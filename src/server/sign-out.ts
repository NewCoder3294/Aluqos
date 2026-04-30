"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { serverAuthClient } from "@/src/db/auth-client";

const SESSION_COOKIE = "aluqos_session_id";

export async function signOut() {
  try {
    const supabase = await serverAuthClient();
    await supabase.auth.signOut();
  } catch {
    // If Supabase isn't configured (MOCK_MODE) the call throws — sign-out
    // is then a no-op for Supabase. Still clear the legacy cookie below.
  }
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
