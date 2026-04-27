import { headers } from "next/headers";
import { MOCK_MODE, serverClient } from "@/src/db/client";

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfter: number; // seconds until window rolls over
};

/** Fetch the client IP, falling back to "unknown" if no proxy header is set. */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/**
 * Sliding-window rate limit backed by the `rate_log` Supabase table.
 *
 * Records every accepted hit and rejects if the count in the last
 * `windowMs` exceeds `max`. Fails open (allows the request) on DB error
 * so a transient outage doesn't take the site down. In MOCK_MODE this
 * is a no-op pass.
 *
 * Cost: one count query + one insert per allowed request. Cheap on
 * Supabase free tier; index on (key, created_at desc) keeps both fast.
 */
export async function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (MOCK_MODE) return { ok: true, remaining: max, retryAfter: 0 };
  try {
    const sb = serverClient();
    const since = new Date(Date.now() - windowMs).toISOString();
    const { count, error: countErr } = await sb
      .from("rate_log")
      .select("*", { count: "exact", head: true })
      .eq("key", key)
      .gte("created_at", since);
    if (countErr) throw countErr;

    const used = count ?? 0;
    if (used >= max) {
      return {
        ok: false,
        remaining: 0,
        retryAfter: Math.ceil(windowMs / 1000),
      };
    }
    await sb.from("rate_log").insert({ key });
    return { ok: true, remaining: Math.max(0, max - used - 1), retryAfter: 0 };
  } catch (err) {
    console.error("[ratelimit] error (failing open)", err);
    return { ok: true, remaining: max, retryAfter: 0 };
  }
}

/** Convenience wrapper that returns a 429 Response, or null if allowed. */
export async function rateLimitResponse(
  key: string,
  max: number,
  windowMs: number,
): Promise<Response | null> {
  const r = await checkRateLimit(key, max, windowMs);
  if (r.ok) return null;
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      retryAfter: r.retryAfter,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(r.retryAfter),
      },
    },
  );
}
