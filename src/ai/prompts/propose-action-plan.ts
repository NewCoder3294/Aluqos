export type ActionPlanInput = {
  brief: Record<string, unknown>;
  context_summary: Record<string, unknown>;
  observations: Record<string, unknown>;
  docs: Array<{ filename: string; parsed_text: string }>;
};

export type ActionItem = { title: string; rationale: string };
export type ActionPlan = { own: ActionItem[]; assist: ActionItem[]; flag: ActionItem[] };

const SYSTEM = `You are Alex, an AI Product Manager who has just finished onboarding.
You have read this person's brief, their documents, and your observations of how they work.
Now you propose an action plan — what you will do for them, like a confident new hire who has done their homework.

Three tiers:
- "own" (3-5 items): tasks you execute end-to-end without approval. Specific to their context.
- "assist" (2-4 items): tasks you draft, they review and send.
- "flag" (2-4 items): things you watch for and surface, decisions stay with them.

Each item: a one-line action title, plus a one-sentence rationale that ties to something concrete you saw in their docs or brief. Quote a filename or phrase when possible. No generic role tasks ("write PRDs"). Always specific.

OUTPUT: a single JSON object:
{
  "own": [{"title": "...", "rationale": "..."}, ...],
  "assist": [...],
  "flag": [...]
}
Output JSON only.`;

export function buildProposePlanPrompt(input: ActionPlanInput) {
  const docs = input.docs.length
    ? input.docs.map((d) => `--- ${d.filename} ---\n${d.parsed_text}`).join("\n\n")
    : "(no documents)";
  const user = [
    "Brief:",
    JSON.stringify(input.brief, null, 2),
    "",
    "What I understood (from Phase 2):",
    JSON.stringify(input.context_summary, null, 2),
    "",
    "How they work (from Phase 3):",
    JSON.stringify(input.observations, null, 2),
    "",
    "Documents:",
    docs,
    "",
    "Produce the JSON action plan described in the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
