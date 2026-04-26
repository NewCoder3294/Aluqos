import { fetchWorkspaceState } from "@/src/server/run-prd";
import { WorkspaceClient } from "./workspace-client";
import { notFound } from "next/navigation";

export default async function WorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<{ bootstrap?: string }>;
}) {
  const { employeeId } = await params;
  const sp = await searchParams;
  const state = await fetchWorkspaceState(employeeId);
  if (!state.emp) notFound();
  return (
    <WorkspaceClient
      employee={state.emp}
      uploads={state.uploads}
      prds={state.prds}
      actionPlan={state.session?.action_plan ?? null}
      bootstrap={sp.bootstrap === "1"}
    />
  );
}
