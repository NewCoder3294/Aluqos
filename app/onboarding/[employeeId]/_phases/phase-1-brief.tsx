"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dropzone } from "@/src/components/dropzone";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { submitBrief, BriefData } from "@/src/server/onboarding-actions";
import { seedDemoFixture } from "@/src/server/seed-demo-fixture";
import { PhaseHeader, PhaseFooter } from "../_chrome/phase-header";

const STEPS = [
  { key: "project", q: "What are you building?", placeholder: "Saathi — AI employees that learn how you work" },
  { key: "role", q: "What's your role?", placeholder: "Founder / Head of Product / …" },
  { key: "priorities", q: "Top three priorities right now?", placeholder: "Ship the YC demo, close design partners, hire eng #2" },
  { key: "time_sink", q: "What's eating most of your time?", placeholder: "Drafting PRDs from scratch every week" },
  { key: "team", q: "Who's on the team? (optional)", placeholder: "3 engineers + 1 designer" },
  { key: "tools", q: "What tools do you live in?", placeholder: "Notion, Slack, GitHub, Figma" },
] as const;

const STEP_TITLES = ["Project", "Role", "Priorities", "Time", "Team", "Tools", "Files"];

export function Phase1Brief({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setBriefStore = useWalkthrough(s => s.setBrief);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const showDemo = searchParams.get("demo") === "1";

  const onUpload = async () => {
    if (!files.length) return;
    setSubmitting(true);
    const filePayload = await Promise.all(files.map(async f => ({
      name: f.name, type: f.type, data: await f.arrayBuffer(),
    })));
    const brief: BriefData = {
      project: answers.project ?? "",
      role: answers.role ?? "",
      priorities: (answers.priorities ?? "").split(",").map(s => s.trim()).filter(Boolean),
      time_sink: answers.time_sink ?? "",
      team: answers.team,
      tools: (answers.tools ?? "").split(",").map(s => s.trim()).filter(Boolean),
    };
    setBriefStore(brief);
    await submitBrief(employeeId, brief, filePayload);
    setPhase(2);
    setSubmitting(false);
  };

  const totalSteps = STEPS.length + 1; // +1 for files step
  const onFiles = stepIdx === STEPS.length;

  return (
    <>
      <PhaseHeader
        phase={1}
        title="Brief the intern"
        subtitle="Fast typeform-style intake. Tell me what you're building, then drop in anything I should read."
        estimate="~2 min"
      />

      <div className="bg-white border border-[--color-paper-edge] rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)]">
        {/* Stepped horizontal indicator */}
        <div className="px-6 pt-5 pb-3 border-b border-[--color-paper-edge]">
          <ol className="flex items-center gap-1.5">
            {STEP_TITLES.map((label, i) => {
              const done = i < stepIdx;
              const current = i === stepIdx;
              return (
                <li key={label} className="flex-1 min-w-0 flex items-center gap-1.5">
                  <span
                    className={
                      "h-1 flex-1 rounded-full transition-colors " +
                      (done
                        ? "bg-[--color-coral]"
                        : current
                          ? "bg-[--color-coral]/50"
                          : "bg-[--color-paper-edge]/70")
                    }
                  />
                </li>
              );
            })}
          </ol>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint] font-medium">
              Step {Math.min(stepIdx + 1, totalSteps)} of {totalSteps} · {STEP_TITLES[stepIdx] ?? "Files"}
            </span>
            <span className="text-[10.5px] tabular-nums text-[--color-ink-faint]">
              {Math.round(((stepIdx) / totalSteps) * 100)}%
            </span>
          </div>
        </div>

        {/* Question / files content */}
        <div className="px-6 py-7">
          {!onFiles && (() => {
            const step = STEPS[stepIdx];
            return (
              <div className="space-y-5">
                <Serif as="h2" className="text-[24px] leading-tight">{step.q}</Serif>
                <input
                  autoFocus
                  className="w-full bg-transparent border-b border-[--color-paper-edge] py-3 text-[18px] focus:outline-none focus:border-[--color-coral] transition-colors"
                  placeholder={step.placeholder}
                  value={answers[step.key] ?? ""}
                  onChange={e => setAnswers(a => ({ ...a, [step.key]: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") setStepIdx(stepIdx + 1); }}
                />
              </div>
            );
          })()}

          {onFiles && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Serif as="h2" className="text-[24px] leading-tight">Drop in anything I should read.</Serif>
                <p className="text-[13.5px] text-[--color-ink-muted]">
                  PRDs, briefs, meeting notes, your roadmap. The more, the better.
                </p>
              </div>
              <Dropzone onFiles={fs => setFiles(prev => [...prev, ...fs])} />
              {files.length > 0 && (
                <ul className="text-[13px] space-y-1">
                  {files.map((f, i) => (
                    <li key={i} className="text-[--color-ink-muted]">· {f.name}</li>
                  ))}
                </ul>
              )}
              {showDemo && (
                <Button
                  variant="quiet"
                  size="sm"
                  onClick={async () => {
                    setSubmitting(true);
                    await seedDemoFixture(employeeId);
                    setPhase(2);
                    setSubmitting(false);
                  }}
                  className="underline normal-case tracking-normal text-[11px]"
                >
                  Use demo data
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Per-step controls (kept inside the content card) */}
        <div className="px-6 pb-5 flex items-center justify-between">
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}
            disabled={stepIdx === 0}
          >
            Back
          </Button>
          {!onFiles ? (
            <Button variant="ink" size="md" onClick={() => setStepIdx(stepIdx + 1)}>
              Next
            </Button>
          ) : (
            <Button
              variant="ink"
              size="md"
              disabled={files.length === 0 || submitting}
              onClick={onUpload}
            >
              {submitting ? "Reading…" : "Hand it over"}
            </Button>
          )}
        </div>
      </div>

      <PhaseFooter phase={1} />
    </>
  );
}
