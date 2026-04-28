import { describe, it, expect, vi, beforeEach } from "vitest";

const fromMock = vi.fn();
vi.mock("@/src/db/client", () => ({ serverClient: () => ({ from: fromMock }), MOCK_MODE: false }));

import { queryActivityEvents, countActivityEvents } from "@/src/events/query";

describe("queryActivityEvents", () => {
  beforeEach(() => fromMock.mockReset());

  it("filters by source when provided", async () => {
    const eqMock = vi.fn().mockReturnThis();
    const orderMock = vi.fn().mockReturnThis();
    const limitMock = vi.fn().mockResolvedValue({ data: [], error: null });
    fromMock.mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        eq: eqMock,
        order: orderMock,
        gte: vi.fn().mockReturnThis(),
        lt: vi.fn().mockReturnThis(),
        limit: limitMock,
      }),
    });
    await queryActivityEvents({ tenant_id: "t1", source: "linear", limit: 10 });
    expect(eqMock).toHaveBeenCalledWith("tenant_id", "t1");
  });
});

describe("countActivityEvents", () => {
  beforeEach(() => fromMock.mockReset());

  it("returns the count", async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({ eq: () => Promise.resolve({ count: 42, error: null }) }),
      }),
    });
    const count = await countActivityEvents("t1", "linear");
    expect(count).toBe(42);
  });
});
