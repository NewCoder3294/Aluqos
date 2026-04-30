import { TreeNav, type ActiveNavKey } from "./tree-nav";
import { HeaderAuthControl } from "./header-auth-control";

export type { ActiveNavKey };

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
  "alex-workflows": "Workflows",
  "alex-inbox": "Inbox",
  "alex-settings": "Settings",
  "jordan-dashboard": "Jordan",
  "jordan-standups": "Jordan · Standups",
  "jordan-status": "Jordan · Status updates",
  "jordan-risks": "Jordan · Risks",
  "sam-dashboard": "Sam",
  "sam-campaigns": "Sam · Campaigns",
  "sam-brand-voice": "Sam · Brand voice",
  "sam-performance": "Sam · Performance",
};

// AppShell is the canonical chrome for both top-level routes
// (/dashboard, /workflows, /inbox) and per-employee routes
// (/work/<id>/*). Top-level pages pass DEMO_EMPLOYEE_ID so the
// TreeNav's per-employee section still links correctly.
export function AppShell({
  employeeId,
  activeNav,
  children,
  showDemoBadge = true,
}: {
  employeeId: string;
  activeNav: ActiveNavKey;
  children: React.ReactNode;
  showDemoBadge?: boolean;
}) {
  const dateLabel = formatToday();
  const headerTitle = HEADER_TITLE[activeNav];

  return (
    <div className="min-h-screen flex bg-paper items-stretch">
      <TreeNav employeeId={employeeId} activeNav={activeNav} />

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header className="h-[56px] shrink-0 border-b border-paper-edge bg-paper px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="serif text-[16px] tracking-[-0.01em] text-ink">{headerTitle}</div>
            {showDemoBadge && (
              <span
                title="Demo mode — running on seeded sample activity. Production wires the same UI to your actual sources."
                className="inline-flex items-center gap-1.5 rounded-full bg-coral/10 border border-coral/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-coral-deep"
              >
                <span className="size-1.5 rounded-full bg-coral" />
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <HeaderAuthControl />
            <div className="text-[12px] text-ink-faint">{dateLabel}</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
