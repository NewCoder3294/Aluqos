import { fetchWorkspaceState } from "@/src/server/run-prd";
import { DEMO_USER_ID, fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "./_dashboard/dashboard-shell";
import { ALEX_DATA } from "./_dashboard/data/alex";
import { listOpenProposals } from "@/src/workflows/queries";

export default async function WorkPage({
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

  // Surface Alex's autonomous ideas as the first thing the user sees on the
  // dashboard. Failures are non-fatal — degrade to no proposals card.
  let proposals: Awaited<ReturnType<typeof listOpenProposals>> = [];
  try {
    proposals = await listOpenProposals(DEMO_USER_ID);
  } catch (err) {
    console.error("listOpenProposals failed", err);
  }

  return (
    <DashboardShell
      employeeId={emp.id}
      employeeName={emp.name}
      activeNav="alex-dashboard"
      data={ALEX_DATA}
      proposals={proposals}
    />
  );
}
