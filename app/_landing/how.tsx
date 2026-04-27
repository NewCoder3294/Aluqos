"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { Card, CardContent } from "@/src/components/ui/card";
import { FileText, Hash, CheckCircle2 } from "lucide-react";
import { EASE, Reveal } from "./motion-primitives";

// ─── Step visuals (right-side cards) ──────────────────────────────────
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
              whileInView={reduced ? undefined : { scaleX: 1, opacity: 1 }}
              viewport={{ once: false, amount: 0.6 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              style={{ width: `${w}%`, originX: 0 }}
              className={"h-2.5 rounded-full relative " + (isActive ? "bg-coral/30" : "bg-paper-hi")}
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
          &ldquo;Ops needs board-ready exports. Engineering owns the dashboard renderer.&rdquo;
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
            Drafted the PRD for bulk export &mdash; 6 sections, sourced from Q2 roadmap + issue 47.
            Ready for your read.
          </p>
          <div className="mt-3.5 flex items-center gap-2 px-3.5 py-2.5 rounded-md border border-paper-edge bg-paper-hi/60">
            <FileText className="w-4 h-4 text-coral shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-ink truncate">PRD — Bulk export for ops</div>
              <div className="text-[10px] text-ink-faint">6 sections · 1,240 words</div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.12em] text-coral-deep border border-coral/30 rounded-full px-2 py-0.5 shrink-0">
              Pending
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {[
              { e: "👀", n: 3 },
              { e: "🔥", n: 2 },
              { e: "✅", n: 1 },
            ].map(r => (
              <span
                key={r.e}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-paper-hi border border-paper-edge text-[11px]"
              >
                <span>{r.e}</span>
                <span className="text-ink-faint">{r.n}</span>
              </span>
            ))}
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

// ─── Left scene (text only — visual lives in the pinned right column) ─
function StepCopy({
  step,
  index,
  active,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: number;
}) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const blur = useTransform(scrollYProgress, [0, 0.4, 0.5, 0.6, 1], [10, 0, 0, 0, 10]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.5, 0.65, 1], [0.2, 1, 1, 1, 0.2]);
  const filter = useTransform(blur, b => `blur(${b}px)`);

  const isActive = index === active;

  return (
    <div ref={ref} className="min-h-screen flex items-center py-16 lg:py-24">
      <motion.div
        style={reduced ? undefined : { opacity, filter }}
        className="w-full flex gap-6 lg:gap-10"
      >
        {/* Vertical timeline marker */}
        <div className="hidden sm:flex flex-col items-center shrink-0 pt-2">
          <span
            className={`serif text-[20px] tracking-[-0.02em] leading-none transition-colors ${
              isActive ? "text-coral-deep" : "text-ink-faint/50"
            }`}
          >
            {step.n}
          </span>
          <div className="mt-3 w-px flex-1 bg-paper-edge relative overflow-hidden">
            {isActive && (
              <motion.div
                layoutId="how-timeline-fill"
                className="absolute inset-x-0 top-0 h-2/3 bg-coral/50"
              />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[12px] tracking-[0.16em] uppercase text-coral-deep font-medium">
            {step.eyebrow}
          </div>
          <h3 className="serif mt-5 text-[clamp(40px,6vw,84px)] leading-[1.02] tracking-[-0.025em] text-ink">
            {step.title}{" "}
            <span className="italic-serif text-ink-faint">{step.titleAccent}</span>
          </h3>
          <p className="mt-7 text-[17px] lg:text-[18px] leading-[1.6] text-ink-muted max-w-[40ch]">
            {step.body}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── A single right-column card ────────────────────────────────────────
// Three of these stack absolutely on top of each other. As `active` changes,
// adjacent cards crossfade with a CSS transition — both visible mid-swap,
// the outgoing one slides slightly up, the incoming one slides up from below.
function PinnedCard({
  step,
  index,
  active,
}: {
  step: (typeof STEPS)[number];
  index: number;
  active: number;
}) {
  const Visual = step.Visual;
  const isActive = index === active;
  const isPast = index < active;

  return (
    <div
      className="absolute inset-0 flex items-center pointer-events-none transition-all duration-500 ease-out"
      style={{
        opacity: isActive ? 1 : 0,
        transform: isActive
          ? "translateY(0px)"
          : `translateY(${isPast ? -40 : 40}px)`,
      }}
      aria-hidden={!isActive}
    >
      <Card className="w-full p-2 lg:p-3 shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)] border border-paper-edge bg-white">
        <CardContent className="p-0">
          <Visual />
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main section — sticky right column, scrolling left scenes ────────
export function LandingHow() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track scroll progress through the whole stacked-scenes wrapper.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", v => {
    const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length)));
    if (idx !== active) setActive(idx);
  });

  const ActiveVisual = STEPS[active].Visual;

  return (
    <section id="how" className="relative isolate py-12 sm:py-16 px-4 sm:px-8 bg-paper">
      <div className="w-full">
        {/* Editorial framed card — matches Integrations.
            overflow-clip (NOT overflow-hidden) so sticky inside still pins. */}
        <div className="relative bg-paper-hi border border-paper-edge rounded-[2.5rem] shadow-[0_16px_64px_rgba(31,29,26,0.08)] overflow-clip">
          {/* visible grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(31,29,26,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(31,29,26,0.10) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at center, black 60%, transparent 95%)",
            }}
          />
          {/* "+" intersection marks */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(31,29,26,0.18) 1px, transparent 1.5px)`,
              backgroundSize: "224px 224px",
              backgroundPosition: "28px 28px",
            }}
          />
          {/* coral wash on the right (where the visual lives) */}
          <div
            className="absolute inset-y-0 right-0 w-2/3 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 75% 50%, rgba(196,100,73,0.12), transparent 65%)",
            }}
          />

          {/* Section header */}
          <div className="relative max-w-6xl mx-auto px-8 lg:px-16 pt-16 lg:pt-24 pb-4 lg:pb-8">
            <Reveal>
              <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
                How it works
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
                Like onboarding <span className="italic text-ink-faint">a smart intern.</span>
              </h2>
            </Reveal>
          </div>

          {/* Two-column wrapper:
              - Left col is tall (one viewport per scene) and scrolls normally
              - Right col is sticky-pinned and crossfades the active visual */}
          <div ref={wrapperRef} className="relative max-w-6xl mx-auto px-8 lg:px-16 pb-16 lg:pb-24 grid grid-cols-12 gap-6 lg:gap-12">
        {/* Left: stacked scenes */}
        <div className="col-span-12 lg:col-span-7">
          {STEPS.map((step, i) => (
            <StepCopy key={step.n} step={step} index={i} active={active} />
          ))}
        </div>

        {/* Right: sticky pinned visual — three cards stacked, fade across scroll */}
        <div className="hidden lg:block lg:col-span-5">
          <div className="sticky top-0 h-screen flex items-center">
            <div className="w-full">
              {/* Card stack — each is absolutely positioned in this relative box */}
              <div className="relative w-full" style={{ minHeight: 480 }}>
                {STEPS.map((step, i) => (
                  <PinnedCard
                    key={step.n}
                    step={step}
                    index={i}
                    active={active}
                  />
                ))}
              </div>

              {/* Step pip indicator under the stack */}
              <div className="mt-5 flex items-center justify-center gap-2">
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
          </div>
        </div>

        {/* Mobile: visual appears after each scene's text */}
        <div className="col-span-12 lg:hidden -mt-12 mb-12">
          <Card className="p-2 shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)] border border-paper-edge">
            <CardContent className="p-0">
              <ActiveVisual />
            </CardContent>
          </Card>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
}
