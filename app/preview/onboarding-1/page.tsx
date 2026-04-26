"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { OnboardingPreviewBanner } from "../_chrome/onboarding-preview-banner";

// Onboarding direction 1 — "Linear-style".
// Editorial onboarding with a thin top progress bar and a big centered
// question. No sidebar, no top toolbar, no dashboard chrome whatsoever.
// The whitespace is the design.

const TEAM_EXAMPLES = [
  "3 engineers + 1 designer",
  "5-person product team",
  "Just me — solo founder",
];

const PROGRESS_PCT = (5 / 7) * 100;

export default function OnboardingOnePreview() {
  const [answer, setAnswer] = useState("");

  return (
    <div className="bg-paper min-h-screen relative">
      <OnboardingPreviewBanner active="onboarding-1" />

      {/* Thin coral progress rail anchored just under the banner. */}
      <div
        className="absolute left-0 right-0 h-[3px] bg-paper-edge/60"
        style={{ top: 32 }}
        aria-hidden
      >
        <div
          className="h-full bg-coral transition-all"
          style={{ width: `${PROGRESS_PCT}%` }}
        />
      </div>

      <main className="min-h-screen flex items-center justify-center px-6 -mt-8">
        <div className="w-full max-w-[640px] flex flex-col items-center text-center gap-7">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
            Phase 1 · Step 5 of 7
          </span>

          <Serif as="h1" className="font-medium leading-[1.05]">
            {/* Fluid clamp 32 → 56px */}
            <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
              Who&apos;s on the team?
            </span>
          </Serif>

          <Serif italic className="text-[16px] text-ink-muted">
            Optional — but it&apos;ll help me write to the right people.
          </Serif>

          <input
            autoFocus
            aria-label="Team answer"
            className="w-full max-w-[640px] bg-transparent border-b-2 border-paper-edge focus:border-coral focus:outline-none text-[22px] py-3 text-center transition-colors text-ink placeholder:text-ink-faint/60"
            placeholder="Type your answer…"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />

          <div className="flex flex-wrap justify-center gap-2 pt-1">
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
      </main>

      {/* Bottom-right quiet phase + nav cluster */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 font-sans text-[11px] text-ink-faint">
        <span className="tabular-nums uppercase tracking-[0.14em]">1 / 6</span>
        <span className="opacity-40">·</span>
        <Button variant="quiet" size="sm">Back</Button>
        <Button variant="ink" size="sm">Next</Button>
      </div>
    </div>
  );
}
