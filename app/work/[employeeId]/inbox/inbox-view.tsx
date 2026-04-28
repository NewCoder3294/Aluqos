"use client";

import { useCallback, useEffect, useState } from "react";
import { Mailbox, CheckCircle2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";
import type { Draft } from "@/src/workflows/queries";

const POLL_MS = 1000;

function fmtTimeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
}

function secondsUntil(iso: string | null): number {
  if (!iso) return 0;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 1000));
}

export function InboxView({ initialDrafts }: { initialDrafts: Draft[] }) {
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, tick] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/drafts", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { drafts: Draft[] };
      setDrafts(json.drafts);
    } catch {
      // silent — the next tick will retry
    }
  }, []);

  // Poll the inbox endpoint every second so the 60s timer + auto-send to
  // "sent" lands without a manual refresh.
  useEffect(() => {
    const interval = setInterval(() => {
      tick((n) => n + 1); // re-render to advance per-draft countdowns
      refresh();
    }, POLL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  async function handleApprove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/drafts/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("approve failed");
      toast.info("Approved. Sends in 60 seconds — cancel any time.");
      await refresh();
    } catch {
      toast.info("Could not approve — try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleCancel(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/drafts/${id}/cancel`, { method: "POST" });
      toast.info("Cancelled. Nothing was sent.");
      await refresh();
    } catch {
      toast.info("Could not cancel — try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/drafts/${id}/reject`, { method: "POST" });
      toast.info("Draft rejected. Alex will skip this one.");
      await refresh();
    } catch {
      toast.info("Could not reject — try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (drafts.length === 0) {
    return (
      <div className="space-y-4">
        <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Inbox</h1>
        <Card>
          <CardContent compact className="px-8 py-12 text-center">
            <Mailbox size={28} strokeWidth={1.5} className="mx-auto text-ink-faint mb-3" />
            <div className="text-[15px] text-ink mb-1">Nothing waiting on you</div>
            <p className="text-[13px] text-ink-faint">
              Alex will queue drafts here when scheduled workflows fire. You can also approve a
              proposal on the dashboard to draft something immediately.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Inbox</h1>
        <p className="mt-1 text-[13px] text-ink-faint">
          Drafts Alex made for you. One tap to approve, sixty seconds to cancel.
        </p>
      </div>

      <div className="space-y-4">
        {drafts.map((draft) => {
          const isPending = draft.status === "pending";
          const isApproved = draft.status === "approved";
          const remaining = isApproved ? secondsUntil(draft.send_at) : 0;

          return (
            <Card key={draft.id} tone={isApproved ? "primary" : "default"}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isApproved ? (
                    <CheckCircle2 size={14} strokeWidth={2} className="text-coral-deep" />
                  ) : (
                    <Mailbox size={14} strokeWidth={2} className="text-ink-faint" />
                  )}
                  {draft.subject}
                </CardTitle>
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                  {draft.recipient ? `→ ${draft.recipient}` : "no recipient"} ·{" "}
                  {fmtTimeAgo(draft.created_at)}
                </span>
              </CardHeader>
              <CardContent compact className="px-5 py-4">
                <pre className="text-[13px] text-ink whitespace-pre-wrap font-sans leading-relaxed">
                  {draft.body}
                </pre>

                {isApproved && (
                  <div className="mt-4 flex items-center justify-between rounded-md border border-coral/30 bg-coral/5 px-4 py-3">
                    <span className="text-[13px] text-coral-deep">
                      Sending in <span className="font-medium tabular-nums">{remaining}</span> second
                      {remaining === 1 ? "" : "s"}…
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(draft.id)}
                      disabled={busyId !== null}
                    >
                      <X size={12} strokeWidth={2} className="mr-1" />
                      Cancel
                    </Button>
                  </div>
                )}

                {isPending && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(draft.id)}
                      disabled={busyId !== null}
                      className={cn("bg-coral text-white hover:bg-coral-deep")}
                    >
                      Approve & send
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(draft.id)}
                      disabled={busyId !== null}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
