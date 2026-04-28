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

export type DevWorkflowProposal = {
  id: string;
  tenant_id: string;
  title: string;
  rationale: string;
  trigger_kind: "weekly" | "daily" | "on_demand";
  trigger_config: Record<string, unknown>;
  source_filter: Record<string, unknown>;
  recipient: string | null;
  draft_template: string;
  sample_draft: string;
  status: "open" | "approved" | "dismissed";
  created_at: string;
  decided_at: string | null;
};

export type DevWorkflow = {
  id: string;
  tenant_id: string;
  proposal_id: string | null;
  title: string;
  trigger_kind: "weekly" | "daily" | "on_demand";
  trigger_config: Record<string, unknown>;
  source_filter: Record<string, unknown>;
  recipient: string | null;
  draft_template: string;
  enabled: boolean;
  created_at: string;
  last_run_at: string | null;
  next_run_at: string | null;
};

export type DevWorkflowRun = {
  id: string;
  workflow_id: string;
  tenant_id: string;
  status: "running" | "drafted" | "approved" | "sent" | "cancelled" | "failed";
  started_at: string;
  finished_at: string | null;
  error_message: string | null;
};

export type DraftConfidence = "high" | "medium" | "low";

// The reasoning trail is the user-visible audit of why this draft exists.
// It's surfaced verbatim in the Inbox so non-technical users can see exactly
// what Alex thought about before drafting — not as a debug panel, but as
// the human-facing explanation.
export type DraftReasoningTrail = {
  /** identifier strings (e.g. "ENG-128") that fed this draft */
  included: string[];
  /** events Alex looked at and chose to skip, with the reason */
  omitted: { ref: string; reason: string }[];
  /** one-sentence note about voice/tone match */
  voice_note: string;
  /** model's self-assessment surfaced as a 3-dot indicator */
  confidence: DraftConfidence;
};

export type DevDraft = {
  id: string;
  run_id: string;
  workflow_id: string;
  tenant_id: string;
  subject: string;
  body: string;
  recipient: string | null;
  status: "pending" | "approved" | "sent" | "rejected" | "cancelled";
  reasoning_trail: DraftReasoningTrail;
  created_at: string;
  approved_at: string | null;
  send_at: string | null; // when the 60s cancel window expires
  sent_at: string | null;
  rejected_at: string | null;
};

type DevStore = {
  connections: Map<string, DevConnection>; // key = `${tenant_id}|${source}`
  events: Map<string, DevActivityEvent>; // key = `${source}|${source_event_id}`
  backfills: Map<string, DevBackfillRun>; // key = `${tenant_id}|${source}`
  proposals: Map<string, DevWorkflowProposal>; // key = id
  workflows: Map<string, DevWorkflow>; // key = id
  runs: Map<string, DevWorkflowRun>; // key = id
  drafts: Map<string, DevDraft>; // key = id
};

const GLOBAL_KEY = "__aluqos_dev_store__";

function makeStore(): DevStore {
  return {
    connections: new Map(),
    events: new Map(),
    backfills: new Map(),
    proposals: new Map(),
    workflows: new Map(),
    runs: new Map(),
    drafts: new Map(),
  };
}

export function getDevStore(): DevStore {
  const g = globalThis as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = makeStore();
  // Backfill any maps that were added after the store was first instantiated.
  // Hot-reload doesn't recreate the global, so a store created before this
  // module added new maps would otherwise be missing fields.
  const s = g[GLOBAL_KEY] as Partial<DevStore>;
  if (!s.connections) s.connections = new Map();
  if (!s.events) s.events = new Map();
  if (!s.backfills) s.backfills = new Map();
  if (!s.proposals) s.proposals = new Map();
  if (!s.workflows) s.workflows = new Map();
  if (!s.runs) s.runs = new Map();
  if (!s.drafts) s.drafts = new Map();
  // Backfill any draft from a pre-Phase-B session that pre-dates the
  // reasoning_trail field, so render code can assume it's always present.
  for (const draft of s.drafts.values()) {
    if (!draft.reasoning_trail) {
      draft.reasoning_trail = {
        included: [],
        omitted: [],
        voice_note: "Tone matches the way you usually write to this audience.",
        confidence: "medium",
      };
    }
  }
  return s as DevStore;
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

  // Clear prior Linear events for this tenant — re-seed should replace, not
  // accumulate. Each call uses a fresh `now` so source_event_ids differ.
  for (const [key, ev] of store.events) {
    if (ev.tenant_id === tenantId && ev.source === "linear") store.events.delete(key);
  }

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

  seedAlexProposals(tenantId);
  seedHistoricalWorkflow(tenantId);
}

