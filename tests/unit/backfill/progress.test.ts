import { describe, it, expect, vi, beforeEach } from "vitest";

const fromMock = vi.fn();
vi.mock("@/src/db/client", () => ({ serverClient: () => ({ from: fromMock }), MOCK_MODE: false }));

import { getBackfillStatus } from "@/src/backfill/progress";

describe("getBackfillStatus", () => {
  beforeEach(() => fromMock.mockReset());

  it("returns the row for tenant+source", async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({
              data: { status: "completed", events_ingested: 142, started_at: null, completed_at: null, error_message: null },
              error: null,
            }),
          }),
        }),
      }),
    });
    const s = await getBackfillStatus("t1", "linear");
    expect(s?.status).toBe("completed");
    expect(s?.events_ingested).toBe(142);
  });
});
