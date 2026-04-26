import { TreeNav } from "./tree-nav";
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

export function DashboardShell({
  employeeId,
  employeeName,
}: {
  employeeId: string;
  employeeName: string;
}) {
  // Use a stable label (avoid hydration mismatch by using server-rendered value).
  const dateLabel = formatToday();
  const firstName = employeeName.split(" ")[0] || "Nick";

  return (
    <div className="min-h-screen flex bg-paper">
      <TreeNav employeeId={employeeId} activeKey="Dashboard" activeSectionId="alex" />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top header */}
        <header className="h-[56px] shrink-0 border-b border-paper-edge bg-paper px-8 flex items-center justify-between">
          <div className="serif text-[16px] tracking-[-0.01em] text-ink">Dashboard</div>
          <div className="text-[12px] text-ink-faint">{dateLabel}</div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
            <Greeting name={firstName} />

            <KpiRow />

            <div className="grid grid-cols-[1.5fr_1fr] gap-5">
              <NeedsAttention employeeId={employeeId} />
              <Today />
            </div>

            <Pipeline employeeId={employeeId} />
          </div>
        </main>
      </div>
    </div>
  );
}
