"use client";

// Linear-style top progress rail for the onboarding walkthrough.
// Pinned 3px bar at the very top of the viewport, filling proportionally
// based on the user's overall progress across the 6 onboarding phases.
//
// Calculation:
//   overall = (phase - 1) / TOTAL_PHASES + (stepWithinPhase / totalStepsInPhase) / TOTAL_PHASES
//
// So Phase 1 step 1 = ~0%, Phase 1 step 7 = ~16.6%, Phase 2 = 16.6%, etc.

const TOTAL_PHASES = 6;

export function OnboardingProgress({
  phase,
  stepWithinPhase,
  totalStepsInPhase,
}: {
  phase: number;
  stepWithinPhase: number;
  totalStepsInPhase: number;
}) {
  const safeTotal = Math.max(1, totalStepsInPhase);
  const safeStep = Math.min(Math.max(0, stepWithinPhase), safeTotal);
  const phaseFloor = (phase - 1) / TOTAL_PHASES;
  const within = safeStep / safeTotal / TOTAL_PHASES;
  const pct = Math.min(1, Math.max(0, phaseFloor + within)) * 100;

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-paper-edge/60 pointer-events-none"
    >
      <div
        className="h-full bg-coral transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
