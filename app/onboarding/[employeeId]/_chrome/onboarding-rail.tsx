"use client";

import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { toast } from "@/src/components/toast";
import { Check, ExternalLink } from "lucide-react";

const PHASES: Array<{ n: Phase; name: string; subtitle: string }> = [
  { n: 1, name: "Brief", subtitle: "Tell me about your project" },
  { n: 2, name: "Reading", subtitle: "I read your docs" },
  { n: 3, name: "Observe", subtitle: "How you like to work" },
  { n: 4, name: "Plan", subtitle: "What I'll own" },
  { n: 5, name: "Approve", subtitle: "Your call" },
  { n: 6, name: "Begin", subtitle: "Getting started" },
];

export function OnboardingRail({
  employeeName,
  uploadCount,
  elapsedLabel = "0:42",
}: {
  employeeName: string;
  uploadCount: number;
  /** Mock elapsed time string e.g. "0:42" */
  elapsedLabel?: string;
}) {
  const phase = useWalkthrough(s => s.phase);

  return (
    <aside className="bg-paper-hi border-r border-paper-edge h-full overflow-y-auto flex flex-col">
      {/* Header band — identity anchor */}
      <div className="px-4 pt-4 pb-3 border-b border-paper-edge">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full text-white grid place-items-center shrink-0"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            <Serif className="text-[16px]">{employeeName.charAt(0)}</Serif>
          </div>
          <div className="min-w-0">
            <Serif className="text-[15px] block truncate leading-tight">{employeeName}</Serif>
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium leading-tight mt-0.5">
              AI Product Manager
            </div>
          </div>
        </div>
        <div className="mt-2.5">
          <StatusPill active>{onboardingVerb(phase)}</StatusPill>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3 flex-1">
        {/* Phase progress */}
        <Card tone="muted">
          <div className="flex items-center justify-between !py-2.5 !px-4 border-b border-paper-edge/70">
            <div className="flex items-center gap-2">
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
                Onboarding
              </span>
            </div>
            <span className="text-[10.5px] tabular-nums text-ink-faint">
              Phase {phase} of 6
            </span>
          </div>
          <CardContent compact className="!p-3">
            <ol className="relative">
              {PHASES.map((p, i) => {
                const completed = p.n < phase;
                const current = p.n === phase;
                const showConnector = i < PHASES.length - 1;
                return (
                  <li key={p.n} className="relative pl-7 pr-1 py-1.5">
                    {showConnector && (
                      <span
                        aria-hidden
                        className="absolute left-[10px] top-[26px] bottom-[-6px] w-px bg-paper-edge"
                      />
                    )}
                    <span
                      aria-hidden
                      className={
                        "absolute left-0 top-[6px] w-[22px] h-[22px] rounded-full grid place-items-center text-[10.5px] tabular-nums font-medium " +
                        (completed
                          ? "bg-coral text-white"
                          : current
                            ? "bg-white border-2 border-coral text-coral-deep"
                            : "bg-white border border-paper-edge text-ink-faint")
                      }
                    >
                      {completed ? <Check className="size-3" strokeWidth={3} /> : p.n}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <Serif
                          className={
                            "text-[13.5px] leading-tight block truncate " +
                            (current
                              ? "text-ink"
                              : completed
                                ? "text-ink-muted"
                                : "text-ink-faint")
                          }
                        >
                          {p.name}
                        </Serif>
                        <div
                          className={
                            "text-[11px] mt-0.5 leading-tight truncate " +
                            (current ? "text-ink-muted" : "text-ink-faint")
                          }
                        >
                          {p.subtitle}
                        </div>
                      </div>
                      <span
                        aria-hidden
                        className={
                          "text-[11px] shrink-0 " +
                          (completed
                            ? "text-coral-deep"
                            : current
                              ? "text-coral"
                              : "text-transparent")
                        }
                      >
                        {completed ? "✓" : current ? "●" : ""}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        {/* Mini KPI block */}
        <Card tone="muted">
          <CardContent compact className="!p-3">
            <div className="grid grid-cols-3 gap-2">
              <MiniKpi label="Phase" value={`${phase}/6`} />
              <MiniKpi label="Files" value={`${uploadCount}`} />
              <MiniKpi label="Time" value={elapsedLabel} />
            </div>
          </CardContent>
        </Card>

        {/* Footer — quiet save & exit */}
        <div className="mt-auto pt-2 pb-1 flex items-center justify-between">
          <Button
            variant="quiet"
            size="sm"
            onClick={() => toast.info("Coming soon")}
          >
            Save & exit ↗
          </Button>
          <Button
            type="button"
            variant="quiet"
            size="sm"
            onClick={() => toast.info("Coming soon")}
            className="gap-1 text-[11px] normal-case tracking-normal px-0 py-0"
          >
            Docs
            <ExternalLink className="size-3" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function MiniKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-paper-edge rounded px-2 py-2 transition-colors hover:border-coral/40">
      <div className="text-[9.5px] uppercase tracking-[0.12em] text-ink-faint font-medium leading-tight">
        {label}
      </div>
      <div className="serif text-[16px] leading-tight text-ink mt-1 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function onboardingVerb(phase: Phase): string {
  switch (phase) {
    case 1:
      return "Listening";
    case 2:
      return "Reading";
    case 3:
      return "Observing";
    case 4:
      return "Planning";
    case 5:
      return "Awaiting approval";
    case 6:
      return "Ready";
    default:
      return "Onboarding";
  }
}
