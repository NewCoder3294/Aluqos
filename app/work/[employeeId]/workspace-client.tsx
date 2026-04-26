"use client";

import { useWorkspace } from "@/src/store/workspace";
import { PrdSurface } from "./_workspace/prd-surface";
import { LeftRail } from "./_workspace/left-rail";
import { TopToolbar } from "./_workspace/top-toolbar";

export function WorkspaceClient({
  employee,
  uploads,
  prds,
  actionPlan,
  bootstrap,
}: {
  employee: { id: string; name: string; role: string };
  uploads: Array<{ id: string; filename: string }>;
  prds: Array<{ id: string; title: string; sections: Record<string, string>; source_issue: string | null }>;
  actionPlan: { own: { title: string }[]; assist: { title: string }[]; flag: { title: string }[] } | null;
  bootstrap: boolean;
}) {
  const title = useWorkspace(s => s.title);
  const prdId = useWorkspace(s => s.prdId);

  const centerLabel = prdId ? title || "Drafting…" : "Workspace";

  return (
    <main className="h-screen overflow-hidden flex flex-col bg-paper">
      <TopToolbar employeeName={employee.name} centerLabel={centerLabel} />
      <div className="grid grid-cols-[280px_1fr_360px] flex-1 min-h-0 overflow-hidden">
        <LeftRail
          employeeId={employee.id}
          employeeName={employee.name}
          uploads={uploads}
          actionPlan={actionPlan}
          prds={prds.map(p => ({ id: p.id, title: p.title }))}
        />
        <PrdSurface
          employeeId={employee.id}
          initialPrds={prds}
          bootstrap={bootstrap}
          uploads={uploads}
        />
      </div>
    </main>
  );
}
