import { fetchWorkspaceState } from "@/src/server/run-prd";
import { DEMO_USER_ID, fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { listWorkflows } from "@/src/workflows/queries";
import { WorkflowsView } from "./workflows-view";

export const dynamic = "force-dynamic";

export default async function WorkflowsPage({
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

  const workflows = await listWorkflows(DEMO_USER_ID);

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="alex-workflows">
      <WorkflowsView employeeId={emp.id} workflows={workflows} />
    </DashboardShell>
  );
}
