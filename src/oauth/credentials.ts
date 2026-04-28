import { MOCK_MODE, serverClient } from "@/src/db/client";
import { storeSecret, readSecret, revokeSecret } from "@/src/oauth/vault";
import type { SourceId } from "@/src/config/sources";

export type DecryptedTokens = {
  access_token: string;
  refresh_token: string | null;
  expires_at: Date;
  scope: string;
};

export async function saveCredentials(input: {
  tenant_id: string;
  source: SourceId;
  access_token: string;
  refresh_token: string | null;
  expires_at: Date;
  scope: string;
}): Promise<{ id: string }> {
  // Dev: skip Vault round-trip and pretend the credential was stored. No real
  // tokens exist anyway when MOCK_MODE is on.
  if (MOCK_MODE) return { id: `dev-cred-${input.tenant_id}-${input.source}` };
  const accessId = await storeSecret(input.access_token, {
    tenant_id: input.tenant_id,
    source: input.source,
    kind: "access_token",
  });
  const refreshId = input.refresh_token
    ? await storeSecret(input.refresh_token, {
        tenant_id: input.tenant_id,
        source: input.source,
        kind: "refresh_token",
      })
    : null;

  const sb = serverClient();
  const { data, error } = await sb
    .from("oauth_credentials")
    .upsert(
      {
        tenant_id: input.tenant_id,
        source: input.source,
        access_token_secret_id: accessId,
        refresh_token_secret_id: refreshId,
        scope: input.scope,
        expires_at: input.expires_at.toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tenant_id,source" }
    )
    .select()
    .single();
  if (error) throw new Error(`saveCredentials failed: ${error.message}`);
  return { id: data.id };
}

export async function getDecryptedTokens(
  tenantId: string,
  source: SourceId
): Promise<DecryptedTokens | null> {
  if (MOCK_MODE) return null; // dev: no real tokens exist; backfill is mocked
  const sb = serverClient();
  const { data, error } = await sb
    .from("oauth_credentials")
    .select("access_token_secret_id, refresh_token_secret_id, expires_at, scope")
    .eq("tenant_id", tenantId)
    .eq("source", source)
    .maybeSingle();
  if (error) throw new Error(`getDecryptedTokens failed: ${error.message}`);
  if (!data?.access_token_secret_id) return null;

  const access_token = await readSecret(data.access_token_secret_id);
  const refresh_token = data.refresh_token_secret_id ? await readSecret(data.refresh_token_secret_id) : null;
  return {
    access_token,
    refresh_token,
    expires_at: new Date(data.expires_at),
    scope: data.scope ?? "",
  };
}

export async function revokeCredentials(tenantId: string, source: SourceId): Promise<void> {
  if (MOCK_MODE) return; // dev: no Vault rows to revoke
  const sb = serverClient();
  const { data } = await sb
    .from("oauth_credentials")
    .select("access_token_secret_id, refresh_token_secret_id")
    .eq("tenant_id", tenantId)
    .eq("source", source)
    .maybeSingle();
  if (data?.access_token_secret_id) await revokeSecret(data.access_token_secret_id);
  if (data?.refresh_token_secret_id) await revokeSecret(data.refresh_token_secret_id);

  await sb.from("oauth_credentials").delete().eq("tenant_id", tenantId).eq("source", source);
}
