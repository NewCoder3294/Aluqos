"use client";

import { motion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";
import { FileText, Hash } from "lucide-react";
import { EASE, Reveal } from "./motion-primitives";

function StepDescribeVisual() {
  return (
    <div className="rounded-md border border-[--color-paper-edge] bg-[--color-paper-hi]/50 p-4">
      <div className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-3">
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
          <div className="serif text-[15px] text-[--color-ink]">Alex</div>
          <div className="text-[11px] text-[--color-ink-faint] uppercase tracking-[0.12em]">
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
            className="flex items-center justify-between text-[11px] py-1.5 px-2 rounded bg-white border border-[--color-paper-edge]"
          >
            <span className="text-[--color-ink-faint] uppercase tracking-[0.1em] text-[10px]">
              {row.k}
            </span>
            <span className="text-[--color-ink] serif">{row.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepLearnVisual() {
  return (
    <div className="rounded-md border border-[--color-paper-edge] bg-white p-4">
      <div className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-3 flex items-center gap-1.5">
        <FileText className="w-3 h-3" />
        Reading q2-roadmap.pdf
      </div>
      <div className="space-y-1.5">
        <div className="h-2 rounded-full bg-[--color-paper-hi]" style={{ width: "94%" }} />
        <div className="h-2 rounded-full bg-[--color-paper-hi]" style={{ width: "82%" }} />
        <div className="h-2 rounded-full bg-[--color-paper-hi]" style={{ width: "100%" }} />
        <div className="h-2 rounded-full bg-[--color-paper-hi]" style={{ width: "68%" }} />
        <div className="h-2 rounded-full bg-[--color-coral]/30 relative" style={{ width: "55%" }}>
          <span
            className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-[--color-coral] animate-pulse"
            aria-hidden
          />
        </div>
      </div>
      <div className="mt-3 text-[11px] text-[--color-ink-muted] serif italic leading-snug">
        &ldquo;Ops needs board-ready exports. Engineering owns the dashboard
        renderer.&rdquo;
      </div>
    </div>
  );
}

function StepDeployVisual() {
  return (
    <div className="rounded-md border border-[--color-paper-edge] bg-white p-3">
      <div className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-3 flex items-center gap-1.5">
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
            <span className="serif text-[12px] text-[--color-ink]">Alex</span>
            <span className="text-[9px] text-[--color-ink-faint]">9:41</span>
          </div>
          <p className="mt-0.5 text-[11.5px] leading-snug text-[--color-ink-muted]">
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

/**
 * Subtle horizontal coral hairline behind the 3 step cards (desktop only).
 * Animates pathLength 0 → 1 over 1.2s when scrolled into view.
 */
function ConnectorLine() {
  return (
    <svg
      aria-hidden
      className="hidden lg:block absolute left-0 right-0 top-[80px] w-full h-px pointer-events-none"
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
    >
      <motion.line
        x1="6"
        x2="94"
        y1="0.5"
        y2="0.5"
        stroke="var(--color-coral)"
        strokeWidth="0.4"
        strokeOpacity="0.35"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.2, ease: EASE }}
      />
    </svg>
  );
}

export function LandingHow() {
  return (
    <section id="how" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-[--color-coral-deep] font-medium">
          How it works
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
          Like onboarding{" "}
          <span className="italic text-[--color-ink-faint]">a smart intern.</span>
        </h2>
      </Reveal>

      <div className="relative mt-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ConnectorLine />
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
                  <div className="serif text-[36px] leading-none text-[--color-coral-deep] tracking-[-0.02em]">
                    {s.n}
                  </div>
                  <div>
                    <Serif as="h3" className="text-[22px] leading-tight">
                      {s.title}
                    </Serif>
                    <div className="serif italic text-[14px] text-[--color-ink-muted] mt-1.5 leading-snug">
                      {s.italic}
                    </div>
                  </div>
                  <p className="text-[14px] leading-[1.65] text-[--color-ink-muted]">
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
    </section>
  );
}
