"use client";

import { AvatarCard } from "@/src/components/avatar-card";
import { StatusPill } from "@/src/components/status-pill";
import { useWorkspace } from "@/src/store/workspace";
import { PrdSurface } from "./_workspace/prd-surface";
import { LeftRail } from "./_workspace/left-rail";

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

  return (
    <main className="min-h-screen bg-[--color-paper]">
      <header className="px-6 py-4 border-b border-[--color-paper-edge] bg-[--color-paper-hi] flex items-center justify-between">
        <AvatarCard name={employee.name} role="AI Product Manager" size="sm" />
        <StatusPill active={status !== "idle"}>{statusLabel(status)}</StatusPill>
      </header>
      <div className="grid grid-cols-[300px_1fr] min-h-[calc(100vh-65px)]">
        <LeftRail employeeId={employee.id} uploads={uploads} actionPlan={actionPlan} />
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
