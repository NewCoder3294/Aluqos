import { NextResponse } from "next/server";
import { readStateCookie, clearStateCookie } from "@/src/oauth/cookies";
import { verifyState } from "@/src/oauth/state";
import { exchangeLinearCode } from "@/src/oauth/linear";
import { saveCredentials } from "@/src/oauth/credentials";
import { upsertConnection } from "@/src/connections/queries";
import { inngest } from "@/src/inngest/client";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = await readStateCookie();

  if (!code || !state || !cookieState || cookieState !== state) {
    return NextResponse.json({ error: "invalid_callback" }, { status: 400 });
  }

  let tenantId: string;
  try {
    ({ tenantId } = verifyState(state, "linear"));
  } catch (err) {
    return NextResponse.json(
      { error: "state_verify_failed", detail: String(err) },
      { status: 400 }
    );
  }

  try {
    const tokens = await exchangeLinearCode(code);
    await saveCredentials({
      tenant_id: tenantId,
      source: "linear",
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      expires_at: tokens.expiresAt,
      scope: tokens.scope,
    });
    await upsertConnection({ tenant_id: tenantId, source: "linear" });
    await inngest.send({
      name: "backfill/start",
      data: { tenantId, source: "linear" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "exchange_failed", detail: String(err) },
      { status: 502 }
    );
  }

  await clearStateCookie();
  return NextResponse.redirect(
    new URL("/settings/connections?connected=linear", url.origin)
  );
}
