-- Google OAuth sign-in support: a public.profiles table mirrored from auth.users
-- (so we can join Aluqos data against the Supabase Auth user without RLS games),
-- plus expansion of the source CHECK constraints on the Phase 1 tables to accept
-- 'gmail' alongside the existing connectors.

-- public.profiles: one row per real (Google-authenticated) user. The id is the
-- Supabase auth.users.id so foreign keys cascade on user deletion. Demo users
-- never get a profiles row — they live entirely in employees + the hardcoded
-- DEMO_USER_ID.
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text,
  full_name     text,
  avatar_url    text,
  auth_provider text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Owner can read and update their own profile. Inserts happen from the auth
-- callback under the service role, which bypasses RLS, so no insert policy.
-- Postgres has no `create policy if not exists`, so drop-then-create.
drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Expand source CHECK constraints across the Phase 1 tables so 'gmail' becomes
-- a valid value. Postgres' DROP/ADD CONSTRAINT pattern is the cleanest way to
-- mutate a CHECK; the constraint names follow Supabase's default `<table>_<col>_check`.
alter table connections drop constraint if exists connections_source_check;
alter table connections add constraint connections_source_check
  check (source in ('linear', 'github', 'calendar', 'slack', 'gmail'));

alter table oauth_credentials drop constraint if exists oauth_credentials_source_check;
alter table oauth_credentials add constraint oauth_credentials_source_check
  check (source in ('linear', 'github', 'calendar', 'slack', 'gmail'));

alter table activity_events drop constraint if exists activity_events_source_check;
alter table activity_events add constraint activity_events_source_check
  check (source in ('linear', 'github', 'calendar', 'slack', 'gmail'));

alter table backfill_runs drop constraint if exists backfill_runs_source_check;
alter table backfill_runs add constraint backfill_runs_source_check
  check (source in ('linear', 'github', 'calendar', 'slack', 'gmail'));
