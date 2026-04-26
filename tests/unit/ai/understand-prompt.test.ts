import { describe, it, expect } from "vitest";
import { buildUnderstandPrompt } from "@/src/ai/prompts/understand-context";

describe("buildUnderstandPrompt", () => {
  it("includes the brief and parsed docs verbatim", () => {
    const out = buildUnderstandPrompt({
      brief: { project: "Saathi", role: "Founder", priorities: ["YC demo"], time_sink: "PRDs", team: "3 eng", tools: ["Notion"] },
      docs: [{ filename: "spec.pdf", parsed_text: "Goals: build the demo" }],
    });
    expect(out.system).toContain("Product Manager");
    expect(out.system).toContain("JSON");
    expect(out.user).toContain("Saathi");
    expect(out.user).toContain("spec.pdf");
    expect(out.user).toContain("Goals: build the demo");
  });

  it("forces strict JSON schema", () => {
    const out = buildUnderstandPrompt({ brief: {}, docs: [] });
    expect(out.system).toContain("project_context");
    expect(out.system).toContain("role_and_priorities");
    expect(out.system).toContain("how_you_communicate");
  });
});
