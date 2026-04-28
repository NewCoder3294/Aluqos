import { describe, it, expect, vi, beforeEach } from "vitest";

const rpcMock = vi.fn();
const fromMock = vi.fn();
vi.mock("@/src/db/client", () => ({
  serverClient: () => ({
    rpc: rpcMock,
    from: (table: string) => {
      fromMock(table);
      return {
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { decrypted_secret: "v" }, error: null }) }) }),
        delete: () => ({ eq: async () => ({ error: null }) }),
      };
    },
  }),
}));

import { storeSecret, readSecret, revokeSecret } from "@/src/oauth/vault";

describe("vault", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    fromMock.mockReset();
  });

  it("stores a secret via vault_create_secret RPC", async () => {
    rpcMock.mockResolvedValueOnce({ data: "11111111-1111-1111-1111-111111111111", error: null });
    const id = await storeSecret("token-abc", {
      tenant_id: "00000000-0000-0000-0000-000000000001",
      source: "linear",
      kind: "access_token",
    });
    expect(id).toBe("11111111-1111-1111-1111-111111111111");
    expect(rpcMock).toHaveBeenCalledWith("vault_create_secret", expect.objectContaining({
      p_secret: "token-abc",
      p_name: "00000000-0000-0000-0000-000000000001:linear:access_token",
    }));
  });

  it("reads a secret by id from decrypted_secrets", async () => {
    const value = await readSecret("11111111-1111-1111-1111-111111111111");
    expect(value).toBe("v");
    expect(fromMock).toHaveBeenCalledWith("decrypted_secrets");
  });

  it("revokes a secret idempotently", async () => {
    await expect(revokeSecret("11111111-1111-1111-1111-111111111111")).resolves.toBeUndefined();
  });
});
