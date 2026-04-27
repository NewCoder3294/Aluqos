import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { ComingSoonWall } from "../../_dashboard/coming-soon-wall";
import { AGENTS } from "../../_dashboard/data/overview";

export default async function JordanRisksPage({
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
    <ComingSoonWall
      employeeId={emp.id}
      employeeName={emp.name}
      activeNav="jordan-risks"
      name="Jordan"
      role="Program Manager"
      avatarGradient={AGENTS.jordan.avatarGradient}
      pitch="Jordan keeps a live risk register — owners, ETAs, and mitigation status — so nothing slips quietly."
    />
  );
}
