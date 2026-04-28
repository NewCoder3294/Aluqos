import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee, DEMO_EMPLOYEE_ID } from "@/src/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";
import { DashboardShell } from "@/app/work/[employeeId]/_dashboard/dashboard-shell";

export default async function SettingsPage() {
  const employeeId = DEMO_EMPLOYEE_ID;

  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = {
      emp: { ...fakeEmployee(), id: employeeId },
      session: null,
      uploads: [],
      prds: [],
    };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  return (
    <DashboardShell
      employeeId={emp.id}
      employeeName={emp.name}
      activeNav="alex-settings"
    >
      <div className="space-y-6 max-w-3xl">
        <div>
          <Serif as="h1" className="text-[28px] leading-[1.15] tracking-[-0.01em]">
            Settings
          </Serif>
          <p className="text-[14px] text-ink-faint mt-1">
            Tune what {emp.name} knows and how {emp.name} works.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-coral-deep" />
              <CardTitle>Detailed setup</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[14px] leading-[1.55] text-ink-muted max-w-[60ch]">
              Walk through the long-form configuration: project brief, work
              patterns, action plan, and autonomy. Use this when you want to
              fine-tune what the magical onboarding skipped over.
            </p>
            <div className="mt-5">
              <Button variant="outline" size="md" asChild>
                <Link href="/settings/setup">
                  Open detailed setup <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
