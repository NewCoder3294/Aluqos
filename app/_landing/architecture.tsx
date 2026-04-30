"use client";

import {
  Briefcase,
  Mic,
  Wand2,
  FileText,
  Check,
  Database,
  Code,
  BookOpen,
  Mail,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Serif } from "@/src/components/serif";
import { FlipCard, FlipCardFront, FlipCardBack } from "@/src/components/ui/flip-card";
import { Reveal } from "./motion-primitives";

// Architecture diagram. ONE brain per employee, observing 24/7. The brain
// spawns THREE agents — role agent (drafts artifacts), personal assistant
// (ships recaps), autonomous agent (writes Markdown skills the team owns
// forever). Each agent visibly emits a real artifact below it: a PRD
// draft, a meeting recap, or a skill file. The autonomous agent's
// artifact is the most polished (dark editor) since the moat is the
// company-owned skills it writes.
//
// Each agent renders as a hover-flip card: front is the role + one-line
// promise; back is the detailed capability list. Keyboard accessible
// (focus + Enter/Space toggles the flip).

type Agent = {
  Icon: typeof Briefcase;
  label: string;
  promise: string;
  description: string;
  capabilities: string[];
  output: string; // short label between card and artifact ("Drafts", "Recaps", "Skills")
  accent?: boolean;
};

// Knowledge sources the brain ingests. Anchors the "company brain" idea:
// the brain reads everything the company already produces, then synthesizes.
// Each source has an explicit scatter position + rotation so the row reads
// like notes dropped on the canvas, not a tidy lineup.
type Source = {
  Icon: typeof Briefcase;
  label: string;
  leftPct: number; // 0–100, horizontal anchor inside the scatter area
  topPx: number; // px from top of scatter area
  rotate: number; // degrees, slight tilt for the dropped feel
};

// Fan/arc layout: outer chips sit higher, inner chips sit lower. This
// gives every chip its own clear vertical lane down to the central
// junction so connector curves never sweep through another pill.
const SOURCES: Source[] = [
  { Icon: Database, label: "Legacy DBs", leftPct: 2, topPx: 8, rotate: -5 },
  { Icon: Code, label: "Codebases", leftPct: 18, topPx: 62, rotate: 3 },
  { Icon: BookOpen, label: "Docs", leftPct: 34, topPx: 120, rotate: -2 },
  { Icon: Mail, label: "Emails", leftPct: 54, topPx: 120, rotate: 5 },
  { Icon: MessageSquare, label: "Slack", leftPct: 71, topPx: 62, rotate: -4 },
  { Icon: Calendar, label: "Meetings", leftPct: 85, topPx: 8, rotate: 4 },
];

function SourceChip({
  Icon,
  label,
}: {
  Icon: typeof Briefcase;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-paper/95 border border-paper-edge shadow-[0_12px_28px_-10px_rgba(0,0,0,0.55)]">
      <Icon className="w-4 h-4 text-coral-deep" aria-hidden />
      <span className="text-[14px] font-medium tracking-[0.01em] text-ink">
        {label}
      </span>
    </div>
  );
}

const AGENTS: Agent[] = [
  {
    Icon: Briefcase,
    label: "Role agent",
    promise: "Does your job.",
    description:
      "Trained on how your team actually operates. Drafts the artifacts your role ships every week.",
    capabilities: [
      "Drafts PRDs in your tone, sourced from Linear + customer calls",
      "Manages the backlog, surfaces what's at risk before standup",
      "Updates roadmap docs and stakeholder threads",
      "Picks up your decision style from the first review pass",
    ],
    output: "Drafts",
  },
  {
    Icon: Mic,
    label: "Personal assistant",
    promise: "Joins your meetings.",
    description:
      "Your second pair of ears in every room. Ships the follow-ups so you never lose a thread.",
    capabilities: [
      "Attends your calls, transcribes, flags action items live",
      "Drafts thank-you notes and meeting recaps for one-click send",
      "Speaks on your behalf when you invite it (chat or voice)",
      "Connects new asks back to existing PRDs, tickets, and customers",
    ],
    output: "Recaps",
  },
  {
    Icon: Wand2,
    label: "Autonomous agent",
    promise: "Writes the automations.",
    description:
      "Watches three weeks. Drafts a workflow as a Markdown skill your team owns and edits forever.",
    capabilities: [
      "Detects repeating work: what you copy-paste, what wakes you up",
      "Drafts the skill as plain Markdown with YAML frontmatter",
      "Promotes proven skills from personal → role → company-wide",
      "Every action audit-logged, every change git-tracked",
    ],
    output: "Skills",
    accent: true,
  },
];

