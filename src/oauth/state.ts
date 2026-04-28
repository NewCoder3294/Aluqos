import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TTL_SECONDS = 600; // 10 minutes

type Source = "linear" | "github" | "calendar" | "slack";

function getSecret(): string {
  const s = process.env.OAUTH_STATE_SECRET;
  if (!s || s.length < 32) {
    throw new Error("OAUTH_STATE_SECRET must be set and ≥32 chars");
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function generateState(
  tenantId: string,
  source: Source,
  opts: { ttlSeconds?: number } = {}
): string {
  const ttl = opts.ttlSeconds ?? DEFAULT_TTL_SECONDS;
  const expiresAt = Math.floor(Date.now() / 1000) + ttl;
  const payload = `${tenantId}.${source}.${expiresAt}`;
  const sig = sign(payload);
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verifyState(state: string, expectedSource: Source): { tenantId: string } {
  const [payloadB64, sig] = state.split(".");
  if (!payloadB64 || !sig) throw new Error("invalid state format");
  const payload = Buffer.from(payloadB64, "base64url").toString("utf8");
  const expectedSig = sign(payload);
  const sigBuf = Buffer.from(sig, "base64url");
  const expBuf = Buffer.from(expectedSig, "base64url");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    throw new Error("state signature mismatch");
  }
  const [tenantId, source, expiresAtStr] = payload.split(".");
  if (source !== expectedSource) throw new Error("state source mismatch");
  if (Number(expiresAtStr) < Math.floor(Date.now() / 1000)) {
    throw new Error("state expired");
  }
  return { tenantId };
}
