"use server";

import { redirect } from "next/navigation";
import { MOCK_MODE, DEMO_EMPLOYEE_ID } from "@/src/db/client";
import { getDemoEmployee, setEmployeeStatus, getOrInitOnboarding, logEvent } from "@/src/db/queries";

export async function hireProductManager() {
  if (MOCK_MODE) {
    redirect(`/onboarding/${DEMO_EMPLOYEE_ID}?demo=1`);
  }
  try {
    const emp = await getDemoEmployee();
    if (!emp) throw new Error("Demo employee not seeded. Run pnpm db:seed.");
    await setEmployeeStatus(emp.id, "onboarding");
    await getOrInitOnboarding(emp.id);
    await logEvent(emp.id, "onboarding_started");
    redirect(`/onboarding/${emp.id}`);
  } catch (err) {
    // If anything bombs (e.g. Supabase reachable but tables missing), fall back to demo path.
    if ((err as { digest?: string } | null)?.digest?.startsWith("NEXT_REDIRECT")) throw err;
    redirect(`/onboarding/${DEMO_EMPLOYEE_ID}?demo=1`);
  }
}
