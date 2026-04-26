import { TreeNav, type ActiveNavKey } from "./tree-nav";
import { Greeting } from "./greeting";
import { KpiRow } from "./kpi-row";
import { NeedsAttention } from "./needs-attention";
import { Today } from "./today";
import { Pipeline } from "./pipeline";

function formatToday(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const HEADER_TITLE: Record<ActiveNavKey, string> = {
  dashboard: "Dashboard",
  prds: "PRDs",
  backlog: "Backlog",
  calendar: "Calendar",
  goals: "Goals",
};

export function DashboardShell({
  employeeId,
  employeeName,
  activeNav = "dashboard",
  children,
}: {
  employeeId: string;
  employeeName: string;
  activeNav?: ActiveNavKey;
  children?: React.ReactNode;
}) {
  // Use a stable label (avoid hydration mismatch by using server-rendered value).
  const dateLabel = formatToday();
  const firstName = employeeName.split(" ")[0] || "Nick";
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
          ) : (
            <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
              <Greeting name={firstName} />

              <KpiRow />

              <div className="grid grid-cols-[1.5fr_1fr] gap-5">
                <NeedsAttention employeeId={employeeId} />
                <Today />
              </div>

              <Pipeline employeeId={employeeId} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
