"use client";

import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { Button } from "@/src/components/ui/button";
import { useWorkspace } from "@/src/store/workspace";
import { PrdSurface } from "./_workspace/prd-surface";
import { LeftRail } from "./_workspace/left-rail";
import { Search, Settings } from "lucide-react";
import { toast } from "@/src/components/toast";

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

  const centerLabel = prdId ? title || "Drafting…" : "Workspace";

  return (
    <main className="min-h-screen bg-[--color-paper]">
      <header
        className="h-[72px] px-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-[--color-paper-hi] border-b border-[--color-paper-edge] shadow-[0_1px_0_rgba(31,29,26,0.03)]"
      >
        {/* Left: avatar + name + role */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-full text-white grid place-items-center shrink-0"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            <Serif className="text-[14px]">{employee.name.charAt(0)}</Serif>
          </div>
          <div className="min-w-0">
            <Serif className="text-[15px] block truncate leading-tight">{employee.name}</Serif>
            <div className="label leading-tight">AI Product Manager</div>
          </div>
        </div>

        {/* Center: current PRD title */}
        <div className="min-w-0 text-center">
          <Serif className="text-[14px] text-[--color-ink-muted] truncate">{centerLabel}</Serif>
        </div>

        {/* Right: status + actions */}
        <div className="flex items-center justify-end gap-2">
          <StatusPill active={status !== "idle"}>
            {verb}{detail ? ` · ${detail}` : ""}
          </StatusPill>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => toast.info("Coming soon")}
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Settings"
            onClick={() => toast.info("Coming soon")}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-[320px_1fr] min-h-[calc(100vh-72px)]">
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

function statusLabel(s: string) {
  switch (s) {
    case "drafting": return "Drafting";
    case "editing": return "Editing";
    case "exporting": return "Exporting";
    default: return "Idle";
  }
}
