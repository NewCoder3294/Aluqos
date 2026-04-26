"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { AvatarCard } from "@/src/components/avatar-card";
import { StatusPill } from "@/src/components/status-pill";
import { PhaseHeader, PhaseFooter } from "@/app/onboarding/[employeeId]/_chrome/phase-header";
import { PreviewShell } from "../_chrome/preview-shell";

const STEP_TITLES = ["Project", "Role", "Priorities", "Time", "Team", "Tools", "Files"];
const CURRENT_STEP_IDX = 4;

// Each fact is a sentence in Alex's italic-serif voice. The {bold} fragment
// is the user's actual input — rendered as upright sans, slightly heavier —
// so Alex's "voice" wraps the user's words.
const FACTS: Array<{ pre: string; bold: string; post: string }> = [
  { pre: "You're building", bold: "Aluqos", post: "— AI employees for non-technical buyers." },
  { pre: "You're the", bold: "Founder,", post: "owning the demo and product surface." },
  { pre: "Top priority:", bold: "ship the YC demo.", post: "" },
  { pre: "Your biggest pain:", bold: "drafting PRDs from scratch every week.", post: "" },
];

export default function OptionBPreview() {
  const [answer, setAnswer] = useState("");

  return (
    <PreviewShell active="option-b">
      <PhaseHeader
        phase={1}
        title="Brief the intern"
        subtitle="Fast typeform-style intake. Tell me what you're building, then drop in anything I should read."
        estimate="~2 min"
      />

      <div className="bg-white border border-paper-edge rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)] flex flex-col min-h-[520px]">
        {/* Step indicator */}
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

        {/* Two-column body — question on the left, notebook rail on the right */}
        <div className="grid grid-cols-[1fr_280px] flex-1">
          {/* Left — focused question + input, vertically centered */}
          <div className="px-6 py-7 flex flex-col justify-center space-y-5">
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
          </div>

          {/* Right — Alex's notebook rail */}
          <div className="border-l border-paper-edge bg-paper-hi/30 px-5 py-6 flex flex-col">
            <div className="text-[11px] uppercase tracking-[0.14em] text-ink-faint font-medium">
              What I&apos;ve learned
            </div>

            <ul className="mt-3 space-y-2.5">
              {FACTS.map((f, i) => (
                <li key={i} className="flex gap-2 items-baseline">
                  <span
                    aria-hidden
                    className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 translate-y-[5px]"
                  />
                  <Serif
                    italic
                    className="text-[13.5px] leading-snug text-ink-muted"
                  >
                    {f.pre}{" "}
                    <span className="not-italic font-sans font-medium text-ink">
                      {f.bold}
                    </span>
                    {f.post && <> {f.post}</>}
                  </Serif>
                </li>
              ))}
            </ul>

            {/* Hairline + listening pulse */}
            <div className="mt-auto pt-5">
              <div className="border-t border-paper-edge/70 pt-4 flex items-center justify-between gap-3">
                <AvatarCard
                  name="Alex"
                  role="AI Product Manager"
                  size="sm"
                />
                <StatusPill active>Listening…</StatusPill>
              </div>
            </div>
          </div>
        </div>

        {/* Footer spans the full card width */}
        <div className="px-6 pb-5 pt-4 border-t border-paper-edge flex items-center justify-between shrink-0">
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
