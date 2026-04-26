import { describe, it, expect, vi } from "vitest";
import { withFallback, loadCanned } from "@/src/ai/fallback";

describe("withFallback", () => {
  it("returns the live result when it succeeds within the budget", async () => {
    const live = vi.fn().mockResolvedValue("live");
    const canned = vi.fn().mockResolvedValue("canned");
    const out = await withFallback({ ttfbMs: 10000, live, canned });
    expect(out).toBe("live");
    expect(canned).not.toHaveBeenCalled();
  });

  it("uses canned when live throws", async () => {
    const live = vi.fn().mockRejectedValue(new Error("network"));
    const canned = vi.fn().mockResolvedValue("canned");
    const out = await withFallback({ ttfbMs: 10000, live, canned });
    expect(out).toBe("canned");
  });

  it("uses canned when live exceeds the time budget", async () => {
    const live = () => new Promise(r => setTimeout(() => r("late"), 200));
    const canned = vi.fn().mockResolvedValue("canned");
    const out = await withFallback({ ttfbMs: 50, live, canned });
    expect(out).toBe("canned");
  });
});

describe("loadCanned", () => {
  it("loads a canned response by key", async () => {
    const r = await loadCanned("understand");
    expect(r).toBeTruthy();
    expect(typeof r).toBe("object");
  });
});
