import { fetchWorkspaceState } from "@/src/server/run-prd";
import { DEMO_USER_ID, fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { listPendingDrafts, settlePendingSends } from "@/src/workflows/queries";
import { InboxView } from "./inbox-view";

export const dynamic = "force-dynamic";

export default async function InboxPage({
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

  // Settle any approved-but-past-window drafts before rendering so the SSR
  // status matches what a fresh client poll would show.
  await settlePendingSends(DEMO_USER_ID);
  const drafts = await listPendingDrafts(DEMO_USER_ID);

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="alex-inbox">
      <InboxView initialDrafts={drafts} />
    </DashboardShell>
  );
}
