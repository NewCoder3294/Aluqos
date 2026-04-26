"use server";

import { redirect } from "next/navigation";
import { serverClient } from "@/src/db/client";
import { updateOnboarding, setEmployeeStatus, logEvent } from "@/src/db/queries";

export async function startWorking(
  employeeId: string,
  approvals: Record<string, "approved" | "modified" | "removed">,
  autonomyLevel: "ask_always" | "ask_external" | "just_do_it",
  modifications: Record<string, string>,
) {
  const sb = serverClient();
  await updateOnboarding(employeeId, {
    approvals,
    completed_at: new Date().toISOString(),
    phase: 6,
  });
  await sb.from("employees").update({ autonomy_level: autonomyLevel }).eq("id", employeeId);
  await setEmployeeStatus(employeeId, "working");
  await logEvent(employeeId, "phase_completed", { phase: 5, modifications });
  await logEvent(employeeId, "onboarding_completed");
  redirect(`/work/${employeeId}?bootstrap=1`);
}
