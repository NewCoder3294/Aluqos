// Pure projections over the activity-event store + workflows + drafts.
// Power the rich dashboard surfaces (attention, pipeline, people, wins) without
// any new persistence — the UI is always live with whatever the store has.

import type { Workflow, Draft } from "./queries";
import type { DevActivityEvent } from "@/src/dev/store";

// ─── PEOPLE ───────────────────────────────────────────────────────────
//
// Inferred from event actors + workflow recipients. Each person gets a
// role label based on observed behavior:
//   - stakeholder: appears as a recipient on a workflow, or is someone the
//     user tends to reply to (high reply ratio on their comments)
//   - collaborator: frequent actor on the same identifiers as the user
//   - team: everyone else who's appeared

export type Person = {
  email: string;
  name: string; // display name from email local-part
  initials: string;
  role: "stakeholder" | "collaborator" | "team";
  /** ISO timestamp of last event involving this person */
  last_seen: string;
  /** Count of events they're the actor on, last 30d */
  event_count: number;
  /** Free-form hint shown under the name */
  hint: string;
};

function nameFromEmail(email: string): { name: string; initials: string } {
  const local = email.split("@")[0] ?? email;
  const name = local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
  const initials = name.slice(0, 1);
  return { name, initials };
}

export function derivePeople(
  events: DevActivityEvent[],
  workflows: Workflow[],
  /** Optional: emails Alex has *proposed* a workflow to, even if the user
   *  hasn't approved yet. Lets the orbit hint a likely-stakeholder ahead of
   *  approval so the relationship graph reflects what Alex thinks, not just
   *  what's been confirmed. */
  proposedStakeholders: string[] = [],
): Person[] {
  const stakeholderEmails = new Set<string>();
  for (const wf of workflows) {
    if (wf.recipient && wf.recipient.includes("@") && !wf.recipient.startsWith("team@")) {
      stakeholderEmails.add(wf.recipient);
    }
  }
  const proposedSet = new Set(
    proposedStakeholders.filter((e) => e && e.includes("@") && !e.startsWith("team@")),
  );

  const byEmail = new Map<string, { count: number; last: string }>();
  for (const ev of events) {
    if (!ev.actor || !ev.actor.includes("@")) continue;
    const prev = byEmail.get(ev.actor);
    if (!prev) byEmail.set(ev.actor, { count: 1, last: ev.occurred_at });
    else {
      prev.count += 1;
      if (ev.occurred_at > prev.last) prev.last = ev.occurred_at;
    }
  }

  // Pick the single highest-count collaborator as "most active". Anyone with
  // the same count ties on alphabetical so the result is stable.
  let topActorEmail: string | null = null;
  let topCount = 0;
  for (const [email, stats] of byEmail) {
    if (stakeholderEmails.has(email)) continue;
    if (
      stats.count > topCount ||
      (stats.count === topCount && (topActorEmail === null || email < topActorEmail))
    ) {
      topActorEmail = email;
      topCount = stats.count;
    }
  }

  const people: Person[] = [];
  for (const [email, stats] of byEmail) {
    const { name, initials } = nameFromEmail(email);
    let role: Person["role"] = "team";
    let hint = "Recently active in your sources.";
    if (stakeholderEmails.has(email)) {
      role = "stakeholder";
      hint = "Your stakeholder · receives the weekly digest.";
    } else if (proposedSet.has(email)) {
      role = "stakeholder";
      hint = "Likely stakeholder · I drafted a digest proposal for them.";
    } else if (stats.count >= 2) {
      role = "collaborator";
      hint =
        email === topActorEmail
          ? "Your most active teammate this week."
          : "Steady contributor in your orbit.";
    }
    people.push({ email, name, initials, role, last_seen: stats.last, event_count: stats.count, hint });
  }

  // Stakeholders first, then collaborators by event count, then team.
  const rolePriority: Record<Person["role"], number> = { stakeholder: 0, collaborator: 1, team: 2 };
  return people.sort((a, b) => {
    if (rolePriority[a.role] !== rolePriority[b.role]) return rolePriority[a.role] - rolePriority[b.role];
    return b.event_count - a.event_count;
  });
}

