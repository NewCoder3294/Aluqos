"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play, ChevronDown, ChevronUp, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar } from "./avatar";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";
import type { Workflow, Draft } from "@/src/workflows/queries";
import { derivePastSends } from "@/src/workflows/projections";

const TRIGGER_PHRASE: Record<Workflow["trigger_kind"], (cfg: Record<string, unknown>) => string> = {
  weekly: (cfg) => {
    const day = cfg.day_of_week as string | undefined;
    const hour = cfg.hour as number | undefined;
    if (!day || hour === undefined) return "Every week";
    const cap = day.charAt(0).toUpperCase() + day.slice(1);
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `Every ${cap} at ${displayHour}${ampm}`;
  },
  daily: (cfg) => {
    const hour = cfg.hour as number | undefined;
    if (hour === undefined) return "Every day";
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `Every day at ${displayHour}${ampm}`;
  },
  on_demand: () => "On demand",
};

const STATUS_DOT_CLASS: Record<Draft["status"], string> = {
  sent: "bg-coral",
  approved: "bg-coral/60",
  pending: "bg-paper-edge",
  rejected: "bg-ink/30",
  cancelled: "bg-ink/15",
};

const STATUS_LABEL: Record<Draft["status"], string> = {
  sent: "Sent",
  approved: "Approved",
  pending: "Drafted",
  rejected: "You rejected",
  cancelled: "You cancelled",
};

function recipientName(recipient: string | null): string | null {
  if (!recipient) return null;
  const local = recipient.split("@")[0] ?? recipient;
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
}

function formatLastRun(iso: string | null): string {
  if (!iso) return "never run";
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return days === 1 ? "yesterday" : `${days} days ago`;
}

function formatDayMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function WorkflowCard({
  workflow,
  drafts,
  liveSignalCount,
}: {
  workflow: Workflow;
  drafts: Draft[];
  /** Count of activity events in the workflow's window worth including */
  liveSignalCount: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const cadence = TRIGGER_PHRASE[workflow.trigger_kind](workflow.trigger_config);
  const recipName = recipientName(workflow.recipient);
  const pastSends = derivePastSends(drafts, workflow.id);
  const lastSent = pastSends.find((p) => p.status === "sent");
  const sentCount = pastSends.filter((p) => p.status === "sent").length;
  const totalDrafts = pastSends.length;
  // Confidence proxy: % of recent sends that went through (not rejected/cancelled).
  const successRate = totalDrafts === 0 ? null : Math.round((sentCount / totalDrafts) * 100);

  async function handleRunNow() {
    setBusy(true);
    try {
      const res = await fetch(`/api/workflows/${workflow.id}/run`, { method: "POST" });
      if (!res.ok) throw new Error("run failed");
      toast.info("Drafted. It's in your Inbox waiting for sign-off.");
      router.push("/inbox");
      router.refresh();
    } catch {
      toast.info("Couldn't draft right now. Try again?");
    } finally {
      setBusy(false);
    }
  }

  // Latest sent draft body, expanded on demand. Lets the user audit what
  // Alex has actually been sending without leaving the page.
  const lastSentDraft = drafts.find((d) => d.workflow_id === workflow.id && d.status === "sent");

  return (
    <Card className="alex-fade-up overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3 min-w-0">
          <CardTitle className="truncate">{workflow.title}</CardTitle>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] font-medium shrink-0",
              workflow.enabled
                ? "bg-coral/10 border-coral/30 text-coral-deep"
                : "bg-paper-hi border-paper-edge text-ink-faint",
            )}
          >
            <span className={cn("size-1.5 rounded-full", workflow.enabled ? "bg-coral" : "bg-ink-faint")} />
            {workflow.enabled ? "Active" : "Paused"}
          </span>
        </div>
        <span className="text-[11px] text-ink-faint shrink-0 tabular-nums">
          Last run {formatLastRun(workflow.last_run_at)}
        </span>
      </CardHeader>

      <CardContent compact className="px-5 py-5 space-y-5">
        {/* Recipient row */}
        <div className="flex items-center gap-3">
          {recipName ? (
            <Avatar name={workflow.recipient} initials={recipName.charAt(0)} size="md" />
          ) : (
            <Avatar name="yourself" initials="·" size="md" tone="neutral" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[14px] text-ink">
              {recipName ? `Goes to ${recipName}` : "Goes to yourself"}
            </div>
            {workflow.recipient && (
              <div className="text-[12px] text-ink-faint truncate">{workflow.recipient}</div>
            )}
          </div>
          <span className="text-[12px] text-coral-deep font-medium shrink-0">{cadence}</span>
        </div>

        {/* Live signal */}
        <div className="rounded-md bg-paper-hi/40 border border-paper-edge px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="alex-breathe size-1.5 rounded-full bg-coral shrink-0" aria-hidden />
            <span className="text-[13px] text-ink">
              {liveSignalCount === 0
                ? "Quiet right now — I'll keep watching."
                : `I see ${liveSignalCount} event${liveSignalCount === 1 ? "" : "s"} this period worth including.`}
            </span>
          </div>
        </div>

        {/* Past-sends timeline */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
              Past {totalDrafts || "—"} run{totalDrafts === 1 ? "" : "s"}
            </span>
            {successRate !== null && (
              <span className="text-[11px] text-ink-muted">
                {successRate}% you approved · {lastSent ? `last sent ${formatDayMonth(lastSent.created_at)}` : "none sent yet"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {/* Show 6 slots — fill from the right with most recent first, blank slots on the left */}
            {Array.from({ length: 6 }).map((_, i) => {
              const slotIdx = 5 - i;
              const send = pastSends[slotIdx];
              return (
                <span
                  key={i}
                  className={cn(
                    "flex-1 h-2 rounded-full",
                    send ? STATUS_DOT_CLASS[send.status] : "bg-paper-edge/40",
                  )}
                  title={send ? `${STATUS_LABEL[send.status]} · ${formatDayMonth(send.created_at)}` : "no run yet"}
                />
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            disabled={!lastSentDraft}
            className="inline-flex items-center gap-1 text-[12px] text-ink-faint hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {lastSentDraft ? (expanded ? "Hide last sent" : "See what I last sent") : "No sends yet"}
            {lastSentDraft && (expanded ? <ChevronUp size={12} strokeWidth={2} /> : <ChevronDown size={12} strokeWidth={2} />)}
          </button>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => toast.info("Pause coming soon — for now you can disconnect the source.")}
            >
              <Pause size={11} strokeWidth={2} className="mr-1" />
              Pause
            </Button>
            <Button
              size="sm"
              onClick={handleRunNow}
              disabled={busy}
              className="bg-coral text-white hover:bg-coral-deep"
            >
              <Play size={11} strokeWidth={2} className="mr-1" />
              Draft one now
            </Button>
          </div>
        </div>

        {expanded && lastSentDraft && (
          <div className="rounded-md border border-paper-edge bg-paper-hi/30 p-4">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-faint mb-2 font-medium">
              Last sent · {formatDayMonth(lastSentDraft.sent_at ?? lastSentDraft.created_at)}
            </div>
            <div className="text-[13px] text-ink mb-2 font-medium">{lastSentDraft.subject}</div>
            <pre className="text-[12.5px] text-ink-muted whitespace-pre-wrap font-sans leading-relaxed">
              {lastSentDraft.body}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
