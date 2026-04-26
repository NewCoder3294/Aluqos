"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dropzone } from "@/src/components/dropzone";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { submitBrief, BriefData } from "@/src/server/onboarding-actions";
import { seedDemoFixture } from "@/src/server/seed-demo-fixture";

const STEPS = [
  { key: "project", q: "What are you building?", placeholder: "Saathi — AI employees that learn how you work" },
  { key: "role", q: "What's your role?", placeholder: "Founder / Head of Product / …" },
  { key: "priorities", q: "Top three priorities right now?", placeholder: "Ship the YC demo, close design partners, hire eng #2" },
  { key: "time_sink", q: "What's eating most of your time?", placeholder: "Drafting PRDs from scratch every week" },
  { key: "team", q: "Who's on the team? (optional)", placeholder: "3 engineers + 1 designer" },
  { key: "tools", q: "What tools do you live in?", placeholder: "Notion, Slack, GitHub, Figma" },
] as const;

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

  if (stepIdx < STEPS.length) {
    const step = STEPS[stepIdx];
    return (
      <section className="space-y-6">
        <Serif as="h2" className="text-[28px]">{step.q}</Serif>
        <input
          autoFocus
          className="w-full bg-transparent border-b border-[--color-paper-edge] py-3 text-[18px] focus:outline-none focus:border-[--color-coral]"
          placeholder={step.placeholder}
          value={answers[step.key] ?? ""}
          onChange={e => setAnswers(a => ({ ...a, [step.key]: e.target.value }))}
          onKeyDown={e => { if (e.key === "Enter") setStepIdx(stepIdx + 1); }}
        />
        <div className="flex justify-between items-center">
          <Button variant="quiet" size="sm" onClick={() => setStepIdx(Math.max(0, stepIdx - 1))}>
            Back
          </Button>
          <Button variant="ink" size="md" onClick={() => setStepIdx(stepIdx + 1)}>
            Next
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Serif as="h2" className="text-[28px]">Drop in anything I should read.</Serif>
      <p className="text-[14px] text-[--color-ink-muted]">PRDs, briefs, meeting notes, your roadmap. The more, the better.</p>
      <Dropzone onFiles={fs => setFiles(prev => [...prev, ...fs])} />
      {files.length > 0 && (
        <ul className="text-[13px] space-y-1">
          {files.map((f, i) => <li key={i} className="text-[--color-ink-muted]">· {f.name}</li>)}
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
          className="mt-4 underline normal-case tracking-normal text-[11px]"
        >
          Use demo data
        </Button>
      )}
      <div className="flex justify-between items-center pt-2">
        <Button variant="quiet" size="sm" onClick={() => setStepIdx(STEPS.length - 1)}>
          Back
        </Button>
        <Button
          variant="ink"
          size="md"
          disabled={files.length === 0 || submitting}
          onClick={onUpload}
        >
          {submitting ? "Reading…" : "Hand it over"}
        </Button>
      </div>
    </section>
  );
}
