import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { WorkspaceClient } from "./workspace-client";

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<{ bootstrap?: string }>;
}) {
  const { employeeId } = await params;
  const sp = await searchParams;

  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads: [], prds: [] };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  return (
    <WorkspaceClient
      employee={emp}
      uploads={state.uploads}
      prds={state.prds}
      actionPlan={state.session?.action_plan ?? null}
      bootstrap={sp.bootstrap === "1"}
    />
  );
}