// ─── ATTENTION ────────────────────────────────────────────────────────
//
// Recent events that Alex would actually do something about. Each item gets
// an annotation explaining what Alex *plans* to do with it — that's the
// "watching an employee work" signal. Annotations are deterministic for now;
// in prod, the same data feeds an LLM call that produces richer text.

export type AttentionItem = {
  id: string; // event id
  identifier: string | null; // e.g. "ENG-128"
  actor_name: string | null;
  actor_initials: string | null;
  verb: string;
  object: string | null;
  occurred_at: string;
  /** Plain-English line in Alex's voice — what he plans to do with this */
  annotation: string;
};

export function deriveAttention(
  events: DevActivityEvent[],
  workflows: Workflow[],
  limit = 6,
): AttentionItem[] {
  const recipientEmails = new Set(workflows.map((w) => w.recipient).filter(Boolean) as string[]);

  // Most recent first; cap at `limit`.
  const sorted = [...events].sort((a, b) => b.occurred_at.localeCompare(a.occurred_at));
  const items: AttentionItem[] = [];
  for (const ev of sorted) {
    if (items.length >= limit) break;
    const identifier = (ev.context_json as { identifier?: string })?.identifier ?? null;
    const state = (ev.context_json as { state?: string })?.state ?? null;
    const actor = ev.actor;
    const actorName = actor ? nameFromEmail(actor).name : null;
    const actorInitials = actor ? nameFromEmail(actor).initials : null;

    let annotation = "";
    if (ev.verb === "commented" && actor && recipientEmails.has(actor)) {
      annotation = `${actorName} reached out. I'll surface this if you don't reply by tomorrow.`;
    } else if (ev.verb === "commented") {
      annotation = `${actorName ?? "Someone"} added context. I'll fold it into the next digest.`;
    } else if (state === "Done") {
      annotation = "I'll log this as a win in the next recap.";
    } else if (ev.verb === "created") {
      annotation = "Watching for the first state change before I include it.";
    } else if (ev.verb === "updated" && state) {
      annotation = `Tracking the move to ${state}.`;
    } else {
      annotation = "Keeping an eye on this.";
    }

    items.push({
      id: ev.id,
      identifier,
      actor_name: actorName,
      actor_initials: actorInitials,
      verb: ev.verb,
      object: ev.object,
      occurred_at: ev.occurred_at,
      annotation,
    });
  }
  return items;
}

// ─── PIPELINE ─────────────────────────────────────────────────────────
//
// Upcoming workflow runs with countdown. next_run_at on each workflow drives
// the order. Computes a friendly "in 3h 12m" delta for the UI.

export type PipelineItem = {
  workflow_id: string;
  title: string;
  recipient: string | null;
  recipient_name: string | null;
  next_run_at: string;
  /** Friendly relative label like "in 3h 12m" or "tomorrow at 9 AM" */
  countdown_label: string;
  /** What happens when this fires — short verb phrase */
  next_action: string;
};

function formatCountdown(targetMs: number): string {
  const delta = targetMs - Date.now();
  if (delta <= 0) return "any moment now";
  const min = Math.floor(delta / 60_000);
  if (min < 60) return `in ${min}m`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  if (hr < 24) return remMin === 0 ? `in ${hr}h` : `in ${hr}h ${remMin}m`;
  const days = Math.floor(hr / 24);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}

function nextRunForWorkflow(wf: Workflow): Date | null {
  if (wf.next_run_at) return new Date(wf.next_run_at);
  // Compute next run from trigger_config when missing. This keeps the UI
  // working for newly-approved workflows that haven't had next_run_at set yet.
  const cfg = wf.trigger_config as { day_of_week?: string; hour?: number };
  const now = new Date();
  if (wf.trigger_kind === "daily" && typeof cfg.hour === "number") {
    const next = new Date(now);
    next.setHours(cfg.hour, 0, 0, 0);
    if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
    return next;
  }
  if (wf.trigger_kind === "weekly" && cfg.day_of_week && typeof cfg.hour === "number") {
    const targetDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].indexOf(
      cfg.day_of_week.toLowerCase(),
    );
    if (targetDay < 0) return null;
    const next = new Date(now);
    next.setHours(cfg.hour, 0, 0, 0);
    const delta = (targetDay - next.getDay() + 7) % 7;
    next.setDate(next.getDate() + (delta === 0 && next.getTime() <= now.getTime() ? 7 : delta));
    return next;
  }
  return null;
}

