"use client";

import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { Card, CardContent } from "@/src/components/ui/card";
import { FileText, Hash, CheckCircle2 } from "lucide-react";
import { EASE, Reveal } from "./motion-primitives";

// ─── Step visuals ─────────────────────────────────────────────────────
function StepDescribeVisual() {
  return (
    <div className="rounded-lg border border-paper-edge bg-paper-hi/50 p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5">
        New AI employee
      </div>
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full text-white grid place-items-center serif text-[28px]"
          style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          aria-hidden
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="serif text-[20px] text-ink">Alex</div>
          <div className="text-[11px] text-ink-faint uppercase tracking-[0.12em]">
            Product Manager
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {[
          { k: "Tone", v: "Direct, warm" },
          { k: "Priorities", v: "Customer truth > velocity" },
          { k: "Style", v: "Short PRDs, sharp problems" },
        ].map(row => (
          <div
            key={row.k}
            className="flex items-center justify-between text-[12.5px] py-2.5 px-3.5 rounded bg-white border border-paper-edge"
          >
            <span className="text-ink-faint uppercase tracking-[0.1em] text-[10px]">
              {row.k}
            </span>
            <span className="text-ink serif">{row.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepLearnVisual() {
  const reduced = useReducedMotion() ?? false;
  const widths = [94, 82, 100, 68, 88, 55];
  return (
    <div className="rounded-lg border border-paper-edge bg-white p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-coral" />
          q2-roadmap.pdf
        </span>
        <span className="flex items-center gap-1 text-coral">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" />
          reading
        </span>
      </div>
      <div className="space-y-2.5">
        {widths.map((w, i) => {
          const isActive = i === widths.length - 1;
          return (
            <motion.div
              key={i}
              initial={reduced ? false : { scaleX: 0, opacity: 0.4 }}
              animate={reduced ? undefined : { scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              style={{ width: `${w}%`, originX: 0 }}
              className={
                "h-2.5 rounded-full relative " +
                (isActive ? "bg-coral/30" : "bg-paper-hi")
              }
            >
              {isActive && (
                <span
                  className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-[2px] h-3.5 bg-coral animate-pulse"
                  aria-hidden
                />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-paper-edge">
        <div className="text-[10px] uppercase tracking-[0.12em] text-coral mb-1.5">
          Extracted
        </div>
        <div className="text-[14px] text-ink serif italic leading-snug">
          &ldquo;Ops needs board-ready exports. Engineering owns the dashboard
          renderer.&rdquo;
        </div>
      </div>
    </div>
  );
}

function StepDeployVisual() {
  return (
    <div className="rounded-lg border border-paper-edge bg-white p-6 lg:p-7">
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5" />
          product-team
        </span>
        <span className="text-ink-faint">9:41</span>
      </div>
      <div className="flex gap-3">
        <div
          className="w-10 h-10 rounded text-white grid place-items-center serif text-[15px] shrink-0"
          style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          aria-hidden
        >
          A
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="serif text-[15px] text-ink">Alex</span>
            <span className="text-[10px] text-ink-faint uppercase tracking-[0.1em]">
              AI Product Manager
            </span>
          </div>
          <p className="mt-1 text-[14px] leading-snug text-ink-muted">
            Drafted the PRD for bulk export &mdash; 6 sections, sourced from Q2
            roadmap + issue 47. Ready for your read.
          </p>
          <div className="mt-3.5 flex items-center gap-2 px-3.5 py-2.5 rounded-md border border-paper-edge bg-paper-hi/60">
            <FileText className="w-4 h-4 text-coral shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-ink truncate">
                PRD — Bulk export for ops
              </div>
              <div className="text-[10px] text-ink-faint">
                6 sections · 1,240 words
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.12em] text-coral-deep border border-coral/30 rounded-full px-2 py-0.5 shrink-0">
              Pending
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-paper-edge flex items-center gap-2 text-[12px] text-ink-faint">
        <CheckCircle2 className="w-3.5 h-3.5 text-coral" />
        <span>Linked to Linear issue #47, Notion roadmap, Drive folder</span>
      </div>
    </div>
  );
}

// ─── Step data ────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    eyebrow: "Brief them",
    title: "Describe how",
    titleAccent: "you work.",
    body: "Give them a name, a role, a personality. Tell them how you like to work — tone, priorities, style. Just like briefing a new hire on their first day.",
    Visual: StepDescribeVisual,
  },
  {
    n: "02",
    eyebrow: "Watch & learn",
    title: "They learn",
    titleAccent: "from you.",
    body: "Your AI employee shadows your work — reads your docs, observes your patterns, picks up your voice. No training. No prompts. It just learns, like a smart colleague would.",
    Visual: StepLearnVisual,
  },
  {
    n: "03",
    eyebrow: "Stay in sync",
    title: "They ship",
    titleAccent: "in your stack.",
    body: "Your AI employee shows up in Slack, email, or wherever you work. Assign them tasks. They get smarter with every interaction.",
    Visual: StepDeployVisual,
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
                    Like onboarding{" "}
                    <span className="italic text-ink-faint">
                      a smart intern.
                    </span>
                  </h2>
                </Reveal>

                <div className="relative mt-10 min-h-[260px]">
                  {STEPS.map((step, i) => {
                    const isActive = i === active;
                    const isPast = i < active;
                    return (
                      <div
                        key={step.n}
                        className="absolute inset-0 transition-all duration-500 ease-out"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? "translateY(0px)"
                            : `translateY(${isPast ? -24 : 24}px)`,
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
                            <p className="mt-5 text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted max-w-[40ch]">
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
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? "translateY(0px) scale(1)"
                          : `translateY(${isPast ? -32 : 32}px) scale(0.97)`,
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                      aria-hidden={!isActive}
                    >
                      <Card className="w-full max-w-[440px] p-2 lg:p-3 shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)] border border-paper-edge bg-white">
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
