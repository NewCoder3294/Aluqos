-- Phase 1 foundation: connections registry, OAuth credential vault references,
-- normalized activity event store, async backfill state.

-- Per-(tenant, source) consent state. Toggling consent off pauses ingestion
-- without deleting historical events. Tenant = user_id for V1 single-user tenants.
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

-- OAuth credentials per (tenant, source). Tokens themselves live in vault.secrets;
-- this table holds references and metadata. Disconnecting the source nulls the
-- secret_ids and revokes the vault rows in the application layer.
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

-- Normalized activity event store. One row per source event after normalization.
-- Idempotency is enforced by (source, source_event_id) — webhook replays
-- and backfill overlap collapse to a single row.
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

-- Backfill state per (tenant, source). Drives the status pill UI.
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
