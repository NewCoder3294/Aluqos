"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Eye, Sparkles, ShieldCheck, ArrowUpRight } from "lucide-react";
import { EASE, Reveal } from "./motion-primitives";

// ─── Step visuals ─────────────────────────────────────────────────────

// Week 1 — read-only observation. Shows Aluqos passively watching the
// surfaces a real team works in. No actions, no writes — just signal.
function StepWatchVisual() {
  const reduced = useReducedMotion() ?? false;
  const observed: Array<{ source: string; signal: string; tone: "muted" | "warm" }> = [
    { source: "#oncall-pages", signal: "12 pages this week · 4 false alarms", tone: "warm" },
    { source: "Notion · Q2 roadmap", signal: "edited 9× · 3 stakeholders", tone: "muted" },
    { source: "Linear · #ENG-471", signal: "blocked 3 days · waiting on design", tone: "warm" },
    { source: "Slack · #product", signal: "47 threads · 6 unresolved asks", tone: "muted" },
  ];
  return (
    <div className="rounded-lg border border-paper-edge bg-white p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-coral" />
          Observing · read-only
        </span>
        <span className="flex items-center gap-1 text-coral">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" />
          live
        </span>
      </div>
      <div className="space-y-2">
        {observed.map((row, i) => (
          <motion.div
            key={row.source}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            animate={reduced ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
            className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded bg-paper-hi/60 border border-paper-edge"
          >
            <span className="serif text-[13px] text-ink truncate">{row.source}</span>
            <span
              className={`text-[11px] truncate shrink-0 ${
                row.tone === "warm" ? "text-coral-deep" : "text-ink-faint"
              }`}
            >
              {row.signal}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-paper-edge text-[12px] text-ink-faint">
        Day 6 · no actions taken yet
      </div>
    </div>
  );
}

// Week 2 — proposed workflows ranked by estimated hours saved per week.
// The buyer's first "oh this is different" moment: Aluqos found work to
// automate that they didn't have to spec.
function StepProposeVisual() {
  const reduced = useReducedMotion() ?? false;
  const proposals: Array<{ title: string; why: string; hours: string; rank: number }> = [
    {
      rank: 1,
      title: "Auto-triage incoming pages",
      why: "60% of last week's pages were duplicates of incidents already resolved.",
      hours: "6 hrs/wk",
    },
    {
      rank: 2,
      title: "Draft weekly stakeholder update",
      why: "Pulled from Linear activity, customer calls, and PRD edits.",
      hours: "3 hrs/wk",
    },
    {
      rank: 3,
      title: "Surface stale blocks in standup",
      why: "Detected 4 issues that have been waiting on review > 3 days.",
      hours: "1.5 hrs/wk",
    },
  ];
  return (
    <div className="rounded-lg border border-paper-edge bg-paper-hi/50 p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-coral" />
          Proposed workflows · ranked
        </span>
        <span className="text-ink-faint">10.5 hrs/wk total</span>
      </div>
      <div className="space-y-2.5">
        {proposals.map((p, i) => (
          <motion.div
            key={p.title}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
            className="flex items-start gap-3 px-3.5 py-3 rounded-md bg-white border border-paper-edge"
          >
            <span className="serif text-[14px] text-coral-deep tabular-nums shrink-0 w-5">
              {p.rank}.
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] text-ink leading-snug">{p.title}</div>
              <div className="text-[11px] text-ink-faint leading-snug mt-0.5 truncate">
                {p.why}
              </div>
            </div>
            <span className="text-[11px] uppercase tracking-[0.1em] text-coral-deep border border-coral/30 rounded-full px-2 py-0.5 shrink-0 self-center tabular-nums">
              {p.hours}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-paper-edge flex items-center justify-between text-[11.5px]">
        <span className="text-ink-faint">Approve all · Edit · Reject</span>
        <span className="text-coral-deep flex items-center gap-1">
          You decide what ships <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

// Week 3 — autonomy slider. The visual hero of the section. The buyer
// picks how much trust to extend, per workflow, and changes their mind
// at any time. Migrated from the old bento to live with the narrative.
function StepShipVisual() {
  const modes: Array<{ id: string; label: string; sub: string; icon: string; active?: boolean }> = [
    { id: "ask",      label: "Ask always",         sub: "Confirm every action",            icon: "?" },
    { id: "external", label: "Ask before external", sub: "Send to Slack/email needs OK",   icon: "↗", active: true },
    { id: "go",       label: "Just do it",          sub: "Run with full autonomy",          icon: "→" },
  ];
  return (
    <div className="rounded-lg border border-paper-edge bg-white p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-coral" />
          Auto-triage · autonomy
        </span>
        <span className="text-ink-faint">per workflow</span>
      </div>
      <div className="space-y-2.5">
        {modes.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
            className={`flex items-center gap-3 rounded-md border p-3 ${
              m.active
                ? "border-coral/40 bg-coral/[0.06]"
                : "border-paper-edge bg-paper-hi/40"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full grid place-items-center text-[13px] shrink-0 ${
                m.active
                  ? "bg-coral text-paper"
                  : "bg-paper-hi text-ink-faint border border-paper-edge"
              }`}
              aria-hidden
            >
              {m.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className={`text-[13px] ${m.active ? "text-ink font-medium" : "text-ink"}`}
              >
                {m.label}
              </div>
              <div className="text-[11px] text-ink-faint truncate">{m.sub}</div>
            </div>
            {m.active && (
              <span className="text-[10px] uppercase tracking-[0.12em] text-coral-deep shrink-0">
                Current
              </span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-paper-edge text-[11.5px] text-ink-faint">
        Change any time · per-workflow · audit log of every action
      </div>
    </div>
  );
}

// ─── Step data ────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    eyebrow: "Week 1",
    title: "It watches.",
    titleAccent: "Read-only.",
    body: "Aluqos joins your stack — Slack, Linear, Notion, GitHub, your inbox — read-only. It sees what you do, what you ignore, what you copy-paste, what wakes you up. No setup. No prompts. Nothing to configure.",
    Visual: StepWatchVisual,
  },
  {
    n: "02",
    eyebrow: "Week 2",
    title: "It proposes",
    titleAccent: "the workflows.",
    body: "Aluqos surfaces what it would automate, ranked by hours saved per week, with the evidence for each. You approve, edit, or reject — you don't write specs, you don't prompt, you don't configure. You just say yes or no.",
    Visual: StepProposeVisual,
  },
  {
    n: "03",
    eyebrow: "Week 3",
    title: "It ships.",
    titleAccent: "Your leash.",
    body: "Approved workflows go live with your chosen autonomy level — confirm everything, only outbound, or fully autonomous. Per workflow. Change at any time. Aluqos keeps watching and proposes new workflows as your work evolves.",
    Visual: StepShipVisual,
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
                    Three weeks.{" "}
                    <span className="italic text-ink-faint">Zero configuration.</span>
                  </h2>
                </Reveal>

                <div className="relative mt-10 min-h-[300px]">
                  {STEPS.map((step, i) => {
                    const isActive = i === active;
                    const isPast = i < active;
                    return (
                      <div
                        key={step.n}
                        className="absolute inset-0 transition-[opacity,transform,visibility] duration-200 ease-out"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? "translateY(0px)"
                            : `translateY(${isPast ? -16 : 16}px)`,
                          // Visibility lags by the transition duration so the inactive
                          // card stops claiming layout/text once its fade-out finishes —
                          // this is what kept text from "bleeding through" during scroll.
                          visibility: isActive ? "visible" : "hidden",
                          transitionDelay: isActive ? "0ms" : "200ms",
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
                      className="absolute inset-0 flex items-center justify-center transition-[opacity,transform,visibility] duration-200 ease-out"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateY(0px) scale(1)"
                          : `translateY(${isPast ? -20 : 20}px) scale(0.98)`,
                        visibility: isActive ? "visible" : "hidden",
                        transitionDelay: isActive ? "0ms" : "200ms",
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
