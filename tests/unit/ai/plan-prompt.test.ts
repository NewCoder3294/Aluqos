import { describe, it, expect } from "vitest";
import { buildProposePlanPrompt } from "@/src/ai/prompts/propose-action-plan";

describe("buildProposePlanPrompt", () => {
  it("includes brief, summary, observations, and docs", () => {
    const out = buildProposePlanPrompt({
      brief: { project: "Saathi" },
      context_summary: { project_context: "x", role_and_priorities: "y", how_you_communicate: "z" },
      observations: { decision_style: "ask_external", prd_depth: "1-pager", sample_prd_text: "Sample PRD body" },
      docs: [{ filename: "issue-47.json", parsed_text: "bulk export" }],
    });
    expect(out.system).toContain("own");
    expect(out.system).toContain("assist");
    expect(out.system).toContain("flag");
    expect(out.user).toContain("Saathi");
    expect(out.user).toContain("Sample PRD body");
    expect(out.user).toContain("issue-47.json");
  });
});
