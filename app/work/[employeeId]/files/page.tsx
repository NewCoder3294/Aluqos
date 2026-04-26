import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { FileGrid } from "../_dashboard/file-grid";

export default async function GlobalFilesPage({
  params,
  searchParams,
}: {
  params: Promise<{ employeeId: string }>;
  searchParams: Promise<{ path?: string }>;
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
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="all-files">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">
            Files
          </h1>
          <p className="mt-1 text-[13px] text-ink-faint">
            Everything your team has produced — drafts, decks, source materials, and shared docs.
          </p>
        </div>

        <FileGrid initialPath={sp.path} />
      </div>
    </DashboardShell>
  );
}
