import Link from "next/link";
import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/cn";

type PrdStatus = "draft" | "review" | "shipped";

type PrdRow = {
  id: string;
  title: string;
  issue: string;
  words: number;
  sectionsDone: number;
  sectionsTotal: number;
  status: PrdStatus;
  lastEdited: string;
};

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

const DOT_BY_STATUS: Record<PrdStatus, string> = {
  draft: "bg-coral",
  review: "bg-coral-light",
  shipped: "bg-ink-muted",
};

const LABEL_BY_STATUS: Record<PrdStatus, string> = {
  draft: "Draft",
  review: "In review",
  shipped: "Shipped",
};

const VARIANT_BY_STATUS: Record<PrdStatus, "coral" | "default" | "outline"> = {
  draft: "coral",
  review: "default",
  shipped: "outline",
};

export default async function PrdsPage({
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
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="alex-prds">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">All PRDs</h1>
          <p className="mt-1 text-[13px] text-ink-faint">Everything Alex has drafted, in review, or shipped.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All PRDs · {PRDS.length} total</CardTitle>
            <Button variant="outline" size="sm">Filter</Button>
          </CardHeader>
          <CardContent compact className="p-0">
            <ul>
              {PRDS.map((prd, idx) => (
                <li key={prd.id}>
                  <Link
                    href={`/work/${emp.id}/prd/${prd.id}`}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-hi/40 cursor-pointer",
                      idx !== PRDS.length - 1 && "border-b border-paper-edge",
                    )}
                  >
                    <span className={cn("size-2 rounded-full shrink-0", DOT_BY_STATUS[prd.status])} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] text-ink font-medium truncate">{prd.title}</div>
                      <div className="text-[12px] text-ink-faint mt-0.5">
                        {prd.issue} · {prd.words.toLocaleString()} words · {prd.sectionsDone}/{prd.sectionsTotal} sections
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge variant={VARIANT_BY_STATUS[prd.status]}>{LABEL_BY_STATUS[prd.status]}</Badge>
                      <span className="text-[12px] text-ink-faint italic w-[110px] text-right">last edited {prd.lastEdited}</span>
                      <Button variant="outline" size="sm" asChild>
                        <span>Open →</span>
                      </Button>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
