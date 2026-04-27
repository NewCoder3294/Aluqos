"use server";

import { revalidatePath } from "next/cache";
import { updateOnboarding, logEvent } from "@/src/db/queries";
import { storeAndParseUpload } from "./uploads";
import { authorizeEmployee } from "./auth-guard";

export type BriefData = {
  project: string;
  role: string;
  priorities: string[];
  time_sink: string;
  team?: string;
  tools?: string[];
};

export async function submitBrief(employeeId: string, brief: BriefData, files: Array<{ name: string; type: string; data: ArrayBuffer }>) {
  await authorizeEmployee(employeeId);
  for (const file of files) {
    await storeAndParseUpload(employeeId, file);
  }
  await updateOnboarding(employeeId, { brief, phase: 2 });
  await logEvent(employeeId, "phase_completed", { phase: 1 });
  revalidatePath(`/onboarding/${employeeId}`);
}

export async function updateOnboardingObservations(employeeId: string, observations: Record<string, unknown>) {
  await authorizeEmployee(employeeId);
  await updateOnboarding(employeeId, { observations, phase: 4 });
  await logEvent(employeeId, "phase_completed", { phase: 3 });
}
