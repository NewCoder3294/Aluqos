"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { OnboardingProgress } from "./_chrome/onboarding-progress";
import {
  Phase1Brief, Phase2Reading, Phase3Observe, Phase4Plan, Phase5Approve,
} from "./_phases";

// Linear-style editorial onboarding shell.
// No top toolbar, no sidebars, no KPI strip — only a thin coral progress
// rail at the very top and a centered content area. Each phase renders its
// own steps; phases publish their progress (current step / total in phase)
// into the walkthrough store so the rail at the top can fill proportionally.
export function WalkthroughClient({
  employee,
  session,
}: {
  employee: { id: string; name: string; role: string };
  session: { phase?: number; employee_id: string };
}) {
  const phase = useWalkthrough(s => s.phase);
  const subStep = useWalkthrough(s => s.subStep);
  const subStepTotal = useWalkthrough(s => s.subStepTotal);
  const setPhase = useWalkthrough(s => s.setPhase);

  useEffect(() => {
    if (session.phase) setPhase(session.phase as Phase);
  }, [session.phase, setPhase]);

  return (
    <main className="bg-paper min-h-screen relative">
      <OnboardingProgress
        phase={phase}
        stepWithinPhase={subStep}
        totalStepsInPhase={subStepTotal}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {phase === 1 && <Phase1Brief employeeId={employee.id} />}
          {phase === 2 && <Phase2Reading employeeId={employee.id} />}
          {phase === 3 && <Phase3Observe employeeId={employee.id} />}
          {phase === 4 && <Phase4Plan employeeId={employee.id} />}
          {phase === 5 && <Phase5Approve employeeId={employee.id} />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
