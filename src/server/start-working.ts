"use server";

import { redirect } from "next/navigation";
import { serverClient, MOCK_MODE } from "@/src/db/client";
import { updateOnboarding, setEmployeeStatus, logEvent } from "@/src/db/queries";

export async function startWorking(
  employeeId: string,
  approvals: Record<string, "approved" | "modified" | "removed">,
  autonomyLevel: "ask_always" | "ask_external" | "just_do_it",
  modifications: Record<string, string>,
) {
  if (MOCK_MODE) {
    redirect(`/work/${employeeId}/prd/new-bootstrap?bootstrap=1`);
  }
  try {
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
  } catch (err) {
    if ((err as { digest?: string } | null)?.digest?.startsWith("NEXT_REDIRECT")) throw err;
  }
  redirect(`/work/${employeeId}?bootstrap=1`);
}
