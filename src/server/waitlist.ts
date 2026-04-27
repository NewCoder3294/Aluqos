"use server";

import { headers } from "next/headers";
import { MOCK_MODE, serverClient } from "@/src/db/client";
import { checkRateLimit } from "./ratelimit";

export type WaitlistResult =
  | { status: "ok"; position: number }
  | { status: "duplicate"; position: number }
  | { status: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  _prev: WaitlistResult | null,
  formData: FormData,
): Promise<WaitlistResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  const company = String(formData.get("company") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const source = String(formData.get("source") ?? "landing").trim() || "landing";
  const honeypot = String(formData.get("website") ?? "").trim();

  // Honeypot — bots typically fill this hidden field. Lie back so they don't retry.
  if (honeypot) return { status: "ok", position: 1 };

  if (!email || !EMAIL_RE.test(email) || email.length > 320) {
    return { status: "error", message: "Enter a valid email address." };
  }

  if (MOCK_MODE) {
    // No DB configured — pretend it worked so dev still flows.
    return { status: "ok", position: 1 };
  }

  try {
    const sb = serverClient();
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const ua = h.get("user-agent") ?? null;

    // Rate limit: 5 signups per minute per IP. Beyond that, ask politely to slow down.
    const limit = await checkRateLimit(`waitlist:${ip ?? "unknown"}`, 5, 60_000);
    if (!limit.ok) {
      return {
        status: "error",
        message: `Slow down — try again in ${limit.retryAfter}s.`,
      };
    }

    const { error: insertErr } = await sb
      .from("signups")
      .insert({ email, name, company, notes, source, ip, user_agent: ua });

    if (insertErr && insertErr.code === "23505") {
      // Unique-violation: already on the list.
      const { count } = await sb
        .from("signups")
        .select("*", { count: "exact", head: true });
      return { status: "duplicate", position: count ?? 1 };
    }
    if (insertErr) {
      console.error("[waitlist] insert error", insertErr);
      return { status: "error", message: "Something went wrong. Try again?" };
    }

    const { count } = await sb
      .from("signups")
      .select("*", { count: "exact", head: true });
    return { status: "ok", position: count ?? 1 };
  } catch (err) {
    console.error("[waitlist] unexpected", err);
    return { status: "error", message: "Couldn't join the list. Try again?" };
  }
}
