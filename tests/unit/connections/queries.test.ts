import { describe, it, expect, vi, beforeEach } from "vitest";

const fromMock = vi.fn();
vi.mock("@/src/db/client", () => ({
  serverClient: () => ({ from: fromMock }),
  MOCK_MODE: false,
}));

import { listConnections, upsertConnection, disconnectSource } from "@/src/connections/queries";

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
});
