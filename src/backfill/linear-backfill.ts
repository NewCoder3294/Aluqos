import { LinearClient } from "@linear/sdk";
import { getDecryptedTokens } from "@/src/oauth/credentials";
import { insertActivityEvent } from "@/src/events/insert";
import { takeRateBudget } from "@/src/server/rate-budget";
import { sanitizeUserText } from "@/src/events/sanitize";
import type { ActivityEvent } from "@/src/events/types";

const BACKFILL_DAYS = 30;
const PAGE_SIZE = 50;

export async function runLinearBackfill(opts: { tenantId: string }): Promise<number> {
  const tokens = await getDecryptedTokens(opts.tenantId, "linear");
  if (!tokens) throw new Error("Linear credentials missing for tenant " + opts.tenantId);

  const client = new LinearClient({ accessToken: tokens.access_token });
  const since = new Date(Date.now() - BACKFILL_DAYS * 24 * 60 * 60 * 1000);

  let cursor: string | undefined = undefined;
  let ingested = 0;

  while (true) {
    await takeRateBudget("linear", opts.tenantId);
    const result = await client.issues({
      first: PAGE_SIZE,
      after: cursor,
      filter: { updatedAt: { gte: since.toISOString() } },
    });

    for (const issue of result.nodes) {
      const event: ActivityEvent = {
        tenant_id: opts.tenantId,
        source: "linear",
        source_event_id: `linear:Issue:backfill:${issue.id}:${issue.updatedAt}`,
        actor: ((issue as unknown as { creator?: { email?: string } }).creator?.email) ?? null,
        verb: "updated",
        object: sanitizeUserText(issue.title ?? ""),
        context_json: {
          type: "Issue",
          identifier: issue.identifier ?? null,
          state: ((issue as unknown as { state?: { name?: string } }).state?.name) ?? null,
        },
        occurred_at: new Date(issue.updatedAt as unknown as string),
      };
      await insertActivityEvent(event);
      ingested += 1;
    }

    if (!result.pageInfo.hasNextPage) break;
    cursor = result.pageInfo.endCursor ?? undefined;
  }

  return ingested;
}
