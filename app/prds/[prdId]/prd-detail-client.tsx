"use client";

import { TreeNav } from "@/app/_chrome/tree-nav";
import { PrdSurface } from "@/app/work/[employeeId]/_workspace/prd-surface";
import { useWorkspace } from "@/src/store/workspace";

export function PrdDetailClient({
  employeeId,
  prdId,
  prdTitle,
  prds,
  bootstrap,
  uploads,
  dateLabel,
}: {
  employeeId: string;
  prdId: string;
  prdTitle: string;
  prds: Array<{ id: string; title: string; sections: Record<string, string>; source_issue: string | null }>;
  bootstrap: boolean;
  uploads: Array<{ id: string; filename: string }>;
  dateLabel: string;
}) {
  const liveTitle = useWorkspace((s) => s.title);
  const headerLabel = liveTitle || prdTitle || "Drafting…";
  const breadcrumb = `PRDs › ${prdId === "new-bootstrap" ? "Issue #47" : prdId}`;

  return (
    <div className="min-h-screen flex bg-paper">
      <TreeNav employeeId={employeeId} activeNav="alex-prds" />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[56px] shrink-0 border-b border-paper-edge bg-paper px-8 flex items-center justify-between">
          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-[12px] uppercase tracking-[0.12em] text-ink-faint">
              {breadcrumb}
            </span>
            <span className="serif text-[16px] tracking-[-0.01em] text-ink truncate">
              · {headerLabel}
            </span>
          </div>
          <div className="text-[12px] text-ink-faint shrink-0">{dateLabel}</div>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-[1fr_320px] overflow-hidden">
          <PrdSurface
            employeeId={employeeId}
            initialPrds={prds}
            bootstrap={bootstrap}
            uploads={uploads}
          />
        </div>
      </div>
    </div>
  );
}
