import { describe, it, expect, beforeEach, vi } from "vitest";
import { takeRateBudget, resetRateBudget, RateBudgetExceeded } from "@/src/server/rate-budget";

describe("rate budget", () => {
  beforeEach(() => {
    resetRateBudget();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-27T00:00:00Z"));
  });

  it("allows within budget", async () => {
    for (let i = 0; i < 20; i++) {
      await takeRateBudget("linear", "t1");
    }
  });

  it("throws RateBudgetExceeded over Linear budget", async () => {
    for (let i = 0; i < 100; i++) {
      try { await takeRateBudget("linear", "t1"); } catch {}
    }
    await expect(takeRateBudget("linear", "t1")).rejects.toBeInstanceOf(RateBudgetExceeded);
  });

  it("budget resets on window expiry", async () => {
    for (let i = 0; i < 5000; i++) {
      try { await takeRateBudget("github", "t1"); } catch {}
    }
    await expect(takeRateBudget("github", "t1")).rejects.toBeInstanceOf(RateBudgetExceeded);
    vi.advanceTimersByTime(60 * 60 * 1000 + 1000);
    await expect(takeRateBudget("github", "t1")).resolves.toBeUndefined();
  });
});
