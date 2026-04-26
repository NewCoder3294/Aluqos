import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { ActivityFeed } from "../_dashboard/activity-feed";
import { ACTIVITY_FEED } from "../_dashboard/data/activity";

export default async function GlobalActivityPage({
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
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="all-activity">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">
            Activity
          </h1>
          <p className="mt-1 text-[13px] text-ink-faint">
            Every move your team has made — chronological, filterable, and searchable.
          </p>
        </div>

        <ActivityFeed employeeId={emp.id} events={ACTIVITY_FEED} />
      </div>
    </DashboardShell>
  );
}