// Seeds one workflow that's been running for ~3 weeks with 4 sent drafts so
// /workflows isn't empty before the user approves a proposal. Gives the past-
// sends timeline real content and lets users see what a steady-state workflow
// feels like at a glance.
export function seedHistoricalWorkflow(tenantId: string): void {
  const store = getDevStore();

  // Idempotent — wipe any existing seeded historical workflow so a re-Connect
  // resets cleanly. Identified by the title we use here.
  for (const [id, wf] of store.workflows) {
    if (wf.tenant_id === tenantId && wf.title === "Daily wins recap to yourself") {
      store.workflows.delete(id);
      // also drop runs + drafts attached to it
      for (const [rid, r] of store.runs) if (r.workflow_id === id) store.runs.delete(rid);
      for (const [did, d] of store.drafts) if (d.workflow_id === id) store.drafts.delete(did);
    }
  }

  const day = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const wfId = devId("wf");

  store.workflows.set(wfId, {
    id: wfId,
    tenant_id: tenantId,
    proposal_id: null,
    title: "Daily wins recap to yourself",
    trigger_kind: "daily",
    trigger_config: { hour: 18 },
    source_filter: { sources: ["linear"], state: "Done" },
    recipient: null,
    draft_template:
      "You are Alex. Summarize today's 'Done' Linear transitions in a short EOD recap. " +
      "Tone: warm but quick. Sign off with momentum, not bureaucracy.",
    enabled: true,
    created_at: new Date(now - 21 * day).toISOString(),
    last_run_at: new Date(now - 1 * day).toISOString(),
    next_run_at: new Date(now + 4 * 60 * 60 * 1000).toISOString(), // ~4h from now
  });

  // 4 historical sent drafts spanning the last 4 days, with varied statuses so
  // the past-sends timeline isn't a single color.
  const history: Array<{ daysAgo: number; status: DevDraft["status"]; subject: string; body: string }> = [
    {
      daysAgo: 1.0,
      status: "sent",
      subject: "Daily wins — yesterday",
      body:
        "Two things landed:\n\n" +
        "• ENG-124 — Backfill source_event_id collision (Aman).\n" +
        "• ENG-122 — Connections empty state (Priya).\n\n" +
        "Tomorrow's queue: ENG-128, ENG-126.\n\n— Alex",
    },
    {
      daysAgo: 2.1,
      status: "sent",
      subject: "Daily wins — 2 days ago",
      body:
        "Quiet day on shipped, but two moves to flag:\n\n" +
        "• ENG-127 — Priya unblocked the digest copy review.\n" +
        "• ENG-126 — Ravi picked up the webhook tenant lookup.\n\n— Alex",
    },
    {
      daysAgo: 3.2,
      status: "rejected",
      subject: "Daily wins — 3 days ago",
      body:
        "Nothing landed today. Skipping.\n\n— Alex",
    },
    {
      daysAgo: 4.4,
      status: "sent",
      subject: "Daily wins — 4 days ago",
      body:
        "One in the books:\n\n" +
        "• ENG-118 — Status pill on the connection row (Priya's ask).\n\n— Alex",
    },
  ];

  for (const h of history) {
    const at = new Date(now - h.daysAgo * day);
    const runId = devId("run");
    const draftId = devId("draft");

    store.runs.set(runId, {
      id: runId,
      workflow_id: wfId,
      tenant_id: tenantId,
      status: h.status === "sent" ? "sent" : "cancelled",
      started_at: at.toISOString(),
      finished_at: at.toISOString(),
      error_message: null,
    });
    store.drafts.set(draftId, {
      id: draftId,
      run_id: runId,
      workflow_id: wfId,
      tenant_id: tenantId,
      subject: h.subject,
      body: h.body,
      recipient: null,
      status: h.status,
      reasoning_trail: {
        included: ["ENG-124", "ENG-122", "ENG-127", "ENG-118"].slice(0, 2),
        omitted: [],
        voice_note: "Tone matches your past EOD notes — short, momentum-forward.",
        confidence: h.status === "rejected" ? "low" : "high",
      },
      created_at: at.toISOString(),
      approved_at: h.status === "sent" ? at.toISOString() : null,
      send_at: null,
      sent_at: h.status === "sent" ? new Date(at.getTime() + 60_000).toISOString() : null,
      rejected_at: h.status === "rejected" ? at.toISOString() : null,
    });
  }
}

