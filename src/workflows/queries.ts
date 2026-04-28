import { MOCK_MODE, serverClient } from "@/src/db/client";
import {
  devId,
  getDevStore,
  type DevDraft,
  type DevWorkflow,
  type DevWorkflowProposal,
  type DevWorkflowRun,
} from "@/src/dev/store";
import { queryActivityEvents } from "@/src/events/query";

export type WorkflowProposal = DevWorkflowProposal;
export type Workflow = DevWorkflow;
export type WorkflowRun = DevWorkflowRun;
export type Draft = DevDraft;

export async function listOpenProposals(tenantId: string): Promise<WorkflowProposal[]> {
  if (MOCK_MODE) {
    const store = getDevStore();
    return [...store.proposals.values()]
      .filter((p) => p.tenant_id === tenantId && p.status === "open")
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }
  const sb = serverClient();
  const { data, error } = await sb
    .from("workflow_proposals")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("status", "open")
    .order("created_at", { ascending: true });
  if (error) throw new Error(`listOpenProposals failed: ${error.message}`);
  return (data ?? []) as WorkflowProposal[];
}

export async function getProposal(id: string): Promise<WorkflowProposal | null> {
  if (MOCK_MODE) return getDevStore().proposals.get(id) ?? null;
  const sb = serverClient();
  const { data, error } = await sb
    .from("workflow_proposals")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getProposal failed: ${error.message}`);
  return (data ?? null) as WorkflowProposal | null;
}

// Promotes a proposal to a Workflow row, marks the proposal "approved", and
// returns the new workflow id. Caller decides whether to immediately run.
export async function approveProposal(id: string): Promise<string> {
  const proposal = await getProposal(id);
  if (!proposal) throw new Error(`Proposal ${id} not found`);
  if (proposal.status !== "open") throw new Error(`Proposal ${id} is ${proposal.status}, not open`);

  if (MOCK_MODE) {
    const store = getDevStore();
    const wfId = devId("wf");
    const now = new Date().toISOString();
    store.workflows.set(wfId, {
      id: wfId,
      tenant_id: proposal.tenant_id,
      proposal_id: proposal.id,
      title: proposal.title,
      trigger_kind: proposal.trigger_kind,
      trigger_config: proposal.trigger_config,
      source_filter: proposal.source_filter,
      recipient: proposal.recipient,
      draft_template: proposal.draft_template,
      enabled: true,
      created_at: now,
      last_run_at: null,
      next_run_at: null,
    });
    proposal.status = "approved";
    proposal.decided_at = now;
    return wfId;
  }
  // Prod path: insert workflow + flip proposal in a single round-trip pair.
  const sb = serverClient();
  const { data: wf, error: wfErr } = await sb
    .from("workflows")
    .insert({
      tenant_id: proposal.tenant_id,
      proposal_id: proposal.id,
      title: proposal.title,
      trigger_kind: proposal.trigger_kind,
      trigger_config: proposal.trigger_config,
      source_filter: proposal.source_filter,
      recipient: proposal.recipient,
      draft_template: proposal.draft_template,
      enabled: true,
    })
    .select("id")
    .single();
  if (wfErr || !wf) throw new Error(`approveProposal: workflow insert failed: ${wfErr?.message}`);
  const { error: updErr } = await sb
    .from("workflow_proposals")
    .update({ status: "approved", decided_at: new Date().toISOString() })
    .eq("id", id);
  if (updErr) throw new Error(`approveProposal: proposal update failed: ${updErr.message}`);
  return wf.id as string;
}

export async function dismissProposal(id: string): Promise<void> {
  const proposal = await getProposal(id);
  if (!proposal) return;
  if (MOCK_MODE) {
    proposal.status = "dismissed";
    proposal.decided_at = new Date().toISOString();
    return;
  }
  const sb = serverClient();
  const { error } = await sb
    .from("workflow_proposals")
    .update({ status: "dismissed", decided_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`dismissProposal failed: ${error.message}`);
}

export async function listWorkflows(tenantId: string): Promise<Workflow[]> {
  if (MOCK_MODE) {
    const store = getDevStore();
    return [...store.workflows.values()]
      .filter((w) => w.tenant_id === tenantId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }
  const sb = serverClient();
  const { data, error } = await sb
    .from("workflows")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(`listWorkflows failed: ${error.message}`);
  return (data ?? []) as Workflow[];
}

export async function getWorkflow(id: string): Promise<Workflow | null> {
  if (MOCK_MODE) return getDevStore().workflows.get(id) ?? null;
  const sb = serverClient();
  const { data, error } = await sb
    .from("workflows")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`getWorkflow failed: ${error.message}`);
  return (data ?? null) as Workflow | null;
}

// Executes a workflow once. In MOCK_MODE this synthesizes a draft from seeded
// activity (no LLM call) so the demo loop closes without an API key. In prod
// the Inngest function takes over and calls Anthropic with the draft_template.
export async function runWorkflow(workflowId: string): Promise<{ runId: string; draftId: string }> {
  const wf = await getWorkflow(workflowId);
  if (!wf) throw new Error(`Workflow ${workflowId} not found`);

  if (MOCK_MODE) {
    const store = getDevStore();
    const runId = devId("run");
    const draftId = devId("draft");
    const now = new Date();

    store.runs.set(runId, {
      id: runId,
      workflow_id: wf.id,
      tenant_id: wf.tenant_id,
      status: "drafted",
      started_at: now.toISOString(),
      finished_at: now.toISOString(),
      error_message: null,
    });

    // Pull the most recent activity for the tenant to ground the synthesized
    // draft. In prod this same set of events would feed the LLM prompt.
    const events = await queryActivityEvents({
      tenant_id: wf.tenant_id,
      since: new Date(now.getTime() - 7 * 86400000),
      limit: 25,
    });
    const body = synthesizeDraftBody(wf, events);
    const subject = synthesizeDraftSubject(wf);
    const reasoning_trail = synthesizeReasoningTrail(wf, events);

    store.drafts.set(draftId, {
      id: draftId,
      run_id: runId,
      workflow_id: wf.id,
      tenant_id: wf.tenant_id,
      subject,
      body,
      recipient: wf.recipient,
      status: "pending",
      reasoning_trail,
      created_at: now.toISOString(),
      approved_at: null,
      send_at: null,
      sent_at: null,
      rejected_at: null,
    });

    wf.last_run_at = now.toISOString();
    return { runId, draftId };
  }

  // Prod: enqueue Inngest. Implemented in src/inngest/functions.ts.
  // (Stubbed here; full implementation lives outside the dev path.)
  throw new Error("runWorkflow prod path not yet wired — fall through to Inngest function");
}

function synthesizeDraftSubject(wf: Workflow): string {
  const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (wf.trigger_kind === "weekly") return `${wf.title} — week of ${today}`;
  if (wf.trigger_kind === "daily") return `${wf.title} — ${today}`;
  return wf.title;
}

// Builds a plain-text draft from recent events. The real implementation will
// hand the events + draft_template to Anthropic; this is just enough to make
// the demo feel real — bullets are grounded in the actual seeded events the
// user just saw flow in.
function synthesizeDraftBody(
  wf: Workflow,
  events: Array<{ actor: string | null; verb: string; object: string | null; context_json: Record<string, unknown>; occurred_at: string }>,
): string {
  const greeting = wf.recipient ? `Hi ${(wf.recipient.split("@")[0] ?? "there").replace(/\b\w/g, (c) => c.toUpperCase())},` : "Hey,";

  // Collapse same-identifier events (a ticket touched 3 times this week becomes
  // one bullet) and prefer the latest state. Events without an identifier just
  // dedupe on object text.
  const byKey = new Map<string, typeof events[number]>();
  for (const e of events) {
    const ident = (e.context_json as { identifier?: string })?.identifier ?? `__nokey:${e.object ?? ""}`;
    const prev = byKey.get(ident);
    if (!prev || e.occurred_at > prev.occurred_at) byKey.set(ident, e);
  }
  const deduped = [...byKey.values()];

  // Don't report the recipient's own work back to them — it would feel weird,
  // and the reasoning trail will explain those omissions explicitly.
  const reportable = deduped.filter((e) => !(wf.recipient && e.actor === wf.recipient));

  const shipped = reportable.filter((e) => {
    const state = (e.context_json as { state?: string })?.state;
    return state === "Done";
  });
  const inFlight = reportable.filter((e) => {
    const state = (e.context_json as { state?: string })?.state;
    return state && state !== "Done";
  });

  const lines: string[] = [greeting, ""];

  if (shipped.length > 0) {
    lines.push("Shipped:");
    for (const e of shipped.slice(0, 4)) {
      const id = (e.context_json as { identifier?: string })?.identifier ?? "";
      lines.push(`• ${id ? `${id} — ` : ""}${e.object ?? "(untitled)"}`);
    }
    lines.push("");
  }
  if (inFlight.length > 0) {
    lines.push("In flight:");
    for (const e of inFlight.slice(0, 4)) {
      const id = (e.context_json as { identifier?: string })?.identifier ?? "";
      const state = (e.context_json as { state?: string })?.state ?? "";
      lines.push(`• ${id ? `${id} — ` : ""}${e.object ?? "(untitled)"}${state ? ` (${state})` : ""}`);
    }
    lines.push("");
  }
  if (shipped.length === 0 && inFlight.length === 0) {
    lines.push("Quiet week — nothing material to flag.");
    lines.push("");
  }
  lines.push("— Alex");
  return lines.join("\n");
}

// Build a user-facing reasoning trail explaining what Alex thought about
// before drafting. Surfaced verbatim in the Inbox card so the user can audit
// the work — included tickets, omitted ones with reasons, voice note, and a
// confidence label. In prod the LLM returns this alongside the body via
// structured output; here we synthesize deterministically.
function synthesizeReasoningTrail(
  wf: Workflow,
  events: Array<{ actor: string | null; verb: string; object: string | null; context_json: Record<string, unknown>; occurred_at: string }>,
): import("@/src/dev/store").DraftReasoningTrail {
  // Dedupe by identifier so we report each ticket once.
  const byKey = new Map<string, typeof events[number]>();
  for (const e of events) {
    const ident = (e.context_json as { identifier?: string })?.identifier;
    if (!ident) continue;
    const prev = byKey.get(ident);
    if (!prev || e.occurred_at > prev.occurred_at) byKey.set(ident, e);
  }
  const deduped = [...byKey.values()];

  // Heuristic omissions: if any included ticket's actor matches the recipient
  // (only meaningful for workflows with a recipient), call that out — it would
  // feel weird to report someone's own work back to them.
  const included: string[] = [];
  const omitted: { ref: string; reason: string }[] = [];
  for (const e of deduped) {
    const ident = (e.context_json as { identifier?: string })?.identifier ?? "";
    if (wf.recipient && e.actor === wf.recipient) {
      omitted.push({
        ref: ident,
        reason: `${recipientFirstName(wf.recipient)} did this herself — would feel weird to report it back.`,
      });
      continue;
    }
    if (ident) included.push(ident);
  }

  // Confidence: high when we have a healthy mix of shipped + in-flight,
  // medium when only one bucket, low when nothing meaningful was found.
  const shippedCount = deduped.filter((e) => (e.context_json as { state?: string })?.state === "Done").length;
  const inFlightCount = deduped.filter((e) => {
    const s = (e.context_json as { state?: string })?.state;
    return s && s !== "Done";
  }).length;
  let confidence: import("@/src/dev/store").DraftConfidence = "low";
  if (shippedCount + inFlightCount >= 4) confidence = "high";
  else if (shippedCount + inFlightCount >= 2) confidence = "medium";

  const voice_note =
    wf.trigger_kind === "weekly"
      ? "Tone matches your past stakeholder updates — direct, no fluff."
      : wf.trigger_kind === "daily"
      ? "Tone matches your past EOD notes — short, momentum-forward."
      : "Tone matches the way you usually write to this audience.";

  return { included, omitted, voice_note, confidence };
}

function recipientFirstName(recipient: string | null): string {
  if (!recipient) return "they";
  const local = recipient.split("@")[0] ?? recipient;
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export async function listPendingDrafts(tenantId: string): Promise<Draft[]> {
  if (MOCK_MODE) {
    const store = getDevStore();
    return [...store.drafts.values()]
      .filter((d) => d.tenant_id === tenantId && (d.status === "pending" || d.status === "approved"))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const sb = serverClient();
  const { data, error } = await sb
    .from("drafts")
    .select("*")
    .eq("tenant_id", tenantId)
    .in("status", ["pending", "approved"])
    .order("created_at", { ascending: false });
  if (error) throw new Error(`listPendingDrafts failed: ${error.message}`);
  return (data ?? []) as Draft[];
}

export async function getDraft(id: string): Promise<Draft | null> {
  if (MOCK_MODE) return getDevStore().drafts.get(id) ?? null;
  const sb = serverClient();
  const { data, error } = await sb.from("drafts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`getDraft failed: ${error.message}`);
  return (data ?? null) as Draft | null;
}

// All drafts for a tenant, regardless of status. Powers the per-workflow
// past-sends timeline + the dashboard's recent-wins card.
export async function listAllDrafts(tenantId: string): Promise<Draft[]> {
  if (MOCK_MODE) {
    const store = getDevStore();
    return [...store.drafts.values()]
      .filter((d) => d.tenant_id === tenantId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }
  const sb = serverClient();
  const { data, error } = await sb
    .from("drafts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`listAllDrafts failed: ${error.message}`);
  return (data ?? []) as Draft[];
}

// Approve flips status to "approved" and stamps a send_at 60s in the future.
// The actual send is triggered when send_at passes (a follow-up GET call from
// the inbox finishes the flip in dev; an Inngest scheduled job does it in prod).
const CANCEL_WINDOW_MS = 60_000;

export async function approveDraft(id: string): Promise<{ send_at: string }> {
  const now = new Date();
  const sendAt = new Date(now.getTime() + CANCEL_WINDOW_MS).toISOString();
  if (MOCK_MODE) {
    const draft = getDevStore().drafts.get(id);
    if (!draft) throw new Error(`Draft ${id} not found`);
    if (draft.status !== "pending") throw new Error(`Draft ${id} is ${draft.status}, not pending`);
    draft.status = "approved";
    draft.approved_at = now.toISOString();
    draft.send_at = sendAt;
    return { send_at: sendAt };
  }
  const sb = serverClient();
  const { error } = await sb
    .from("drafts")
    .update({ status: "approved", approved_at: now.toISOString(), send_at: sendAt })
    .eq("id", id)
    .eq("status", "pending");
  if (error) throw new Error(`approveDraft failed: ${error.message}`);
  return { send_at: sendAt };
}

export async function cancelDraft(id: string): Promise<void> {
  if (MOCK_MODE) {
    const draft = getDevStore().drafts.get(id);
    if (!draft) return;
    draft.status = "cancelled";
    return;
  }
  const sb = serverClient();
  const { error } = await sb
    .from("drafts")
    .update({ status: "cancelled" })
    .eq("id", id)
    .in("status", ["pending", "approved"]);
  if (error) throw new Error(`cancelDraft failed: ${error.message}`);
}

export async function rejectDraft(id: string): Promise<void> {
  if (MOCK_MODE) {
    const draft = getDevStore().drafts.get(id);
    if (!draft) return;
    draft.status = "rejected";
    draft.rejected_at = new Date().toISOString();
    return;
  }
  const sb = serverClient();
  const { error } = await sb
    .from("drafts")
    .update({ status: "rejected", rejected_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(`rejectDraft failed: ${error.message}`);
}

// Marks an approved draft "sent" if its send_at has passed. Called from the
// inbox poll so we don't need a scheduled job in dev.
export async function settlePendingSends(tenantId: string): Promise<number> {
  const now = Date.now();
  let settled = 0;
  if (MOCK_MODE) {
    const store = getDevStore();
    for (const draft of store.drafts.values()) {
      if (
        draft.tenant_id === tenantId &&
        draft.status === "approved" &&
        draft.send_at &&
        new Date(draft.send_at).getTime() <= now
      ) {
        draft.status = "sent";
        draft.sent_at = new Date().toISOString();
        settled += 1;
      }
    }
    return settled;
  }
  // Prod: scheduled Inngest job handles this. We still no-op the call so the
  // inbox UI can hit the same endpoint without branching.
  return 0;
}
