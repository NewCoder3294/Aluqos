"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Dropzone } from "@/src/components/dropzone";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { updateOnboardingObservations } from "@/src/server/onboarding-actions";
import { storeAndParseUpload } from "@/src/server/uploads";

const QUESTIONS = [
  { key: "prd_depth", q: "Should your PRDs be 1-pagers or full specs?", options: ["1-pager", "Full spec", "Depends on the feature"] },
  { key: "stakeholders", q: "Who are your main stakeholders?", placeholder: "Engineers + design + CEO" },
  { key: "done_definition", q: "What does a 'done' PRD look like to you?", placeholder: "Approved by eng lead and design lead, scope reviewed" },
  { key: "scope_creep", q: "How do you handle scope creep?", options: ["Strict — push back hard", "Flexible — capture for v2", "Depends on who's asking"] },
] as const;

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

  if (isQ) {
    const cur = QUESTIONS[step];
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">{cur.q}</Serif>
        {"options" in cur ? (
          <div className="space-y-2">
            {cur.options.map(o => (
              <button
                key={o}
                onClick={() => { setAnswers(a => ({ ...a, [cur.key]: o })); setStep(step + 1); }}
                className={`w-full text-left px-4 py-3 rounded border ${
                  answers[cur.key] === o ? "border-[--color-coral] bg-[--color-paper-hi]" : "border-[--color-paper-edge] bg-white"
                }`}
              >{o}</button>
            ))}
          </div>
        ) : (
          <input
            autoFocus
            className="w-full bg-transparent border-b border-[--color-paper-edge] py-3 text-[18px] focus:outline-none focus:border-[--color-coral]"
            placeholder={(cur as { placeholder: string }).placeholder}
            value={answers[cur.key] ?? ""}
            onChange={e => setAnswers(a => ({ ...a, [cur.key]: e.target.value }))}
            onKeyDown={e => { if (e.key === "Enter") setStep(step + 1); }}
          />
        )}
        <div className="flex justify-between items-center">
          <Button variant="quiet" size="sm" onClick={() => setStep(Math.max(0, step - 1))}>Back</Button>
          <span className="label">{step + 1} / {total}</span>
        </div>
      </section>
    );
  }

  if (isDecision) {
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">How much do you want to be in the loop?</Serif>
        <div className="space-y-2">
          {DECISION_STYLE.map(d => (
            <button
              key={d.val}
              onClick={() => setDecisionStyle(d.val)}
              className={`w-full text-left px-4 py-3 rounded border ${
                decisionStyle === d.val ? "border-[--color-coral] bg-[--color-paper-hi]" : "border-[--color-paper-edge] bg-white"
              }`}
            >
              <div className="text-[14px]">{d.label}</div>
              <div className="text-[12.5px] text-[--color-ink-faint]">{d.sub}</div>
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <Button variant="quiet" size="sm" onClick={() => setStep(step - 1)}>Back</Button>
          <Button variant="ink" size="md" onClick={() => setStep(step + 1)}>Next</Button>
        </div>
      </section>
    );
  }

  if (isSample) {
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">Drop a PRD you're proud of.</Serif>
        <p className="text-[14px] text-[--color-ink-muted]">Optional — but it's the fastest way for me to learn your bar.</p>
        <Dropzone onFiles={f => setSampleFile(f[0] ?? null)} multiple={false} />
        {sampleFile && <p className="text-[13px] text-[--color-ink-muted]">· {sampleFile.name}</p>}
        <div className="flex justify-between items-center">
          <Button variant="quiet" size="sm" onClick={() => setStep(step - 1)}>Back</Button>
          <Button variant="ink" size="md" onClick={finish} disabled={submitting}>
            {submitting ? "Saving…" : "Show me what you'll do"}
          </Button>
        </div>
      </section>
    );
  }

  return null;
}
