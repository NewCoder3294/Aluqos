import type { GeneratedPrd } from "@/src/ai/prompts/generate-prd";

const HEADINGS: Array<[keyof GeneratedPrd["sections"], string]> = [
  ["problem", "Problem statement"],
  ["goals", "Goals"],
  ["user_stories", "User stories"],
  ["scope", "Scope"],
  ["out_of_scope", "Out of scope"],
  ["success_metrics", "Success metrics"],
];

export function prdToMarkdown(prd: GeneratedPrd): string {
  const out: string[] = [`# ${prd.title || "Untitled PRD"}`, ""];
  for (const [key, label] of HEADINGS) {
    const body = (prd.sections[key] ?? "").trim();
    if (!body) continue;
    out.push(`## ${label}`, "", body, "");
  }
  return out.join("\n").trim() + "\n";
}
