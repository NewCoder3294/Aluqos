import { describe, it, expect, beforeAll } from "vitest";
import { generateState, verifyState } from "@/src/oauth/state";

beforeAll(() => {
  process.env.OAUTH_STATE_SECRET = "test-secret-32-bytes-long-please.";
});

describe("oauth state", () => {
  it("generates a state that verifies for the same tenant", () => {
    const tenantId = "11111111-1111-1111-1111-111111111111";
    const state = generateState(tenantId, "linear");
    const result = verifyState(state, "linear");
    expect(result.tenantId).toBe(tenantId);
  });

  it("rejects a state for the wrong source", () => {
    const state = generateState("11111111-1111-1111-1111-111111111111", "linear");
    expect(() => verifyState(state, "github")).toThrow(/source mismatch/);
  });

  it("rejects a tampered state", () => {
    const state = generateState("11111111-1111-1111-1111-111111111111", "linear");
    const tampered = state.slice(0, -2) + "AA";
    expect(() => verifyState(tampered, "linear")).toThrow(/signature/);
  });

  it("rejects an expired state", () => {
    const state = generateState("11111111-1111-1111-1111-111111111111", "linear", { ttlSeconds: -1 });
    expect(() => verifyState(state, "linear")).toThrow(/expired/);
  });
});
