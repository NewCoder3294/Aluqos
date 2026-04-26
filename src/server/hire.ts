"use server";

import { redirect } from "next/navigation";
import { getDemoEmployee, setEmployeeStatus, getOrInitOnboarding, logEvent } from "@/src/db/queries";

export async function hireProductManager() {
  const emp = await getDemoEmployee();
  if (!emp) throw new Error("Demo employee not seeded. Run pnpm db:seed.");
  await setEmployeeStatus(emp.id, "onboarding");
  await getOrInitOnboarding(emp.id);
  await logEvent(emp.id, "onboarding_started");
  redirect(`/onboarding/${emp.id}`);
}
