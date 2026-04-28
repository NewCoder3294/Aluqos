-- Phase 1 fix C2: durable, atomic rate budget shared across serverless invocations.
--
-- The previous implementation kept counters in a process-local Map, which doesn't
-- survive serverless cold starts — every new function instance reset the window,
-- making the budget effectively per-invocation rather than per-tenant. This
-- migration moves the bucket into Postgres with a SECURITY DEFINER plpgsql
-- function that performs window check + increment in one atomic transaction.

create table if not exists rate_budget (
  source       text not null,
  tenant_id    uuid not null,
  window_start timestamptz not null default now(),
  count        int  not null default 0,
  primary key (source, tenant_id)
);

-- rate_budget_take returns NULL on success and the milliseconds-until-retry
-- (as a bigint) when the caller has exhausted its budget for the current window.
-- Caller is responsible for passing the per-source capacity + window length so
-- the SQL stays free of source-specific knowledge.
create or replace function public.rate_budget_take(
  p_source     text,
  p_tenant_id  uuid,
  p_capacity   int,
  p_window_ms  bigint
) returns bigint
language plpgsql
as $$
declare
  v_now          timestamptz := clock_timestamp();
  v_window_start timestamptz;
  v_count        int;
  v_window       interval := make_interval(secs => p_window_ms / 1000.0);
begin
  -- Ensure a row exists, then take a row-level lock for the rest of the txn.
  insert into public.rate_budget (source, tenant_id, window_start, count)
  values (p_source, p_tenant_id, v_now, 0)
  on conflict (source, tenant_id) do nothing;

  select window_start, count
    into v_window_start, v_count
    from public.rate_budget
   where source = p_source and tenant_id = p_tenant_id
   for update;

  -- Window expired — reset and accept the call.
  if v_now - v_window_start >= v_window then
    update public.rate_budget
       set window_start = v_now, count = 1
     where source = p_source and tenant_id = p_tenant_id;
    return null;
  end if;

  -- Within window but over capacity — reject with retry-after.
  if v_count >= p_capacity then
    return greatest(
      0,
      (extract(epoch from (v_window_start + v_window - v_now)) * 1000)::bigint
    );
  end if;

  -- Within window and under capacity — increment and accept.
  update public.rate_budget
     set count = count + 1
   where source = p_source and tenant_id = p_tenant_id;
  return null;
end;
$$;
