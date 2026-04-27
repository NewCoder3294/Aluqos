import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { ComingSoonWall } from "../../_dashboard/coming-soon-wall";
import { AGENTS } from "../../_dashboard/data/overview";

export default async function SamBrandVoicePage({
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
      activeNav="sam-brand-voice"
      name="Sam"
      role="Marketing"
      avatarGradient={AGENTS.sam.avatarGradient}
      pitch="Sam learns your brand voice from everything you've already published, then keeps it consistent across every channel."
    />
  );
}
