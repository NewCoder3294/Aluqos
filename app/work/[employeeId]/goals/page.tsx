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
  display: string;
};

type Goal = {
  id: string;
  title: string;
  timeframe: string;
  status: GoalStatus;
  setBy: string;
  lastReview: string;
  alexNote: string;
  keyResults: KeyResult[];
};

const GOALS: Goal[] = [
  {
    id: "g1",
    title: "Ship analytics bulk export",
    timeframe: "Q2 2026 · due May 16",
    status: "on-track",
    setBy: "Set with Nicolas · Apr 14",
    lastReview: "Reviewed 3 days ago",
    alexNote:
      "PRD #47 finished drafting this morning. Engineering picked up the spec — first slice lands Friday.",
    keyResults: [
      { title: "PRD drafted, refined, and approved", current: 6, target: 6, display: "6 / 6 sections" },
      { title: "Engineering effort scoped", current: 100, target: 100, display: "Scoped · 9 pts" },
      { title: "First user-visible slice in staging", current: 60, target: 100, display: "60% built" },
      { title: "Top-10 accounts notified before GA", current: 4, target: 10, display: "4 / 10 accounts" },
    ],
  },
  {
    id: "g2",
    title: "Tighten PRD cycle time",
    timeframe: "Q2 2026 · rolling target",
    status: "ahead",
    setBy: "Self-set · Apr 1",
    lastReview: "Reviewed yesterday",
    alexNote:
      "Three drafts shipped this week from issue → reviewable in under a day. Holding pace through demo prep.",
    keyResults: [
      { title: "Median issue → reviewable PRD", current: 75, target: 100, display: "0.6d (target ≤ 1d)" },
      { title: "PRDs shipped this quarter", current: 11, target: 15, display: "11 / 15" },
      { title: "PRDs reviewed by ≥ 1 partner before merge", current: 9, target: 11, display: "9 / 11" },
      { title: "Refinement rounds per PRD (lower better)", current: 50, target: 100, display: "1.4 avg (cap 2.0)" },
    ],
  },
  {
    id: "g3",
    title: "Convert design-partner feedback into roadmap",
    timeframe: "Q2 2026 · monthly check-in",
    status: "at-risk",
    setBy: "Set with Marie · Mar 22",
    lastReview: "Reviewed 5 days ago",
    alexNote:
      "Acme Health and Beacon Labs both raised filter parity on this week's calls. Pulling forward to next sprint — flagging to Nicolas.",
    keyResults: [
      { title: "Partner-flagged requests triaged within 48h", current: 18, target: 22, display: "18 / 22" },
      { title: "Partner asks promoted to PRDs", current: 5, target: 8, display: "5 / 8" },
      { title: "Net Promoter Score from partners", current: 53, target: 60, display: "53 / 60" },
      { title: "Discovery calls attended this quarter", current: 19, target: 24, display: "19 / 24" },
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
          <p className="mt-1 text-[13px] text-ink-faint">
            What Alex is driving as Product. Reviewed weekly with Nicolas.
          </p>
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
                    <div className="hidden md:block text-[12px] text-ink-faint">
                      <div>{goal.setBy}</div>
                      <div>{goal.lastReview}</div>
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
                              {kr.display}
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

                  <div className="border-t border-paper-edge pt-4 flex items-start gap-3">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-coral-deep font-medium shrink-0 mt-0.5">
                      Note from Alex
                    </span>
                    <p className="text-[13px] text-ink-muted leading-relaxed flex-1">
                      {goal.alexNote}
                    </p>
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
