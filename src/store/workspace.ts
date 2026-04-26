import { create } from "zustand";

export type PrdSectionKey =
  | "problem"
  | "goals"
  | "user_stories"
  | "scope"
  | "out_of_scope"
  | "success_metrics";

export type PrdState = {
  prdId: string | null;
  title: string;
  sections: Partial<Record<PrdSectionKey, string>>;
  streamingSection: PrdSectionKey | null;
  status: "idle" | "drafting" | "editing" | "exporting";
  setPrd: (p: { id: string; title: string }) => void;
  appendSection: (key: PrdSectionKey, delta: string) => void;
  setStreamingSection: (k: PrdSectionKey | null) => void;
  finishStreaming: () => void;
  setStatus: (s: PrdState["status"]) => void;
  reset: () => void;
};

const initial: Pick<PrdState, "prdId"|"title"|"sections"|"streamingSection"|"status"> = {
  prdId: null,
  title: "",
  sections: {},
  streamingSection: null,
  status: "idle",
};

export const useWorkspace = create<PrdState>((set) => ({
  ...initial,
  setPrd: ({ id, title }) => set({ prdId: id, title, sections: {}, status: "drafting" }),
  appendSection: (key, delta) =>
    set((s) => ({ sections: { ...s.sections, [key]: (s.sections[key] ?? "") + delta } })),
  setStreamingSection: (streamingSection) => set({ streamingSection }),
  finishStreaming: () => set({ streamingSection: null, status: "idle" }),
  setStatus: (status) => set({ status }),
  reset: () => set(initial),
}));
