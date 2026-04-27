create table if not exists signups (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  name            text,
  source          text,
  ip              inet,
  user_agent      text,
  created_at      timestamptz default now()
);

create index if not exists signups_created_idx on signups(created_at desc);
