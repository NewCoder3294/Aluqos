import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee, DEMO_EMPLOYEE_ID } from "@/src/db/client";
import { DashboardShell } from "@/app/work/[employeeId]/_dashboard/dashboard-shell";
import { CalendarView } from "./calendar-view";

export default async function CalendarPage() {
  const employeeId = DEMO_EMPLOYEE_ID;
  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads: [], prds: [] };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="alex-calendar">
      <CalendarView />
    </DashboardShell>
  );
}
