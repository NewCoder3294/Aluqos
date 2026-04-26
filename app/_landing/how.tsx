"use client";

import { motion, useReducedMotion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";
import { FileText, Hash } from "lucide-react";
import { EASE, Reveal } from "./motion-primitives";

function DotGrid() {
  const reduced = useReducedMotion() ?? false;
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)",
      }}
    >
      <motion.div
        className="absolute -inset-8"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(28,24,22,0.22) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
        animate={reduced ? undefined : { backgroundPosition: ["0px 0px", "22px 22px"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function StepDescribeVisual() {
  return (
    <div className="rounded-md border border-paper-edge bg-paper-hi/50 p-4">
      <div className="text-[9px] uppercase tracking-[0.12em] text-ink-faint mb-3">
        New AI employee
      </div>
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full text-white grid place-items-center serif text-[20px]"
          style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          aria-hidden
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="serif text-[15px] text-ink">Alex</div>
          <div className="text-[11px] text-ink-faint uppercase tracking-[0.12em]">
            Product Manager
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          { k: "Tone", v: "Direct, warm" },
          { k: "Priorities", v: "Customer truth > velocity" },
          { k: "Style", v: "Short PRDs, sharp problems" },
        ].map(row => (
          <div
            key={row.k}
            className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded bg-white border border-paper-edge"
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
  // Lines that animate in sequence as if the agent is reading the doc top→bottom
  const widths = [94, 82, 100, 68, 55];
  return (
    <div className="rounded-md border border-paper-edge bg-white p-4">
      <div className="text-[9px] uppercase tracking-[0.12em] text-ink-faint mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-coral" />
          q2-roadmap.pdf
        </span>
        <span className="flex items-center gap-1 text-coral">
          <span className="size-1 rounded-full bg-coral pulse-coral" />
          reading
        </span>
      </div>
      <div className="space-y-1.5">
        {widths.map((w, i) => {
          const isActive = i === widths.length - 1;
          return (
            <motion.div
              key={i}
              initial={reduced ? false : { scaleX: 0, opacity: 0.4 }}
              whileInView={reduced ? undefined : { scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{
                duration: 0.6,
                delay: i * 0.18,
                ease: EASE,
              }}
              style={{ width: `${w}%`, originX: 0 }}
              className={
                "h-2 rounded-full relative " +
                (isActive ? "bg-coral/30" : "bg-paper-hi")
              }
            >
              {isActive && (
                <span
                  className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-coral animate-pulse"
                  aria-hidden
                />
              )}
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-paper-edge">
        <div className="text-[9px] uppercase tracking-[0.12em] text-coral mb-1">
          Extracted
        </div>
        <div className="text-[11px] text-ink serif italic leading-snug">
          &ldquo;Ops needs board-ready exports. Engineering owns the dashboard
          renderer.&rdquo;
        </div>
      </div>
    </div>
  );
}

function StepDeployVisual() {
  return (
    <div className="rounded-md border border-paper-edge bg-white p-3">
      <div className="text-[9px] uppercase tracking-[0.12em] text-ink-faint mb-3 flex items-center gap-1.5">
        <Hash className="w-3 h-3" />
        product-team
      </div>
      <div className="flex gap-2.5">
        <div
          className="w-8 h-8 rounded text-white grid place-items-center serif text-[13px] shrink-0"
          style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          aria-hidden
        >
          A
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="serif text-[12px] text-ink">Alex</span>
            <span className="text-[9px] text-ink-faint">9:41</span>
          </div>
          <p className="mt-0.5 text-[11.5px] leading-snug text-ink-muted">
            Drafted the PRD for bulk export &mdash; 6 sections, sourced from Q2
            roadmap + issue 47. Ready for your read.
          </p>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "1",
    title: "Describe.",
    italic: "Design your AI like an avatar — name, role, personality.",
    body: "Give them a name, a role, a personality. Tell them how you like to work — tone, priorities, style. Just like briefing a new hire on their first day.",
    Visual: StepDescribeVisual,
  },
  {
    n: "2",
    title: "It learns from you.",
    italic: "Watches, listens, adapts. No prompts, ever.",
    body: "Your AI employee shadows your work — reads your docs, observes your patterns, picks up your voice. No training. No prompts. It just learns, like a smart colleague would.",
    Visual: StepLearnVisual,
  },
  {
    n: "3",
    title: "Deploy.",
    italic: "Ready to work in minutes. Shows up where you do.",
    body: "Your AI employee shows up in Slack, email, or wherever you work. Assign them tasks. They get smarter with every interaction.",
    Visual: StepDeployVisual,
  },
];

export function LandingHow() {
  return (
    <section id="how" className="relative isolate py-24 lg:py-32 overflow-hidden">
      <DotGrid />
      <div className="relative max-w-6xl mx-auto px-6">
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          How it works
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
          Like onboarding{" "}
          <span className="italic text-ink-faint">a smart intern.</span>
        </h2>
      </Reveal>

      <div className="relative mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {STEPS.map((s, i) => {
          const Visual = s.Visual;
          return (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="flex"
            >
              <Card className="flex flex-col w-full">
                <CardContent className="flex flex-col gap-4">
                  {/* Editorial step counter — number + pagination tag */}
                  <div className="flex items-baseline justify-between border-b border-paper-edge pb-3">
                    <span className="serif text-[44px] leading-none text-coral-deep tracking-[-0.03em]">
                      {`0${s.n}`}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                      Step {s.n} / {STEPS.length}
                    </span>
                  </div>

                  <div>
                    <Serif as="h3" className="text-[22px] leading-tight">
                      {s.title}
                    </Serif>
                    <div className="serif italic text-[14px] text-ink-muted mt-1.5 leading-snug">
                      {s.italic}
                    </div>
                  </div>
                  <p className="text-[14px] leading-[1.65] text-ink-muted">
                    {s.body}
                  </p>
                  <div className="mt-auto pt-2">
                    <Visual />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
