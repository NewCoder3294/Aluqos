import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import Link from "next/link";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { Greeting } from "../_dashboard/greeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { TeamToday } from "../_dashboard/team-today";
import { cn } from "@/src/lib/cn";
import {
  AGENTS,
  OVERVIEW_KPIS,
  OVERVIEW_ATTENTION,
  TEAM_TODAY,
  WORK_IN_FLIGHT,
  RECENT_ACTIVITY,
} from "../_dashboard/data/overview";

export default async function GlobalOverviewPage({
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
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="all-dashboard">
      <div className="space-y-8">
        <Greeting name="Nick" subline="Your team is on it." />

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-5">
          {OVERVIEW_KPIS.map((k) => (
            <div
              key={k.label}
              className={cn(
                "bg-white border border-paper-edge rounded-md p-5 transition-colors",
                "hover:border-coral/30",
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    k.tone === "warning" ? "bg-coral" : "bg-paper-edge",
                  )}
                />
                <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint font-medium">
                  {k.label}
                </span>
              </div>
              <div className="serif text-[36px] leading-none text-ink mt-3 tabular-nums tracking-[-0.02em]">
                {k.value}
              </div>
              <div className="text-[11.5px] text-ink-faint mt-2.5">{k.caption}</div>
            </div>
          ))}
        </div>

        {/* Two-column row */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-5">
          {/* Needs Attention - aggregated */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Needs Attention</CardTitle>
              <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-coral/15 text-coral-deep text-[11px] font-medium tabular-nums">
                {OVERVIEW_ATTENTION.filter((i) => i.blocker).length}
              </span>
            </CardHeader>
            <CardContent compact className="p-0">
              <ul>
                {OVERVIEW_ATTENTION.map((item, idx) => {
                  const meta = AGENTS[item.agent];
                  const rowInner = (
                    <>
                      <span
                        className={cn(
                          "size-7 rounded-full shrink-0 flex items-center justify-center",
                          meta.avatarGradient,
                        )}
                        aria-hidden
                      >
                        <span className="size-2.5 rounded-full bg-white/45" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint shrink-0">
                            {item.type}
                          </span>
                          <span className="text-[15px] text-ink truncate">{item.title}</span>
                        </div>
                        <div className="text-[12px] text-ink-faint mt-0.5">
                          {meta.name} · {item.context}
                        </div>
                      </div>
                      {item.blocker && (
                        <span
                          className="size-2 rounded-full bg-coral shrink-0"
                          aria-label="blocker"
                        />
                      )}
                      <Button variant="outline" size="sm" className="shrink-0" asChild>
                        <span>{item.cta}</span>
                      </Button>
                    </>
                  );
                  const rowClass = cn(
                    "flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-paper-hi/40 w-full text-left",
                    idx !== OVERVIEW_ATTENTION.length - 1 && "border-b border-paper-edge",
                  );
                  return (
                    <li key={item.id}>
                      {item.href ? (
                        <Link
                          href={`/work/${employeeId}/${item.href}`}
                          className={cn(rowClass, "block")}
                        >
                          <span className="flex items-center gap-3 w-full">{rowInner}</span>
                        </Link>
                      ) : (
                        <div className={rowClass}>{rowInner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>

          {/* Your team today */}
          <TeamToday employeeId={employeeId} team={TEAM_TODAY} />
        </div>

        {/* All work in flight */}
        <Card>
          <CardHeader>
            <CardTitle>All work in flight</CardTitle>
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              {WORK_IN_FLIGHT.length} active
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {WORK_IN_FLIGHT.map((w) => {
                const meta = AGENTS[w.agent];
                const inner = (
                  <div className="bg-white border border-paper-edge rounded-md p-3.5 space-y-2 transition-colors hover:bg-paper-hi/40 hover:border-coral/30 cursor-pointer h-full">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-4 rounded-full flex items-center justify-center shrink-0",
                          meta.avatarGradient,
                        )}
                        aria-hidden
                      >
                        <span className="size-1.5 rounded-full bg-white/55" />
                      </span>
                      <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
                        {meta.name}
                      </span>
                      <span className="ml-auto text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                        {w.stage}
                      </span>
                    </div>
                    <div className="text-[13.5px] text-ink font-medium leading-snug">
                      {w.title}
                    </div>
                    <div className="h-1 w-full bg-paper-edge/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-coral"
                        style={{ width: `${w.progress}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-ink-faint tabular-nums">
                      {w.progress}%
                    </div>
                  </div>
                );
                return w.href ? (
                  <Link
                    key={w.id}
                    href={`/work/${employeeId}/${w.href}`}
                    className="block"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div key={w.id}>{inner}</div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/work/${employeeId}/activity`}>View all →</Link>
            </Button>
          </CardHeader>
          <CardContent compact className="p-0">
            <ul>
              {RECENT_ACTIVITY.map((event, idx) => {
                const meta = AGENTS[event.agent];
                const inner = (
                  <div className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-paper-hi/40">
                    <span
                      className={cn(
                        "size-7 rounded-full shrink-0 flex items-center justify-center mt-0.5",
                        meta.avatarGradient,
                      )}
                      aria-hidden
                    >
                      <span className="size-2.5 rounded-full bg-white/45" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] text-ink leading-snug">
                        <span className="font-medium">{meta.name}</span>{" "}
                        <span className="text-ink-muted">{event.verb}</span>{" "}
                        <span
                          className={cn(
                            event.href ? "text-coral-deep" : "text-ink",
                          )}
                        >
                          {event.subject}
                        </span>
                      </div>
                    </div>
                    <span className="text-[12px] text-ink-faint shrink-0 mt-0.5">
                      {event.timestamp}
                    </span>
                  </div>
                );
                const showBorder = idx !== RECENT_ACTIVITY.length - 1;
                return (
                  <li
                    key={event.id}
                    className={cn(showBorder && "border-b border-paper-edge")}
                  >
                    {event.href ? (
                      <Link
                        href={`/work/${employeeId}/${event.href}`}
                        className="block"
                      >
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
