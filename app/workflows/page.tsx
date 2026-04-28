import Link from "next/link";
import { Workflow as WorkflowIcon } from "lucide-react";
import { AppShell } from "@/app/_chrome/app-shell";
import { WorkflowCard } from "@/app/_chrome/workflow-card";
import { Card, CardContent } from "@/src/components/ui/card";
import { DEMO_EMPLOYEE_ID, DEMO_USER_ID } from "@/src/db/client";
import { listAllDrafts, listWorkflows } from "@/src/workflows/queries";
import { queryActivityEvents } from "@/src/events/query";

export const dynamic = "force-dynamic";

// "Alex's responsibilities." Each workflow card is a job-duty view —
// recipient row with avatar, plain-English schedule, live signal showing
// what Alex is watching for this workflow, past-sends timeline, last-sent
// preview. Not a config page. The user is supposed to look at this and
// see *what Alex is hired to do*.
export default async function WorkflowsPage() {
  const tenantId = DEMO_USER_ID;

  const [workflows, drafts, events] = await Promise.all([
    listWorkflows(tenantId),
    listAllDrafts(tenantId),
    queryActivityEvents({
      tenant_id: tenantId,
      since: new Date(Date.now() - 7 * 86400000),
      limit: 100,
    }),
  ]);

  // Live-signal count per workflow: how many recent events match the
  // workflow's source filter. For V1 we use a coarse "events in the
  // window" count; the prod LLM call will refine "worth including".
  function liveSignalCountFor(workflowId: string): number {
    const wf = workflows.find((w) => w.id === workflowId);
    if (!wf) return 0;
    const sourceFilter = wf.source_filter as { sources?: string[]; state?: string };
    const sources = sourceFilter?.sources ?? [];
    return events.filter((e) => {
      if (sources.length > 0 && !sources.includes(e.source)) return false;
      if (sourceFilter?.state) {
        const evState = (e.context_json as { state?: string })?.state;
        if (evState !== sourceFilter.state) return false;
      }
      return true;
    }).length;
  }

  return (
    <AppShell employeeId={DEMO_EMPLOYEE_ID} activeNav="alex-workflows">
      <div className="space-y-6 pb-12">
        <div className="alex-fade-up">
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">
            Alex&apos;s responsibilities
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-muted leading-relaxed max-w-2xl">
            Recurring work Alex handles for you. You stay in the loop on every send —
            nothing leaves your account without your one-tap approval.
          </p>
        </div>

        {workflows.length === 0 ? (
          <Card className="alex-fade-up alex-stagger-1">
            <CardContent compact className="px-8 py-12 text-center">
              <WorkflowIcon size={28} strokeWidth={1.5} className="mx-auto text-ink-faint mb-3" />
              <div className="text-[15px] text-ink mb-1.5">No responsibilities yet</div>
              <p className="text-[13px] text-ink-muted max-w-md mx-auto">
                Approve one of my ideas on the{" "}
                <Link href="/dashboard" className="underline underline-offset-2 hover:text-coral-deep">
                  dashboard
                </Link>{" "}
                and I&apos;ll start running it on a schedule.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {workflows.map((wf, idx) => (
              <div key={wf.id} className={`alex-stagger-${Math.min(idx + 1, 6)}`}>
                <WorkflowCard
                  workflow={wf}
                  drafts={drafts}
                  liveSignalCount={liveSignalCountFor(wf.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
