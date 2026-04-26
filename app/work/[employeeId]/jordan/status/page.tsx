import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/cn";

type Status = "Draft" | "Sent" | "Scheduled";

type Update = {
  id: string;
  status: Status;
  audience: string;
  title: string;
  preview: string;
  timestamp: string;
};

const UPDATES: Update[] = [
  {
    id: "u1",
    status: "Draft",
    audience: "#leadership",
    title: "Weekly status — Apr 22",
    preview: "Saved views shipped to 60% of design partners. Bulk export PRD ready for review. One slip on roles v2 pushed to next sprint.",
    timestamp: "drafted 8m ago",
  },
  {
    id: "u2",
    status: "Draft",
    audience: "#engineering",
    title: "Sprint 14 wrap — engineering notes",
    preview: "Velocity stable at 38 pts. Two carry-overs (#43 roles, #41 rename flow). One incident: webhook retries spiking on Tuesday.",
    timestamp: "drafted 1h ago",
  },
  {
    id: "u3",
    status: "Scheduled",
    audience: "#product-feedback",
    title: "Customer-facing changelog — week of Apr 22",
    preview: "What shipped, what's coming, and a callout on the new daily digest preferences. Includes a one-line note on Notion export.",
    timestamp: "sends Friday 4:00 PM",
  },
  {
    id: "u4",
    status: "Sent",
    audience: "#leadership",
    title: "Weekly status — Apr 15",
    preview: "Demo prep on track. Two design partners moved to paid. Onboarding gating shipped without rollback.",
    timestamp: "sent 7d ago",
  },
  {
    id: "u5",
    status: "Sent",
    audience: "#engineering",
    title: "Sprint 13 wrap",
    preview: "Closed 12 tickets, 1 carry-over. Health is green. Next sprint focuses on roles v2 and the export pipeline.",
    timestamp: "sent 14d ago",
  },
];

const VARIANT: Record<Status, "coral" | "default" | "green"> = {
  Draft: "coral",
  Sent: "default",
  Scheduled: "green",
};

export default async function JordanStatusPage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;
  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads: [], prds: [] };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  const drafts = UPDATES.filter((u) => u.status === "Draft").length;
  const scheduled = UPDATES.filter((u) => u.status === "Scheduled").length;
  const sent = UPDATES.filter((u) => u.status === "Sent").length;

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="jordan-status">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Status updates</h1>
          <p className="mt-1 text-[13px] text-ink-faint">
            {drafts} {drafts === 1 ? "draft" : "drafts"} waiting for your review · {scheduled} scheduled · {sent} sent
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <Button variant="outline" size="sm">New update</Button>
          </CardHeader>
          <CardContent compact className="p-0">
            <ul>
              {UPDATES.map((u, idx) => (
                <li
                  key={u.id}
                  className={cn(
                    "px-5 py-4 transition-colors hover:bg-paper-hi/40 cursor-pointer",
                    idx !== UPDATES.length - 1 && "border-b border-paper-edge",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1.5 w-[120px] shrink-0">
                      <Badge variant={VARIANT[u.status]} className="self-start">{u.status}</Badge>
                      <span className="text-[11px] text-ink-faint">{u.audience}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] text-ink font-medium">{u.title}</div>
                      <p className="text-[13px] text-ink-muted mt-1 leading-relaxed line-clamp-2">{u.preview}</p>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mt-2">{u.timestamp}</div>
                    </div>
                    <div className="shrink-0 self-center">
                      {u.status === "Sent" ? (
                        <span className="text-[12px] text-ink-faint italic">Sent</span>
                      ) : (
                        <Button variant="outline" size="sm">Review →</Button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
