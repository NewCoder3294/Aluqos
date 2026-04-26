"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { Dropzone } from "@/src/components/dropzone";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { updateOnboardingObservations } from "@/src/server/onboarding-actions";
import { storeAndParseUpload } from "@/src/server/uploads";

type ChoiceQ = {
  kind: "choice";
  key: string;
  question: string;
  helper: string;
  options: ReadonlyArray<string>;
};

type InputQ = {
  kind: "input";
  key: string;
  question: string;
  helper: string;
  placeholder: string;
  examples: ReadonlyArray<string>;
};

type Step = ChoiceQ | InputQ | { kind: "decision" } | { kind: "sample" };

const QUESTIONS: ReadonlyArray<ChoiceQ | InputQ> = [
  {
    kind: "choice",
    key: "prd_depth",
    question: "Should your PRDs be 1-pagers or full specs?",
    helper: "I'll match the depth you actually want.",
    options: ["1-pager", "Full spec", "Depends on the feature"],
  },
  {
    kind: "input",
    key: "stakeholders",
    question: "Who are your main stakeholders?",
    helper: "The people I'll be writing for, mostly.",
    placeholder: "Engineers + design + CEO",
    examples: ["Engineers + design + CEO", "Just my co-founder", "Eng team + customer success"],
  },
  {
    kind: "input",
    key: "done_definition",
    question: "What does a 'done' PRD look like to you?",
    helper: "Your bar. I'll learn it.",
    placeholder: "Approved by eng lead and design lead, scope reviewed",
    examples: [
      "Eng + design sign-off",
      "Scope, risks, success metrics agreed",
      "Approved in our weekly review",
    ],
  },
  {
    kind: "choice",
    key: "scope_creep",
    question: "How do you handle scope creep?",
    helper: "So I know when to push back versus when to capture for later.",
    options: ["Strict — push back hard", "Flexible — capture for v2", "Depends on who's asking"],
  },
] as const;

const DECISION_STYLE = [
  { val: "ask_always", label: "Ask everything", sub: "I want to approve before any send" },
  { val: "ask_external", label: "Ask for external actions", sub: "Drafts are yours; sending needs me" },
  { val: "just_do_it", label: "Just do it", sub: "I'll review when something looks off" },
] as const;

const STEPS: ReadonlyArray<Step> = [...QUESTIONS, { kind: "decision" }, { kind: "sample" }];
const TOTAL = STEPS.length;

export function Phase3Observe({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setObsStore = useWalkthrough(s => s.setObservations);
  const setSubStep = useWalkthrough(s => s.setSubStep);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [decisionStyle, setDecisionStyle] = useState<string>("ask_external");
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSubStep(stepIdx + 1, TOTAL);
  }, [stepIdx, setSubStep]);

  const finish = async () => {
    setSubmitting(true);
    let sample_prd_text: string | undefined;
    if (sampleFile) {
      const data = await sampleFile.arrayBuffer();
      const stored = await storeAndParseUpload(employeeId, {
        name: sampleFile.name,
        type: sampleFile.type,
        data,
      });
      sample_prd_text = stored.parsed_text;
    }
    const observations = { ...answers, decision_style: decisionStyle, sample_prd_text };
    setObsStore(observations);
    await updateOnboardingObservations(employeeId, observations);
    setPhase(4);
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
            Phase 3 · Step {stepIdx + 1} of {TOTAL}
          </span>

          {step.kind === "input" && (
            <>
              <Serif as="h1" className="font-medium leading-[1.05]">
                <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>{step.question}</span>
              </Serif>
              <Serif italic className="text-[16px] text-ink-muted">
                {step.helper}
              </Serif>
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

          {step.kind === "choice" && (
            <>
              <Serif as="h1" className="font-medium leading-[1.05]">
                <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>{step.question}</span>
              </Serif>
              <Serif italic className="text-[16px] text-ink-muted">
                {step.helper}
              </Serif>
              <div className="w-full flex flex-col gap-2 pt-2">
                {step.options.map(o => {
                  const selected = answers[step.key] === o;
                  return (
                    <Button
                      key={o}
                      type="button"
                      variant={selected ? "ink" : "outline"}
                      size="md"
                      aria-pressed={selected}
                      onClick={() => {
                        setAnswers(a => ({ ...a, [step.key]: o }));
                        // small UX nicety: auto-advance after a choice
                        setTimeout(() => goNext(), 120);
                      }}
                      className="w-full justify-center px-5 py-3.5 normal-case tracking-normal text-[15px] rounded"
                    >
                      {o}
                    </Button>
                  );
                })}
              </div>
            </>
          )}

          {step.kind === "decision" && (
            <>
              <Serif as="h1" className="font-medium leading-[1.05]">
                <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
                  How much do you want to be in the loop?
                </span>
              </Serif>
              <Serif italic className="text-[16px] text-ink-muted">
                You can change this any time once we&apos;re working together.
              </Serif>
              <div className="w-full flex flex-col gap-3 pt-2">
                {DECISION_STYLE.map(d => {
                  const selected = decisionStyle === d.val;
                  return (
                    <Button
                      key={d.val}
                      type="button"
                      variant={selected ? "ink" : "outline"}
                      size="md"
                      aria-pressed={selected}
                      onClick={() => setDecisionStyle(d.val)}
                      className="w-full text-left px-5 py-4 rounded normal-case tracking-normal h-auto items-start flex-col gap-1"
                    >
                      <span className="text-[15px] block w-full">{d.label}</span>
                      <span
                        className={
                          "text-[13px] block w-full " +
                          (selected ? "text-paper/70" : "text-ink-faint")
                        }
                      >
                        {d.sub}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </>
          )}

          {step.kind === "sample" && (
            <>
              <Serif as="h1" className="font-medium leading-[1.05]">
                <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
                  Drop a PRD you&apos;re proud of.
                </span>
              </Serif>
              <Serif italic className="text-[16px] text-ink-muted">
                Optional — but it&apos;s the fastest way for me to learn your bar.
              </Serif>
              <div className="w-full pt-2">
                <Dropzone onFiles={f => setSampleFile(f[0] ?? null)} multiple={false} />
                {sampleFile && (
                  <p className="text-[13px] text-ink-muted mt-3 text-left">· {sampleFile.name}</p>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bottom-right phase indicator + nav */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 font-sans text-[11px] text-ink-faint z-30">
        <span className="tabular-nums uppercase tracking-[0.14em]">3 / 6</span>
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
        {step.kind === "sample" ? (
          <Button variant="ink" size="sm" onClick={finish} disabled={submitting}>
            {submitting ? "Saving…" : "Show me what you'll do"}
            {!submitting && <ArrowRight className="size-3.5" />}
          </Button>
        ) : (
          <Button variant="ink" size="sm" onClick={goNext}>
            Next
            <ArrowRight className="size-3.5" />
          </Button>
        )}
      </div>
    </>
  );
}
