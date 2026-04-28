import { AppShell } from "@/app/_chrome/app-shell";
import { DEMO_EMPLOYEE_ID } from "@/src/db/client";

export const dynamic = "force-dynamic";

export default function InboxPage() {
  return (
    <AppShell employeeId={DEMO_EMPLOYEE_ID} activeNav="alex-inbox">
      <div className="text-ink-faint text-sm">
        Inbox composition lands in Phase F.
      </div>
    </AppShell>
  );
}
