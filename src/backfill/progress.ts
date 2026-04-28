import { serverClient } from "@/src/db/client";
import type { SourceId } from "@/src/config/sources";

export type BackfillStatus = {
  status: "queued" | "running" | "completed" | "failed" | "partial";
  events_ingested: number;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
};

export async function getBackfillStatus(tenantId: string, source: SourceId): Promise<BackfillStatus | null> {
  const sb = serverClient();
  const { data, error } = await sb
    .from("backfill_runs")
    .select("status, events_ingested, started_at, completed_at, error_message")
    .eq("tenant_id", tenantId)
    .eq("source", source)
    .maybeSingle();
  if (error) throw new Error(`getBackfillStatus failed: ${error.message}`);
  return data as BackfillStatus | null;
}

export async function upsertBackfillRun(input: {
  tenant_id: string;
  source: SourceId;
  status: BackfillStatus["status"];
  events_ingested?: number;
  started_at?: Date | null;
  completed_at?: Date | null;
  error_message?: string | null;
  cursor?: string | null;
}): Promise<void> {
  const sb = serverClient();
  const { error } = await sb.from("backfill_runs").upsert(
    {
      tenant_id: input.tenant_id,
      source: input.source,
      status: input.status,
      events_ingested: input.events_ingested ?? 0,
      started_at: input.started_at?.toISOString() ?? null,
      completed_at: input.completed_at?.toISOString() ?? null,
      error_message: input.error_message ?? null,
      cursor: input.cursor ?? null,
    },
    { onConflict: "tenant_id,source" }
  );
  if (error) throw new Error(`upsertBackfillRun failed: ${error.message}`);
}
