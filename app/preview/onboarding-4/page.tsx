"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { OnboardingPreviewBanner } from "../_chrome/onboarding-preview-banner";

// Onboarding direction 4 — "Atmospheric editorial".
// Letterboxed serif essay where the user fills in their answer like body
// text. Heavy serif, generous leading, decorative Q. / A. drop-cap accents.

const TEAM_EXAMPLES = [
  "3 engineers + 1 designer",
  "5-person product team",
  "Just me — solo founder",
];

export default function OnboardingFourPreview() {
  const [answer, setAnswer] = useState("");

  return (
    <div className="bg-paper-hi min-h-screen">
      <OnboardingPreviewBanner active="onboarding-4" />

      <article className="max-w-[640px] mx-auto px-6 py-24">
        <Serif italic className="block text-[14px] text-ink-faint">
          Day one — getting acquainted.
        </Serif>

        <hr className="border-t border-paper-edge w-12 my-8 mx-0" />

        <Serif as="h1" className="text-[36px] leading-tight font-medium">
          Brief the intern
        </Serif>

        <div className="mt-12 space-y-7">
          <div>
            <span className="text-[12px] uppercase tracking-[0.18em] text-coral font-medium">
              Q.
            </span>
            <Serif italic as="p" className="mt-2 text-[28px] leading-snug text-ink">
              Who&apos;s on the team?
            </Serif>
          </div>

          <div>
            <span className="text-[12px] uppercase tracking-[0.18em] text-coral font-medium">
              A.
            </span>
            <input
              autoFocus
              aria-label="Team answer"
              className="serif italic mt-2 block w-full bg-transparent border-0 border-b border-transparent focus:border-coral focus:outline-none text-[22px] leading-relaxed py-1 text-ink placeholder:italic placeholder:text-ink-faint/70 transition-colors"
              placeholder="A small team of three — two engineers and one designer…"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
              {TEAM_EXAMPLES.map(ex => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setAnswer(ex)}
                  className="serif italic text-[14px] text-ink-faint hover:text-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper-hi rounded-sm transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-t border-paper-edge w-12 my-12 mx-auto" />

        <footer className="flex items-center justify-between font-sans text-[12px] text-ink-faint">
          <button
            type="button"
            className="uppercase tracking-[0.14em] hover:text-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper-hi rounded-sm transition-colors"
          >
            ← Back
          </button>
          <Serif italic className="text-[14px] text-ink-faint">
            5 / 7
          </Serif>
          <button
            type="button"
            className="uppercase tracking-[0.14em] text-ink hover:text-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper-hi rounded-sm transition-colors"
          >
            Next →
          </button>
        </footer>
      </article>
    </div>
  );
}
