import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { PrdDetailClient } from "./prd-detail-client";

function formatToday(): string {
  const d = new Date();
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default async function PrdDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ employeeId: string; prdId: string }>;
  searchParams: Promise<{ bootstrap?: string }>;
}) {
  const { employeeId, prdId } = await params;
  const sp = await searchParams;

  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads: [], prds: [] };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  // Filter PRDs to the one we're viewing, or pass all if bootstrap-streaming.
  const prds = state.prds;
  const target = prds.find((p) => p.id === prdId);
  const initialPrds = target ? [target] : prds;

  return (
    <PrdDetailClient
      employeeId={emp.id}
      prdId={prdId}
      prdTitle={target?.title ?? ""}
      prds={initialPrds}
      bootstrap={sp.bootstrap === "1"}
      uploads={state.uploads}
      dateLabel={formatToday()}
    />
  );
}
