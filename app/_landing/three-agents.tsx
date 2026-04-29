"use client";

import { Briefcase, Mic, Wand2, FileText, Pin, Code2 } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { Reveal } from "./motion-primitives";

// "Three agents working for you" — the architecture overview.
// Frames Aluqos as ONE brain spawning THREE agent kinds per employee.
// The visual on each card is a tiny stylized mock that hints at the
// agent's job, in the same design vocabulary as the how.tsx demos.

function RoleAgentVisual() {
  return (
    <div className="rounded-md border border-paper-edge bg-white p-4">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-coral" aria-hidden />
          PRD · bulk-export-ops
        </span>
        <span className="text-coral-deep">Pending</span>
      </div>
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-paper-hi w-full" />
        <div className="h-2 rounded-full bg-paper-hi w-[88%]" />
        <div className="h-2 rounded-full bg-paper-hi w-[72%]" />
      </div>
      <button
        type="button"
        className="mt-3.5 w-full text-[10.5px] uppercase tracking-[0.12em] py-1.5 rounded bg-ink text-paper"
      >
        Approve & ship
      </button>
    </div>
  );
}

function PersonalAssistantVisual() {
  return (
    <div className="rounded-md border border-paper-edge bg-white p-4">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Mic className="w-3 h-3 text-coral" aria-hidden />
          Standup · 24:18
        </span>
        <span className="flex items-center gap-1 text-coral">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" aria-hidden />
          listening
        </span>
      </div>
      {/* Timeline with two pinned action-item markers */}
      <div className="relative h-1.5 rounded-full bg-paper-hi mb-4">
        <div className="absolute left-[28%] -top-1 -translate-y-px">
          <Pin className="w-3 h-3 text-coral-deep rotate-12" aria-hidden />
        </div>
        <div className="absolute left-[64%] -top-1 -translate-y-px">
          <Pin className="w-3 h-3 text-coral-deep rotate-12" aria-hidden />
        </div>
      </div>
      <div className="text-[11px] text-ink leading-snug">
        Drafted ·{" "}
        <span className="font-mono text-[10.5px] text-coral-deep bg-coral/[0.08] px-1.5 py-0.5 rounded">
          thank-you-note.md
        </span>
      </div>
    </div>
  );
}

function AutonomousAgentVisual() {
  return (
    <div className="rounded-md border border-paper-edge bg-ink/95 p-4 font-mono text-[11px] leading-[1.55] text-paper">
      <div className="text-paper/60 text-[9.5px] uppercase tracking-[0.12em] mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Code2 className="w-3 h-3 text-coral" aria-hidden />
          weekly-stakeholder-update.md
        </span>
        <span className="text-coral">draft</span>
      </div>
      <pre className="text-paper/95 whitespace-pre-wrap">
{`---
name: weekly-stakeholder-update
triggers: cron("0 16 * * fri")
permissions: [linear:read, gmail:draft]
autonomy: ask_before_external
---
Pull last 7d Linear activity, customer
calls, and PRD edits. Draft a 5-bullet
stakeholder update. Queue for review.`}
      </pre>
    </div>
  );
}

type AgentCard = {
  Icon: typeof Briefcase;
  eyebrow: string;
  header: string;
  body: string;
  Visual: () => React.JSX.Element;
};

const AGENTS: AgentCard[] = [
  {
    Icon: Briefcase,
    eyebrow: "Role agent",
    header: "Knows your job.",
    body:
      "Drafts your PRDs, manages your tickets, prioritizes your backlog, and updates your roadmap. Trained on how your team specifically operates — not a generic PM.",
    Visual: RoleAgentVisual,
  },
  {
    Icon: Mic,
    eyebrow: "Personal assistant",
    header: "Joins your meetings.",
    body:
      "Attends your calls, takes notes, flags your action items, drafts the follow-ups. Speaks on your behalf when you invite it. Your second pair of ears in every room.",
    Visual: PersonalAssistantVisual,
  },
  {
    Icon: Wand2,
    eyebrow: "Autonomous agent",
    header: "Writes your automations.",
    body:
      "Watches what you do three weeks in a row, then drafts a workflow as a Markdown skill — readable, editable, owned by your team forever.",
    Visual: AutonomousAgentVisual,
  },
];

export function LandingThreeAgents() {
  return (
    <section
      id="agents"
      aria-labelledby="agents-heading"
      className="relative max-w-6xl mx-auto px-6 py-16 lg:py-24"
    >
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          The architecture
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          id="agents-heading"
          className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[24ch]"
        >
          The three agents{" "}
          <span className="italic-serif text-coral-deep">working for you.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-[58ch] text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted">
          One brain per employee, three agents. The role agent does the job,
          the personal assistant covers the meetings, and the autonomous agent
          writes new automations as your team works.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
        {AGENTS.map((agent, i) => (
          <Reveal key={agent.eyebrow} delay={0.15 + i * 0.05}>
            <article className="h-full rounded-xl border border-paper-edge bg-paper-hi/40 p-6 lg:p-7 flex flex-col">
              <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-coral-deep">
                <agent.Icon className="w-3.5 h-3.5" aria-hidden />
                {agent.eyebrow}
              </div>
              <Serif as="h3" className="mt-4 text-[24px] lg:text-[26px] leading-tight tracking-[-0.01em]">
                {agent.header}
              </Serif>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-muted">
                {agent.body}
              </p>
              <div className="mt-6 pt-2">
                <agent.Visual />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
