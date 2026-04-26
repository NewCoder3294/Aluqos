"use server";

import { listUploads, updateOnboarding, logEvent } from "@/src/db/queries";
import { serverClient } from "@/src/db/client";

export async function fetchOnboardingForUnderstand(employeeId: string) {
  const sb = serverClient();
  const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
  const uploads = await listUploads(employeeId);
  return {
    brief: session?.brief ?? {},
    docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
  };
}

export async function persistUnderstood(employeeId: string, summary: unknown) {
  await updateOnboarding(employeeId, { context_summary: summary, phase: 3 });
  await logEvent(employeeId, "phase_completed", { phase: 2 });
}
