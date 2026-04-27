"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { OnboardingProgress } from "./_chrome/onboarding-progress";
import {
  Beat1Intro,
  Beat2Drop,
  Beat3Reading,
  Beat4Understanding,
  Beat5PrdReveal,
} from "./_beats";

// Magic-moment onboarding shell. Five beats per Saathi_MVP_Spec.docx:
//   1 Intro    — "Hi, I'm Alex." avatar reveal
//   2 Drop     — "GitHub repo" + "Notion product spec" drop targets
//   3 Reading  — streaming "Reading codebase…" theater
//   4 Understanding — "Here's what I picked up." cards + That's right
//   5 PRD reveal — unprompted Issue #47 PRD streams in → /work
//
// The walkthrough store's `phase` field is repurposed (1-5 = beats; 6 = done,
// handled by start-working.ts). The old form-driven phases live under
// /work/{id}/settings as advanced setup (kept, not deleted).
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
    if (session.phase && session.phase >= 1 && session.phase <= 5) {
      setPhase(session.phase as Phase);
    } else {
      setPhase(1);
    }
  }, [session.phase, setPhase]);

  return (
    <main className="bg-paper min-h-screen relative overflow-hidden">
      {/* Editorial dot grid — same treatment as the landing hero */}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={
              // Beats 1-4 sit inside their own BeatCard container, centered
              // in the viewport on top of the dot grid. Beat 5 owns its own
              // wide layout (sticky avatar rail + scrolling PRD card).
              phase === 5
                ? undefined
                : "min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-10"
            }
          >
            {phase === 1 && <Beat1Intro />}
            {phase === 2 && <Beat2Drop />}
            {phase === 3 && <Beat3Reading />}
            {phase === 4 && <Beat4Understanding />}
            {phase === 5 && <Beat5PrdReveal employeeId={employee.id} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
