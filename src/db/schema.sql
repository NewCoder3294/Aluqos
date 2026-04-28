-- Saathi schema. Single demo user; RLS off in dev, permissive single-user policy in deploy.

create extension if not exists "uuid-ossp";

create table if not exists employees (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null,
  name            text not null,
  role            text not null,
  bio             text,
  avatar_seed     text,
  status          text not null default 'idle',
  autonomy_level  text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists onboarding_sessions (
  id                uuid primary key default uuid_generate_v4(),
  employee_id       uuid not null references employees(id) on delete cascade,
  phase             int not null default 1,
  brief             jsonb,
  context_summary   jsonb,
  observations      jsonb,
  action_plan       jsonb,
  approvals         jsonb,
  completed_at      timestamptz,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique(employee_id)
);

create table if not exists uploads (
  id              uuid primary key default uuid_generate_v4(),
  employee_id     uuid not null references employees(id) on delete cascade,
  filename        text not null,
  storage_path    text not null,
  mime_type       text,
  parsed_text     text,
  parse_status    text not null default 'pending',
  created_at      timestamptz default now()
);

create table if not exists prds (
  id              uuid primary key default uuid_generate_v4(),
  employee_id     uuid not null references employees(id) on delete cascade,
  title           text,
  source_issue    text,
  sections        jsonb not null default '{}'::jsonb,
  status          text not null default 'streaming',
  generated_at    timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists walkthrough_events (
  id              uuid primary key default uuid_generate_v4(),
  employee_id     uuid references employees(id) on delete cascade,
  type            text not null,
  payload         jsonb,
  created_at      timestamptz default now()
);

create index if not exists idx_uploads_employee on uploads(employee_id);
create index if not exists idx_prds_employee on prds(employee_id);
create index if not exists idx_walkthrough_events_employee on walkthrough_events(employee_id, created_at desc);

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;

-- Phase 1 foundation: connections registry, OAuth credential vault references,
-- normalized activity event store, async backfill state.

create table if not exists connections (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null,
  source          text not null check (source in ('linear', 'github', 'calendar', 'slack')),
  consent_active  boolean not null default true,
  connected_at    timestamptz default now(),
  disconnected_at timestamptz,
  display_handle  text,
  unique(tenant_id, source)
);

create index if not exists idx_connections_tenant on connections(tenant_id);

create table if not exists oauth_credentials (
  id                       uuid primary key default uuid_generate_v4(),
  tenant_id                uuid not null,
  source                   text not null check (source in ('linear', 'github', 'calendar', 'slack')),
  access_token_secret_id   uuid,
  refresh_token_secret_id  uuid,
  scope                    text,
  expires_at               timestamptz,
  created_at               timestamptz default now(),
  updated_at               timestamptz default now(),
  unique(tenant_id, source)
);

create table if not exists activity_events (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null,
  source          text not null check (source in ('linear', 'github', 'calendar', 'slack')),
  source_event_id text not null,
  actor           text,
  verb            text not null,
  object          text,
  context_json    jsonb not null default '{}'::jsonb,
  occurred_at     timestamptz not null,
  ingested_at     timestamptz default now(),
  unique(source, source_event_id)
);

create index if not exists idx_activity_events_tenant_time
  on activity_events(tenant_id, occurred_at desc);

create index if not exists idx_activity_events_tenant_source_actor
  on activity_events(tenant_id, source, actor);

create table if not exists backfill_runs (
  id              uuid primary key default uuid_generate_v4(),
  tenant_id       uuid not null,
  source          text not null check (source in ('linear', 'github', 'calendar', 'slack')),
  status          text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'partial')),
  started_at      timestamptz,
  completed_at    timestamptz,
  cursor          text,
  events_ingested int not null default 0,
  error_message   text,
  unique(tenant_id, source)
);
