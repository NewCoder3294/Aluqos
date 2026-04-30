-- Phase 1 autonomous workflows: Alex analyzes the activity stream after backfill,
-- proposes recurring tasks the user could hand off, and runs them on schedule
-- with one-tap approval.

-- A pattern Alex inferred from the user's events that *could* become a recurring
-- workflow. Stays in the proposal state until the user approves or dismisses.
create table if not exists workflow_proposals (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null,
  title           text not null,
  rationale       text not null, -- why Alex thinks this would help (shown to user)
  trigger_kind    text not null check (trigger_kind in ('weekly', 'daily', 'on_demand')),
  trigger_config  jsonb not null default '{}'::jsonb, -- { day_of_week, hour, etc }
  source_filter   jsonb not null default '{}'::jsonb, -- which sources / actors this watches
  recipient       text,
  draft_template  text not null, -- prompt seed Alex will use when drafting
  sample_draft    text not null, -- a concrete first draft, shown on the proposal card
  status          text not null default 'open' check (status in ('open', 'approved', 'dismissed')),
  created_at      timestamptz default now(),
  decided_at      timestamptz
);

create index if not exists idx_proposals_tenant_status on workflow_proposals(tenant_id, status);

-- An approved workflow that Alex executes on its trigger. Lifted from a proposal
-- when the user approves, or created directly via the future "edit / new" flow.
create table if not exists workflows (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null,
  proposal_id       uuid references workflow_proposals(id) on delete set null,
  title             text not null,
  trigger_kind      text not null check (trigger_kind in ('weekly', 'daily', 'on_demand')),
  trigger_config    jsonb not null default '{}'::jsonb,
  source_filter     jsonb not null default '{}'::jsonb,
  recipient         text,
  draft_template    text not null,
  enabled           boolean not null default true,
  created_at        timestamptz default now(),
  last_run_at       timestamptz,
  next_run_at       timestamptz
);

create index if not exists idx_workflows_tenant on workflows(tenant_id);

-- Each invocation. Tracks whether the run produced a draft and whether the
-- draft was approved / sent / cancelled.
create table if not exists workflow_runs (
  id           uuid primary key default gen_random_uuid(),
  workflow_id  uuid not null references workflows(id) on delete cascade,
  tenant_id    uuid not null,
  status       text not null default 'running' check (status in ('running', 'drafted', 'approved', 'sent', 'cancelled', 'failed')),
  started_at   timestamptz default now(),
  finished_at  timestamptz,
  error_message text
);

create index if not exists idx_runs_workflow on workflow_runs(workflow_id, started_at desc);

-- A draft awaiting one-tap approval. Lives in the inbox until Approve or Reject.
-- send_at is set when the user clicks Approve; the 60-second cancel window runs
-- between approved_at and send_at.
create table if not exists drafts (
  id           uuid primary key default gen_random_uuid(),
  run_id       uuid not null references workflow_runs(id) on delete cascade,
  workflow_id  uuid not null references workflows(id) on delete cascade,
  tenant_id    uuid not null,
  subject      text not null,
  body         text not null,
  recipient    text,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'sent', 'rejected', 'cancelled')),
  created_at   timestamptz default now(),
  approved_at  timestamptz,
  send_at      timestamptz, -- when the 60s cancel window expires
  sent_at      timestamptz,
  rejected_at  timestamptz
);

create index if not exists idx_drafts_tenant_status on drafts(tenant_id, status, created_at desc);
