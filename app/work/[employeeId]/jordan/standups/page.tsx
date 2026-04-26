import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../../_dashboard/dashboard-shell";
import { ComingSoon } from "../../_dashboard/coming-soon";

export default async function JordanStandupsPage({
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
      employeeName={emp.name}
      activeNav="jordan-standups"
    >
      <ComingSoon title="Standups" />
    </DashboardShell>
  );
}
