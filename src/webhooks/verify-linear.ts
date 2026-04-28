import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyLinearSignature(body: string, signature: string): boolean {
  const secret = process.env.LINEAR_WEBHOOK_SECRET;
  if (!secret) throw new Error("LINEAR_WEBHOOK_SECRET not set");
  const expected = createHmac("sha256", secret).update(body).digest("hex");
  let a: Buffer;
  let b: Buffer;
  try {
    a = Buffer.from(signature, "hex");
    b = Buffer.from(expected, "hex");
  } catch {
    return false;
  }
  if (a.length !== b.length || a.length === 0) return false;
  return timingSafeEqual(a, b);
}
