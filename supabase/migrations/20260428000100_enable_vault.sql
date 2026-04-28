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
