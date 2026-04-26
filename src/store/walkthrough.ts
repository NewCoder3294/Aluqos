import { create } from "zustand";

export type Phase = 1 | 2 | 3 | 4 | 5 | 6;

type WalkthroughState = {
  phase: Phase;
  briefDraft: Record<string, unknown>;
  readingLines: string[];
  understoodDraft: { project_context: string; role_and_priorities: string; how_you_communicate: string } | null;
  observationsDraft: Record<string, unknown>;
  actionPlanDraft: { own: any[]; assist: any[]; flag: any[] } | null;
  setPhase: (p: Phase) => void;
  setBrief: (b: Record<string, unknown>) => void;
  appendReadingLine: (l: string) => void;
  setUnderstood: (u: WalkthroughState["understoodDraft"]) => void;
  setObservations: (o: Record<string, unknown>) => void;
  setActionPlan: (p: WalkthroughState["actionPlanDraft"]) => void;
  reset: () => void;
};

const initial: Pick<WalkthroughState, "phase"|"briefDraft"|"readingLines"|"understoodDraft"|"observationsDraft"|"actionPlanDraft"> = {
  phase: 1,
  briefDraft: {},
  readingLines: [],
  understoodDraft: null,
  observationsDraft: {},
  actionPlanDraft: null,
};

export const useWalkthrough = create<WalkthroughState>((set) => ({
  ...initial,
  setPhase: (phase) => set({ phase }),
  setBrief: (briefDraft) => set({ briefDraft }),
  appendReadingLine: (line) => set((s) => ({ readingLines: [...s.readingLines, line] })),
  setUnderstood: (understoodDraft) => set({ understoodDraft }),
  setObservations: (observationsDraft) => set({ observationsDraft }),
  setActionPlan: (actionPlanDraft) => set({ actionPlanDraft }),
  reset: () => set(initial),
}));
