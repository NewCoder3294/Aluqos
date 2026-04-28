"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, X, Send, Brain } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar } from "./avatar";
import { ConfidenceDots } from "./confidence-dots";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";
import type { Draft } from "@/src/workflows/queries";

function fmtRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

function recipientName(recipient: string | null): string | null {
  if (!recipient) return null;
  const local = recipient.split("@")[0] ?? recipient;
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
}

function secondsUntil(iso: string | null): number {
  if (!iso) return 0;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 1000));
}

export function DraftCard({
  draft,
  onAfterAction,
}: {
  draft: Draft;
  /** Refresh callback the parent uses to re-poll the inbox */
  onAfterAction: () => Promise<void> | void;
}) {
  const [busy, setBusy] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);
  // Force re-render every second so the countdown ticks. Cleared on unmount.
  const [, force] = useState(0);
  useEffect(() => {
    if (draft.status !== "approved") return;
    const i = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(i);
  }, [draft.status]);

  const recipName = recipientName(draft.recipient);
  const remaining = draft.status === "approved" ? secondsUntil(draft.send_at) : 0;
  const isPending = draft.status === "pending";
  const isApproved = draft.status === "approved";

  async function callAndRefresh(path: string, msg: string) {
    setBusy(true);
    try {
      const res = await fetch(path, { method: "POST" });
      if (!res.ok) throw new Error("action failed");
      toast.info(msg);
      await onAfterAction();
    } catch {
      toast.info("Couldn't do that. Try again?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card
      tone={isApproved ? "primary" : "default"}
      className={cn("alex-fade-up overflow-hidden", isApproved && "border-coral/30")}
    >
      <CardHeader className="px-6 py-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {recipName ? (
            <Avatar name={draft.recipient} initials={recipName.charAt(0)} size="md" />
          ) : (
            <Avatar name="yourself" initials="·" size="md" tone="neutral" />
          )}
          <div className="min-w-0 flex-1">
            <div className="serif text-[16px] tracking-[-0.01em] text-ink truncate">{draft.subject}</div>
            <div className="text-[12px] text-ink-faint truncate">
              {recipName ? (
                <>To <span className="text-ink-muted">{recipName}</span> · {draft.recipient}</>
              ) : (
                <>For yourself</>
              )}
            </div>
          </div>
        </div>
        <span className="text-[11px] text-ink-faint shrink-0 tabular-nums">{fmtRelative(draft.created_at)}</span>
      </CardHeader>

      <CardContent compact className="px-6 py-5">
        {/* The body, rendered like an email preview */}
        <div className="rounded-md bg-paper-hi/30 border border-paper-edge px-5 py-4">
          <pre className="text-[13.5px] text-ink whitespace-pre-wrap font-sans leading-[1.6]">
            {draft.body}
          </pre>
        </div>

        {/* Reasoning trail */}
        <button
          type="button"
          onClick={() => setShowReasoning((s) => !s)}
          className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-ink-faint hover:text-ink transition-colors"
        >
          <Brain size={12} strokeWidth={2} />
          {showReasoning ? "Hide why I drafted this" : "Why I drafted this"}
          {showReasoning ? <ChevronUp size={12} strokeWidth={2} /> : <ChevronDown size={12} strokeWidth={2} />}
        </button>

        {showReasoning && (
          <div className="mt-3 rounded-md border border-paper-edge bg-white px-5 py-4 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
                Alex&apos;s reasoning
              </span>
              <ConfidenceDots confidence={draft.reasoning_trail.confidence} />
            </div>

            {draft.reasoning_trail.included.length > 0 && (
              <div>
                <div className="text-[12px] text-ink-muted mb-1.5">I included these:</div>
                <div className="flex flex-wrap gap-1.5">
                  {draft.reasoning_trail.included.map((ref) => (
                    <span
                      key={ref}
                      className="inline-flex items-center rounded-md bg-paper-hi border border-paper-edge px-2 py-0.5 text-[11px] tabular-nums text-ink"
                    >
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {draft.reasoning_trail.omitted.length > 0 && (
              <div>
                <div className="text-[12px] text-ink-muted mb-1.5">What I left out, and why:</div>
                <ul className="space-y-1.5">
                  {draft.reasoning_trail.omitted.map((o, i) => (
                    <li key={i} className="text-[12.5px] text-ink-muted leading-relaxed">
                      <span className="inline-flex items-center rounded-md bg-paper-hi/60 border border-paper-edge px-1.5 py-px text-[10.5px] tabular-nums text-ink mr-1.5">
                        {o.ref}
                      </span>
                      {o.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-[12.5px] text-ink-muted italic-serif leading-relaxed pt-1 border-t border-paper-edge">
              {draft.reasoning_trail.voice_note}
            </div>
          </div>
        )}

        {/* Action footer */}
        {isApproved ? (
          <div className="mt-5 flex items-center justify-between rounded-md border border-coral/40 bg-coral/8 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="alex-breathe size-2 rounded-full bg-coral shrink-0" aria-hidden />
              <span className="text-[13px] text-coral-deep">
                Sending in <span className="font-medium tabular-nums">{remaining}</span> second{remaining === 1 ? "" : "s"}…
                <span className="text-ink-muted"> tap Cancel to take it back.</span>
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => callAndRefresh(`/api/drafts/${draft.id}/cancel`, "Cancelled. Nothing was sent.")}
            >
              <X size={11} strokeWidth={2} className="mr-1" />
              Cancel
            </Button>
          </div>
        ) : isPending ? (
          <div className="mt-5 flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => callAndRefresh(`/api/drafts/${draft.id}/approve`, "Approved. Sends in 60 seconds — Cancel any time.")}
              disabled={busy}
              className="bg-coral text-white hover:bg-coral-deep"
            >
              <Send size={11} strokeWidth={2} className="mr-1" />
              Approve & send
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() => callAndRefresh(`/api/drafts/${draft.id}/reject`, "Rejected. I'll skip this one.")}
            >
              Not this time
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
