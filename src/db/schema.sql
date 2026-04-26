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

create table if not exists events (
  id              uuid primary key default uuid_generate_v4(),
  employee_id     uuid references employees(id) on delete cascade,
  type            text not null,
  payload         jsonb,
  created_at      timestamptz default now()
);

create index if not exists idx_uploads_employee on uploads(employee_id);
create index if not exists idx_prds_employee on prds(employee_id);
create index if not exists idx_events_employee on events(employee_id, created_at desc);

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;
