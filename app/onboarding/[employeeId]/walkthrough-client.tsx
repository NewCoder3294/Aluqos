"use client";

import { useEffect } from "react";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { AvatarCard } from "@/src/components/avatar-card";
import { Serif } from "@/src/components/serif";
import {
  Phase1Brief, Phase2Reading, Phase3Observe, Phase4Plan, Phase5Approve,
} from "./_phases";

const DAY_LABELS: Record<Phase, string> = {
  1: "Day one — getting acquainted",
  2: "Day one — reading the room",
  3: "Day one — picking up your style",
  4: "Day one — planning the work",
  5: "Day one — your call",
  6: "Already on it.",
};

export function WalkthroughClient({
  employee,
  session,
}: {
  employee: { id: string; name: string; role: string };
  session: { phase?: number; employee_id: string };
}) {
  const phase = useWalkthrough(s => s.phase);
  const setPhase = useWalkthrough(s => s.setPhase);

  useEffect(() => {
    if (session.phase) setPhase(session.phase as Phase);
  }, [session.phase, setPhase]);

  return (
    <main className="min-h-screen px-6 py-10 flex flex-col items-center">
      <div className="w-full max-w-[760px]">
        <div className="flex items-start justify-between mb-12">
          <Serif italic className="text-[14px] text-[--color-ink-faint]">
            {DAY_LABELS[phase]}
          </Serif>
          <AvatarCard name={employee.name} role="AI Product Manager" size="sm" />
        </div>

        <div className="space-y-8">
          {phase === 1 && <Phase1Brief employeeId={employee.id} />}
          {phase === 2 && <Phase2Reading employeeId={employee.id} />}
          {phase === 3 && <Phase3Observe employeeId={employee.id} />}
          {phase === 4 && <Phase4Plan employeeId={employee.id} />}
          {phase === 5 && <Phase5Approve employeeId={employee.id} />}
        </div>
      </div>
    </main>
  );
}
