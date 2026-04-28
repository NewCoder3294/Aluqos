import { AppShell } from "@/app/_chrome/app-shell";
import { DEMO_EMPLOYEE_ID } from "@/src/db/client";

export const dynamic = "force-dynamic";

export default function WorkflowsPage() {
  return (
    <AppShell employeeId={DEMO_EMPLOYEE_ID} activeNav="alex-workflows">
      <div className="text-ink-faint text-sm">
        Workflows composition lands in Phase E.
      </div>
    </AppShell>
  );
}
