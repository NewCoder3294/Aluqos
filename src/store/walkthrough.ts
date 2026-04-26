import { create } from "zustand";

export type Phase = 1 | 2 | 3 | 4 | 5 | 6;

type WalkthroughState = {
  phase: Phase;
  /** 1-based index of the current step within the active phase. Used by the
   * top progress rail. Defaults to 1. */
  subStep: number;
  /** Total number of steps inside the active phase. Defaults to 1 for phases
   * that render a single screen (Phase 2, 4, 5). */
  subStepTotal: number;
  briefDraft: Record<string, unknown>;
  readingLines: string[];
  understoodDraft: { project_context: string; role_and_priorities: string; how_you_communicate: string } | null;
  observationsDraft: Record<string, unknown>;
  actionPlanDraft: { own: any[]; assist: any[]; flag: any[] } | null;
  setPhase: (p: Phase) => void;
  setSubStep: (step: number, total: number) => void;
  setBrief: (b: Record<string, unknown>) => void;
  appendReadingLine: (l: string) => void;
  setUnderstood: (u: WalkthroughState["understoodDraft"]) => void;
  setObservations: (o: Record<string, unknown>) => void;
  setActionPlan: (p: WalkthroughState["actionPlanDraft"]) => void;
  reset: () => void;
};

const initial: Pick<WalkthroughState, "phase"|"subStep"|"subStepTotal"|"briefDraft"|"readingLines"|"understoodDraft"|"observationsDraft"|"actionPlanDraft"> = {
  phase: 1,
  // Start at step 0 so the progress rail sits at the bottom of the current
  // phase floor on first render — each phase's mount effect publishes the real
  // (step, total) immediately afterwards.
  subStep: 0,
  subStepTotal: 1,
  briefDraft: {},
  readingLines: [],
  understoodDraft: null,
  observationsDraft: {},
  actionPlanDraft: null,
};

export const useWalkthrough = create<WalkthroughState>((set) => ({
  ...initial,
  setPhase: (phase) => set({ phase }),
  setSubStep: (subStep, subStepTotal) => set({ subStep, subStepTotal }),
  setBrief: (briefDraft) => set({ briefDraft }),
  appendReadingLine: (line) => set((s) => ({ readingLines: [...s.readingLines, line] })),
  setUnderstood: (understoodDraft) => set({ understoodDraft }),
  setObservations: (observationsDraft) => set({ observationsDraft }),
  setActionPlan: (actionPlanDraft) => set({ actionPlanDraft }),
  reset: () => set(initial),
}));
