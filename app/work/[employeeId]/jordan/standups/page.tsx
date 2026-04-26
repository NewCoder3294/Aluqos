import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type Standup = {
  id: string;
  weekLabel: string;
  date: string;
  title: string;
  duration: string;
  attendees: { initials: string; tone: "coral" | "ink" | "olive" }[];
  actionItems: number;
  blockers: number;
  risks: number;
};

const STANDUPS: Standup[] = [
  {
    id: "su-1",
    weekLabel: "This week",
    date: "Today · 9:30 AM",
    title: "Engineering standup",
    duration: "12 min",
    attendees: [
      { initials: "OL", tone: "coral" },
      { initials: "DK", tone: "ink" },
      { initials: "AM", tone: "olive" },
      { initials: "PR", tone: "coral" },
      { initials: "SK", tone: "ink" },
    ],
    actionItems: 5,
    blockers: 1,
    risks: 0,
  },
  {
    id: "su-2",
    weekLabel: "This week",
    date: "Yesterday · 9:32 AM",
    title: "Engineering standup",
    duration: "9 min",
    attendees: [
      { initials: "OL", tone: "coral" },
      { initials: "DK", tone: "ink" },
      { initials: "AM", tone: "olive" },
      { initials: "PR", tone: "coral" },
    ],
    actionItems: 3,
    blockers: 0,
    risks: 1,
  },
  {
    id: "su-3",
    weekLabel: "This week",
    date: "2 days ago · 9:31 AM",
    title: "Engineering standup",
    duration: "14 min",
    attendees: [
      { initials: "OL", tone: "coral" },
      { initials: "DK", tone: "ink" },
      { initials: "AM", tone: "olive" },
      { initials: "PR", tone: "coral" },
      { initials: "SK", tone: "ink" },
    ],
    actionItems: 7,
    blockers: 2,
    risks: 1,
  },
  {
    id: "su-4",
    weekLabel: "Last week",
    date: "Apr 18 · 9:34 AM",
    title: "Engineering standup",
    duration: "11 min",
    attendees: [
      { initials: "OL", tone: "coral" },
      { initials: "DK", tone: "ink" },
      { initials: "PR", tone: "coral" },
    ],
    actionItems: 4,
    blockers: 0,
    risks: 0,
  },
  {
    id: "su-5",
    weekLabel: "Last week",
    date: "Apr 17 · 9:30 AM",
    title: "Engineering standup",
    duration: "13 min",
    attendees: [
      { initials: "OL", tone: "coral" },
      { initials: "DK", tone: "ink" },
      { initials: "AM", tone: "olive" },
      { initials: "PR", tone: "coral" },
    ],
    actionItems: 6,
    blockers: 1,
    risks: 0,
  },
  {
    id: "su-6",
    weekLabel: "Last week",
    date: "Apr 16 · 9:30 AM",
    title: "Engineering standup",
    duration: "10 min",
    attendees: [
      { initials: "OL", tone: "coral" },
      { initials: "DK", tone: "ink" },
      { initials: "AM", tone: "olive" },
      { initials: "PR", tone: "coral" },
      { initials: "SK", tone: "ink" },
    ],
    actionItems: 4,
    blockers: 0,
    risks: 1,
  },
];

const TONE: Record<"coral" | "ink" | "olive", string> = {
  coral: "bg-gradient-to-br from-coral to-coral-deep text-white",
  ink: "bg-gradient-to-br from-[#3a3530] to-[#1f1d1a] text-paper",
  olive: "bg-gradient-to-br from-[#9da77f] to-[#5d6948] text-white",
};

function groupByWeek(items: Standup[]) {
  const map = new Map<string, Standup[]>();
  for (const s of items) {
    const arr = map.get(s.weekLabel) ?? [];
    arr.push(s);
    map.set(s.weekLabel, arr);
  }
  return [...map.entries()];
}

export default async function JordanStandupsPage({
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
  const groups = groupByWeek(STANDUPS);

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="jordan-standups">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Standups</h1>
          <p className="mt-1 text-[13px] text-ink-faint">Jordan listens, summarizes, and surfaces blockers from every standup.</p>
        </div>

        <div className="space-y-6">
          {groups.map(([week, items]) => (
            <div key={week} className="space-y-2">
              <div className="flex items-center gap-3 px-1">
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">{week}</span>
                <span className="flex-1 h-px bg-paper-edge" />
                <span className="text-[11px] text-ink-faint tabular-nums">{items.length}</span>
              </div>

              <Card>
                <CardContent compact className="p-0">
                  <ul>
                    {items.map((s, idx) => (
                      <li
                        key={s.id}
                        className={cn(
                          "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-hi/40 cursor-pointer",
                          idx !== items.length - 1 && "border-b border-paper-edge",
                        )}
                      >
                        <div className="w-[160px] shrink-0">
                          <div className="serif italic text-[13px] text-ink-faint">{s.date}</div>
                        </div>
                        <div className="flex -space-x-1.5 shrink-0">
                          {s.attendees.map((a, i) => (
                            <span
                              key={i}
                              className={cn(
                                "size-6 rounded-full ring-2 ring-white text-[10px] font-medium flex items-center justify-center",
                                TONE[a.tone],
                              )}
                            >
                              {a.initials}
                            </span>
                          ))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[15px] text-ink truncate">{s.title}</span>
                            <span className="text-[12px] text-ink-faint">· {s.duration}</span>
                          </div>
                          <div className="text-[12px] text-ink-faint mt-0.5">
                            {s.actionItems} action items · {s.blockers} {s.blockers === 1 ? "blocker" : "blockers"} · {s.risks} {s.risks === 1 ? "risk" : "risks"}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0">Open notes →</Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
