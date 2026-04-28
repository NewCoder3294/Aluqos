import { describe, it, expect, vi, beforeEach } from "vitest";

const issuesMock = vi.hoisted(() => vi.fn());
vi.mock("@linear/sdk", () => ({
  LinearClient: class {
    issues = issuesMock;
  },
}));

vi.mock("@/src/oauth/credentials", () => ({
  getDecryptedTokens: vi.fn().mockResolvedValue({
    access_token: "tok",
    refresh_token: null,
    expires_at: new Date(Date.now() + 3600_000),
    scope: "read",
  }),
}));

vi.mock("@/src/events/insert", () => ({
  insertActivityEvent: vi.fn().mockResolvedValue("row1"),
}));

vi.mock("@/src/server/rate-budget", () => ({
  takeRateBudget: vi.fn().mockResolvedValue(undefined),
  RateBudgetExceeded: class extends Error {},
}));

import { runLinearBackfill } from "@/src/backfill/linear-backfill";
import { insertActivityEvent } from "@/src/events/insert";

describe("runLinearBackfill", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    issuesMock.mockReset();
  });

  it("paginates issues over the 30-day window", async () => {
    issuesMock
      .mockResolvedValueOnce({
        nodes: [
          { id: "i1", title: "First", identifier: "ENG-1", state: { name: "Done" }, updatedAt: "2026-04-26T10:00:00Z", creator: { email: "a@b.com" } },
          { id: "i2", title: "Second", identifier: "ENG-2", state: { name: "Todo" }, updatedAt: "2026-04-25T10:00:00Z", creator: { email: "a@b.com" } },
        ],
        pageInfo: { hasNextPage: true, endCursor: "cur1" },
      })
      .mockResolvedValueOnce({
        nodes: [],
        pageInfo: { hasNextPage: false, endCursor: null },
      });
    const ingested = await runLinearBackfill({ tenantId: "t1" });
    expect(ingested).toBe(2);
    expect(insertActivityEvent).toHaveBeenCalledTimes(2);
    expect(issuesMock).toHaveBeenCalledTimes(2);
  });

  it("emits source_event_id matching the webhook shape so dedup works", async () => {
    // Same issue, same updatedAt — must produce the exact key the webhook normalizer
    // would produce for action="update", so the unique index collapses duplicates.
    issuesMock
      .mockResolvedValueOnce({
        nodes: [
          { id: "abc-123", title: "T", identifier: "ENG-1", state: { name: "Done" }, updatedAt: "2026-04-27T10:00:00Z", creator: { email: "a@b.com" } },
        ],
        pageInfo: { hasNextPage: false, endCursor: null },
      });
    await runLinearBackfill({ tenantId: "t1" });
    const call = (insertActivityEvent as any).mock.calls[0][0];
    expect(call.source_event_id).toBe("linear:Issue:update:abc-123:2026-04-27T10:00:00.000Z");
  });
});
