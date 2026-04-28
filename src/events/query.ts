import { MOCK_MODE, serverClient } from "@/src/db/client";
import { getDevStore } from "@/src/dev/store";
import type { SourceId } from "@/src/config/sources";

export async function queryActivityEvents(opts: {
  tenant_id: string;
  source?: SourceId;
  since?: Date;
  until?: Date;
  limit?: number;
}) {
  if (MOCK_MODE) {
    const store = getDevStore();
    const sinceMs = opts.since?.getTime();
    const untilMs = opts.until?.getTime();
    let rows = [...store.events.values()].filter((e) => {
      if (e.tenant_id !== opts.tenant_id) return false;
      if (opts.source && e.source !== opts.source) return false;
      const t = new Date(e.occurred_at).getTime();
      if (sinceMs !== undefined && t < sinceMs) return false;
      if (untilMs !== undefined && t >= untilMs) return false;
      return true;
    });
    rows.sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
    if (opts.limit) rows = rows.slice(0, opts.limit);
    return rows;
  }
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
  if (MOCK_MODE) {
    const store = getDevStore();
    let n = 0;
    for (const e of store.events.values()) {
      if (e.tenant_id === tenantId && e.source === source) n += 1;
    }
    return n;
  }
  const sb = serverClient();
  const { count, error } = await sb
    .from("activity_events")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("source", source);
  if (error) throw new Error(`countActivityEvents failed: ${error.message}`);
  return count ?? 0;
}
