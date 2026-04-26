import { TreeNav, type ActiveNavKey } from "./tree-nav";
import { Greeting } from "./greeting";
import { KpiRow } from "./kpi-row";
import { NeedsAttention } from "./needs-attention";
import { Today } from "./today";
import { Pipeline } from "./pipeline";
import type { DashboardData } from "./data/types";

function formatToday(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const HEADER_TITLE: Record<ActiveNavKey, string> = {
  "all-dashboard": "Dashboard",
  "all-files": "Files",
  "all-activity": "Activity",
  "alex-dashboard": "Dashboard",
  "alex-prds": "PRDs",
  "alex-backlog": "Backlog",
  "alex-calendar": "Calendar",
  "alex-goals": "Goals",
  "jordan-dashboard": "Dashboard",
  "jordan-standups": "Standups",
  "jordan-status": "Status updates",
  "jordan-risks": "Risks",
  "sam-dashboard": "Dashboard",
  "sam-campaigns": "Campaigns",
  "sam-brand-voice": "Brand voice",
  "sam-performance": "Performance",
};

export function DashboardShell({
  employeeId,
  employeeName,
  activeNav = "alex-dashboard",
  data,
  children,
}: {
  employeeId: string;
  employeeName: string;
  activeNav?: ActiveNavKey;
  /** Role data for the dashboard composition. Required when no `children`. */
  data?: DashboardData;
  /** Pass custom content (e.g. <ComingSoon />) to override the dashboard composition. */
  children?: React.ReactNode;
}) {
  const dateLabel = formatToday();
  const headerTitle = HEADER_TITLE[activeNav];

  return (
    <div className="min-h-screen flex bg-paper items-stretch">
      <TreeNav employeeId={employeeId} activeNav={activeNav} />

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="h-[56px] shrink-0 border-b border-paper-edge bg-paper px-8 flex items-center justify-between">
          <div className="serif text-[16px] tracking-[-0.01em] text-ink">{headerTitle}</div>
          <div className="text-[12px] text-ink-faint">{dateLabel}</div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children ? (
            <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
          ) : data ? (
            <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
              <Greeting name={data.greetingName} subline={data.greetingSubline} />

              <KpiRow kpis={data.kpis} />

              <div className="grid grid-cols-[1.5fr_1fr] gap-5">
                <NeedsAttention employeeId={employeeId} items={data.attention} />
                <Today events={data.events} />
              </div>

              <Pipeline
                employeeId={employeeId}
                title={data.pipelineTitle}
                columns={data.pipelineColumns}
              />
            </div>
          ) : (
            // Defensive: should not happen — caller must pass data or children.
            <div className="max-w-7xl mx-auto px-8 py-8 text-ink-faint">
              No content for {employeeName}.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
