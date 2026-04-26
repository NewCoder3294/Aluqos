"use client";

import { motion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

type Win = {
  /** Brand name for a11y. */
  name: string;
  /** Visual wordmark — text only, on-brand cadence. */
  render: string;
  /** Tailwind classes that drive the wordmark weight + tracking. */
  wordmarkClass: string;
  /** Headline number-as-outcome. */
  stat: string;
  /** Caption beneath the stat. */
  caption: string;
  /** Function/team eyebrow. */
  eyebrow: string;
};

const WINS: Win[] = [
  {
    name: "Nike",
    render: "NIKE",
    wordmarkClass: "font-extrabold tracking-[0.04em]",
    stat: "8h",
    caption: "saved per PM per week",
    eyebrow: "Product team",
  },
  {
    name: "UC San Diego",
    render: "UC SAN DIEGO",
    wordmarkClass: "font-semibold tracking-[0.03em]",
    stat: "30",
    caption: "PRDs drafted in 1 sprint",
    eyebrow: "Research ops",
  },
  {
    name: "T-Mobile",
    render: "T·Mobile",
    wordmarkClass: "font-bold tracking-[-0.005em]",
    stat: "30%",
    caption: "faster sprint reviews",
    eyebrow: "Program mgmt",
  },
  {
    name: "Shipd",
    render: "Shipd",
    wordmarkClass: "font-medium tracking-[-0.01em]",
    stat: "$0",
    caption: "onboarding cost for new PM hires",
    eyebrow: "Product",
  },
  {
    name: "HPE",
    render: "HPE",
    wordmarkClass: "font-extrabold tracking-[0.05em]",
    stat: "12 → 76%",
    caption: "AI adoption inside 1 quarter",
    eyebrow: "Ops",
  },
];

function WinCard({ win, index }: { win: Win; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      whileHover={{ y: -3 }}
      className="flex"
    >
      <Card className="w-full">
        <CardContent compact className="flex flex-col gap-3 h-full">
          <div
            aria-label={win.name}
            className={
              "text-[13px] leading-none text-ink-faint whitespace-nowrap " +
              win.wordmarkClass
            }
          >
            {win.render}
          </div>
          <Serif className="text-[28px] leading-none tracking-[-0.02em] text-ink tabular-nums">
            {win.stat}
          </Serif>
          <p className="text-[13px] leading-snug text-ink-muted">
            {win.caption}
          </p>
          <div className="mt-auto pt-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">
            {win.eyebrow}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LandingCustomerWins() {
  return (
    <section
      aria-label="Customer outcomes"
      className="max-w-6xl mx-auto px-6 pt-16 lg:pt-20"
    >
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          Customer outcomes
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-3 text-[clamp(22px,2.6vw,30px)] leading-[1.2] tracking-[-0.01em] text-ink-muted max-w-[44ch]">
          The <span className="text-ink">first cohort</span>{" "}
          <span className="italic text-ink-faint">is already shipping work.</span>
        </h2>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-4">
        {WINS.map((win, i) => (
          <WinCard key={win.name} win={win} index={i} />
        ))}
      </div>
    </section>
  );
}
