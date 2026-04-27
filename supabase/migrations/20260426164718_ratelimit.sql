create table if not exists rate_log (
  id          bigserial primary key,
  key         text not null,
  created_at  timestamptz default now()
);

create index if not exists rate_log_key_created_idx on rate_log (key, created_at desc);
create index if not exists rate_log_created_idx     on rate_log (created_at);

-- Optional: periodic cleanup. Anything older than 24h can be pruned manually.
