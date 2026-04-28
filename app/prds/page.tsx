import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee, DEMO_EMPLOYEE_ID } from "@/src/db/client";
import { DashboardShell } from "@/app/work/[employeeId]/_dashboard/dashboard-shell";
import { PrdsList, type PrdRow } from "./prds-list";

const PRDS: PrdRow[] = [
  { id: "issue-47", title: "Bulk export for analytics", issue: "Issue #47", words: 1420, sectionsDone: 6, sectionsTotal: 6, status: "review", lastEdited: "3m ago" },
  { id: "issue-46", title: "Saved views & filter presets", issue: "Issue #46", words: 1180, sectionsDone: 5, sectionsTotal: 6, status: "draft", lastEdited: "22m ago" },
  { id: "issue-44", title: "Quick filters on dashboard", issue: "Issue #44", words: 940, sectionsDone: 6, sectionsTotal: 6, status: "review", lastEdited: "1h ago" },
  { id: "issue-43", title: "Workspace member roles v2", issue: "Issue #43", words: 1640, sectionsDone: 4, sectionsTotal: 6, status: "draft", lastEdited: "3h ago" },
  { id: "issue-41", title: "Rename workspace flow", issue: "Issue #41", words: 720, sectionsDone: 6, sectionsTotal: 6, status: "review", lastEdited: "5h ago" },
  { id: "issue-39", title: "Notification digest preferences", issue: "Issue #39", words: 1320, sectionsDone: 6, sectionsTotal: 6, status: "shipped", lastEdited: "1d ago" },
  { id: "issue-38", title: "Saved searches API", issue: "Issue #38", words: 2110, sectionsDone: 6, sectionsTotal: 6, status: "shipped", lastEdited: "2d ago" },
  { id: "issue-36", title: "Mobile detail view", issue: "Issue #36", words: 980, sectionsDone: 6, sectionsTotal: 6, status: "shipped", lastEdited: "4d ago" },
  { id: "issue-35", title: "Daily summary emails", issue: "Issue #35", words: 1490, sectionsDone: 6, sectionsTotal: 6, status: "shipped", lastEdited: "1w ago" },
  { id: "issue-34", title: "Onboarding gating logic", issue: "Issue #34", words: 1280, sectionsDone: 6, sectionsTotal: 6, status: "shipped", lastEdited: "1w ago" },
  { id: "issue-32", title: "Notion export integration", issue: "Issue #32", words: 1860, sectionsDone: 6, sectionsTotal: 6, status: "shipped", lastEdited: "2w ago" },
  { id: "issue-31", title: "Voice notes capture", issue: "Issue #31", words: 1050, sectionsDone: 6, sectionsTotal: 6, status: "shipped", lastEdited: "3w ago" },
];

export default async function PrdsPage() {
  const employeeId = DEMO_EMPLOYEE_ID;
  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads: [], prds: [] };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="alex-prds">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">All PRDs</h1>
          <p className="mt-1 text-[13px] text-ink-faint">Everything Alex has drafted, in review, or shipped.</p>
        </div>

        <PrdsList employeeId={emp.id} prds={PRDS} />
      </div>
    </DashboardShell>
  );
}
