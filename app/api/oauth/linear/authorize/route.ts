import { NextRequest, NextResponse } from "next/server";
import { generateState } from "@/src/oauth/state";
import { setStateCookie } from "@/src/oauth/cookies";
import { buildLinearAuthorizeUrl } from "@/src/oauth/linear";
import { DEMO_USER_ID } from "@/src/db/client";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  // V1 single-user tenant: tenant_id = the demo user. Phase-3+ adds real auth.
  const tenantId = DEMO_USER_ID;
  const state = generateState(tenantId, "linear");
  await setStateCookie(state);
  const url = buildLinearAuthorizeUrl(state);
  return NextResponse.redirect(url);
}
