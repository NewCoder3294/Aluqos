"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Avatar } from "./avatar";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";
import type { WorkflowProposal } from "@/src/workflows/queries";

const TRIGGER_PHRASE: Record<WorkflowProposal["trigger_kind"], (cfg: Record<string, unknown>) => string> = {
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

function recipientName(recipient: string | null): string | null {
  if (!recipient) return null;
  const local = recipient.split("@")[0] ?? recipient;
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
}

export function ProposalCards({ proposals }: { proposals: WorkflowProposal[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(proposals[0]?.id ?? null);

  if (proposals.length === 0) return null;

  async function handleApprove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/workflows/proposals/${id}/approve`, { method: "POST" });
      if (!res.ok) throw new Error("approve failed");
      await res.json();
      toast.info("Done. First draft is in your Inbox.");
      router.push("/inbox");
      router.refresh();
    } catch (err) {
      toast.info("Couldn't schedule that one. Try again?");
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDismiss(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/workflows/proposals/${id}/dismiss`, { method: "POST" });
      if (!res.ok) throw new Error("dismiss failed");
      router.refresh();
    } catch (err) {
      toast.info("Couldn't dismiss. Try again?");
      console.error(err);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card tone="primary" className="alex-fade-up alex-stagger-1 overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={14} strokeWidth={2} className="text-coral-deep" />
          I have {proposals.length} {proposals.length === 1 ? "idea" : "ideas"} for you
        </CardTitle>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Inferred from your activity · Approve to schedule
        </span>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul>
          {proposals.map((p, idx) => {
            const expanded = expandedId === p.id;
            const recipName = recipientName(p.recipient);
            const cadence = TRIGGER_PHRASE[p.trigger_kind](p.trigger_config);
            return (
              <li
                key={p.id}
                className={cn(
                  "transition-colors",
                  idx !== proposals.length - 1 && "border-b border-paper-edge",
                  expanded && "bg-paper-hi/30",
                )}
              >
                <div className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    {recipName ? (
                      <Avatar name={p.recipient} initials={recipName.charAt(0)} size="md" />
                    ) : (
                      <Avatar name="yourself" initials="·" size="md" tone="neutral" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] text-ink mb-0.5">{p.title}</div>
                      <div className="text-[12px] text-ink-faint mb-2">
                        <span className="font-medium text-coral-deep">{cadence}</span>
                        {recipName && <span> · to {recipName}</span>}
                      </div>
                      <p className="text-[13px] text-ink-muted leading-relaxed">{p.rationale}</p>

                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : p.id)}
                        className="mt-2.5 inline-flex items-center gap-1 text-[12px] text-ink-faint hover:text-ink transition-colors"
                      >
                        {expanded ? "Hide sample" : "See what the first one would look like"}
                        {expanded ? (
                          <ChevronUp size={12} strokeWidth={2} />
                        ) : (
                          <ChevronDown size={12} strokeWidth={2} />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col items-stretch gap-2 shrink-0 min-w-[160px]">
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
                        Not for me
                      </Button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 ml-[52px] rounded-md border border-paper-edge bg-white px-4 py-3.5">
                      <pre className="text-[12.5px] text-ink whitespace-pre-wrap font-sans leading-relaxed">
                        {p.sample_draft}
                      </pre>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
