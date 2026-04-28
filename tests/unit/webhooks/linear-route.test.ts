import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/src/webhooks/verify-linear", () => ({
  verifyLinearSignature: vi.fn(),
}));
vi.mock("@/src/connections/queries", () => ({
  isConsentActive: vi.fn(),
  findTenantByExternalAccount: vi.fn(),
}));
vi.mock("@/src/events/normalize-linear", () => ({
  normalizeLinearWebhook: vi.fn(),
}));
vi.mock("@/src/events/insert", () => ({
  insertActivityEvent: vi.fn(),
}));

import { POST } from "@/app/api/webhooks/linear/route";
import { verifyLinearSignature } from "@/src/webhooks/verify-linear";
import { findTenantByExternalAccount, isConsentActive } from "@/src/connections/queries";
import { normalizeLinearWebhook } from "@/src/events/normalize-linear";
import { insertActivityEvent } from "@/src/events/insert";

const validBody = JSON.stringify({
  action: "create",
  type: "Issue",
  data: { id: "1" },
  organizationId: "org-1",
});

describe("Linear webhook route", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 on bad signature without touching the DB", async () => {
    (verifyLinearSignature as any).mockReturnValue(false);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "bad" },
      body: validBody,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
    expect(findTenantByExternalAccount).not.toHaveBeenCalled();
  });

  it("returns 400 when payload has no organizationId", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig" },
      body: '{"action":"create","type":"Issue","data":{"id":"1"}}',
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
    expect(findTenantByExternalAccount).not.toHaveBeenCalled();
  });

  it("returns 404 when no connection matches the organizationId", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    (findTenantByExternalAccount as any).mockResolvedValue(null);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig" },
      body: validBody,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(404);
    expect(findTenantByExternalAccount).toHaveBeenCalledWith("linear", "org-1");
  });

  it("ignores any x-aluqos-tenant header — tenant must come from the connection", async () => {
    // Spoofing attempt: attacker sets x-aluqos-tenant to "victim", but the
    // connection lookup is the only source of truth. Result must be the
    // tenant from the connection, not the header.
    (verifyLinearSignature as any).mockReturnValue(true);
    (findTenantByExternalAccount as any).mockResolvedValue("real-owner");
    (isConsentActive as any).mockResolvedValue(true);
    (normalizeLinearWebhook as any).mockReturnValue({
      tenant_id: "real-owner", source: "linear", source_event_id: "x", verb: "created",
      object: "test", actor: null, context_json: {}, occurred_at: new Date(),
    });
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig", "x-aluqos-tenant": "victim" },
      body: validBody,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(normalizeLinearWebhook).toHaveBeenCalledWith(expect.any(Object), "real-owner");
    expect(isConsentActive).toHaveBeenCalledWith("real-owner", "linear");
  });

  it("returns 200 and skips insert when consent is off", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    (findTenantByExternalAccount as any).mockResolvedValue("t1");
    (isConsentActive as any).mockResolvedValue(false);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig" },
      body: validBody,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(insertActivityEvent).not.toHaveBeenCalled();
  });

  it("normalizes and inserts when consent is active", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    (findTenantByExternalAccount as any).mockResolvedValue("t1");
    (isConsentActive as any).mockResolvedValue(true);
    (normalizeLinearWebhook as any).mockReturnValue({
      tenant_id: "t1", source: "linear", source_event_id: "x", verb: "created",
      object: "test", actor: null, context_json: {}, occurred_at: new Date(),
    });
    (insertActivityEvent as any).mockResolvedValue("row1");
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig" },
      body: validBody,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(insertActivityEvent).toHaveBeenCalled();
  });

  it("returns 200 silently when normalizer returns null (unsupported type)", async () => {
    (verifyLinearSignature as any).mockReturnValue(true);
    (findTenantByExternalAccount as any).mockResolvedValue("t1");
    (isConsentActive as any).mockResolvedValue(true);
    (normalizeLinearWebhook as any).mockReturnValue(null);
    const req = new Request("http://test/webhook", {
      method: "POST",
      headers: { "linear-signature": "sig" },
      body: JSON.stringify({ action: "create", type: "Reaction", data: {}, organizationId: "org-1" }),
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(insertActivityEvent).not.toHaveBeenCalled();
  });
});
