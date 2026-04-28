import { describe, it, expect, beforeAll } from "vitest";
import { createHmac } from "node:crypto";
import { verifyLinearSignature } from "@/src/webhooks/verify-linear";

const SECRET = "test-webhook-secret";

beforeAll(() => {
  process.env.LINEAR_WEBHOOK_SECRET = SECRET;
});

function sign(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("hex");
}

describe("verifyLinearSignature", () => {
  it("accepts a correctly signed body", () => {
    const body = '{"action":"create","type":"Issue"}';
    expect(verifyLinearSignature(body, sign(body))).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = '{"action":"create","type":"Issue"}';
    const tampered = '{"action":"delete","type":"Issue"}';
    expect(verifyLinearSignature(tampered, sign(body))).toBe(false);
  });

  it("rejects a wrong signature", () => {
    expect(verifyLinearSignature('{"k":"v"}', "deadbeef")).toBe(false);
  });
});