function AgentFlipCard({ agent }: { agent: Agent }) {
  return (
    <FlipCard
      className="h-[380px] w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-xl"
      aria-label={`${agent.label}: ${agent.promise} (hover or press Enter to flip)`}
    >
      {/* Top connector dot — anchor where the trunk SVG line meets the card */}
      <span
        aria-hidden
        className="hidden lg:block absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 rounded-full bg-coral border-2 border-ink z-30"
      />

      {/* FRONT — sits on the dark grid, so it needs a real lift shadow
          and a subtle inner highlight to read as a tactile object rather
          than a flat panel. */}
      <FlipCardFront
        className={`rounded-2xl border bg-white p-8 lg:p-10 flex flex-col ${
          agent.accent
            ? "border-coral/45 shadow-[0_24px_60px_-18px_rgba(196,100,73,0.45),0_8px_24px_-8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.9)]"
            : "border-paper-edge shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55),0_8px_24px_-8px_rgba(0,0,0,0.30),inset_0_1px_0_0_rgba(255,255,255,0.85)]"
        }`}
      >
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-coral-deep font-semibold">
          <agent.Icon className="w-3.5 h-3.5" aria-hidden />
          {agent.label}
        </div>
        <Serif as="h3" className="mt-5 text-[28px] lg:text-[32px] leading-[1.05] tracking-[-0.02em] text-ink">
          {agent.promise}
        </Serif>
        <p className="mt-4 text-[15px] lg:text-[16px] leading-[1.55] text-ink-muted">
          {agent.description.split(".")[0] + "."}
        </p>
        {/* Hover hint — shows on hover/focus that the card flips */}
        <div className="mt-auto pt-6 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
          <span className="size-1 rounded-full bg-coral" aria-hidden />
          Hover to expand
        </div>
      </FlipCardFront>

      {/* BACK */}
      <FlipCardBack
        className={`rounded-2xl border bg-paper-hi p-8 lg:p-10 flex flex-col ${
          agent.accent
            ? "border-coral/45 shadow-[0_24px_60px_-18px_rgba(196,100,73,0.45),0_8px_24px_-8px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.9)]"
            : "border-paper-edge shadow-[0_24px_60px_-18px_rgba(0,0,0,0.55),0_8px_24px_-8px_rgba(0,0,0,0.30),inset_0_1px_0_0_rgba(255,255,255,0.85)]"
        }`}
      >
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-coral-deep font-semibold">
          <agent.Icon className="w-3.5 h-3.5" aria-hidden />
          {agent.label}
        </div>
        <p className="mt-4 text-[14px] leading-[1.6] text-ink">
          {agent.description}
        </p>
        <ul className="mt-4 space-y-2.5 flex-1">
          {agent.capabilities.map((cap) => (
            <li key={cap} className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-ink-muted">
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-coral-deep" aria-hidden />
              <span>{cap}</span>
            </li>
          ))}
        </ul>
      </FlipCardBack>
    </FlipCard>
  );
}

// Per-agent artifact previews. Each agent visibly emits something the
// team owns: role drafts a PRD, assistant ships a meeting recap, the
// autonomous agent writes a skill. The first two are light "rendered
// markdown" cards; the autonomous one is a dark code-editor card to
// signal "this is automation source the team owns."

