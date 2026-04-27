"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { OnboardingProgress } from "@/app/onboarding/[employeeId]/_chrome/onboarding-progress";
import {
  Phase1Brief,
  Phase2Reading,
  Phase3Observe,
  Phase4Plan,
  Phase5Approve,
} from "@/app/onboarding/[employeeId]/_phases";

// Detailed-setup wrapper for the original form-driven onboarding.
// Reachable from /work/[id]/settings — separate from the magical onboarding
// flow at /onboarding/[id] which uses the new beats. State is shared via the
// walkthrough zustand store; phase 6 / start-working still redirects to /work.
export function SetupClient({
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
    const startAt = session.phase && session.phase >= 1 && session.phase <= 5
      ? (session.phase as Phase)
      : 1;
    setPhase(startAt);
  }, [session.phase, setPhase]);

  return (
    <main className="bg-paper min-h-screen relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 [background-image:radial-gradient(circle,#9a9388_1.2px,transparent_1.2px)] [background-size:20px_20px]"
      />

      <div className="relative z-10">
        <OnboardingProgress
          phase={phase}
          stepWithinPhase={subStep}
          totalStepsInPhase={subStepTotal}
        />

        <div className="absolute top-4 left-6 z-20">
          <Link
            href={`/work/${employee.id}/settings`}
            className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.12em] text-ink-faint hover:text-coral-deep transition-colors"
          >
            <ArrowLeft size={12} strokeWidth={2} /> Settings
          </Link>
        </div>

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
      </div>
    </main>
  );
}
