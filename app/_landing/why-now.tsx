"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Brain, Plug, TrendingUp, Users } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

type Reason = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
};

const REASONS: Reason[] = [
  {
    Icon: Brain,
    title: "LLMs are finally good enough to learn context.",
    body: "200K-token context windows, sub-second TTFT, multi-modal in/out — LLMs can finally observe and adapt the way a colleague would.",
  },
  {
    Icon: Plug,
    title: "OAuth + MCP made tool integration trivial.",
    body: "Connecting your AI to Slack, Notion, Jira, GitHub used to take weeks. Now it's a checkbox.",
  },
  {
    Icon: TrendingUp,
    title: "Enterprises are budgeting for AI — but have no adoption.",
    body: "Every CIO has a line item. None of them know what to deploy. We're the answer.",
  },
  {
    Icon: Users,
    title: "Non-technical buyers now have purchasing power.",
    body: "PMs, ops leads, marketing — they own AI budgets now. They don't want a prompt engineer; they want an employee.",
  },
];

function ReasonCard({
  reason,
  index,
  pulse,
}: {
  reason: Reason;
  index: number;
  pulse: boolean;
}) {
  // 2x2 grid stagger 0/0.06/0.12/0.18
  const delay = index * 0.06;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      whileHover="hover"
    >
      <Card>
        <CardContent className="flex flex-col gap-4">
          <motion.div
            variants={{
              hover: {
                rotate: [0, 6, -4, 2, 0],
                color: "var(--color-coral-deep)",
                transition: { duration: 0.5, ease: EASE },
              },
            }}
            animate={pulse ? { scale: [1, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-coral-deep w-5 h-5"
          >
            <reason.Icon className="w-5 h-5" aria-hidden />
          </motion.div>
          <Serif as="h3" className="text-[20px] leading-snug">
            {reason.title}
          </Serif>
          <p className="text-[14px] leading-[1.65] text-ink-muted">
            {reason.body}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LandingWhyNow() {
  const reduced = useReducedMotion() ?? false;
  const [pulseIdx, setPulseIdx] = React.useState<number | null>(null);

  // Every ~10s, a random card's icon pulses subtly.
  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      const next = Math.floor(Math.random() * REASONS.length);
      setPulseIdx(next);
      setTimeout(() => setPulseIdx(null), 700);
    }, 10000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      id="why"
      className="bg-paper-hi/40 border-y border-paper-edge"
    >
      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <Reveal>
          <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
            Why now
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[18ch]">
            The window <span className="italic text-ink-faint">is open.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted">
            Four shifts arrived in the last eighteen months. Together, they make
            AI employees practical for the first time.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {REASONS.map((r, i) => (
            <ReasonCard
              key={r.title}
              reason={r}
              index={i}
              pulse={pulseIdx === i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
