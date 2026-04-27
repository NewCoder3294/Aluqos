import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { ComingSoonWall } from "../../_dashboard/coming-soon-wall";
import { AGENTS } from "../../_dashboard/data/overview";

export default async function SamPerformancePage({
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
      activeNav="sam-performance"
      name="Sam"
      role="Marketing"
      avatarGradient={AGENTS.sam.avatarGradient}
      pitch="Sam reports back on what's landing — reach, engagement, conversions — so you know where to spend next."
    />
  );
}