export function derivePipeline(workflows: Workflow[]): PipelineItem[] {
  const items: PipelineItem[] = [];
  for (const wf of workflows) {
    if (!wf.enabled) continue;
    const next = nextRunForWorkflow(wf);
    if (!next) continue;
    items.push({
      workflow_id: wf.id,
      title: wf.title,
      recipient: wf.recipient,
      recipient_name: wf.recipient ? nameFromEmail(wf.recipient).name : null,
      next_run_at: next.toISOString(),
      countdown_label: formatCountdown(next.getTime()),
      next_action: wf.recipient ? `draft a note to ${nameFromEmail(wf.recipient).name}` : "draft a recap for you",
    });
  }
  return items.sort((a, b) => a.next_run_at.localeCompare(b.next_run_at));
}

// ─── RECENT WINS ──────────────────────────────────────────────────────
//
// Last few sent drafts — proof Alex is shipping work for the user. Inbox
// shows pending; this surface shows the "after" state.

export type WinItem = {
  draft_id: string;
  workflow_id: string;
  subject: string;
  recipient: string | null;
  recipient_name: string | null;
  sent_at: string;
};

export function deriveRecentWins(drafts: Draft[], limit = 3): WinItem[] {
  return drafts
    .filter((d) => d.status === "sent" && d.sent_at)
    .sort((a, b) => (b.sent_at ?? "").localeCompare(a.sent_at ?? ""))
    .slice(0, limit)
    .map((d) => ({
      draft_id: d.id,
      workflow_id: d.workflow_id,
      subject: d.subject,
      recipient: d.recipient,
      recipient_name: d.recipient ? nameFromEmail(d.recipient).name : null,
      sent_at: d.sent_at as string,
    }));
}

// ─── PAST SENDS (for workflow card timelines) ─────────────────────────
//
// Last N drafts for a single workflow, with status only — feeds the colored
// dot timeline on the workflow card.

export type PastSendDot = {
  draft_id: string;
  status: Draft["status"];
  created_at: string;
};

export function derivePastSends(drafts: Draft[], workflowId: string, limit = 6): PastSendDot[] {
  return drafts
    .filter((d) => d.workflow_id === workflowId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((d) => ({ draft_id: d.id, status: d.status, created_at: d.created_at }));
}

// ─── ALEX'S STATUS LINE ───────────────────────────────────────────────
//
// One-sentence summary of what Alex is doing right now, derived from
// store state. Drives the greeting card on /dashboard.

export type AlexStatus = {
  /** Plain-English line shown under the greeting */
  line: string;
  /** "live" = breathing dot in coral; "neutral" = no dot */
  tone: "live" | "neutral";
};

export function deriveAlexStatus(opts: {
  pendingDrafts: Draft[];
  approvedDrafts: Draft[];
  recentSent: WinItem[];
  hasConnection: boolean;
  pipeline: PipelineItem[];
}): AlexStatus {
  if (!opts.hasConnection) {
    return {
      line: "Connect a source and I'll start watching for things you'd want me to handle.",
      tone: "neutral",
    };
  }
  const approvedMidWindow = opts.approvedDrafts.find((d) => d.send_at);
  if (approvedMidWindow) {
    return {
      line: `Sending "${approvedMidWindow.subject}" in a moment — tap Cancel in the Inbox if you need to take it back.`,
      tone: "live",
    };
  }
  if (opts.pendingDrafts.length > 0) {
    const d = opts.pendingDrafts[0];
    const minutesAgo = Math.max(1, Math.floor((Date.now() - new Date(d.created_at).getTime()) / 60_000));
    return {
      line: `I drafted "${d.subject}" ${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago — waiting on your sign-off in the Inbox.`,
      tone: "live",
    };
  }
  if (opts.pipeline.length > 0) {
    const next = opts.pipeline[0];
    return {
      line: `Next up: I'll ${next.next_action} ${next.countdown_label}. I'll let you know when there's a draft to look at.`,
      tone: "neutral",
    };
  }
  if (opts.recentSent.length > 0) {
    return {
      line: `Just sent "${opts.recentSent[0].subject}". All quiet — I'll let you know when something matters.`,
      tone: "neutral",
    };
  }
  return {
    line: "All quiet. I'll let you know when something matters.",
    tone: "neutral",
  };
}
