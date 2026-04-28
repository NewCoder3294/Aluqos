import { describe, it, expect, beforeAll, vi } from "vitest";
import { buildLinearAuthorizeUrl, exchangeLinearCode, refreshLinearToken } from "@/src/oauth/linear";

beforeAll(() => {
  process.env.LINEAR_CLIENT_ID = "test-client-id";
  process.env.LINEAR_CLIENT_SECRET = "test-client-secret";
  process.env.NEXT_PUBLIC_BASE_URL = "https://test.aluqos.com";
});

describe("Linear OAuth", () => {
  it("builds an authorize URL with required params", () => {
    const url = buildLinearAuthorizeUrl("state-token-xyz");
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe("https://linear.app/oauth/authorize");
    expect(parsed.searchParams.get("client_id")).toBe("test-client-id");
    expect(parsed.searchParams.get("redirect_uri")).toBe("https://test.aluqos.com/api/oauth/linear/callback");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("scope")).toBe("read");
    expect(parsed.searchParams.get("state")).toBe("state-token-xyz");
  });

  it("exchanges a code for tokens", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({
        access_token: "linear-access",
        refresh_token: "linear-refresh",
        expires_in: 3600,
        scope: "read",
      }), { status: 200, headers: { "content-type": "application/json" } })
    );
    const tokens = await exchangeLinearCode("auth-code-123");
    expect(tokens.accessToken).toBe("linear-access");
    expect(tokens.refreshToken).toBe("linear-refresh");
    expect(tokens.expiresAt).toBeInstanceOf(Date);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.linear.app/oauth/token",
      expect.objectContaining({ method: "POST" })
    );
    fetchMock.mockRestore();
  });

  it("throws on Linear OAuth error response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "invalid_grant", error_description: "bad code" }),
        { status: 400, headers: { "content-type": "application/json" } })
    );
    await expect(exchangeLinearCode("bad-code")).rejects.toThrow(/invalid_grant/);
    fetchMock.mockRestore();
  });

  it("refreshes a token and returns new tokens", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({
        access_token: "linear-access-2",
        refresh_token: "linear-refresh-2",
        expires_in: 3600,
        scope: "read",
      }), { status: 200, headers: { "content-type": "application/json" } })
    );
    const tokens = await refreshLinearToken("old-refresh");
    expect(tokens.accessToken).toBe("linear-access-2");
    fetchMock.mockRestore();
  });
});
