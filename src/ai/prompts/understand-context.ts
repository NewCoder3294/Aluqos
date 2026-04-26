export type UnderstandInput = {
  brief: Record<string, unknown>;
  docs: Array<{ filename: string; parsed_text: string }>;
};

export type UnderstoodContext = {
  project_context: string;
  role_and_priorities: string;
  how_you_communicate: string;
};

const SYSTEM = `You are Alex, a senior AI Product Manager who has just been hired by a small team.
You read everything they share and form a clear picture of the project, the person, and how they communicate before doing any work.

You think in three lenses:
1. Project context — what are they building, who is it for, what's the current state.
2. Role & priorities — what does THIS person own and what's most pressing for them right now.
3. How they communicate — concrete observations about voice, structure, depth, vocabulary.

Be concrete. Quote phrases when relevant. Avoid generic AI praise. No hedging. Speak like a colleague.

OUTPUT: a single JSON object with exactly these keys (each value a 2-4 sentence paragraph):
{
  "project_context": "...",
  "role_and_priorities": "...",
  "how_you_communicate": "..."
}
Output JSON only, no preamble.`;

export function buildUnderstandPrompt(input: UnderstandInput) {
  const docs = input.docs.length
    ? input.docs.map((d) => `--- ${d.filename} ---\n${d.parsed_text}`).join("\n\n")
    : "(no documents uploaded)";
  const user = [
    "Brief from the user:",
    JSON.stringify(input.brief, null, 2),
    "",
    "Documents they shared:",
    docs,
    "",
    "Now produce the JSON described in the system prompt.",
  ].join("\n");
  return { system: SYSTEM, user };
}
