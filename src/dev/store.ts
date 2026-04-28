// In-memory store for localhost dev — activates when MOCK_MODE is true (i.e.
// SUPABASE_SERVICE_ROLE_KEY is unset). Lets the app boot, run the OAuth flow
// in fake-success mode, and show seeded events without any external services.
//
// Hot-reload-safe: stashed on globalThis so module re-evaluation doesn't wipe
// connection / event state mid-session.

import type { SourceId } from "@/src/config/sources";

export type DevConnection = {
  id: string;
  tenant_id: string;
  source: SourceId;
  consent_active: boolean;
  connected_at: string;
  disconnected_at: string | null;
  display_handle: string | null;
  external_account_id: string | null;
};

export type DevActivityEvent = {
  id: string;
  tenant_id: string;
  source: SourceId;
  source_event_id: string;
  actor: string | null;
  verb: string;
  object: string | null;
  context_json: Record<string, unknown>;
  occurred_at: string;
  ingested_at: string;
};

export type DevBackfillRun = {
  tenant_id: string;
  source: SourceId;
  status: "queued" | "running" | "completed" | "failed" | "partial";
  events_ingested: number;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  cursor: string | null;
};

type DevStore = {
  connections: Map<string, DevConnection>; // key = `${tenant_id}|${source}`
  events: Map<string, DevActivityEvent>; // key = `${source}|${source_event_id}`
  backfills: Map<string, DevBackfillRun>; // key = `${tenant_id}|${source}`
};

const GLOBAL_KEY = "__aluqos_dev_store__";

function makeStore(): DevStore {
  return { connections: new Map(), events: new Map(), backfills: new Map() };
}

export function getDevStore(): DevStore {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = makeStore();
  return g[GLOBAL_KEY] as DevStore;
}

export function connectionKey(tenantId: string, source: SourceId): string {
  return `${tenantId}|${source}`;
}

export function eventKey(source: SourceId, sourceEventId: string): string {
  return `${source}|${sourceEventId}`;
}

// Generates a deterministic-ish UUID-shaped string for in-memory rows.
let counter = 0;
export function devId(prefix = "dev"): string {
  counter += 1;
  return `${prefix}-${counter.toString().padStart(8, "0")}`;
}

// Seeds a Linear connection plus 8 plausible activity events covering the
// last 6 days, and marks the backfill complete. Idempotent — replaces any
// existing Linear seed for the tenant so repeated Connect clicks just refresh.
export function seedLinearDemoData(tenantId: string): void {
  const store = getDevStore();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const connection: DevConnection = {
    id: devId("conn"),
    tenant_id: tenantId,
    source: "linear",
    consent_active: true,
    connected_at: new Date(now).toISOString(),
    disconnected_at: null,
    display_handle: "Aluqos workspace (dev)",
    external_account_id: "dev-org-aluqos",
  };
  store.connections.set(connectionKey(tenantId, "linear"), connection);

  const seeds: Array<{
    minusDays: number;
    actor: string;
    verb: string;
    object: string;
    identifier: string;
    state: string;
  }> = [
    { minusDays: 0.2, actor: "aman@aluqos.com",   verb: "updated",  object: "Stakeholder weekly digest copy",      identifier: "ENG-128", state: "In Review" },
    { minusDays: 0.5, actor: "priya@aluqos.com",  verb: "commented", object: "Looks great — ship it.",              identifier: "ENG-127", state: "In Progress" },
    { minusDays: 1.1, actor: "aman@aluqos.com",   verb: "created",  object: "Add per-source budget toggle",         identifier: "ENG-128", state: "Todo" },
    { minusDays: 1.4, actor: "priya@aluqos.com",  verb: "updated",  object: "Settings → Connections empty state",   identifier: "ENG-122", state: "Done" },
    { minusDays: 2.3, actor: "ravi@aluqos.com",   verb: "created",  object: "Linear webhook tenant lookup",         identifier: "ENG-126", state: "Todo" },
    { minusDays: 3.1, actor: "aman@aluqos.com",   verb: "updated",  object: "Backfill source_event_id collision",   identifier: "ENG-124", state: "Done" },
    { minusDays: 4.7, actor: "priya@aluqos.com",  verb: "commented", object: "Can we get a status pill on the row?", identifier: "ENG-118", state: "Done" },
    { minusDays: 5.8, actor: "ravi@aluqos.com",   verb: "created",  object: "Phase-1 foundation kickoff",           identifier: "ENG-100", state: "Done" },
  ];

  for (const seed of seeds) {
    const occurred = new Date(now - seed.minusDays * day);
    const sourceEventId = `linear:Issue:${seed.verb === "commented" ? "create" : "update"}:${seed.identifier}:${occurred.toISOString()}`;
    const ev: DevActivityEvent = {
      id: devId("ev"),
      tenant_id: tenantId,
      source: "linear",
      source_event_id: sourceEventId,
      actor: seed.actor,
      verb: seed.verb,
      object: seed.object,
      context_json: { type: seed.verb === "commented" ? "Comment" : "Issue", identifier: seed.identifier, state: seed.state },
      occurred_at: occurred.toISOString(),
      ingested_at: new Date().toISOString(),
    };
    store.events.set(eventKey("linear", sourceEventId), ev);
  }

  const backfill: DevBackfillRun = {
    tenant_id: tenantId,
    source: "linear",
    status: "completed",
    events_ingested: seeds.length,
    started_at: new Date(now - 4_000).toISOString(),
    completed_at: new Date(now).toISOString(),
    error_message: null,
    cursor: null,
  };
  store.backfills.set(connectionKey(tenantId, "linear"), backfill);
}

// Removes the connection, its events, and its backfill state — used by the
// Disconnect button so the demo flow is reversible.
export function purgeSourceForTenant(tenantId: string, source: SourceId): void {
  const store = getDevStore();
  store.connections.delete(connectionKey(tenantId, source));
  store.backfills.delete(connectionKey(tenantId, source));
  for (const [key, ev] of store.events) {
    if (ev.tenant_id === tenantId && ev.source === source) store.events.delete(key);
  }
}
