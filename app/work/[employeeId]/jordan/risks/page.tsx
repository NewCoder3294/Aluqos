import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/cn";

type Severity = "high" | "medium" | "low";
type MitigationStatus = "Mitigating" | "Watching" | "Resolved";

type Risk = {
  id: string;
  severity: Severity;
  title: string;
  ownerInitials: string;
  ownerName: string;
  ownerTone: "coral" | "ink" | "olive";
  status: MitigationStatus;
  eta: string;
};

const RISKS: Risk[] = [
  {
    id: "rk1",
    severity: "high",
    title: "Q2 'Bulk export' milestone slipping by 1 sprint",
    ownerInitials: "OL",
    ownerName: "Olivia",
    ownerTone: "coral",
    status: "Mitigating",
    eta: "May 9",
  },
  {
    id: "rk2",
    severity: "high",
    title: "Webhook retry storm during peak hours",
    ownerInitials: "DK",
    ownerName: "Devon",
    ownerTone: "ink",
    status: "Mitigating",
    eta: "May 2",
  },
  {
    id: "rk3",
    severity: "medium",
    title: "Onboarding completion dropping for self-serve users",
    ownerInitials: "AM",
    ownerName: "Amal",
    ownerTone: "olive",
    status: "Watching",
    eta: "May 16",
  },
  {
    id: "rk4",
    severity: "medium",
    title: "Roles v2 schema migration risks read-after-write delays",
    ownerInitials: "DK",
    ownerName: "Devon",
    ownerTone: "ink",
    status: "Mitigating",
    eta: "May 12",
  },
  {
    id: "rk5",
    severity: "medium",
    title: "Design partner Acme Health considering pause",
    ownerInitials: "PR",
    ownerName: "Priya",
    ownerTone: "coral",
    status: "Watching",
    eta: "May 5",
  },
  {
    id: "rk6",
    severity: "low",
    title: "PDF export quality regressions on Windows clients",
    ownerInitials: "SK",
    ownerName: "Sara",
    ownerTone: "ink",
    status: "Watching",
    eta: "Jun 1",
  },
  {
    id: "rk7",
    severity: "low",
    title: "Demo screencast assets need refresh before Day-Day",
    ownerInitials: "AM",
    ownerName: "Amal",
    ownerTone: "olive",
    status: "Mitigating",
    eta: "Apr 27",
  },
  {
    id: "rk8",
    severity: "low",
    title: "Notion export rate-limit edge case",
    ownerInitials: "DK",
    ownerName: "Devon",
    ownerTone: "ink",
    status: "Watching",
    eta: "Jun 15",
  },
];

const SEV_DOT: Record<Severity, string> = {
  high: "bg-coral",
  medium: "bg-coral-light",
  low: "bg-ink-muted",
};

const SEV_LABEL: Record<Severity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const STATUS_VARIANT: Record<MitigationStatus, "coral" | "default" | "green"> = {
  Mitigating: "coral",
  Watching: "default",
  Resolved: "green",
};

const TONE: Record<"coral" | "ink" | "olive", string> = {
  coral: "bg-gradient-to-br from-coral to-coral-deep text-white",
  ink: "bg-gradient-to-br from-[#3a3530] to-[#1f1d1a] text-paper",
  olive: "bg-gradient-to-br from-[#9da77f] to-[#5d6948] text-white",
};

export default async function JordanRisksPage({
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

  const high = RISKS.filter((r) => r.severity === "high").length;
  const med = RISKS.filter((r) => r.severity === "medium").length;
  const low = RISKS.filter((r) => r.severity === "low").length;

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="jordan-risks">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Risk register</h1>
          <p className="mt-1 text-[13px] text-ink-faint">
            {high} high · {med} medium · {low} low — Jordan keeps owners and ETAs honest.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All risks · {RISKS.length}</CardTitle>
            <Button variant="outline" size="sm">Filter</Button>
          </CardHeader>
          <CardContent compact className="p-0">
            <ul>
              {RISKS.map((risk, idx) => (
                <li
                  key={risk.id}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-hi/40 cursor-pointer",
                    idx !== RISKS.length - 1 && "border-b border-paper-edge",
                  )}
                >
                  <span className={cn("size-2 rounded-full shrink-0", SEV_DOT[risk.severity])} title={SEV_LABEL[risk.severity]} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] text-ink truncate">{risk.title}</div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mt-1">
                      Severity · {SEV_LABEL[risk.severity]}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-[160px]">
                    <span className={cn("size-6 rounded-full text-[10px] font-medium flex items-center justify-center", TONE[risk.ownerTone])}>
                      {risk.ownerInitials}
                    </span>
                    <span className="text-[13px] text-ink-muted truncate">{risk.ownerName}</span>
                  </div>
                  <Badge variant={STATUS_VARIANT[risk.status]} className="shrink-0">{risk.status}</Badge>
                  <span className="shrink-0 text-[11px] uppercase tracking-[0.1em] text-ink-faint border border-paper-edge rounded-full px-2 py-0.5">
                    ETA · {risk.eta}
                  </span>
                  <Button variant="outline" size="sm" className="shrink-0">Open thread →</Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
