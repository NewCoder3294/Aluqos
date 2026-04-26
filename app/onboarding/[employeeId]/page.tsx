import { serverClient, MOCK_MODE, fakeEmployee } from "@/src/db/client";
import { WalkthroughClient } from "./walkthrough-client";

export default async function OnboardingPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = await params;

  if (MOCK_MODE) {
    return (
      <WalkthroughClient
        employee={{ ...fakeEmployee(), id: employeeId }}
        session={{ phase: 1, employee_id: employeeId }}
      />
    );
  }

  try {
    const sb = serverClient();
    const { data: emp } = await sb.from("employees").select("*").eq("id", employeeId).maybeSingle();
    if (!emp) {
      return (
        <WalkthroughClient
          employee={{ ...fakeEmployee(), id: employeeId }}
          session={{ phase: 1, employee_id: employeeId }}
        />
      );
    }
    const { data: session } = await sb.from("onboarding_sessions").select("*").eq("employee_id", employeeId).maybeSingle();
    return <WalkthroughClient employee={emp} session={session ?? { phase: 1, employee_id: employeeId }} />;
  } catch {
    return (
      <WalkthroughClient
        employee={{ ...fakeEmployee(), id: employeeId }}
        session={{ phase: 1, employee_id: employeeId }}
      />
    );
  }
}
