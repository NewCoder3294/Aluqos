import { NextResponse } from "next/server";
import { verifyLinearSignature } from "@/src/webhooks/verify-linear";
import { findTenantByExternalAccount, isConsentActive } from "@/src/connections/queries";
import { normalizeLinearWebhook } from "@/src/events/normalize-linear";
import { insertActivityEvent } from "@/src/events/insert";

export const runtime = "nodejs";

// Tenant resolution order:
//   1. HMAC-verify the raw body — rejects bogus traffic before any DB load.
//   2. Parse JSON, extract organizationId from the payload.
//   3. Look up the owning tenant via connections.external_account_id.
// We do NOT trust any client-controllable header (e.g. x-aluqos-tenant) — HMAC
// proves the request body wasn't forged, but it doesn't bind that body to a
// tenant. The connection record does.
export async function POST(req: Request) {
  const signature = req.headers.get("linear-signature");
  const body = await req.text();

  if (!signature || !verifyLinearSignature(body, signature)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let payload: {
    action: string;
    type: string;
    data: Record<string, unknown>;
    organizationId?: string;
  };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const organizationId =
    typeof payload.organizationId === "string" ? payload.organizationId : null;
  if (!organizationId) {
    return NextResponse.json({ error: "missing_organization_id" }, { status: 400 });
  }

  const tenantId = await findTenantByExternalAccount("linear", organizationId);
  if (!tenantId) {
    return NextResponse.json({ error: "unknown_organization" }, { status: 404 });
  }

  if (!(await isConsentActive(tenantId, "linear"))) {
    return NextResponse.json({ status: "consent_off" }, { status: 200 });
  }

  const event = normalizeLinearWebhook(payload, tenantId);
  if (!event) return NextResponse.json({ status: "unsupported_type" }, { status: 200 });

  await insertActivityEvent(event);
  return NextResponse.json({ status: "ingested" }, { status: 200 });
}
