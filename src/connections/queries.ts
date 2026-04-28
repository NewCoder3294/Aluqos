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
}): Promise<Connection> {
  const sb = serverClient();
  const { data, error } = await sb
    .from("connections")
    .upsert(
      {
        tenant_id: input.tenant_id,
        source: input.source,
        consent_active: true,
        connected_at: new Date().toISOString(),
        disconnected_at: null,
        display_handle: input.display_handle ?? null,
      },
      { onConflict: "tenant_id,source" }
    )
    .select()
    .single();
  if (error) throw new Error(`upsertConnection failed: ${error.message}`);
  return data as Connection;
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
