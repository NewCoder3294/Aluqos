"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Network,
  Users,
  Activity,
  Database,
  Code as CodeIcon,
  BookOpen,
  Mail,
  MessageSquare,
  Calendar,
  Briefcase,
  Mic,
  Wand2,
} from "lucide-react";
import { EASE, Reveal } from "./motion-primitives";

// ─── Step visuals ─────────────────────────────────────────────────────

// Step 1 — the brain ingests every source the company already produces.
// The visual is a live indexing receipt so "context" reads as concrete
// (record counts, repo counts, transcripts) rather than vibes.
function StepContextVisual() {
  const reduced = useReducedMotion() ?? false;
  const sources: Array<{ Icon: typeof Database; label: string; count: string; warm?: boolean }> = [
    { Icon: Database, label: "Legacy DBs", count: "12,847 records · indexed" },
    { Icon: CodeIcon, label: "Codebases", count: "4 repos · 89k commits" },
    { Icon: BookOpen, label: "Docs · Notion", count: "3,210 pages · indexed" },
    { Icon: Mail, label: "Emails", count: "48k threads · indexed" },
    { Icon: MessageSquare, label: "Slack", count: "186 channels · mapped" },
    { Icon: Calendar, label: "Meetings", count: "324 transcripts · indexed", warm: true },
  ];
  return (
    <div className="rounded-lg border border-paper-edge bg-white p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Network className="w-3.5 h-3.5 text-coral" />
          Indexing company knowledge · read-only
        </span>
        <span className="flex items-center gap-1 text-coral">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" />
          live
        </span>
      </div>
      <div className="space-y-2">
        {sources.map((row, i) => (
          <motion.div
            key={row.label}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={reduced ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded bg-paper-hi/60 border border-paper-edge"
          >
            <row.Icon className="w-3.5 h-3.5 text-coral-deep shrink-0" aria-hidden />
            <span className="serif text-[13px] text-ink truncate flex-1">{row.label}</span>
            <span
              className={`text-[11px] truncate shrink-0 ${
                row.warm ? "text-coral-deep" : "text-ink-faint"
              }`}
            >
              {row.count}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-paper-edge flex items-center justify-between text-[12px]">
        <span className="text-ink-faint">Brain ready</span>
        <span className="text-coral-deep tabular-nums">6m 12s</span>
      </div>
    </div>
  );
}

// Step 2 — three agents activate per employee. Mirrors the architecture
// trio (role / personal / automation) but framed as a deployment receipt:
// every new hire gets all three on day one, all inheriting the brain.
function StepAgentsVisual() {
  const reduced = useReducedMotion() ?? false;
  const agents: Array<{ Icon: typeof Briefcase; label: string; sub: string }> = [
    { Icon: Briefcase, label: "Role agent", sub: "Drafts the artifacts your role ships" },
    { Icon: Mic, label: "Personal assistant", sub: "Joins meetings, files recaps & TODOs" },
    { Icon: Wand2, label: "Automation agent", sub: "Writes the workflows & skills" },
  ];
  return (
    <div className="rounded-lg border border-paper-edge bg-white p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-coral" />
          Deploying · per employee
        </span>
        <span className="text-ink-faint">Sarah · PM</span>
      </div>
      <div className="space-y-2.5">
        {agents.map((a, i) => (
          <motion.div
            key={a.label}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
            className="flex items-start gap-3 px-3.5 py-3 rounded-md bg-paper-hi/50 border border-paper-edge"
          >
            <span className="w-7 h-7 rounded-full grid place-items-center bg-coral/10 border border-coral/30 shrink-0">
              <a.Icon className="w-3.5 h-3.5 text-coral-deep" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] text-ink leading-snug">{a.label}</div>
              <div className="text-[11px] text-ink-faint leading-snug mt-0.5 truncate">
                {a.sub}
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.12em] text-coral-deep border border-coral/30 rounded-full px-2 py-0.5 shrink-0 self-center">
              Active
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-paper-edge flex items-center justify-between text-[11.5px]">
        <span className="text-ink-faint">3 of 3 deployed · brain inherited</span>
        <span className="text-coral-deep tabular-nums">in 4s</span>
      </div>
    </div>
  );
}

// Step 3 — the three agents run continuously. Visual is a live activity
// feed grouped by agent, so the buyer sees what each one ships and what
// each one is about to do next. Frames day-two-onward as "all three
// agents working at once" rather than singling out any one of them.
type AgentRow = {
  Icon: typeof Briefcase;
  name: string;
  role: string;
  events: Array<{ text: string; when: string; warm?: boolean }>;
};

function StepDailyVisual() {
  const reduced = useReducedMotion() ?? false;
  const rows: AgentRow[] = [
    {
      Icon: Briefcase,
      name: "Role agent",
      role: "Drafts the artifacts your role ships",
      events: [
        { text: "Drafted Q2-roadmap update", when: "6m ago" },
        { text: "Shipped weekly stakeholder note", when: "1h ago" },
        { text: "PRD draft · #ENG-471", when: "next", warm: true },
      ],
    },
    {
      Icon: Mic,
      name: "Personal assistant",
      role: "Joins meetings, files recaps & TODOs",
      events: [
        { text: "Filed 4 TODOs from standup", when: "now", warm: true },
        { text: "Flagged blocker on #ENG-471", when: "12m ago" },
        { text: "Joining design review", when: "in 18m" },
      ],
    },
    {
      Icon: Wand2,
      name: "Automation agent",
      role: "Runs the workflows you approved",
      events: [
        { text: "Auto-triaged 12 oncall pages", when: "today" },
        { text: "Proposed new workflow · #7", when: "this AM" },
        { text: "Nightly cleanup", when: "in 6h" },
      ],
    },
  ];
  return (
    <div className="rounded-lg border border-paper-edge bg-white p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-coral" />
          Today · all three agents
        </span>
        <span className="flex items-center gap-1 text-coral">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" />
          live
        </span>
      </div>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={row.name}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.1, ease: EASE }}
            className="rounded-md bg-paper-hi/50 border border-paper-edge p-3"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full grid place-items-center bg-coral/10 border border-coral/30 shrink-0">
                <row.Icon className="w-3.5 h-3.5 text-coral-deep" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-ink leading-snug">{row.name}</div>
                <div className="text-[10.5px] text-ink-faint truncate">{row.role}</div>
              </div>
            </div>
            <ul className="mt-2.5 pl-9 space-y-1">
              {row.events.map(e => (
                <li
                  key={e.text}
                  className="flex items-start justify-between gap-3 text-[11.5px]"
                >
                  <span className="text-ink-muted truncate">· {e.text}</span>
                  <span
                    className={`shrink-0 tabular-nums ${
                      e.warm ? "text-coral-deep" : "text-ink-faint"
                    }`}
                  >
                    {e.when}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-paper-edge flex items-center justify-between text-[11.5px]">
        <span className="text-ink-faint">12 actions today · 0 errors</span>
        <span className="text-coral-deep">audit log open</span>
      </div>
    </div>
  );
}

// ─── Step data ────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    eyebrow: "Day one",
    title: "It learns",
    titleAccent: "the company.",
    body: "Aluqos joins read-only and reads everything the company already produces: legacy databases, codebases, docs, emails, Slack, meetings. The brain forms in minutes, not weeks. Nothing to spec, nothing to prompt.",
    Visual: StepContextVisual,
  },
  {
    n: "02",
    eyebrow: "Day one",
    title: "It spawns",
    titleAccent: "three agents.",
    body: "Every employee gets a role agent that does their job, a personal assistant in every meeting, and an automation agent that writes the workflows. All three inherit the company brain. No setup, no prompts.",
    Visual: StepAgentsVisual,
  },
  {
    n: "03",
    eyebrow: "Every day after",
    title: "They run",
    titleAccent: "your day.",
    body: "The role agent drafts what your role ships. The personal assistant sits in every meeting and files the followups. The automation agent runs the workflows you approved. Three agents, one paper trail, every action under your leash.",
    Visual: StepDailyVisual,
  },
];

// One viewport of scroll per step. The wrapper is `STEPS.length * 100vh`
// tall; inside it we sticky-pin the editorial card at the top of the
// viewport so the page appears to stop scrolling while the step swaps.
const SCROLL_PER_STEP_VH = 100;

export function LandingHow() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", v => {
    // Map [0,1) onto [0..STEPS.length-1]. Clamp the very end so the last
    // step stays active until the wrapper releases the sticky pin.
    const clamped = Math.min(0.9999, Math.max(0, v));
    const idx = Math.min(STEPS.length - 1, Math.floor(clamped * STEPS.length));
    if (idx !== active) setActive(idx);
  });

  return (
    <section
      id="how"
      ref={wrapperRef}
      className="relative bg-paper"
      style={{ height: `${STEPS.length * SCROLL_PER_STEP_VH}vh` }}
    >
      {/* Sticky pinned viewport — stays in place while the wrapper scrolls
          past it. Cards crossfade based on `active`. */}
      <div className="sticky top-0 h-screen flex items-center px-4 sm:px-8 py-12 sm:py-16">
        <div className="w-full">
          <div className="relative bg-paper-hi border border-paper-edge rounded-[2.5rem] shadow-[0_16px_64px_rgba(31,29,26,0.08)] overflow-hidden min-h-[720px]">
            {/* grid pattern */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(31,29,26,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,29,26,0.10) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
                maskImage:
                  "radial-gradient(ellipse at center, black 60%, transparent 95%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-50"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(31,29,26,0.18) 1px, transparent 1.5px)",
                backgroundSize: "224px 224px",
                backgroundPosition: "28px 28px",
              }}
            />
            {/* Cell-shade pattern — 4 shades distributed across a 4×4 tile
                so each grid cell takes a slightly different tone. Two
                lifts (white) and two drops (ink) over paper-hi. */}
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
                <pattern id="cell-shade-how" x="0" y="0" width="224" height="224" patternUnits="userSpaceOnUse">
                  {/* 4 shades — all subtle drops below paper-hi so white
                      content cards stay readable on the right side. */}
                  {/* Row 0 */}
                  <rect x="0" y="0" width="56" height="56" fill="#1f1d1a" fillOpacity="0.012" />
                  <rect x="56" y="0" width="56" height="56" fill="#1f1d1a" fillOpacity="0.040" />
                  <rect x="112" y="0" width="56" height="56" fill="#1f1d1a" fillOpacity="0.024" />
                  <rect x="168" y="0" width="56" height="56" fill="#1f1d1a" fillOpacity="0.060" />
                  {/* Row 1 */}
                  <rect x="0" y="56" width="56" height="56" fill="#1f1d1a" fillOpacity="0.024" />
                  <rect x="56" y="56" width="56" height="56" fill="#1f1d1a" fillOpacity="0.060" />
                  <rect x="112" y="56" width="56" height="56" fill="#1f1d1a" fillOpacity="0.040" />
                  <rect x="168" y="56" width="56" height="56" fill="#1f1d1a" fillOpacity="0.012" />
                  {/* Row 2 */}
                  <rect x="0" y="112" width="56" height="56" fill="#1f1d1a" fillOpacity="0.060" />
                  <rect x="56" y="112" width="56" height="56" fill="#1f1d1a" fillOpacity="0.012" />
                  <rect x="112" y="112" width="56" height="56" fill="#1f1d1a" fillOpacity="0.024" />
                  <rect x="168" y="112" width="56" height="56" fill="#1f1d1a" fillOpacity="0.040" />
                  {/* Row 3 */}
                  <rect x="0" y="168" width="56" height="56" fill="#1f1d1a" fillOpacity="0.040" />
                  <rect x="56" y="168" width="56" height="56" fill="#1f1d1a" fillOpacity="0.024" />
                  <rect x="112" y="168" width="56" height="56" fill="#1f1d1a" fillOpacity="0.060" />
                  <rect x="168" y="168" width="56" height="56" fill="#1f1d1a" fillOpacity="0.012" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cell-shade-how)" />
            </svg>
            <div
              className="absolute inset-y-0 right-0 w-2/3 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 75% 50%, rgba(196,100,73,0.12), transparent 65%)",
              }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-10 sm:p-14 lg:p-24 min-h-[720px] max-w-[1400px] mx-auto">
              {/* Left: header + crossfading step copy */}
              <div className="min-w-0">
                <Reveal>
                  <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
                    How it works
                  </div>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
                    <span className="italic-serif text-coral-deep">Zero configuration.</span>
                  </h2>
                </Reveal>

                <div className="relative mt-10 min-h-[300px]">
                  {STEPS.map((step, i) => {
                    const isActive = i === active;
                    const isPast = i < active;
                    return (
                      <div
                        key={step.n}
                        // Per-property transitions (NOT a single shared duration/delay):
                        //   opacity:    fades 200ms in BOTH directions, no delay
                        //   transform:  ditto
                        //   visibility: instant when becoming active; delayed by 200ms
                        //               when becoming inactive (so it hides AFTER the
                        //               opacity fade completes, never during it)
                        // Earlier version applied the 200ms delay to all three, which
                        // held the outgoing card at opacity 1 while the incoming card
                        // was already fading in — that's the bleed-through bug.
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? "translateY(0px)"
                            : `translateY(${isPast ? -16 : 16}px)`,
                          visibility: isActive ? "visible" : "hidden",
                          transition: isActive
                            ? "opacity 200ms ease-out, transform 200ms ease-out, visibility 0s linear 0s"
                            : "opacity 200ms ease-out, transform 200ms ease-out, visibility 0s linear 200ms",
                          pointerEvents: isActive ? "auto" : "none",
                        }}
                        aria-hidden={!isActive}
                      >
                        <div className="flex gap-6 lg:gap-10">
                          <div className="hidden sm:flex flex-col items-center shrink-0 pt-1">
                            <span className="serif text-[20px] tracking-[-0.02em] leading-none text-coral-deep">
                              {step.n}
                            </span>
                            <div className="mt-3 w-px flex-1 min-h-[80px] bg-paper-edge" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-[12px] tracking-[0.16em] uppercase text-coral-deep font-medium">
                              {step.eyebrow}
                            </div>
                            <h3 className="serif mt-4 text-[clamp(28px,3.6vw,44px)] leading-[1.05] tracking-[-0.02em] text-ink">
                              {step.title}{" "}
                              <span className="italic-serif text-ink-faint">
                                {step.titleAccent}
                              </span>
                            </h3>
                            <p className="mt-5 text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted max-w-[44ch]">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* step pip indicator */}
                <div className="mt-8 flex items-center gap-2">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.n}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        i === active ? "w-8 bg-coral" : "w-1.5 bg-paper-edge"
                      }`}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>

              {/* Right: crossfading visual cards */}
              <div className="relative flex items-center justify-center min-h-[420px]">
                {STEPS.map((step, i) => {
                  const Visual = step.Visual;
                  const isActive = i === active;
                  const isPast = i < active;
                  return (
                    <div
                      key={step.n}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateY(0px) scale(1)"
                          : `translateY(${isPast ? -20 : 20}px) scale(0.98)`,
                        visibility: isActive ? "visible" : "hidden",
                        transition: isActive
                          ? "opacity 200ms ease-out, transform 200ms ease-out, visibility 0s linear 0s"
                          : "opacity 200ms ease-out, transform 200ms ease-out, visibility 0s linear 200ms",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                      aria-hidden={!isActive}
                    >
                      <Card className="w-full max-w-[460px] p-2 lg:p-3 shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)] border border-paper-edge bg-white">
                        <CardContent className="p-0">
                          <Visual />
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
