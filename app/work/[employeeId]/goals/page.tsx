import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/cn";

type GoalStatus = "on-track" | "at-risk" | "ahead";

type KeyResult = {
  title: string;
  current: number;
  target: number;
  unit?: string;
  display?: string;
};

type Goal = {
  id: string;
  title: string;
  timeframe: string;
  status: GoalStatus;
  keyResults: KeyResult[];
};

const GOALS: Goal[] = [
  {
    id: "g1",
    title: "Ship the YC demo",
    timeframe: "Q2 2026 · due Apr 28",
    status: "on-track",
    keyResults: [
      { title: "AI employees built and demo-ready", current: 3, target: 3, display: "3 / 3" },
      { title: "Demo rehearsals completed", current: 22, target: 30, display: "22 / 30" },
      { title: "Design partners on the demo invite", current: 12, target: 12, display: "12 / 12" },
      { title: "Day-Day pitch script locked", current: 90, target: 100, display: "90% locked", unit: "%" },
    ],
  },
  {
    id: "g2",
    title: "Close 10 design partners",
    timeframe: "Q2 2026 · due Jun 30",
    status: "at-risk",
    keyResults: [
      { title: "Design-partner logos signed", current: 6, target: 10, display: "6 / 10" },
      { title: "Contracts sent", current: 9, target: 12, display: "9 / 12" },
      { title: "Discovery calls completed", current: 31, target: 40, display: "31 / 40" },
      { title: "Median NPS across partners", current: 58, target: 60, display: "58 / 60" },
    ],
  },
  {
    id: "g3",
    title: "Hit $10K MRR by July",
    timeframe: "Q2 2026 · due Jul 31",
    status: "ahead",
    keyResults: [
      { title: "Current MRR", current: 6800, target: 10000, display: "$6.8K / $10K" },
      { title: "Paying customers", current: 14, target: 20, display: "14 / 20" },
      { title: "Logo churn (lower is better)", current: 100 - 2, target: 100 - 5, display: "2% churn (cap 5%)" },
    ],
  },
];

const STATUS_BADGE: Record<GoalStatus, { variant: "coral" | "default" | "green"; label: string }> = {
  "on-track": { variant: "default", label: "On track" },
  "at-risk": { variant: "coral", label: "At risk" },
  ahead: { variant: "green", label: "Ahead" },
};

function pct(current: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
}

export default async function GoalsPage({
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

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="alex-goals">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Q2 OKRs</h1>
          <p className="mt-1 text-[13px] text-ink-faint">Three objectives Alex is driving for the quarter.</p>
        </div>

        <div className="space-y-5">
          {GOALS.map((goal) => {
            const overall = Math.round(
              goal.keyResults.reduce((acc, kr) => acc + pct(kr.current, kr.target), 0) / goal.keyResults.length,
            );
            const statusInfo = STATUS_BADGE[goal.status];
            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-[18px]">{goal.title}</CardTitle>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">{goal.timeframe}</span>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                      <span className="size-7 rounded-full bg-gradient-to-br from-coral to-coral-deep text-white text-[11px] font-medium flex items-center justify-center">
                        A
                      </span>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">Owner</div>
                        <div className="text-[13px] text-ink">Alex · Product</div>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">Composite</div>
                      <div className="serif text-[20px] tabular-nums text-ink">{overall}%</div>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-1">
                    {goal.keyResults.map((kr, idx) => {
                      const p = pct(kr.current, kr.target);
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="text-[13px] text-ink">{kr.title}</span>
                            <span className="text-[12px] tabular-nums text-ink-faint shrink-0">
                              {kr.display ?? `${kr.current} / ${kr.target}${kr.unit ?? ""}`}
                            </span>
                          </div>
                          <div className="h-1.5 bg-paper-hi rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full",
                                p >= 100 ? "bg-[#7a8b5c]" : p >= 70 ? "bg-coral" : "bg-coral-light",
                              )}
                              style={{ width: `${p}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardShell>
  );
}
