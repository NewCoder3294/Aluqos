import { NextRequest, NextResponse } from "next/server";
import { generateState } from "@/src/oauth/state";
import { setStateCookie } from "@/src/oauth/cookies";
import { buildLinearAuthorizeUrl } from "@/src/oauth/linear";
import { DEMO_USER_ID, MOCK_MODE } from "@/src/db/client";
import { seedLinearDemoData } from "@/src/dev/store";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const tenantId = DEMO_USER_ID;

  // Dev shortcut: skip the Linear OAuth redirect entirely. Seed the in-memory
  // store with a fake connection, 8 plausible activity events, and a completed
  // backfill, then send the user back to the connections page. Lets localhost
  // demos run without LINEAR_CLIENT_ID, Supabase, Inngest, or live Linear.
  if (MOCK_MODE) {
    seedLinearDemoData(tenantId);
    const target = new URL("/settings/connections?connected=linear", req.url);
    return NextResponse.redirect(target);
  }

  // V1 single-user tenant: tenant_id = the demo user. Phase-3+ adds real auth.
  const state = generateState(tenantId, "linear");
  await setStateCookie(state);
  const url = buildLinearAuthorizeUrl(state);
  return NextResponse.redirect(url);
}
