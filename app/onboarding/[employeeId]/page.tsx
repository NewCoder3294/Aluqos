import { serverClient } from "@/src/db/client";
import { WalkthroughClient } from "./walkthrough-client";
import { notFound } from "next/navigation";

export default async function OnboardingPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = await params;
  const sb = serverClient();
  const { data: emp } = await sb.from("employees").select("*").eq("id", employeeId).maybeSingle();
  if (!emp) notFound();
  const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
  return <WalkthroughClient employee={emp} session={session ?? { phase: 1, employee_id: employeeId }} />;
}
