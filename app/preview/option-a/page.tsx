"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { PhaseHeader, PhaseFooter } from "@/app/onboarding/[employeeId]/_chrome/phase-header";
import { PreviewShell } from "../_chrome/preview-shell";

const STEP_TITLES = ["Project", "Role", "Priorities", "Time", "Team", "Tools", "Files"];
const CURRENT_STEP_IDX = 4; // 0-based; step 5 of 7 = "Team"

const TEAM_EXAMPLES = [
  "3 engineers + 1 designer",
  "5-person product team",
  "Just me — solo founder",
];

export default function OptionAPreview() {
  const [answer, setAnswer] = useState("");

  return (
    <PreviewShell active="option-a">
      <PhaseHeader
        phase={1}
        title="Brief the intern"
        subtitle="Fast typeform-style intake. Tell me what you're building, then drop in anything I should read."
        estimate="~2 min"
      />

      <div className="bg-white border border-paper-edge rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)] flex flex-col min-h-[520px]">
        {/* Step indicator — same as live, step 5 of 7 highlighted */}
        <div className="px-6 pt-5 pb-3 border-b border-paper-edge shrink-0">
          <ol className="flex items-center gap-1.5">
            {STEP_TITLES.map((label, i) => {
              const done = i < CURRENT_STEP_IDX;
              const current = i === CURRENT_STEP_IDX;
              return (
                <li key={label} className="flex-1 min-w-0 flex items-center gap-1.5">
                  <span
                    className={
                      "h-1 flex-1 rounded-full transition-colors " +
                      (done ? "bg-coral" : current ? "bg-coral/50" : "bg-paper-edge/70")
                    }
                  />
                </li>
              );
            })}
          </ol>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
              Step {CURRENT_STEP_IDX + 1} of {STEP_TITLES.length} · {STEP_TITLES[CURRENT_STEP_IDX]}
            </span>
            <span className="text-[10.5px] tabular-nums text-ink-faint">
              {Math.round((CURRENT_STEP_IDX / STEP_TITLES.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Content — question, input, examples, reassurance */}
        <div className="px-6 py-7 flex-1 flex flex-col">
          <div className="space-y-5">
            <Serif as="h2" className="text-[24px] leading-tight">
              Who&apos;s on the team? (optional)
            </Serif>
            <input
              autoFocus
              className="w-full bg-transparent border-b border-paper-edge py-3 text-[18px] focus:outline-none focus:border-coral transition-colors"
              placeholder="3 engineers + 1 designer"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />

            {/* Some examples to spark */}
            <div className="space-y-2.5 pt-2">
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
                Some examples to spark
              </div>
              <div className="flex flex-wrap gap-2">
                {TEAM_EXAMPLES.map(ex => (
                  <Button
                    key={ex}
                    type="button"
                    variant="outline"
                    size="chip"
                    onClick={() => setAnswer(ex)}
                  >
                    {ex}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Alex-voiced reassurance pinned to the bottom */}
          <div className="mt-auto pt-6 flex items-center gap-2">
            <span
              aria-hidden
              className="w-1.5 h-1.5 rounded-full bg-coral shrink-0"
            />
            <Serif italic className="text-[13px] text-ink-faint">
              Don&apos;t worry about getting this perfect — I&apos;ll learn more as we go.
            </Serif>
          </div>
        </div>

        {/* Back / Next */}
        <div className="px-6 pb-5 flex items-center justify-between shrink-0">
          <Button variant="quiet" size="sm">
            Back
          </Button>
          <Button variant="ink" size="md">
            Next
          </Button>
        </div>
      </div>

      <PhaseFooter phase={1} />
    </PreviewShell>
  );
}
