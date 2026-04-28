import { describe, it, expect } from "vitest";
import { normalizeLinearWebhook } from "@/src/events/normalize-linear";

describe("normalizeLinearWebhook", () => {
  it("normalizes an Issue create event", () => {
    const payload = {
      action: "create",
      type: "Issue",
      data: {
        id: "abc-123",
        title: "Fix login race condition",
        identifier: "ENG-47",
        state: { name: "Todo" },
        createdAt: "2026-04-27T10:00:00Z",
        creator: { name: "Aman", email: "aman@example.com" },
      },
    };
    const event = normalizeLinearWebhook(payload, "tenant-1");
    expect(event).toEqual({
      tenant_id: "tenant-1",
      source: "linear",
      source_event_id: "linear:Issue:create:abc-123:2026-04-27T10:00:00Z",
      actor: "aman@example.com",
      verb: "created",
      object: "Fix login race condition",
      context_json: expect.objectContaining({
        identifier: "ENG-47",
        type: "Issue",
        state: "Todo",
      }),
      occurred_at: new Date("2026-04-27T10:00:00Z"),
    });
  });

  it("sanitizes the title before storing", () => {
    const payload = {
      action: "update",
      type: "Issue",
      data: {
        id: "abc-456",
        title: "Has​zero-width‮attack",
        identifier: "ENG-48",
        state: { name: "In Progress" },
        updatedAt: "2026-04-27T11:00:00Z",
        creator: { name: "Aman", email: "aman@example.com" },
      },
    };
    const event = normalizeLinearWebhook(payload, "tenant-1");
    expect(event!.object).toBe("Haszero-widthattack");
  });

  it("normalizes a Comment create event", () => {
    const payload = {
      action: "create",
      type: "Comment",
      data: {
        id: "comment-1",
        body: "LGTM",
        createdAt: "2026-04-27T12:00:00Z",
        user: { name: "Aman", email: "aman@example.com" },
        issue: { id: "abc-123", title: "Fix login", identifier: "ENG-47" },
      },
    };
    const event = normalizeLinearWebhook(payload, "tenant-1");
    expect(event!.verb).toBe("commented");
    expect(event!.object).toBe("LGTM");
    expect(event!.context_json.issue_identifier).toBe("ENG-47");
  });

  it("returns null for an unsupported event type", () => {
    const payload = { action: "create", type: "Reaction", data: {} };
    expect(normalizeLinearWebhook(payload, "tenant-1")).toBeNull();
  });
});
