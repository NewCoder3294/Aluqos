import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/src/webhooks/verify-linear", () => ({
  verifyLinearSignature: vi.fn(),
}));
vi.mock("@/src/connections/queries", () => ({
  isConsentActive: vi.fn(),
}));
vi.mock("@/src/events/normalize-linear", () => ({
  normalizeLinearWebhook: vi.fn(),
}));
vi.mock("@/src/events/insert", () => ({
  insertActivityEvent: vi.fn(),
}));

import { POST } from "@/app/api/webhooks/linear/route";
import { verifyLinearSignature } from "@/src/webhooks/verify-linear";
import { isConsentActive } from "@/src/connections/queries";
import { normalizeLinearWebhook } from "@/src/events/normalize-linear";
import { insertActivityEvent } from "@/src/events/insert";

describe("Linear webhook route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 on bad signature", async () => {
    (verifyLinearSignature as any).mockReturnValue(false);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "bad", "x-aluqos-tenant": "t1" },
      body: '{"action":"create","type":"Issue"}',
    });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it("returns 200 and skips insert when consent is off", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    (isConsentActive as any).mockResolvedValue(false);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig", "x-aluqos-tenant": "t1" },
      body: '{"action":"create","type":"Issue","data":{"id":"1"}}',
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(insertActivityEvent).not.toHaveBeenCalled();
  });

  it("normalizes and inserts when consent is active", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    (isConsentActive as any).mockResolvedValue(true);
    (normalizeLinearWebhook as any).mockReturnValue({
      tenant_id: "t1", source: "linear", source_event_id: "x", verb: "created",
      object: "test", actor: null, context_json: {}, occurred_at: new Date(),
    });
    (insertActivityEvent as any).mockResolvedValue("row1");
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig", "x-aluqos-tenant": "t1" },
      body: '{"action":"create","type":"Issue","data":{"id":"1"}}',
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(insertActivityEvent).toHaveBeenCalled();
  });

  it("returns 200 silently when normalizer returns null (unsupported type)", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    (isConsentActive as any).mockResolvedValue(true);
    (normalizeLinearWebhook as any).mockReturnValue(null);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig", "x-aluqos-tenant": "t1" },
      body: '{"action":"create","type":"Reaction","data":{}}',
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(insertActivityEvent).not.toHaveBeenCalled();
  });
});
