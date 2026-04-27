"use server";

import { cookies } from "next/headers";
import { MOCK_MODE, DEMO_EMPLOYEE_ID, serverClient } from "@/src/db/client";

const SESSION_COOKIE = "aluqos_session_id";

/**
 * Verify that the visitor's session cookie owns the given employee row.
 *
 * Server actions take `employeeId` as a parameter (it's in the URL — the
 * client controls it). Without this check, anyone who learns another user's
 * UUID can read or write that user's data because `serverClient()` uses the
 * Supabase service role key, which bypasses Row Level Security.
 *
 * Pass-through cases (no real data to protect):
 *  - MOCK_MODE: no Supabase configured, no persistence.
 *  - DEMO_EMPLOYEE_ID: the public demo employee everyone shares.
 *
 * Throws "UNAUTHORIZED" if no cookie, "FORBIDDEN" if the cookie's session
 * does not own the employee. Server actions surface these as generic errors
 * to the client.
 */
export async function authorizeEmployee(employeeId: string): Promise<void> {
  if (MOCK_MODE) return;
  if (employeeId === DEMO_EMPLOYEE_ID) return;

  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionId) throw new Error("UNAUTHORIZED");

  const sb = serverClient();
  const { data } = await sb
    .from("employees")
    .select("id")
    .eq("id", employeeId)
    .eq("user_id", sessionId)
    .maybeSingle();
  if (!data) throw new Error("FORBIDDEN");
}