// Synthesizes 3 plausible workflow proposals from the seeded activity. In
// production this is what an LLM analysis pass would produce after backfill;
// here we hardcode the result so the autonomous behavior is visible without
// any API keys. Idempotent — clears prior open proposals for the tenant first
// so reconnecting starts fresh.
export function seedAlexProposals(tenantId: string): void {
  const store = getDevStore();

  // Clear any open proposals so re-seed is idempotent.
  for (const [id, p] of store.proposals) {
    if (p.tenant_id === tenantId && p.status === "open") store.proposals.delete(id);
  }

  const nowIso = new Date().toISOString();

  const proposals: Array<Omit<DevWorkflowProposal, "id" | "tenant_id" | "created_at" | "decided_at" | "status">> = [
    {
      title: "Friday status digest to Priya",
      rationale:
        "Priya commented on 2 of your tickets this week and reacts to your updates within an hour. She reads like the stakeholder you report to. I'll draft Thursday EOD so you can edit before Friday morning.",
      trigger_kind: "weekly",
      trigger_config: { day_of_week: "thursday", hour: 17 },
      source_filter: { sources: ["linear"], stakeholder: "priya@aluqos.com" },
      recipient: "priya@aluqos.com",
      draft_template:
        "You are Alex, an AI PM. Draft a concise weekly status email from {user} to {recipient}. " +
        "Use the activity events from the last 7 days. Lead with shipped, then in-flight, then risks. " +
        "Keep it under 200 words. Match {user}'s voice: direct, no fluff.",
      sample_draft:
        "Subject: Weekly status — week of " +
        new Date(Date.now() - 6 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        "\n\n" +
        "Hi Priya,\n\n" +
        "Shipped this week:\n" +
        "• ENG-122 — Settings → Connections empty state landed.\n" +
        "• ENG-124 — Backfill source_event_id collision fix is in.\n\n" +
        "In flight:\n" +
        "• ENG-128 — Stakeholder weekly digest copy (in review).\n" +
        "• ENG-126 — Linear webhook tenant lookup (Ravi has it).\n\n" +
        "Risks: none material. Phase-1 foundation is on track for next week's demo.\n\n" +
        "— Alex (drafted from Aman's activity)",
    },
    {
      title: "Monday week-ahead memo to the team",
      rationale:
        "Aman, Priya, and Ravi all touched Linear this week but no one posted a plan. A 3-line Monday memo would unblock standups. I'll draft from Friday's tickets and pending issues.",
      trigger_kind: "weekly",
      trigger_config: { day_of_week: "monday", hour: 9 },
      source_filter: { sources: ["linear"], scope: "team" },
      recipient: "team@aluqos.com",
      draft_template:
        "You are Alex. Draft a 3-line week-ahead memo for {team}. Pull pending Linear issues " +
        "and call out who owns what. Tone: clear and short.",
      sample_draft:
        "Subject: Week ahead — Mon\n\n" +
        "Top of the week:\n" +
        "• Aman → ENG-128 (digest copy review with Priya).\n" +
        "• Ravi → ENG-126 (webhook tenant lookup).\n" +
        "• Open for grabs: ENG-127 follow-ups.\n\n" +
        "— Alex",
    },
    {
      title: "Daily 'what just landed' digest",
      rationale:
        "There were 3 'Done' state transitions in Linear this week. A short EOD digest would let you close the day without scrolling Linear yourself.",
      trigger_kind: "daily",
      trigger_config: { hour: 18 },
      source_filter: { sources: ["linear"], state: "Done" },
      recipient: null,
      draft_template:
        "You are Alex. Summarize today's 'Done' Linear transitions in 4 bullets or fewer.",
      sample_draft:
        "Today's wins:\n" +
        "• ENG-124 — Backfill source_event_id collision (Aman).\n" +
        "• ENG-122 — Connections empty state (Priya).\n\n" +
        "Tomorrow's queue: ENG-128, ENG-126.",
    },
  ];

  for (const p of proposals) {
    const id = devId("prop");
    store.proposals.set(id, {
      ...p,
      id,
      tenant_id: tenantId,
      status: "open",
      created_at: nowIso,
      decided_at: null,
    });
  }
}

// Removes the connection, its events, and its backfill state — used by the
// Disconnect button so the demo flow is reversible. Also wipes derived
// proposals / workflows / runs / drafts so the loop fully resets.
export function purgeSourceForTenant(tenantId: string, source: SourceId): void {
  const store = getDevStore();
  store.connections.delete(connectionKey(tenantId, source));
  store.backfills.delete(connectionKey(tenantId, source));
  for (const [key, ev] of store.events) {
    if (ev.tenant_id === tenantId && ev.source === source) store.events.delete(key);
  }
  for (const [id, p] of store.proposals) {
    if (p.tenant_id === tenantId) store.proposals.delete(id);
  }
  for (const [id, w] of store.workflows) {
    if (w.tenant_id === tenantId) store.workflows.delete(id);
  }
  for (const [id, r] of store.runs) {
    if (r.tenant_id === tenantId) store.runs.delete(id);
  }
  for (const [id, d] of store.drafts) {
    if (d.tenant_id === tenantId) store.drafts.delete(id);
  }
}
