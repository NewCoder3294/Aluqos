import { serverClient } from "@/src/db/client";
import type { SourceId } from "@/src/config/sources";

export async function queryActivityEvents(opts: {
  tenant_id: string;
  source?: SourceId;
  since?: Date;
  until?: Date;
  limit?: number;
}) {
  const sb = serverClient();
  let q = sb
    .from("activity_events")
    .select("*")
    .eq("tenant_id", opts.tenant_id)
    .order("occurred_at", { ascending: false });
  if (opts.source) q = q.eq("source", opts.source);
  if (opts.since) q = q.gte("occurred_at", opts.since.toISOString());
  if (opts.until) q = q.lt("occurred_at", opts.until.toISOString());
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw new Error(`queryActivityEvents failed: ${error.message}`);
  return data ?? [];
}

export async function countActivityEvents(tenantId: string, source: SourceId): Promise<number> {
  const sb = serverClient();
  const { count, error } = await sb
    .from("activity_events")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("source", source);
  if (error) throw new Error(`countActivityEvents failed: ${error.message}`);
  return count ?? 0;
}
