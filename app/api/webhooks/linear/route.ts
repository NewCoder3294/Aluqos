import { NextResponse } from "next/server";
import { verifyLinearSignature } from "@/src/webhooks/verify-linear";
import { isConsentActive } from "@/src/connections/queries";
import { normalizeLinearWebhook } from "@/src/events/normalize-linear";
import { insertActivityEvent } from "@/src/events/insert";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const signature = req.headers.get("linear-signature");
  // V1 single-tenant: tenant_id passed via header during dev; in production we'll
  // derive it from the webhook payload's organizationId once OAuth completes.
  const tenantId = req.headers.get("x-aluqos-tenant");
  const body = await req.text();

  if (!signature || !tenantId || !verifyLinearSignature(body, signature)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!(await isConsentActive(tenantId, "linear"))) {
    return NextResponse.json({ status: "consent_off" }, { status: 200 });
  }

  let payload: { action: string; type: string; data: Record<string, unknown> };
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const event = normalizeLinearWebhook(payload, tenantId);
  if (!event) return NextResponse.json({ status: "unsupported_type" }, { status: 200 });

  await insertActivityEvent(event);
  return NextResponse.json({ status: "ingested" }, { status: 200 });
}
