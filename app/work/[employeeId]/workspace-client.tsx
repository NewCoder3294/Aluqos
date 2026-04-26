"use client";

import { AvatarCard } from "@/src/components/avatar-card";
import { StatusPill } from "@/src/components/status-pill";
import { useWorkspace } from "@/src/store/workspace";
import { PrdSurface } from "./_workspace/prd-surface";
import { LeftRail } from "./_workspace/left-rail";

const SECTION_LABELS: Record<string, string> = {
  problem: "Problem",
  goals: "Goals",
  user_stories: "User stories",
  scope: "Scope",
  out_of_scope: "Out of scope",
  success_metrics: "Success metrics",
};

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
  const status = useWorkspace(s => s.status);
  const streamingSection = useWorkspace(s => s.streamingSection);
  const title = useWorkspace(s => s.title);
  const prdId = useWorkspace(s => s.prdId);

  const verb = statusLabel(status);
  let detail = "";
  if (status !== "idle" && prdId) {
    if (streamingSection) {
      detail = SECTION_LABELS[streamingSection] ?? streamingSection;
    } else if (title) {
      detail = title;
    } else {
      detail = "Issue #47";
    }
  }

  return (
    <main className="min-h-screen bg-[--color-paper]">
      <header className="px-6 py-4 border-b border-[--color-paper-edge] bg-[--color-paper-hi] flex items-center justify-between">
        <AvatarCard name={employee.name} role="AI Product Manager" size="sm" />
        <StatusPill active={status !== "idle"}>
          {verb}{detail ? ` · ${detail}` : ""}
        </StatusPill>
      </header>
      <div className="grid grid-cols-[320px_1fr] min-h-[calc(100vh-65px)]">
        <LeftRail
          employeeId={employee.id}
          employeeName={employee.name}
          uploads={uploads}
          actionPlan={actionPlan}
          prds={prds.map(p => ({ id: p.id, title: p.title }))}
        />
        <PrdSurface employeeId={employee.id} initialPrds={prds} bootstrap={bootstrap} />
      </div>
    </main>
  );
}

function statusLabel(s: string) {
  switch (s) {
    case "drafting": return "Drafting";
    case "editing": return "Editing";
    case "exporting": return "Exporting";
    default: return "Idle";
  }
}
