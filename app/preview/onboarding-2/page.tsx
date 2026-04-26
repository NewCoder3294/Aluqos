"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { OnboardingPreviewBanner } from "../_chrome/onboarding-preview-banner";

// Onboarding direction 2 — "Conversational".
// Alex is the warm interlocutor. Avatar on the left, question + chat-style
// input on the right. A slim phase rail of dots sits at the bottom.

const TEAM_EXAMPLES = ["3 engineers + 1 designer", "5-person team", "Just me"];

export default function OnboardingTwoPreview() {
  const [answer, setAnswer] = useState("");

  return (
    <div className="bg-paper min-h-screen flex flex-col">
      <OnboardingPreviewBanner active="onboarding-2" />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="flex items-start gap-6 max-w-[820px] w-full">
          {/* Alex — large avatar + listening pill */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div
              className="h-14 w-14 rounded-full text-white grid place-items-center text-[18px]"
              style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
              aria-label="Alex"
            >
              <Serif>A</Serif>
            </div>
            <StatusPill>Listening…</StatusPill>
          </div>

          {/* Conversation column */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
              Phase 1 · 5 / 7
            </span>

            <Serif as="h1" className="text-[36px] leading-tight font-medium">
              Who&apos;s on the team?
            </Serif>

            <Serif italic className="text-[15px] text-ink-muted">
              Optional — gives me context for who I&apos;m writing for.
            </Serif>

            <div className="h-2" />

            {/* Chat-style pill input */}
            <form
              className="group flex items-center gap-2 bg-white border border-paper-edge rounded-full pl-5 pr-2 py-2 focus-within:border-coral focus-within:ring-2 focus-within:ring-coral/20 transition"
              onSubmit={e => e.preventDefault()}
            >
              <input
                autoFocus
                aria-label="Team answer"
                className="flex-1 bg-transparent text-[16px] text-ink placeholder:text-ink-faint/70 focus:outline-none py-1.5"
                placeholder="Type your answer…"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Send"
                className="h-9 w-9 rounded-full bg-coral text-white grid place-items-center hover:bg-coral-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper transition-colors"
              >
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>

            {/* Soft chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {TEAM_EXAMPLES.map(ex => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setAnswer(ex)}
                  className="text-[13px] px-3 py-1.5 rounded-full bg-paper-hi border border-paper-edge text-ink-muted hover:text-coral-deep hover:border-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Slim phase rail — six dots, 5th filled */}
      <footer className="pb-10 flex flex-col items-center gap-3">
        <div className="flex items-center" aria-hidden>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center">
              <span
                className={
                  "h-2 w-2 rounded-full " +
                  (i === 4 ? "bg-coral" : i < 4 ? "bg-coral/50" : "bg-paper-edge")
                }
              />
              {i < 5 && <span className="w-8 h-px bg-coral/30" />}
            </div>
          ))}
        </div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          Phase 1 — Brief
        </span>
      </footer>
    </div>
  );
}
