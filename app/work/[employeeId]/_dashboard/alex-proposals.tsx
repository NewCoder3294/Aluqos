"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";
import type { WorkflowProposal } from "@/src/workflows/queries";

const TRIGGER_LABEL: Record<WorkflowProposal["trigger_kind"], string> = {
  weekly: "Weekly",
  daily: "Daily",
  on_demand: "On demand",
};

export function AlexProposals({
  employeeId,
  proposals,
}: {
  employeeId: string;
  proposals: WorkflowProposal[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(proposals[0]?.id ?? null);

  if (proposals.length === 0) return null;

  async function handleApprove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/workflows/proposals/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error(`approve failed: ${res.status}`);
      await res.json(); // we don't need the body but consume it for clarity
      toast.info("Workflow scheduled. First draft is in your inbox.");
      router.push(`/work/${employeeId}/inbox`);
      router.refresh();
    } catch (err) {
      toast.info("Could not schedule — try again.");
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDismiss(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/workflows/proposals/${id}/dismiss`, { method: "POST" });
      if (!res.ok) throw new Error(`dismiss failed: ${res.status}`);
      router.refresh();
    } catch (err) {
      toast.info("Could not dismiss — try again.");
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card tone="primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={14} strokeWidth={2} className="text-coral-deep" />
          Alex has {proposals.length} {proposals.length === 1 ? "idea" : "ideas"} for you
        </CardTitle>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Inferred from your activity · Approve to schedule
        </span>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul>
          {proposals.map((p, idx) => {
            const expanded = expandedId === p.id;
            return (
              <li
                key={p.id}
                className={cn(
                  "px-5 py-4 transition-colors",
                  idx !== proposals.length - 1 && "border-b border-paper-edge",
                  expanded && "bg-paper-hi/30",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-[0.12em] text-coral-deep font-medium shrink-0">
                        {TRIGGER_LABEL[p.trigger_kind]}
                      </span>
                      {p.recipient && (
                        <span className="text-[11px] text-ink-faint truncate">→ {p.recipient}</span>
                      )}
                    </div>
                    <div className="text-[15px] text-ink mb-1.5">{p.title}</div>
                    <p className="text-[13px] text-ink-muted leading-relaxed">{p.rationale}</p>

                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : p.id)}
                      className="mt-2 text-[12px] text-ink-faint hover:text-ink underline underline-offset-2"
                    >
                      {expanded ? "Hide sample draft" : "See sample draft"}
                    </button>

                    {expanded && (
                      <div className="mt-3 rounded-md border border-paper-edge bg-paper-hi/50 p-4">
                        <pre className="text-[12.5px] text-ink whitespace-pre-wrap font-sans leading-relaxed">
                          {p.sample_draft}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(p.id)}
                      disabled={busyId !== null}
                      className="bg-coral text-white hover:bg-coral-deep"
                    >
                      Approve & schedule
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDismiss(p.id)}
                      disabled={busyId !== null}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
