import { describe, it, expect, vi, beforeEach } from "vitest";

const { fromMock, storeMock, readMock, revokeMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  storeMock: vi.fn(),
  readMock: vi.fn(),
  revokeMock: vi.fn(),
}));
vi.mock("@/src/db/client", () => ({ serverClient: () => ({ from: fromMock }), MOCK_MODE: false }));
vi.mock("@/src/oauth/vault", () => ({
  storeSecret: storeMock,
  readSecret: readMock,
  revokeSecret: revokeMock,
}));

import { saveCredentials, getDecryptedTokens, revokeCredentials } from "@/src/oauth/credentials";

describe("oauth credentials", () => {
  beforeEach(() => {
    fromMock.mockReset();
    storeMock.mockReset();
    readMock.mockReset();
    revokeMock.mockReset();
  });

  it("saveCredentials stores tokens in Vault and writes the row", async () => {
    storeMock.mockResolvedValueOnce("access-secret-id");
    storeMock.mockResolvedValueOnce("refresh-secret-id");
    fromMock.mockReturnValueOnce({
      upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: "row1" }, error: null }) }) }),
    });
    const row = await saveCredentials({
      tenant_id: "t1",
      source: "linear",
      access_token: "tok-a",
      refresh_token: "tok-r",
      expires_at: new Date("2026-12-01"),
      scope: "read",
    });
    expect(storeMock).toHaveBeenCalledTimes(2);
    expect(row.id).toBe("row1");
  });

  it("getDecryptedTokens reads via Vault", async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({
              data: {
                access_token_secret_id: "a",
                refresh_token_secret_id: "r",
                expires_at: "2026-12-01",
                scope: "read",
              },
              error: null,
            }),
          }),
        }),
      }),
    });
    readMock.mockResolvedValueOnce("tok-a");
    readMock.mockResolvedValueOnce("tok-r");
    const tokens = await getDecryptedTokens("t1", "linear");
    expect(tokens?.access_token).toBe("tok-a");
    expect(tokens?.refresh_token).toBe("tok-r");
  });

  it("revokeCredentials revokes vault secrets and clears the row", async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({
              data: { access_token_secret_id: "a", refresh_token_secret_id: "r" },
              error: null,
            }),
          }),
        }),
      }),
    });
    fromMock.mockReturnValueOnce({
      delete: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
    });
    await revokeCredentials("t1", "linear");
    expect(revokeMock).toHaveBeenCalledWith("a");
    expect(revokeMock).toHaveBeenCalledWith("r");
  });
});
