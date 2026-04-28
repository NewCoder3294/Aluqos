import { describe, it, expect, vi, beforeEach } from "vitest";

const fromMock = vi.fn();
vi.mock("@/src/db/client", () => ({ serverClient: () => ({ from: fromMock }), MOCK_MODE: false }));

import { insertActivityEvent } from "@/src/events/insert";

describe("insertActivityEvent", () => {
  beforeEach(() => fromMock.mockReset());

  it("inserts a new event and returns the row id", async () => {
    fromMock.mockReturnValueOnce({
      upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: "row1" }, error: null }) }) }),
    });
    const id = await insertActivityEvent({
      tenant_id: "t1",
      source: "linear",
      source_event_id: "linear:Issue:create:abc:2026",
      actor: "aman@example.com",
      verb: "created",
      object: "Fix login",
      context_json: {},
      occurred_at: new Date("2026-04-27T10:00:00Z"),
    });
    expect(id).toBe("row1");
  });

  it("treats unique-violation on (source, source_event_id) as a successful no-op", async () => {
    fromMock.mockReturnValueOnce({
      upsert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: "existing" }, error: null }) }) }),
    });
    const id = await insertActivityEvent({
      tenant_id: "t1",
      source: "linear",
      source_event_id: "linear:Issue:create:abc:2026",
      actor: null,
      verb: "created",
      object: null,
      context_json: {},
      occurred_at: new Date(),
    });
    expect(id).toBe("existing");
  });
});
