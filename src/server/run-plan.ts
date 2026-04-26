"use server";

import { listUploads, updateOnboarding, logEvent } from "@/src/db/queries";
import { serverClient, MOCK_MODE } from "@/src/db/client";

export async function fetchPlanInputs(employeeId: string) {
  if (MOCK_MODE) {
    const uploads = await listUploads(employeeId);
    return {
      brief: {},
      context_summary: {},
      observations: {},
      docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
    };
  }
  try {
    const sb = serverClient();
    const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
    const uploads = await listUploads(employeeId);
    return {
      brief: session?.brief ?? {},
      context_summary: session?.context_summary ?? {},
      observations: session?.observations ?? {},
      docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
    };
  } catch {
    const uploads = await listUploads(employeeId);
    return {
      brief: {},
      context_summary: {},
      observations: {},
      docs: uploads.map(u => ({ filename: u.filename, parsed_text: u.parsed_text ?? "" })),
    };
  }
}

export async function persistPlan(employeeId: string, plan: unknown) {
  if (MOCK_MODE) return;
  try {
    await updateOnboarding(employeeId, { action_plan: plan, phase: 5 });
    await logEvent(employeeId, "phase_completed", { phase: 4 });
  } catch {}
}
