import { describe, it, expect, vi, beforeEach } from "vitest";

const rpcMock = vi.fn();
vi.mock("@/src/db/client", () => ({
  serverClient: () => ({ rpc: rpcMock }),
  MOCK_MODE: false,
}));

import { takeRateBudget, RateBudgetExceeded } from "@/src/server/rate-budget";

describe("rate budget (Postgres-backed)", () => {
  beforeEach(() => rpcMock.mockReset());

  it("calls rate_budget_take with the source's capacity and window", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null });
    await takeRateBudget("linear", "11111111-1111-1111-1111-111111111111");
    expect(rpcMock).toHaveBeenCalledWith("rate_budget_take", {
      p_source: "linear",
      p_tenant_id: "11111111-1111-1111-1111-111111111111",
      p_capacity: 100,
      p_window_ms: 60 * 60 * 1000,
    });
  });

  it("uses per-source budget config — github gets 5000/hr", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null });
    await takeRateBudget("github", "t1");
    expect(rpcMock).toHaveBeenCalledWith(
      "rate_budget_take",
      expect.objectContaining({ p_source: "github", p_capacity: 5000 }),
    );
  });

  it("uses per-source budget config — slack gets 20/min", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null });
    await takeRateBudget("slack", "t1");
    expect(rpcMock).toHaveBeenCalledWith(
      "rate_budget_take",
      expect.objectContaining({ p_source: "slack", p_capacity: 20, p_window_ms: 60 * 1000 }),
    );
  });

  it("resolves silently when the RPC returns null (success)", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: null });
    await expect(takeRateBudget("linear", "t1")).resolves.toBeUndefined();
  });

  it("throws RateBudgetExceeded carrying retry_after_ms when over capacity", async () => {
    rpcMock.mockResolvedValueOnce({ data: 12345, error: null });
    const err = await takeRateBudget("linear", "t1").catch((e) => e);
    expect(err).toBeInstanceOf(RateBudgetExceeded);
    expect((err as RateBudgetExceeded).retryAfterMs).toBe(12345);
    expect((err as RateBudgetExceeded).source).toBe("linear");
  });

  it("treats bigint/string responses (Postgres bigint may serialize as string) the same", async () => {
    rpcMock.mockResolvedValueOnce({ data: "42000", error: null });
    await expect(takeRateBudget("linear", "t1")).rejects.toMatchObject({
      name: "RateBudgetExceeded",
      retryAfterMs: 42000,
    });
  });

  it("propagates RPC errors as a thrown Error", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { message: "connection refused" } });
    await expect(takeRateBudget("linear", "t1")).rejects.toThrow(/connection refused/);
  });
});
