import { AppShell } from "@/app/_chrome/app-shell";
import { DEMO_EMPLOYEE_ID } from "@/src/db/client";

export const dynamic = "force-dynamic";

// Placeholder body — Phase D replaces this with the rich Alex composition
// (status card / attention pane / pipeline / people orbit / wins / proposals).
// Kept thin during Phase A so we can verify the route contract first.
export default function DashboardPage() {
  return (
    <AppShell employeeId={DEMO_EMPLOYEE_ID} activeNav="alex-dashboard">
      <div className="text-ink-faint text-sm">
        Dashboard composition lands in Phase D.
      </div>
    </AppShell>
  );
}
