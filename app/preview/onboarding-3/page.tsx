"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { OnboardingPreviewBanner } from "../_chrome/onboarding-preview-banner";

// Onboarding direction 3 — "Minimal".
// Maximum quiet. The corner counter is the only progress indicator. The
// question is the entire page. No chips, no avatar, no rails.

export default function OnboardingThreePreview() {
  const [answer, setAnswer] = useState("");

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <OnboardingPreviewBanner active="onboarding-3" />

      {/* Sole indicator: tiny corner counter */}
      <div className="absolute top-12 right-6 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        Phase 1 of 6 · Step 5 of 7
      </div>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[760px] flex flex-col items-center text-center gap-10">
          <Serif as="h1" className="font-medium leading-[1.02]">
            <span style={{ fontSize: "clamp(48px, 8vw, 80px)" }}>
              Who&apos;s on the team?
            </span>
          </Serif>

          <Serif italic className="text-[18px] text-ink-muted">
            Optional — but it&apos;ll help me write to the right people.
          </Serif>

          <input
            autoFocus
            aria-label="Team answer"
            className="w-full bg-transparent border-b-2 border-paper-edge focus:border-coral focus:outline-none text-[24px] py-5 text-center transition-colors text-ink placeholder:text-ink-faint/50"
            placeholder=""
            value={answer}
            onChange={e => setAnswer(e.target.value)}
          />
        </div>
      </main>

      {/* Bottom-center quiet text-link nav */}
      <footer className="pb-12 flex items-center justify-center gap-10 font-sans text-[13px] text-ink-faint">
        <button
          type="button"
          className="hover:text-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm transition-colors"
        >
          ← back
        </button>
        <button
          type="button"
          className="text-ink hover:text-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm transition-colors"
        >
          next →
        </button>
      </footer>
    </div>
  );
}
