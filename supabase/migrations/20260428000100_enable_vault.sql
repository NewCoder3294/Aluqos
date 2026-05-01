-- Enable pgsodium and the Supabase Vault wrapper.
-- Vault stores encrypted secrets in vault.secrets and exposes vault.decrypted_secrets
-- for read access via SECURITY DEFINER functions. We reference secrets by id from
-- application tables.

create extension if not exists pgsodium;
create extension if not exists supabase_vault;

-- Sanity-check: vault schema and the secrets table exist after the extension is enabled.
do $$
begin
  if not exists (
    select 1 from information_schema.tables
    where table_schema = 'vault' and table_name = 'secrets'
  ) then
    raise exception 'supabase_vault did not provision vault.secrets — extension load failed';
  end if;
end $$;

-- Expose vault.create_secret + decrypted_secrets to the service role only.
-- The service role is used by serverClient(); the anon role never reads tokens.

create or replace function public.vault_create_secret(
  p_secret text,
  p_name text,
  p_description text
) returns uuid
language plpgsql
security definer
set search_path = public, vault
as $$
declare
  v_id uuid;
begin
  select vault.create_secret(p_secret, p_name, p_description) into v_id;
  return v_id;
end;
$$;

revoke all on function public.vault_create_secret(text, text, text) from anon, authenticated;
grant execute on function public.vault_create_secret(text, text, text) to service_role;

-- Mirror vault.decrypted_secrets as a view in public so PostgREST can serve it.
create or replace view public.decrypted_secrets as
  select id, decrypted_secret from vault.decrypted_secrets;

revoke all on table public.decrypted_secrets from anon, authenticated;
grant select on table public.decrypted_secrets to service_role;

-- Mirror vault.secrets for revocation.
create or replace view public.vault_secrets as
  select id from vault.secrets;

revoke all on table public.vault_secrets from anon, authenticated;
grant select, delete on table public.vault_secrets to service_role;
