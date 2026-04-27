"use server";

import { redirect } from "next/navigation";
import { serverClient, MOCK_MODE } from "@/src/db/client";
import { updateOnboarding, setEmployeeStatus, logEvent } from "@/src/db/queries";
import { seedDemoFirstPrd } from "@/src/server/run-prd";
import { authorizeEmployee } from "./auth-guard";
import {
  PRD_DEMO_SECTIONS,
  PRD_DEMO_SOURCE_ISSUE,
  PRD_TITLE,
} from "@/src/data/onboarding-script";

export async function startWorking(
  employeeId: string,
  approvals: Record<string, "approved" | "modified" | "removed">,
  autonomyLevel: "ask_always" | "ask_external" | "just_do_it",
  modifications: Record<string, string>,
) {
  await authorizeEmployee(employeeId);
  if (MOCK_MODE) {
    redirect(`/work/${employeeId}`);
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
    // Plant the magical-onboarding PRD as the user's first PRD so /work shows
    // exactly what they just watched stream — no drift, no second generation.
    await seedDemoFirstPrd(
      employeeId,
      PRD_TITLE,
      PRD_DEMO_SOURCE_ISSUE,
      PRD_DEMO_SECTIONS,
    );
  } catch (err) {
    if ((err as { digest?: string } | null)?.digest?.startsWith("NEXT_REDIRECT")) throw err;
  }
  redirect(`/work/${employeeId}?bootstrap=1`);
}
