"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Workflow as WorkflowIcon, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/toast";
import type { Workflow } from "@/src/workflows/queries";

const TRIGGER_LABEL: Record<Workflow["trigger_kind"], string> = {
  weekly: "Weekly",
  daily: "Daily",
  on_demand: "On demand",
};

function formatTrigger(wf: Workflow): string {
  if (wf.trigger_kind === "weekly") {
    const day = (wf.trigger_config as { day_of_week?: string })?.day_of_week;
    const hour = (wf.trigger_config as { hour?: number })?.hour;
    if (day && hour !== undefined) {
      const cap = day.charAt(0).toUpperCase() + day.slice(1);
      return `Every ${cap} at ${hour}:00`;
    }
    return "Weekly";
  }
  if (wf.trigger_kind === "daily") {
    const hour = (wf.trigger_config as { hour?: number })?.hour;
    return hour !== undefined ? `Daily at ${hour}:00` : "Daily";
  }
  return TRIGGER_LABEL[wf.trigger_kind];
}

export function WorkflowsView({
  employeeId,
  workflows,
}: {
  employeeId: string;
  workflows: Workflow[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleRunNow(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/workflows/${id}/run`, { method: "POST" });
      if (!res.ok) throw new Error("run failed");
      toast.info("Drafted. Check your inbox.");
      router.push(`/work/${employeeId}/inbox`);
      router.refresh();
    } catch {
      toast.info("Could not run — try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Workflows</h1>
        <p className="mt-1 text-[13px] text-ink-faint">
          Recurring tasks Alex runs for you. Approved from proposals on the dashboard.
        </p>
      </div>

      {workflows.length === 0 ? (
        <Card>
          <CardContent compact className="px-8 py-12 text-center">
            <WorkflowIcon size={28} strokeWidth={1.5} className="mx-auto text-ink-faint mb-3" />
            <div className="text-[15px] text-ink mb-1">No workflows yet</div>
            <p className="text-[13px] text-ink-faint">
              Approve one of Alex's proposals on the dashboard to schedule a workflow.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {workflows.map((wf) => (
            <li key={wf.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{wf.title}</CardTitle>
                  <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {wf.enabled ? "Active" : "Paused"} ·{" "}
                    {wf.last_run_at
                      ? `last run ${new Date(wf.last_run_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`
                      : "never run"}
                  </span>
                </CardHeader>
                <CardContent compact className="px-5 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-ink-muted">{formatTrigger(wf)}</div>
                    {wf.recipient && (
                      <div className="text-[12px] text-ink-faint mt-0.5">→ {wf.recipient}</div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunNow(wf.id)}
                    disabled={busyId !== null}
                  >
                    <Play size={12} strokeWidth={2} className="mr-1" />
                    Run now
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
