import { serverClient } from "@/src/db/client";
import type { SourceId } from "@/src/config/sources";

export type Connection = {
  id: string;
  tenant_id: string;
  source: SourceId;
  consent_active: boolean;
  connected_at: string;
  disconnected_at: string | null;
  display_handle: string | null;
  external_account_id: string | null;
};

export async function listConnections(tenantId: string): Promise<Connection[]> {
  const sb = serverClient();
  const { data, error } = await sb
    .from("connections")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("connected_at", { ascending: true });
  if (error) throw new Error(`listConnections failed: ${error.message}`);
  return (data ?? []) as Connection[];
}

export async function upsertConnection(input: {
  tenant_id: string;
  source: SourceId;
  display_handle?: string;
  external_account_id?: string;
}): Promise<Connection> {
  const sb = serverClient();
  const row: Record<string, unknown> = {
    tenant_id: input.tenant_id,
    source: input.source,
    consent_active: true,
    connected_at: new Date().toISOString(),
    disconnected_at: null,
    display_handle: input.display_handle ?? null,
  };
  // Only write external_account_id when supplied — preserves existing value on
  // re-upsert (e.g. consent re-enabled) instead of nulling it out.
  if (input.external_account_id !== undefined) {
    row.external_account_id = input.external_account_id;
  }
  const { data, error } = await sb
    .from("connections")
    .upsert(row, { onConflict: "tenant_id,source" })
    .select()
    .single();
  if (error) throw new Error(`upsertConnection failed: ${error.message}`);
  return data as Connection;
}

// Recovers the owning tenant for an inbound webhook from the source-side account
// id (Linear organizationId, GitHub installation_id, etc.) embedded in the
// payload. Returns null when no matching connection exists — the webhook handler
// should reject those as 404 rather than silently dropping.
export async function findTenantByExternalAccount(
  source: SourceId,
  externalAccountId: string,
): Promise<string | null> {
  const sb = serverClient();
  const { data, error } = await sb
    .from("connections")
    .select("tenant_id")
    .eq("source", source)
    .eq("external_account_id", externalAccountId)
    .maybeSingle();
  if (error) throw new Error(`findTenantByExternalAccount failed: ${error.message}`);
  return (data?.tenant_id as string) ?? null;
}

export async function disconnectSource(tenantId: string, source: SourceId): Promise<void> {
  const sb = serverClient();
  const { error } = await sb
    .from("connections")
    .update({ consent_active: false, disconnected_at: new Date().toISOString() })
    .eq("tenant_id", tenantId)
    .eq("source", source);
  if (error) throw new Error(`disconnectSource failed: ${error.message}`);
}

export async function isConsentActive(tenantId: string, source: SourceId): Promise<boolean> {
  const sb = serverClient();
  const { data, error } = await sb
    .from("connections")
    .select("consent_active")
    .eq("tenant_id", tenantId)
    .eq("source", source)
    .maybeSingle();
  if (error) throw new Error(`isConsentActive failed: ${error.message}`);
  return Boolean(data?.consent_active);
}
