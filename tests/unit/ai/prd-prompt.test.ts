import { describe, it, expect } from "vitest";
import { buildGeneratePrdPrompt } from "@/src/ai/prompts/generate-prd";

describe("buildGeneratePrdPrompt", () => {
  it("includes context summary and source issue", () => {
    const out = buildGeneratePrdPrompt({
      context_summary: { project_context: "ctx", role_and_priorities: "r", how_you_communicate: "punchy short sentences" },
      observations: { prd_depth: "full spec" },
      docs: [{ filename: "issue-47.json", parsed_text: "bulk export request" }],
      source: "Issue #47: Add bulk export for analytics dashboard",
    });
    expect(out.system).toContain("Problem");
    expect(out.system).toContain("Goals");
    expect(out.system).toContain("user_stories");
    expect(out.user).toContain("Issue #47");
    expect(out.user).toContain("bulk export");
    expect(out.user).toContain("punchy short sentences");
  });
});
