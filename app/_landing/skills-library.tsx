"use client";

import { Serif } from "@/src/components/serif";
import { Reveal } from "./motion-primitives";

// The "moat" section: every workflow Aluqos ships is a Markdown file the
// customer owns. The cards are stylized .md previews — frontmatter + the
// first few lines of the spec body. Real-looking enough that an engineer
// reading the page recognizes the format.

type Skill = {
  filename: string;
  caption: string;
  body: string;
};

const SKILLS: Skill[] = [
  {
    filename: "weekly-stakeholder-update.md",
    caption: "PM · Friday 4pm",
    body: `---
name: weekly-stakeholder-update
triggers: cron("0 16 * * fri")
permissions: [linear:read, gmail:draft, drive:read]
autonomy: ask_before_external
---
Pull the last 7 days of Linear activity, customer
call notes, and PRD edits. Cluster by theme.
Draft a 5-bullet stakeholder update with cited
sources. Queue for review in the inbox.`,
  },
  {
    filename: "triage-incoming-pages.md",
    caption: "SRE · realtime",
    body: `---
name: triage-incoming-pages
triggers: pagerduty.alert.created
permissions: [pagerduty:read, github:read, slack:draft]
autonomy: ask_before_external
---
Correlate alert with deploys in the last 24h.
Search past incidents for matching signatures.
Surface the most relevant runbook. Draft an
incident summary with timeline + suspects.`,
  },
  {
    filename: "draft-prd-from-customer-calls.md",
    caption: "PM · per call",
    body: `---
name: draft-prd-from-customer-calls
triggers: meeting.ended where attendees.includes("customer")
permissions: [granola:read, drive:write]
autonomy: ask_before_external
---
Listen to the call transcript. Identify the top 3
unmet user needs by frequency × emotional weight.
Draft a one-page PRD with quotes cited inline and
a confidence score per claim.`,
  },
];

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <Reveal delay={0.1 + index * 0.05}>
      <article className="h-full rounded-xl border border-paper-edge bg-white overflow-hidden flex flex-col shadow-[0_2px_12px_rgba(60,40,20,0.04)]">
        {/* File header — looks like an editor tab */}
        <header className="flex items-center justify-between gap-3 px-4 py-2.5 bg-paper-hi/60 border-b border-paper-edge">
          <div className="flex items-center gap-2 min-w-0">
            <span className="size-1.5 rounded-full bg-coral shrink-0" aria-hidden />
            <span className="font-mono text-[12px] text-ink truncate">
              {skill.filename}
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint shrink-0">
            {skill.caption}
          </span>
        </header>
        {/* Body — monospace preview of the .md */}
        <pre className="flex-1 px-4 py-4 font-mono text-[11.5px] leading-[1.55] text-ink whitespace-pre-wrap overflow-hidden">
          {skill.body}
        </pre>
      </article>
    </Reveal>
  );
}

export function LandingSkillsLibrary() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative bg-paper-hi/30 border-y border-paper-edge"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <Reveal>
          <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
            Your moat
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            id="skills-heading"
            className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[24ch]"
          >
            Your team&rsquo;s automation library,{" "}
            <span className="italic-serif text-coral-deep">in plain text.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-[64ch] text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted">
            Every workflow Aluqos ships becomes a Markdown skill — readable,
            editable, owned by your team. Skills version-control, share across
            roles, and compound every week. Your library leaves with you.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {SKILLS.map((skill, i) => (
            <SkillCard key={skill.filename} skill={skill} index={i} />
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-8 italic-serif text-[15px] lg:text-[16px] leading-[1.5] text-ink max-w-[58ch]">
            Skills you write once. Promoted across your team when they earn it.
            Auditable forever.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
