import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/src/oauth/cookies", () => ({
  readStateCookie: vi.fn(),
  clearStateCookie: vi.fn(),
}));
vi.mock("@/src/oauth/state", () => ({
  verifyState: vi.fn(),
}));
vi.mock("@/src/oauth/linear", () => ({
  exchangeLinearCode: vi.fn(),
}));
vi.mock("@/src/oauth/credentials", () => ({
  saveCredentials: vi.fn(),
}));
vi.mock("@/src/connections/queries", () => ({
  upsertConnection: vi.fn(),
}));
vi.mock("@/src/inngest/client", () => ({
  inngest: { send: vi.fn() },
}));

import { GET } from "@/app/api/oauth/linear/callback/route";
import { readStateCookie, clearStateCookie } from "@/src/oauth/cookies";
import { verifyState } from "@/src/oauth/state";
import { exchangeLinearCode } from "@/src/oauth/linear";
import { saveCredentials } from "@/src/oauth/credentials";
import { upsertConnection } from "@/src/connections/queries";
import { inngest } from "@/src/inngest/client";

describe("Linear callback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("redirects to /settings/connections?connected=linear on success", async () => {
    (readStateCookie as any).mockResolvedValue("state-token");
    (verifyState as any).mockReturnValue({ tenantId: "t1" });
    (exchangeLinearCode as any).mockResolvedValue({
      accessToken: "a",
      refreshToken: "r",
      expiresAt: new Date(),
      scope: "read",
    });
    (saveCredentials as any).mockResolvedValue({ id: "cred1" });
    (upsertConnection as any).mockResolvedValue({ id: "conn1" });

    const req = new Request("http://test/callback?code=abc&state=state-token");
    const res = await GET(req as any);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("/settings/connections?connected=linear");
    expect((inngest.send as any)).toHaveBeenCalledWith({
      name: "backfill/start",
      data: { tenantId: "t1", source: "linear" },
    });
    expect(clearStateCookie).toHaveBeenCalled();
  });

  it("rejects when cookie state and query state mismatch", async () => {
    (readStateCookie as any).mockResolvedValue("cookie-state");
    const req = new Request("http://test/callback?code=abc&state=different-state");
    const res = await GET(req as any);
    expect(res.status).toBe(400);
  });

  it("rejects when verifyState throws", async () => {
    (readStateCookie as any).mockResolvedValue("state-token");
    (verifyState as any).mockImplementation(() => { throw new Error("expired"); });
    const req = new Request("http://test/callback?code=abc&state=state-token");
    const res = await GET(req as any);
    expect(res.status).toBe(400);
  });
});
