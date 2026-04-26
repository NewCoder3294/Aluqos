"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { PhaseHeader, PhaseFooter } from "@/app/onboarding/[employeeId]/_chrome/phase-header";
import { PreviewShell } from "../_chrome/preview-shell";

const TOOLS = ["Notion", "Slack", "GitHub", "Figma", "Linear", "Asana", "Jira"];

// Three consolidated screens — Phase 1 reframed as "Step 2 of 3" because
// related questions live together rather than one-per-screen.
export default function OptionCPreview() {
  const [team, setTeam] = useState("3 engineers + 1 designer");
  const [tools, setTools] = useState<string[]>(["Notion", "Slack", "GitHub"]);
  const [timeSink, setTimeSink] = useState("Drafting PRDs from scratch every week");

  const toggleTool = (t: string) =>
    setTools(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));

  return (
    <PreviewShell active="option-c">
      <PhaseHeader
        phase={1}
        title="Brief the intern"
        subtitle="Fast typeform-style intake. Tell me what you're building, then drop in anything I should read."
        estimate="~2 min"
      />

      <div className="bg-white border border-paper-edge rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)] flex flex-col min-h-[520px]">
        {/* Compact "Step 2 of 3" indicator — three peers per screen instead of seven */}
        <div className="px-6 pt-5 pb-3 border-b border-paper-edge shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
              Step 2 of 3 · How you work
            </span>
            <span className="text-[10.5px] tabular-nums text-ink-faint">67%</span>
          </div>
        </div>

        {/* Three stacked questions */}
        <div className="px-6 py-6 flex-1 flex flex-col gap-5">
          {/* Q1 — Team */}
          <section className="space-y-3">
            <Serif as="h3" className="text-[18px] leading-tight">
              Who&apos;s on the team?{" "}
              <span className="text-[13px] text-ink-faint font-sans not-italic">
                (optional)
              </span>
            </Serif>
            <input
              className="w-full bg-transparent border-b border-paper-edge py-2 text-[15px] focus:outline-none focus:border-coral transition-colors"
              placeholder="3 engineers + 1 designer"
              value={team}
              onChange={e => setTeam(e.target.value)}
            />
          </section>

          {/* Q2 — Tools */}
          <section className="space-y-3 border-t border-paper-edge/60 pt-4">
            <Serif as="h3" className="text-[18px] leading-tight">
              What tools do you live in?
            </Serif>
            <div className="flex flex-wrap gap-2">
              {TOOLS.map(t => {
                const on = tools.includes(t);
                return (
                  <Button
                    key={t}
                    type="button"
                    variant={on ? "coral" : "outline"}
                    size="chip"
                    onClick={() => toggleTool(t)}
                  >
                    {t}
                  </Button>
                );
              })}
            </div>
          </section>

          {/* Q3 — Time sink */}
          <section className="space-y-3 border-t border-paper-edge/60 pt-4">
            <Serif as="h3" className="text-[18px] leading-tight">
              What&apos;s eating most of your time?
            </Serif>
            <input
              className="w-full bg-transparent border-b border-paper-edge py-2 text-[15px] focus:outline-none focus:border-coral transition-colors"
              placeholder="Drafting PRDs from scratch every week"
              value={timeSink}
              onChange={e => setTimeSink(e.target.value)}
            />
          </section>
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
