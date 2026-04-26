"use server";

import { revalidatePath } from "next/cache";
import { updateOnboarding, logEvent } from "@/src/db/queries";
import { storeAndParseUpload } from "./uploads";

export type BriefData = {
  project: string;
  role: string;
  priorities: string[];
  time_sink: string;
  team?: string;
  tools?: string[];
};

export async function submitBrief(employeeId: string, brief: BriefData, files: Array<{ name: string; type: string; data: ArrayBuffer }>) {
  for (const file of files) {
    await storeAndParseUpload(employeeId, file);
  }
  await updateOnboarding(employeeId, { brief, phase: 2 });
  await logEvent(employeeId, "phase_completed", { phase: 1 });
  revalidatePath(`/onboarding/${employeeId}`);
}

export async function updateOnboardingObservations(employeeId: string, observations: Record<string, unknown>) {
  await updateOnboarding(employeeId, { observations, phase: 4 });
  await logEvent(employeeId, "phase_completed", { phase: 3 });
}
