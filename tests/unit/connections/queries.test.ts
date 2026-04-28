import { describe, it, expect, vi, beforeEach } from "vitest";

const fromMock = vi.fn();
vi.mock("@/src/db/client", () => ({
  serverClient: () => ({ from: fromMock }),
  MOCK_MODE: false,
}));

import {
  listConnections,
  upsertConnection,
  disconnectSource,
  findTenantByExternalAccount,
} from "@/src/connections/queries";

describe("connections queries", () => {
  beforeEach(() => fromMock.mockReset());

  it("listConnections returns all rows for a tenant", async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({
            data: [{ id: "c1", tenant_id: "t1", source: "linear", consent_active: true }],
            error: null,
          }),
        }),
      }),
    });
    const rows = await listConnections("t1");
    expect(rows).toHaveLength(1);
    expect(rows[0].source).toBe("linear");
  });

  it("upsertConnection inserts/updates by (tenant_id, source)", async () => {
    fromMock.mockReturnValueOnce({
      upsert: vi.fn().mockReturnValue({
        select: () => ({ single: () => Promise.resolve({ data: { id: "c1" }, error: null }) }),
      }),
    });
    const row = await upsertConnection({ tenant_id: "t1", source: "linear", display_handle: "Aluqos workspace" });
    expect(row.id).toBe("c1");
  });

  it("disconnectSource sets disconnected_at and consent_active=false", async () => {
    fromMock.mockReturnValueOnce({
      update: vi.fn().mockReturnValue({
        eq: () => ({ eq: () => Promise.resolve({ error: null }) }),
      }),
    });
    await expect(disconnectSource("t1", "linear")).resolves.toBeUndefined();
  });

  it("upsertConnection forwards external_account_id when supplied", async () => {
    const upsertSpy = vi.fn().mockReturnValue({
      select: () => ({ single: () => Promise.resolve({ data: { id: "c1" }, error: null }) }),
    });
    fromMock.mockReturnValueOnce({ upsert: upsertSpy });
    await upsertConnection({
      tenant_id: "t1",
      source: "linear",
      external_account_id: "org-xyz",
    });
    const [row] = upsertSpy.mock.calls[0];
    expect(row.external_account_id).toBe("org-xyz");
  });

  it("upsertConnection omits external_account_id when not supplied (preserve on re-upsert)", async () => {
    const upsertSpy = vi.fn().mockReturnValue({
      select: () => ({ single: () => Promise.resolve({ data: { id: "c1" }, error: null }) }),
    });
    fromMock.mockReturnValueOnce({ upsert: upsertSpy });
    await upsertConnection({ tenant_id: "t1", source: "linear" });
    const [row] = upsertSpy.mock.calls[0];
    expect(row).not.toHaveProperty("external_account_id");
  });

  it("findTenantByExternalAccount returns tenant_id on match", async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { tenant_id: "t1" }, error: null }),
          }),
        }),
      }),
    });
    const tenant = await findTenantByExternalAccount("linear", "org-xyz");
    expect(tenant).toBe("t1");
  });

  it("findTenantByExternalAccount returns null on no match", async () => {
    fromMock.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
    });
    const tenant = await findTenantByExternalAccount("linear", "org-xyz");
    expect(tenant).toBeNull();
  });
});
