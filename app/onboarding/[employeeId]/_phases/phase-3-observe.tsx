"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Dropzone } from "@/src/components/dropzone";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { updateOnboardingObservations } from "@/src/server/onboarding-actions";
import { storeAndParseUpload } from "@/src/server/uploads";
import { PhaseHeader, PhaseFooter } from "../_chrome/phase-header";

const QUESTIONS = [
  { key: "prd_depth", q: "Should your PRDs be 1-pagers or full specs?", options: ["1-pager", "Full spec", "Depends on the feature"] },
  { key: "stakeholders", q: "Who are your main stakeholders?", placeholder: "Engineers + design + CEO" },
  { key: "done_definition", q: "What does a 'done' PRD look like to you?", placeholder: "Approved by eng lead and design lead, scope reviewed" },
  { key: "scope_creep", q: "How do you handle scope creep?", options: ["Strict — push back hard", "Flexible — capture for v2", "Depends on who's asking"] },
] as const;

const STEP_LABELS = ["PRD depth", "Stakeholders", "Done bar", "Scope", "Autonomy", "Sample"];

const DECISION_STYLE = [
  { val: "ask_always", label: "Ask everything", sub: "I want to approve before any send" },
  { val: "ask_external", label: "Ask for external actions", sub: "Drafts are yours; sending needs me" },
  { val: "just_do_it", label: "Just do it", sub: "I'll review when something looks off" },
];

export function Phase3Observe({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setObsStore = useWalkthrough(s => s.setObservations);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [decisionStyle, setDecisionStyle] = useState<string>("ask_external");
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = QUESTIONS.length + 2;
  const isQ = step < QUESTIONS.length;
  const isDecision = step === QUESTIONS.length;
  const isSample = step === QUESTIONS.length + 1;

  const finish = async () => {
    setSubmitting(true);
    let sample_prd_text: string | undefined;
    if (sampleFile) {
      const data = await sampleFile.arrayBuffer();
      const stored = await storeAndParseUpload(employeeId, { name: sampleFile.name, type: sampleFile.type, data });
      sample_prd_text = stored.parsed_text;
    }
    const observations = { ...answers, decision_style: decisionStyle, sample_prd_text };
    setObsStore(observations);
    await updateOnboardingObservations(employeeId, observations);
    setPhase(4);
  };

  return (
    <>
      <PhaseHeader
        phase={3}
        title="How do you work?"
        subtitle="Five quick questions to calibrate how I write, what I ask, and when I ship without you."
        estimate="~3 min"
      />

      <div className="bg-white border border-paper-edge rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)]">
        {/* Step indicator */}
        <div className="px-6 pt-5 pb-3 border-b border-paper-edge">
          <ol className="flex items-center gap-1.5">
            {STEP_LABELS.map((label, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={label} className="flex-1 min-w-0 flex items-center gap-1.5">
                  <span
                    className={
                      "h-1 flex-1 rounded-full transition-colors " +
                      (done
                        ? "bg-coral"
                        : current
                          ? "bg-coral/50"
                          : "bg-paper-edge/70")
                    }
                  />
                </li>
              );
            })}
          </ol>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
              Step {step + 1} of {total} · {STEP_LABELS[step] ?? "—"}
            </span>
            <span className="text-[10.5px] tabular-nums text-ink-faint">
              {Math.round((step / total) * 100)}%
            </span>
          </div>
        </div>

        <div className="px-6 py-7">
          {isQ && (() => {
            const cur = QUESTIONS[step];
            return (
              <div className="space-y-5">
                <Serif as="h2" className="text-[24px] leading-tight">{cur.q}</Serif>
                {"options" in cur ? (
                  <div className="space-y-2">
                    {cur.options.map(o => {
                      const selected = answers[cur.key] === o;
                      return (
                        <Button
                          key={o}
                          variant="outline"
                          size="md"
                          aria-pressed={selected}
                          onClick={() => { setAnswers(a => ({ ...a, [cur.key]: o })); setStep(step + 1); }}
                          className={
                            "w-full justify-start text-left px-4 py-3 rounded normal-case tracking-normal text-[14px] text-ink " +
                            (selected
                              ? "border-coral bg-paper-hi"
                              : "hover:bg-paper-hi/40")
                          }
                        >
                          {o}
                        </Button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    autoFocus
                    className="w-full bg-transparent border-b border-paper-edge py-3 text-[18px] focus:outline-none focus:border-coral transition-colors"
                    placeholder={(cur as { placeholder: string }).placeholder}
                    value={answers[cur.key] ?? ""}
                    onChange={e => setAnswers(a => ({ ...a, [cur.key]: e.target.value }))}
                    onKeyDown={e => { if (e.key === "Enter") setStep(step + 1); }}
                  />
                )}
              </div>
            );
          })()}

          {isDecision && (
            <div className="space-y-5">
              <Serif as="h2" className="text-[24px] leading-tight">How much do you want to be in the loop?</Serif>
              <div className="space-y-2">
                {DECISION_STYLE.map(d => {
                  const selected = decisionStyle === d.val;
                  return (
                    <Button
                      key={d.val}
                      variant="outline"
                      size="md"
                      aria-pressed={selected}
                      onClick={() => setDecisionStyle(d.val)}
                      className={
                        "w-full text-left px-4 py-3 rounded normal-case tracking-normal h-auto items-start flex-col [&_div]:w-full " +
                        (selected
                          ? "border-coral bg-paper-hi"
                          : "hover:bg-paper-hi/40")
                      }
                    >
                      <div className="text-[14px] text-ink">{d.label}</div>
                      <div className="text-[12.5px] text-ink-faint mt-0.5">{d.sub}</div>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {isSample && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Serif as="h2" className="text-[24px] leading-tight">Drop a PRD you&apos;re proud of.</Serif>
                <p className="text-[13.5px] text-ink-muted">
                  Optional — but it&apos;s the fastest way for me to learn your bar.
                </p>
              </div>
              <Dropzone onFiles={f => setSampleFile(f[0] ?? null)} multiple={false} />
              {sampleFile && (
                <p className="text-[13px] text-ink-muted">· {sampleFile.name}</p>
              )}
            </div>
          )}
        </div>

        <div className="px-6 pb-5 flex items-center justify-between">
          <Button
            variant="quiet"
            size="sm"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Back
          </Button>
          {isQ && (
            <Button variant="ink" size="md" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
          {isDecision && (
            <Button variant="ink" size="md" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          )}
          {isSample && (
            <Button variant="ink" size="md" onClick={finish} disabled={submitting}>
              {submitting ? "Saving…" : "Show me what you'll do"}
            </Button>
          )}
        </div>
      </div>

      <PhaseFooter phase={3} />
    </>
  );
}
