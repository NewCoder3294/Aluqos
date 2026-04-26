import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { JORDAN_DATA } from "../_dashboard/data/jordan";

export default async function JordanDashboardPage({
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
    <DashboardShell
      employeeId={emp.id}
      employeeName="Jordan"
      activeNav="jordan-dashboard"
      data={JORDAN_DATA}
    />
  );
}
