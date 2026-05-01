import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverAuthClient } from "@/src/db/auth-server";
import { MOCK_MODE, serverClient } from "@/src/db/client";
import { saveCredentials } from "@/src/oauth/credentials";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SESSION_COOKIE = "aluqos_session_id";

// Google access tokens last 3600s. Supabase exposes provider_token but not its
// expiry, so we assume the standard 1-hour lifetime — the Gmail client
// refreshes early on its own anyway.
const GOOGLE_TOKEN_LIFETIME_MS = 3600 * 1000;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");
  const next = url.searchParams.get("next") || "/dashboard";

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorParam)}`, url.origin)
    );
  }
  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", url.origin));
  }

  const supabase = await serverAuthClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session || !data.user) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(error?.message ?? "exchange_failed")}`,
        url.origin
      )
    );
  }

  const { user, session } = data;

  // Persist the Gmail provider token so server code can call Gmail later.
  // Supabase only surfaces provider_token / provider_refresh_token on this
  // exchange — they aren't readable from getSession() afterwards. Miss this
  // window and the only recovery is re-running the OAuth flow.
  if (session.provider_token) {
    try {
      await saveCredentials({
        tenant_id: user.id,
        source: "gmail",
        access_token: session.provider_token,
        refresh_token: session.provider_refresh_token ?? null,
        expires_at: new Date(Date.now() + GOOGLE_TOKEN_LIFETIME_MS),
        scope: "https://www.googleapis.com/auth/gmail.readonly",
      });
    } catch (err) {
      console.warn("auth/callback: saveCredentials failed", err);
      // Don't block sign-in on credential persistence; the dashboard will
      // surface a "reconnect Gmail" affordance when the row is missing.
    }
  }

  // Mirror the auth user into public.profiles + a per-user employees row so
  // the existing demo-shaped queries (which expect an employees row keyed by
  // user_id) keep working for real users.
  if (!MOCK_MODE) {
    try {
      const sb = serverClient();
      const meta = (user.user_metadata ?? {}) as {
        full_name?: string;
        name?: string;
        avatar_url?: string;
        picture?: string;
      };
      const fullName = meta.full_name ?? meta.name ?? user.email ?? "Aluqos user";
      const avatarUrl = meta.avatar_url ?? meta.picture ?? null;

      await sb.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
          avatar_url: avatarUrl,
          auth_provider: "google",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      // Employees has no unique constraint on user_id, so check before insert.
      const { data: existing } = await sb
        .from("employees")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!existing) {
        await sb.from("employees").insert({
          user_id: user.id,
          name: fullName,
          role: "self",
          status: "idle",
        });
      }
    } catch (err) {
      console.warn("auth/callback: profile/employee upsert failed", err);
    }
  }

  // Set the legacy session cookie so authorizeEmployee() and any other code
  // reading aluqos_session_id continues to work without changes.
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.redirect(new URL(next, url.origin));
}
