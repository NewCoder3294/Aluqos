"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { Card } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

const ROWS: Array<{ old: string; aluqos: string }> = [
  { old: "Human learns prompts", aluqos: "AI learns how YOU work" },
  { old: "Generic setup required", aluqos: "Personalized from day 1" },
  { old: "Static, no memory", aluqos: "Gets smarter over time" },
  { old: "Technical users only", aluqos: "Anyone can use it" },
  { old: "You adapt to AI", aluqos: "AI adapts to you" },
];

export function LandingFlip() {
  return (
    <section className="bg-paper-hi/40 border-y border-paper-edge">
      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <Reveal>
          <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
            The flip
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
            We invert the model.{" "}
            <span className="italic text-ink-faint">The AI upskills itself.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted">
            Aluqos flips the burden. Instead of teaching people to talk to AI, we
            teach AI to learn from people &mdash; their tools, their patterns, their
            taste. The way a new colleague would.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <Card className="mt-12 overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-2 border-b border-paper-edge bg-white">
              <div className="px-6 py-4 border-r border-paper-edge">
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  Old AI tools
                </div>
              </div>
              <div className="px-6 py-4">
                <Serif className="text-[18px] text-coral-deep">Aluqos</Serif>
              </div>
            </div>

            <ul>
              {ROWS.map((row, i) => (
                <FlipRow
                  key={row.old}
                  row={row}
                  index={i}
                  last={i === ROWS.length - 1}
                />
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

function FlipRow({
  row,
  index,
  last,
}: {
  row: { old: string; aluqos: string };
  index: number;
  last: boolean;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
      whileHover="hover"
      className={
        "group grid grid-cols-2 transition-colors duration-200 hover:bg-coral/[0.05] " +
        (!last ? "border-b border-paper-edge" : "")
      }
    >
      <div className="px-6 py-5 border-r border-paper-edge flex items-start gap-3 text-ink-muted">
        <X
          className="w-4 h-4 mt-0.5 shrink-0 text-ink-faint"
          aria-hidden
        />
        <span className="text-[15px] leading-snug">{row.old}</span>
      </div>
      <div className="px-6 py-5 flex items-start gap-3 text-ink">
        <motion.span
          variants={{ hover: { x: 4 } }}
          transition={{ duration: 0.25, ease: EASE }}
          className="shrink-0"
        >
          <Check
            className="w-4 h-4 mt-0.5 text-coral-deep"
            aria-hidden
          />
        </motion.span>
        <span className="serif text-[16px] leading-snug">{row.aluqos}</span>
      </div>
    </motion.li>
  );
}
