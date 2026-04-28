import { NextRequest, NextResponse } from "next/server";
import { disconnectSource, upsertConnection } from "@/src/connections/queries";
import { revokeCredentials } from "@/src/oauth/credentials";
import { DEMO_USER_ID } from "@/src/db/client";
import type { SourceId } from "@/src/config/sources";

export const runtime = "nodejs";

const VALID: SourceId[] = ["linear", "github", "calendar", "slack"];

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ source: string }> }
) {
  const { source } = await params;
  if (!VALID.includes(source as SourceId)) {
    return NextResponse.json({ error: "invalid_source" }, { status: 400 });
  }
  await disconnectSource(DEMO_USER_ID, source as SourceId);
  await revokeCredentials(DEMO_USER_ID, source as SourceId);
  return NextResponse.json({ ok: true });
}

// PATCH toggles consent without revoking OAuth tokens — pause vs full disconnect.
// Setting consent_active=false stops ingestion (webhook handler short-circuits via
// isConsentActive); =true resumes ingestion using the existing credentials.
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ source: string }> }
) {
  const { source } = await params;
  if (!VALID.includes(source as SourceId)) {
    return NextResponse.json({ error: "invalid_source" }, { status: 400 });
  }
  const body = (await req.json().catch(() => null)) as { consent_active?: unknown } | null;
  if (!body || typeof body.consent_active !== "boolean") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (body.consent_active) {
    await upsertConnection({ tenant_id: DEMO_USER_ID, source: source as SourceId });
  } else {
    await disconnectSource(DEMO_USER_ID, source as SourceId);
  }
  return NextResponse.json({ ok: true, consent_active: body.consent_active });
}
