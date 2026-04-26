import type { GeneratedPrd } from "./generate-prd";

export type RefineInput = {
  sections: GeneratedPrd["sections"];
  action: string;
  voice_summary?: string;
};

export type RefineOutput = {
  section_key: keyof GeneratedPrd["sections"];
  new_content: string;
};

const SYSTEM = `You are Alex revising a PRD section based on a follow-up instruction.

Pick the section that best matches the instruction. Rewrite ONLY that section. Preserve voice — do not reset it.

OUTPUT: a single JSON object:
{
  "section_key": "problem" | "goals" | "user_stories" | "scope" | "out_of_scope" | "success_metrics",
  "new_content": "..."
}
Output JSON only.`;

export function buildRefinePrdPrompt(input: RefineInput) {
  const user = [
    "Current PRD sections:",
    JSON.stringify(input.sections, null, 2),
    "",
    `Voice to preserve: ${input.voice_summary ?? "(use the existing tone)"}`,
    "",
    `Follow-up instruction: ${input.action}`,
    "",
    "Output JSON per the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
