import { serverClient } from "@/src/db/client";

type SecretMetadata = {
  tenant_id: string;
  source: "linear" | "github" | "calendar" | "slack";
  kind: "access_token" | "refresh_token";
};

/**
 * Stores a secret in vault.secrets and returns the secret id.
 * The metadata is encoded into the description for audit traceability.
 */
export async function storeSecret(value: string, meta: SecretMetadata): Promise<string> {
  const sb = serverClient();
  const description = JSON.stringify(meta);
  const { data, error } = await sb.rpc("vault_create_secret", {
    p_secret: value,
    p_name: `${meta.tenant_id}:${meta.source}:${meta.kind}`,
    p_description: description,
  });
  if (error) throw new Error(`Vault store failed: ${error.message}`);
  return data as string;
}

/**
 * Reads a secret value by id. Throws if the secret has been revoked.
 */
export async function readSecret(secretId: string): Promise<string> {
  const sb = serverClient();
  const { data, error } = await sb
    .from("decrypted_secrets")
    .select("decrypted_secret")
    .eq("id", secretId)
    .maybeSingle();
  if (error) throw new Error(`Vault read failed: ${error.message}`);
  if (!data) throw new Error(`Secret ${secretId} not found or revoked`);
  return data.decrypted_secret as string;
}

/**
 * Revokes a secret by deleting the vault.secrets row. Application code calls this
 * on disconnect or rotation. Idempotent — silently succeeds if the secret no
 * longer exists.
 */
export async function revokeSecret(secretId: string): Promise<void> {
  const sb = serverClient();
  const { error } = await sb.from("vault_secrets").delete().eq("id", secretId);
  if (error && !error.message.includes("not found")) {
    throw new Error(`Vault revoke failed: ${error.message}`);
  }
}
