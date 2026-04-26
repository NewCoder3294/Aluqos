import { describe, it, expect } from "vitest";
import { buildRefinePrdPrompt } from "@/src/ai/prompts/refine-prd";

describe("buildRefinePrdPrompt", () => {
  it("targets a section by key and applies the action", () => {
    const out = buildRefinePrdPrompt({
      sections: { problem: "p", goals: "g", user_stories: "us", scope: "s", out_of_scope: "oos", success_metrics: "sm" },
      action: "Add API spec",
      voice_summary: "punchy short sentences",
    });
    expect(out.system).toContain("section_key");
    expect(out.user).toContain("Add API spec");
    expect(out.user).toContain("punchy short sentences");
  });
});
