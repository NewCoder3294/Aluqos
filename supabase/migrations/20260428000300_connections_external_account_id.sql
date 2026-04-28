-- Phase 1 fix C1: derive webhook tenant from connection lookup, not from a
-- client-controllable header. The webhook payload's organizationId/account
-- identifier is matched against connections.external_account_id to recover
-- the owning tenant safely.

alter table connections
  add column if not exists external_account_id text;

-- Partial unique index: an external account can only be claimed by one tenant
-- per source. Allows nulls (legacy rows / sources that don't expose an account
-- id at OAuth time) without blocking the migration.
create unique index if not exists uq_connections_source_external
  on connections(source, external_account_id)
  where external_account_id is not null;