function ArtifactConnector({
  label,
  emphasized,
}: {
  label: string;
  emphasized?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="flex flex-col items-center"
    >
      <span className="size-2 rounded-full bg-coral" />
      <svg
        className="w-2 h-16"
        viewBox="0 0 4 64"
        preserveAspectRatio="none"
      >
        <path
          d="M 2 0 L 2 64"
          stroke="#c46449"
          strokeOpacity="0.22"
          strokeWidth="1.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 2 0 L 2 64"
          stroke="#c46449"
          strokeOpacity={emphasized ? "0.9" : "0.7"}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3 8"
          className="arch-flow"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span
        className={`mt-1 text-[9.5px] uppercase tracking-[0.18em] font-medium ${
          emphasized ? "text-coral" : "text-coral/70"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function RoleArtifact() {
  return (
    <div className="rounded-xl border border-paper-edge bg-white shadow-[0_8px_24px_-12px_rgba(31,29,26,0.18)] overflow-hidden flex flex-col h-full min-h-[460px]">
      {/* File tab */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-paper-edge bg-paper-hi/40">
        <FileText className="w-3 h-3 text-coral-deep" aria-hidden />
        <span className="font-mono text-[11px] text-ink truncate">
          Q2-bulk-export.prd.md
        </span>
        <span className="ml-auto text-[9.5px] uppercase tracking-[0.14em] text-coral-deep shrink-0">
          draft 0.3
        </span>
      </div>

      {/* Body — rendered-markdown PRD */}
      <div className="flex-1 px-5 py-4">
        <div className="text-[10px] uppercase tracking-[0.14em] text-coral-deep font-medium">
          PRD · Q2 priority
        </div>
        <h4 className="serif text-[19px] leading-tight text-ink mt-2">
          Bulk export for ops dashboards
        </h4>
        <p className="mt-2.5 text-[12.5px] leading-[1.6] text-ink-muted">
          Ops stitches CSVs by hand every week. We ship a single export
          that preserves filters and chart context.
        </p>

        <div className="mt-4 text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
          Why now
        </div>
        <p className="mt-1.5 text-[12.5px] leading-[1.6] text-ink-muted">
          Manual stitching costs ~6 hrs/wk and blocks month-end close.
        </p>

        <div className="mt-4 text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
          Success
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {[
            "One-click export with filters preserved",
            "< 30s for 50K rows",
            "Reuses existing chart query pipeline",
          ].map((it) => (
            <li
              key={it}
              className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-muted"
            >
              <Check className="w-3 h-3 mt-0.5 shrink-0 text-coral-deep" aria-hidden />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-paper-edge flex items-center justify-between text-[9.5px] uppercase tracking-[0.14em] text-ink-faint">
        <span>Drafted by Alex</span>
        <span>2 reviewers · v0.3</span>
      </div>
    </div>
  );
}

function AssistantArtifact() {
  return (
    <div className="rounded-xl border border-[#e8d8b8] bg-[#fbf5e2] shadow-[0_8px_24px_-12px_rgba(31,29,26,0.18)] overflow-hidden flex flex-col h-full min-h-[460px]">
      {/* File tab — warmer cream notebook feel */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#e8d8b8] bg-[#f3e8c7]/50">
        <FileText className="w-3 h-3 text-coral-deep" aria-hidden />
        <span className="font-mono text-[11px] text-ink truncate">
          2026-04-28-stripe-sync.md
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-coral-deep shrink-0">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" aria-hidden />
          live notes
        </span>
      </div>

      {/* Body — rendered-markdown recap */}
      <div className="flex-1 px-5 py-4">
        <div className="text-[10px] uppercase tracking-[0.14em] text-coral-deep font-medium">
          Recap · 47 min
        </div>
        <h4 className="serif text-[19px] leading-tight text-ink mt-2">
          Stripe sync · pricing review
        </h4>
        <p className="mt-2.5 text-[12.5px] leading-[1.55] text-ink-muted">
          Alex, Maya · Stripe (Sara, Tom). Walked the rev-share proposal
          and pricing tier changes.
        </p>

        <div className="mt-4 text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
          Decisions
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {[
            "Move to revenue-share contract by Q3",
            "Pricing tier review owned by Alex",
          ].map((it) => (
            <li
              key={it}
              className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-muted"
            >
              <span
                aria-hidden
                className="mt-1.5 size-1 shrink-0 rounded-full bg-coral-deep"
              />
              <span>{it}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
          Action items
        </div>
        <ul className="mt-1.5 space-y-1.5">
          {[
            "Send rev-share spec to Stripe by Wed",
            "Loop legal in on contract terms",
            "Schedule pricing review for May",
          ].map((it) => (
            <li
              key={it}
              className="flex items-start gap-2 text-[12.5px] leading-snug text-ink-muted"
            >
              <Check className="w-3 h-3 mt-0.5 shrink-0 text-coral-deep" aria-hidden />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[#e8d8b8] flex items-center justify-between text-[9.5px] uppercase tracking-[0.14em] text-ink-faint">
        <span>47-min call</span>
        <span>3 action items</span>
      </div>
    </div>
  );
}

function AutonomousArtifact() {
  return (
    <div className="rounded-xl border border-coral/45 bg-[#2a2723] shadow-[0_22px_60px_-18px_rgba(196,100,73,0.25)] overflow-hidden flex flex-col h-full min-h-[460px]">
      {/* File tab strip */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-paper/10 bg-[#231f1c]">
        <span className="size-1.5 rounded-full bg-coral" aria-hidden />
        <FileText className="w-3 h-3 text-coral" aria-hidden />
        <span className="font-mono text-[11px] text-paper/90 truncate">
          weekly-stakeholder-update.md
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.14em] text-coral shrink-0">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" aria-hidden />
          v1 · drafted
        </span>
      </div>

      {/* Code body — gutter + syntax-highlighted YAML + skill body */}
      <div className="flex-1 flex font-mono text-[11.5px] leading-[1.7]">
        <div
          aria-hidden
          className="select-none px-3 py-3 text-paper/25 border-r border-paper/10 text-right"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 px-4 py-3 text-paper/95 whitespace-pre overflow-x-auto">
          <div>---</div>
          <div>
            <span className="text-coral">name</span>: weekly-stakeholder-update
          </div>
          <div>
            <span className="text-coral">triggers</span>: cron(
            <span className="text-paper/65">&quot;0 16 * * fri&quot;</span>)
          </div>
          <div>
            <span className="text-coral">permissions</span>: [linear:read,
            gmail:draft]
          </div>
          <div>
            <span className="text-coral">autonomy</span>: ask_before_external
          </div>
          <div>---</div>
          <div>&nbsp;</div>
          <div className="text-coral-light"># Weekly stakeholder update</div>
          <div>&nbsp;</div>
          <div>
            <span className="text-paper/55">1.</span> Pull last week&apos;s shipped PRDs from Linear
          </div>
          <div>
            <span className="text-paper/55">2.</span> Summarize blockers from #eng-standup
          </div>
          <div>
            <span className="text-paper/55">3.</span> Draft email, attach metrics, request review
            <span
              aria-hidden
              className="inline-block w-[7px] h-[13px] align-middle bg-coral ml-1 blink"
            />
          </div>
        </div>
      </div>

      {/* Owner footer */}
      <div className="px-4 py-3 border-t border-paper/10 flex items-center justify-between text-[9.5px] uppercase tracking-[0.14em]">
        <span className="text-coral">your team owns this</span>
        <span className="font-mono text-paper/40 normal-case tracking-normal text-[10px] truncate ml-3">
          .skills/weekly-stakeholder-update.md
        </span>
      </div>
    </div>
  );
}

const AGENT_ARTIFACTS = [RoleArtifact, AssistantArtifact, AutonomousArtifact];

export function LandingArchitecture() {
  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="relative py-12 sm:py-16 px-4 sm:px-8 bg-paper"
    >
      {/* Dark container — schematic-blueprint canvas. Same chrome as the
          integrations / how-it-works sections (rounded-[2.5rem], grid
          pattern, shadow) but inverted to bg-ink so the diagram reads
          like a real architectural drawing. The light cards inside
          (PRD, recap, brain, agents) become "documents pinned to the
          board" while the dark skills.md remains the moat punctuation. */}
      <div className="relative bg-ink border border-ink rounded-[2.5rem] shadow-[0_24px_80px_-16px_rgba(31,29,26,0.45)] overflow-hidden">
        {/* Grid pattern — paper-toned lines on dark */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(244,237,225,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,237,225,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 70%, transparent 100%)",
          }}
        />
        {/* Cell-shade pattern — each grid cell gets a slightly different
            shade (some lift, some drop relative to bg-ink). 4×4 tile of
            56px cells repeats infinitely. Combined with the grid lines
            above, this gives the canvas a marbled-graph-paper feel where
            no two adjacent cells are exactly the same tone. */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, black 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 70%, transparent 100%)",
          }}
        >
          <defs>
            <pattern id="cell-shade" x="0" y="0" width="224" height="224" patternUnits="userSpaceOnUse">
              {/* Row 1 — alternating lift / drop relative to bg-ink */}
              <rect x="0" y="0" width="56" height="56" fill="#f4ede1" fillOpacity="0.04" />
              <rect x="56" y="0" width="56" height="56" fill="#000000" fillOpacity="0.16" />
              <rect x="112" y="0" width="56" height="56" fill="#f4ede1" fillOpacity="0.05" />
              <rect x="168" y="0" width="56" height="56" fill="#000000" fillOpacity="0.08" />
              {/* Row 2 */}
              <rect x="0" y="56" width="56" height="56" fill="#000000" fillOpacity="0.10" />
              <rect x="56" y="56" width="56" height="56" fill="#f4ede1" fillOpacity="0.025" />
              <rect x="112" y="56" width="56" height="56" fill="#000000" fillOpacity="0.18" />
              <rect x="168" y="56" width="56" height="56" fill="#f4ede1" fillOpacity="0.045" />
              {/* Row 3 */}
              <rect x="0" y="112" width="56" height="56" fill="#f4ede1" fillOpacity="0.03" />
              <rect x="56" y="112" width="56" height="56" fill="#000000" fillOpacity="0.12" />
              <rect x="112" y="112" width="56" height="56" fill="#f4ede1" fillOpacity="0.06" />
              <rect x="168" y="112" width="56" height="56" fill="#000000" fillOpacity="0.06" />
              {/* Row 4 */}
              <rect x="0" y="168" width="56" height="56" fill="#000000" fillOpacity="0.14" />
              <rect x="56" y="168" width="56" height="56" fill="#f4ede1" fillOpacity="0.035" />
              <rect x="112" y="168" width="56" height="56" fill="#000000" fillOpacity="0.05" />
              <rect x="168" y="168" width="56" height="56" fill="#f4ede1" fillOpacity="0.05" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cell-shade)" />
        </svg>
        {/* Coral spotlight — big, smooth, centered around the brain card
            so it doesn't cut off at the edges. */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            top: "14%",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "min(1400px, 110%)",
            height: "900px",
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(196,100,73,0.30) 0%, rgba(196,100,73,0.16) 30%, rgba(196,100,73,0.06) 55%, transparent 80%)",
            filter: "blur(30px)",
          }}
        />

        <div className="relative p-8 sm:p-12 lg:p-20 max-w-[1400px] mx-auto">
          <Reveal>
            <div className="text-[12px] tracking-[0.14em] uppercase text-coral font-medium">
              The architecture
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="architecture-heading"
              className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[24ch] text-paper"
            >
              One brain.{" "}
              <span className="italic-serif text-coral-light">Three agents.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[58ch] text-[16px] lg:text-[17px] leading-[1.6] text-paper/70">
              A brain per employee. Always on. Plans freely. Writes only with
              approval. Hover any agent to see what it ships.
            </p>
          </Reveal>

      {/* Diagram — sits inside the dark container. The container-level
          coral spotlight + grid pattern do the schematic-blueprint work;
          this wrapper just stacks brain → connector → agents → artifacts. */}
      <div className="relative mt-14 lg:mt-20">
        {/* Sources scatter — chips dropped onto the canvas at varied
            positions, slight tilt each, with dashed-flow lines emerging
            from each chip's location and converging to the brain top.
            Reads as "the company's existing knowledge being pulled in"
            rather than a tidy row. */}
        <Reveal delay={0.1}>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6 lg:mb-8">
              <span className="h-px w-8 bg-coral/40" aria-hidden />
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-coral/85 font-medium">
                Ingests from
              </span>
              <span className="h-px w-8 bg-coral/40" aria-hidden />
            </div>

            {/* Desktop scatter — absolutely-positioned chips with a
                full-bleed funnel SVG drawn from each chip's anchor. */}
            <div className="hidden md:block relative h-[260px] max-w-[1180px] mx-auto">
              <svg
                aria-hidden
                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
                viewBox="0 0 1000 260"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="arch-funnel" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c46449" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#c46449" stopOpacity="0.95" />
                  </linearGradient>
                </defs>
                {/* Every chip curves into a single junction point above
                    the brain, then ONE trunk line continues into the
                    brain card. Visually: many sources → one company brain. */}
                {(() => {
                  const junctionX = 500;
                  const junctionY = 215;
                  const trunkEndY = 260;
                  const guides = SOURCES.map((s, i) => {
                    const startX = s.leftPct * 10 + 60;
                    const startY = s.topPx + 44;
                    const dy = junctionY - startY;
                    // cp1 directly below the chip (vertical tangent at the
                    // start) gives a clean vertical drop. cp2 is interpolated
                    // 60% of the way from the chip to the junction so each
                    // curve enters the junction from an angle proportional
                    // to its lateral distance — outer chips sweep in
                    // diagonally, inner chips drop nearly straight, producing
                    // a visible fan instead of a parallel bundle.
                    const cp1y = startY + dy * 0.55;
                    const cp2x = startX + (junctionX - startX) * 0.6;
                    const cp2y = junctionY - 12;
                    const d = `M ${startX} ${startY} C ${startX} ${cp1y}, ${cp2x} ${cp2y}, ${junctionX} ${junctionY}`;
                    return { d, i };
                  });
                  return (
                    <>
                      {/* Static guides */}
                      {guides.map(({ d, i }) => (
                        <path
                          key={`g-${i}`}
                          d={d}
                          stroke="#c46449"
                          strokeOpacity="0.22"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                      {/* Animated dashed flow */}
                      {guides.map(({ d, i }) => {
                        const stagger =
                          i % 3 === 1
                            ? "arch-flow-d1"
                            : i % 3 === 2
                              ? "arch-flow-d2"
                              : "";
                        return (
                          <path
                            key={`f-${i}`}
                            d={d}
                            stroke="url(#arch-funnel)"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="3 8"
                            className={`arch-flow ${stagger}`}
                            vectorEffect="non-scaling-stroke"
                          />
                        );
                      })}
                      {/* Single trunk: junction → brain top edge */}
                      <path
                        d={`M ${junctionX} ${junctionY} L ${junctionX} ${trunkEndY}`}
                        stroke="#c46449"
                        strokeOpacity="0.85"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                      <path
                        d={`M ${junctionX} ${junctionY} L ${junctionX} ${trunkEndY}`}
                        stroke="url(#arch-funnel)"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="3 8"
                        className="arch-flow"
                        vectorEffect="non-scaling-stroke"
                      />
                      {/* Junction node */}
                      <circle
                        cx={junctionX}
                        cy={junctionY}
                        r="4"
                        fill="#c46449"
                      />
                    </>
                  );
                })()}
              </svg>

              {SOURCES.map((s) => (
                <div
                  key={s.label}
                  className="absolute z-10"
                  style={{
                    left: `${s.leftPct}%`,
                    top: `${s.topPx}px`,
                    transform: `rotate(${s.rotate}deg)`,
                  }}
                >
                  <SourceChip Icon={s.Icon} label={s.label} />
                </div>
              ))}

              {/* Anchor dot at convergence point */}
              <span
                aria-hidden
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-2.5 rounded-full bg-coral border-2 border-ink"
              />
            </div>

            {/* Mobile fallback — center-stacked chips, no scatter */}
            <div className="md:hidden flex flex-wrap items-center justify-center gap-3 max-w-[600px] mx-auto">
              {SOURCES.map((s) => (
                <SourceChip key={s.label} Icon={s.Icon} label={s.label} />
              ))}
            </div>
          </div>
        </Reveal>

        {/* Brain card — bigger, weightier, no card-in-card halo. Coral glow
            via box-shadow only. Pulsing dot sits inside the badge row. */}
        <Reveal delay={0.15}>
          <div className="relative z-10 mx-auto max-w-[480px]">
            <div className="rounded-2xl border-2 border-coral/40 bg-white p-7 lg:p-8 shadow-[0_8px_36px_-8px_rgba(196,100,73,0.35)]">
              <div className="flex items-start gap-5">
                {/* Brain "logo" — bigger black tile with coral inset */}
                <div
                  className="relative w-16 h-16 rounded-2xl bg-ink grid place-items-center shrink-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  aria-hidden
                >
                  <span className="serif text-paper text-[30px] leading-none">A</span>
                  {/* Coral status dot pinned to the corner */}
                  <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-coral border-2 border-white pulse-coral" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-coral-deep font-medium">
                    Aluqos brain · running 24/7
                  </div>
                  <Serif as="h3" className="mt-1.5 text-[24px] leading-tight">
                    One brain per employee.
                  </Serif>
                  <p className="mt-2 text-[13.5px] leading-[1.5] text-ink-muted">
                    Observes your stack read-only. Plans freely. Coordinates
                    the three agents below. Writes only with approval.
                  </p>
                </div>
              </div>
              {/* Footer row — three quick stats that frame the brain's
                  capabilities at a glance */}
              <div className="mt-5 pt-4 border-t border-paper-edge grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <div className="text-coral-deep uppercase tracking-[0.12em] text-[9.5px] font-medium">Memory</div>
                  <div className="text-ink mt-1">Persistent</div>
                </div>
                <div>
                  <div className="text-coral-deep uppercase tracking-[0.12em] text-[9.5px] font-medium">Permissions</div>
                  <div className="text-ink mt-1">MCP-scoped</div>
                </div>
                <div>
                  <div className="text-coral-deep uppercase tracking-[0.12em] text-[9.5px] font-medium">Audit log</div>
                  <div className="text-ink mt-1">Every action</div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Connector — three lines fan from a trunk dot under the brain
            down to each agent card. Faint static guides + slow dashed
            flow on top conveys "running 24/7" without being flashy.
            Lives in normal layout flow at a fixed height so it actually
            spans the gap (the prior absolute SVG was stretched flat). */}
        <div
          aria-hidden
          className="hidden lg:block relative z-10 mx-auto mt-6 h-24 w-full max-w-[860px]"
        >
          {/* Trunk dot — HTML so it stays a circle under SVG aspect-stretch */}
          <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2.5 rounded-full bg-coral border-2 border-ink" />
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="0 0 1000 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="arch-line" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c46449" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#c46449" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            {/* Static base guides — faint, anchor the structure */}
            <path d="M 500 0 C 500 45, 167 60, 167 100" stroke="#c46449" strokeOpacity="0.22" strokeWidth="1.5" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d="M 500 0 L 500 100" stroke="#c46449" strokeOpacity="0.22" strokeWidth="1.5" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <path d="M 500 0 C 500 45, 833 60, 833 100" stroke="#c46449" strokeOpacity="0.22" strokeWidth="1.5" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {/* Animated dashed flow — staggered so they don't tick in sync */}
            <path d="M 500 0 C 500 45, 167 60, 167 100" stroke="url(#arch-line)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 8" className="arch-flow" vectorEffect="non-scaling-stroke" />
            <path d="M 500 0 L 500 100" stroke="url(#arch-line)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 8" className="arch-flow arch-flow-d1" vectorEffect="non-scaling-stroke" />
            <path d="M 500 0 C 500 45, 833 60, 833 100" stroke="url(#arch-line)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="3 8" className="arch-flow arch-flow-d2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        {/* Agent cards row — each card sits in its own subtle radial
            spotlight on the dark grid so the three columns feel like
            three discrete stages rather than three identical panels on
            a single backdrop. The autonomous (accent) column gets a
            slightly stronger coral wash to flag the moat. */}
        <div className="relative z-10 mt-12 lg:mt-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          {AGENTS.map((agent, i) => (
            <Reveal key={agent.label} delay={0.2 + i * 0.06}>
              <div className="relative">
                {/* Per-card spotlight backdrop */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem]"
                  style={{
                    background: agent.accent
                      ? "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(196,100,73,0.22) 0%, rgba(196,100,73,0.08) 45%, transparent 75%)"
                      : "radial-gradient(ellipse 65% 55% at 50% 45%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, transparent 78%)",
                  }}
                />
                <AgentFlipCard agent={agent} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Per-agent connectors row — same dashed-flow language as the
            brain → agents trunk so the whole diagram reads as one chain.
            The autonomous connector is taller + slightly stronger to
            signal the moat. Hidden on mobile/sm where cards stack. */}
        <div className="relative z-10 mt-3 hidden md:grid md:grid-cols-3 gap-5">
          {AGENTS.map((agent) => (
            <ArtifactConnector
              key={agent.label}
              label={agent.output}
              emphasized={agent.accent}
            />
          ))}
        </div>

        {/* Artifacts row — every agent visibly emits a real, named file.
            Role agent → PRD draft. Personal assistant → meeting recap.
            Autonomous agent → skills.md (the moat — dark editor chrome
            so it stands out as automation source the team owns). */}
        <div className="relative z-10 mt-3 grid grid-cols-1 md:grid-cols-3 gap-5 md:items-stretch">
          {AGENT_ARTIFACTS.map((Artifact, i) => (
            <Reveal key={i} delay={0.35 + i * 0.06} className="h-full">
              <Artifact />
            </Reveal>
          ))}
        </div>

        {/* Caption row — three-property descriptor under each artifact so
            all three columns end on the same uniform line. */}
        <Reveal delay={0.55}>
          <div className="relative z-10 mt-3 grid md:grid-cols-3 gap-5">
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-paper/45">
              Reviewable · Versioned · Shippable
            </p>
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-paper/45">
              Searchable · Threaded · Actionable
            </p>
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-paper/45">
              Auditable · Editable · Exportable
            </p>
          </div>
        </Reveal>
      </div>

          <Reveal delay={0.55}>
            <p className="mt-16 lg:mt-24 italic-serif text-[16px] lg:text-[18px] leading-[1.5] text-paper/70 text-center max-w-[58ch] mx-auto">
              Brain plans. Humans ship. Skills belong to your team. Forever.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
