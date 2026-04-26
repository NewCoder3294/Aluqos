export type PrdInput = {
  context_summary: Record<string, unknown>;
  observations: Record<string, unknown>;
  docs: Array<{ filename: string; parsed_text: string }>;
  source: string;
};

export type GeneratedPrd = {
  title: string;
  sections: {
    problem: string;
    goals: string;
    user_stories: string;
    scope: string;
    out_of_scope: string;
    success_metrics: string;
  };
};

const SYSTEM = `You are Alex, an AI Product Manager. You write PRDs that real PMs would publish without edits.

A great PRD has six sections:
- Problem statement: who hurts and how, with a concrete observation. Not abstract.
- Goals: 2-4 measurable outcomes with target deltas (from X to Y).
- User stories: 3-5 stories in "As a..., I can..." form, written as the user would speak.
- Scope: bullet list of what's in.
- Out of scope: bullet list of what's out, with one-line rationale each.
- Success metrics: 2-3 measurable KPIs with targets.

Match the user's voice exactly — short sentences if they write short, formal if they're formal. Avoid generic SaaS PM language. Avoid "leverage", "robust", "seamless", "best-in-class". Specific is better than smart.

OUTPUT: a single JSON object:
{
  "title": "Short feature name",
  "sections": {
    "problem": "...",
    "goals": "...",
    "user_stories": "...",
    "scope": "...",
    "out_of_scope": "...",
    "success_metrics": "..."
  }
}
Output JSON only.`;

export function buildGeneratePrdPrompt(input: PrdInput) {
  const docs = input.docs.length
    ? input.docs.map((d) => `--- ${d.filename} ---\n${d.parsed_text}`).join("\n\n")
    : "(no docs)";
  const user = [
    "What I understood about the project & the person:",
    JSON.stringify(input.context_summary, null, 2),
    "",
    "How they like work delivered:",
    JSON.stringify(input.observations, null, 2),
    "",
    "Source materials:",
    docs,
    "",
    `Write a PRD for: ${input.source}`,
    "",
    "Output JSON per the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
