import { z } from "zod";

// Shared building blocks. parsed_text is already capped at 50k chars by the
// upload pipeline; this is a defense-in-depth ceiling for direct API hits.
const DocSchema = z.object({
  filename: z.string().max(200),
  parsed_text: z.string().max(60_000),
});

const DocsArraySchema = z.array(DocSchema).max(10);

// Loose record schemas — the AI tolerates arbitrary shapes here, but we still
// cap depth indirectly via body-size limits enforced upstream.
const RecordSchema = z.record(z.string(), z.unknown());

// Each export here mirrors the *Input type alias in the matching prompt file.
export const PrdInputSchema = z.object({
  context_summary: RecordSchema,
  observations: RecordSchema,
  docs: DocsArraySchema,
  source: z.string().min(1).max(500),
});

export const RefineInputSchema = z.object({
  sections: z.object({
    problem: z.string(),
    goals: z.string(),
    user_stories: z.string(),
    scope: z.string(),
    out_of_scope: z.string(),
    success_metrics: z.string(),
  }),
  action: z.string().min(1).max(2_000),
  voice_summary: z.string().max(500).optional(),
});

export const UnderstandInputSchema = z.object({
  brief: RecordSchema,
  docs: DocsArraySchema,
});

export const ActionPlanInputSchema = z.object({
  brief: RecordSchema,
  context_summary: RecordSchema,
  observations: RecordSchema,
  docs: DocsArraySchema,
});

/**
 * Parse a JSON request body against a Zod schema. On failure, returns a
 * Response with 400 + the validation error so the route can early-return.
 *
 * Caps the body at 100KB before attempting to parse — defends against
 * cost-amplification via oversized payloads even if the platform's body
 * limit is generous.
 */
export async function parseJsonRequest<T>(
  req: Request,
  schema: z.ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; res: Response }> {
  const raw = await req.text();
  if (raw.length > 100_000) {
    return {
      ok: false,
      res: new Response(JSON.stringify({ error: "Request body too large" }), {
        status: 413,
        headers: { "content-type": "application/json" },
      }),
    };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: false,
      res: new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      }),
    };
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    return {
      ok: false,
      res: new Response(
        JSON.stringify({ error: "Validation failed", issues: result.error.issues }),
        { status: 400, headers: { "content-type": "application/json" } },
      ),
    };
  }
  return { ok: true, data: result.data };
}
