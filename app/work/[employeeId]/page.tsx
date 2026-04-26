import { redirect } from "next/navigation";
import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "./_dashboard/dashboard-shell";

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<{ bootstrap?: string }>;
}) {
  const { employeeId } = await params;
  const sp = await searchParams;

  // Bootstrap from onboarding lands directly into the streaming PRD detail.
  if (sp.bootstrap === "1") {
    redirect(`/work/${employeeId}/prd/new-bootstrap?bootstrap=1`);
  }

  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads: [], prds: [] };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  return <DashboardShell employeeId={emp.id} employeeName={emp.name} />;
}
