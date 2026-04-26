"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Dropzone } from "@/src/components/dropzone";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { submitBrief, BriefData } from "@/src/server/onboarding-actions";
import { seedDemoFixture } from "@/src/server/seed-demo-fixture";

type StepKey = "project" | "role" | "priorities" | "time_sink" | "team" | "tools";

type QuestionStep = {
  kind: "input";
  key: StepKey;
  question: string;
  helper: string;
  placeholder: string;
  examples: string[];
};

type FilesStep = { kind: "files"; question: string; helper: string };

const STEPS: ReadonlyArray<QuestionStep | FilesStep> = [
  {
    kind: "input",
    key: "project",
    question: "What are you building?",
    helper: "One line is plenty. I'll learn the rest from your docs.",
    placeholder: "Aluqos — AI employees that learn how you work",
    examples: [
      "A vertical SaaS for dental clinics",
      "An open-source dev tool",
      "Consumer mobile app for journaling",
    ],
  },
  {
    kind: "input",
    key: "role",
    question: "What's your role?",
    helper: "So I know whose voice to write in.",
    placeholder: "Founder / Head of Product / …",
    examples: ["Founder & CEO", "Head of Product", "Engineering Lead"],
  },
  {
    kind: "input",
    key: "priorities",
    question: "Top three priorities right now?",
    helper: "Comma-separate. I'll keep them top of mind.",
    placeholder: "Ship the YC demo, close design partners, hire eng #2",
    examples: [
      "Ship v1, hire eng #2, raise seed",
      "Cut churn, ship onboarding revamp, win 3 logos",
    ],
  },
  {
    kind: "input",
    key: "time_sink",
    question: "What's eating most of your time?",
    helper: "The thing you'd hand off first if you could.",
    placeholder: "Drafting PRDs from scratch every week",
    examples: [
      "Writing PRDs from scratch",
      "Sales follow-ups",
      "Reviewing every design change",
    ],
  },
  {
    kind: "input",
    key: "team",
    question: "Who's on the team?",
    helper: "Optional — but it'll help me write to the right people.",
    placeholder: "3 engineers + 1 designer",
    examples: [
      "3 engineers + 1 designer",
      "5-person product team",
      "Just me — solo founder",
    ],
  },
  {
    kind: "input",
    key: "tools",
    question: "What tools do you live in?",
    helper: "Comma-separate. I'll meet you where you already are.",
    placeholder: "Notion, Slack, GitHub, Figma",
    examples: ["Notion, Slack, Linear", "GitHub, Figma, Loom", "Email, Sheets, Slack"],
  },
  {
    kind: "files",
    question: "Drop in anything I should read.",
    helper: "PRDs, briefs, meeting notes, your roadmap. The more, the better.",
  },
] as const;

const TOTAL = STEPS.length;

export function Phase1Brief({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setBriefStore = useWalkthrough(s => s.setBrief);
  const setSubStep = useWalkthrough(s => s.setSubStep);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const showDemo = searchParams.get("demo") === "1";

  useEffect(() => {
    setSubStep(stepIdx + 1, TOTAL);
  }, [stepIdx, setSubStep]);

  const onUpload = async () => {
    setSubmitting(true);
    const filePayload = await Promise.all(
      files.map(async f => ({ name: f.name, type: f.type, data: await f.arrayBuffer() })),
    );
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

  const goNext = () => {
    if (stepIdx < TOTAL - 1) setStepIdx(stepIdx + 1);
  };
  const goBack = () => {
    if (stepIdx > 0) setStepIdx(stepIdx - 1);
  };

  const step = STEPS[stepIdx];

  return (
    <>
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div
          key={stepIdx}
          className="w-full max-w-[640px] flex flex-col items-center text-center gap-7"
        >
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
            Phase 1 · Step {stepIdx + 1} of {TOTAL}
          </span>

          <Serif as="h1" className="font-medium leading-[1.05]">
            <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>{step.question}</span>
          </Serif>

          <Serif italic className="text-[16px] text-ink-muted">
            {step.helper}
          </Serif>

          {step.kind === "input" && (
            <>
              <input
                key={step.key}
                autoFocus
                aria-label={step.question}
                className="w-full max-w-[640px] bg-transparent border-b-2 border-paper-edge focus:border-coral focus:outline-none text-[22px] py-3 text-center transition-colors text-ink placeholder:text-ink-faint/60"
                placeholder={step.placeholder}
                value={answers[step.key] ?? ""}
                onChange={e => setAnswers(a => ({ ...a, [step.key]: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    goNext();
                  }
                }}
              />
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {step.examples.map(ex => (
                  <Button
                    key={ex}
                    type="button"
                    variant="outline"
                    size="chip"
                    onClick={() => setAnswers(a => ({ ...a, [step.key]: ex }))}
                  >
                    {ex}
                  </Button>
                ))}
              </div>
            </>
          )}

          {step.kind === "files" && (
            <div className="w-full space-y-4">
              <Dropzone onFiles={fs => setFiles(prev => [...prev, ...fs])} />
              {files.length > 0 && (
                <ul className="text-[13px] space-y-1 text-left">
                  {files.map((f, i) => (
                    <li key={i} className="text-ink-muted">· {f.name}</li>
                  ))}
                </ul>
              )}
              {showDemo && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      setSubmitting(true);
                      await seedDemoFixture(employeeId);
                      setPhase(2);
                      setSubmitting(false);
                    }}
                    className="text-[12px] text-ink-faint hover:text-coral-deep underline underline-offset-4 transition-colors"
                  >
                    Use demo data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Bottom-right phase indicator + nav */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 font-sans text-[11px] text-ink-faint z-30">
        <span className="tabular-nums uppercase tracking-[0.14em]">1 / 6</span>
        <span className="opacity-40">·</span>
        <Button
          variant="quiet"
          size="sm"
          onClick={goBack}
          disabled={stepIdx === 0}
          aria-label="Back"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Button>
        {step.kind === "input" ? (
          <Button variant="ink" size="sm" onClick={goNext}>
            Next
            <ArrowRight className="size-3.5" />
          </Button>
        ) : (
          <Button
            variant="ink"
            size="sm"
            disabled={files.length === 0 || submitting}
            onClick={onUpload}
          >
            {submitting ? "Reading…" : "Hand it over"}
            {!submitting && <ArrowRight className="size-3.5" />}
          </Button>
        )}
      </div>
    </>
  );
}
