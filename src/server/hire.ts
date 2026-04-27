"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MOCK_MODE, DEMO_EMPLOYEE_ID, serverClient } from "@/src/db/client";
import {
  setEmployeeStatus,
  getOrInitOnboarding,
  logEvent,
  updateOnboarding,
} from "@/src/db/queries";

const SESSION_COOKIE = "aluqos_session_id";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

/**
 * Get or create a stable per-visitor session UUID stored in a cookie.
 * Used as `user_id` on the employee row so each browser gets its own
 * isolated demo employee + onboarding state.
 */
async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  const fresh = randomUUID();
  jar.set(SESSION_COOKIE, fresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return fresh;
}

/**
 * Look up the visitor's demo employee, or provision a new one tied to their
 * session cookie. Each browser gets a fresh "Alex" so onboarding state never
 * collides between visitors.
 */
async function getOrCreateSessionEmployee(sessionId: string) {
  const sb = serverClient();
  const { data: existing } = await sb
    .from("employees")
    .select("*")
    .eq("user_id", sessionId)
    .eq("name", "Alex")
    .maybeSingle();
  if (existing) return existing;

  const { data, error } = await sb
    .from("employees")
    .insert({
      user_id: sessionId,
      name: "Alex",
      role: "product_manager",
      bio: "Curious, structured, allergic to vague PRDs.",
      avatar_seed: "alex-pm-coral",
      status: "idle",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function hireProductManager() {
  if (MOCK_MODE) {
    redirect(`/onboarding/${DEMO_EMPLOYEE_ID}?demo=1`);
  }
  try {
    const sessionId = await getOrCreateSessionId();
    const emp = await getOrCreateSessionEmployee(sessionId);
    await setEmployeeStatus(emp.id, "onboarding");
    const session = await getOrInitOnboarding(emp.id);
    // Returning visitor whose previous demo finished (phase >= 6 set by
    // start-working). Reset their session to phase 1 so the magic flow
    // plays fresh on every "Try the demo" click.
    if ((session as { phase?: number } | null)?.phase && (session as { phase: number }).phase > 5) {
      await updateOnboarding(emp.id, {
        phase: 1,
        approvals: null,
        completed_at: null,
        observations: null,
        action_plan: null,
      });
    }
    await logEvent(emp.id, "onboarding_started");
    redirect(`/onboarding/${emp.id}`);
  } catch (err) {
    if ((err as { digest?: string } | null)?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    console.error("[hire] failed, falling back to demo employee", err);
    redirect(`/onboarding/${DEMO_EMPLOYEE_ID}?demo=1`);
  }
}
