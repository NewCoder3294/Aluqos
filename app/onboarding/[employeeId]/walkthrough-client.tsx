"use client";

import { useEffect, useState } from "react";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { TopToolbar } from "@/src/components/top-toolbar";
import { OnboardingRail } from "./_chrome/onboarding-rail";
import { OnboardingContext } from "./_chrome/onboarding-context";
import {
  Phase1Brief, Phase2Reading, Phase3Observe, Phase4Plan, Phase5Approve,
} from "./_phases";

type UploadLite = { id: string; filename: string };

export function WalkthroughClient({
  employee,
  session,
}: {
  employee: { id: string; name: string; role: string };
  session: { phase?: number; employee_id: string };
}) {
  const phase = useWalkthrough(s => s.phase);
  const setPhase = useWalkthrough(s => s.setPhase);

  // Local mock list of uploads for the right rail. Phase 1 + Phase 3 add to it
  // through the file pickers; for the demo path we seed it once entering Phase 2.
  const [uploads, setUploads] = useState<UploadLite[]>([]);

  useEffect(() => {
    if (session.phase) setPhase(session.phase as Phase);
  }, [session.phase, setPhase]);

  // When we enter Phase 2+ and we have no uploads tracked locally, drop in a
  // mock list so the right-rail "Gathered" tab feels populated. Real uploads
  // would replace this once the upload server actions surface filenames here.
  useEffect(() => {
    if (phase >= 2 && uploads.length === 0) {
      setUploads([
        { id: "u-1", filename: "q2-roadmap.pdf" },
        { id: "u-2", filename: "issue-47-brief.md" },
        { id: "u-3", filename: "design-review-notes.docx" },
        { id: "u-4", filename: "voice-and-tone.md" },
      ]);
    }
  }, [phase, uploads.length]);

  return (
    <main className="h-screen overflow-hidden flex flex-col bg-paper">
      <TopToolbar
        employeeName={employee.name}
        centerLabel="Onboarding"
        trail={[`Phase ${phase}`]}
      />
      <div className="grid grid-cols-[280px_1fr_340px] flex-1 min-h-0 overflow-hidden">
        <OnboardingRail
          employeeName={employee.name}
          uploadCount={uploads.length}
        />

        {/* Center column — phase content */}
        <section className="h-full overflow-y-auto">
          <div className="max-w-[680px] mx-auto px-6 py-8 space-y-5">
            {phase === 1 && <Phase1Brief employeeId={employee.id} />}
            {phase === 2 && <Phase2Reading employeeId={employee.id} />}
            {phase === 3 && <Phase3Observe employeeId={employee.id} />}
            {phase === 4 && <Phase4Plan employeeId={employee.id} />}
            {phase === 5 && <Phase5Approve employeeId={employee.id} />}
          </div>
        </section>

        <OnboardingContext uploads={uploads} />
      </div>
    </main>
  );
}
