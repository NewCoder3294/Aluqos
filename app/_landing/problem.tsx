"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

type Stat =
  | { kind: "count"; from: number; to: number; suffix: string; durationMs: number; label: string; caption: string }
  | { kind: "static"; value: string; label: string; caption: string };

const STATS: Stat[] = [
  {
    kind: "count",
    from: 0,
    to: 90,
    suffix: "%",
    durationMs: 1200,
    label: "of non-technical employees never adopt AI tools",
    caption: "Gartner, 2024",
  },
  {
    kind: "count",
    from: 0,
    to: 6,
    suffix: " weeks",
    durationMs: 800,
    label: "average ramp on a new AI workflow",
    caption: "Internal interviews, n=23",
  },
  {
    kind: "static",
    value: "$0",
    label:
      "of ChatGPT Enterprise revenue used by ops teams at one 150-person SaaS",
    caption: "Aluqos customer interview",
  },
];

function CountUp({
  from,
  to,
  durationMs,
  suffix,
  reduced,
  start,
}: {
  from: number;
  to: number;
  durationMs: number;
  suffix: string;
  reduced: boolean;
  start: boolean;
}) {
  const [val, setVal] = React.useState(reduced || !start ? to : from);

  React.useEffect(() => {
    if (reduced) {
      setVal(to);
      return;
    }
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / durationMs);
      // ease-out-expo
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [from, to, durationMs, reduced, start]);

  return (
    <>
      {val}
      {suffix}
    </>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
    >
      <Card>
        <CardContent className="flex items-baseline gap-5">
          {stat.kind === "count" ? (
            <Serif className="text-[44px] tracking-[-0.02em] text-[--color-ink] leading-none shrink-0 tabular-nums">
              <CountUp
                from={stat.from}
                to={stat.to}
                durationMs={stat.durationMs}
                suffix={stat.suffix}
                reduced={reduced}
                start={inView}
              />
            </Serif>
          ) : (
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.34, 1.3, 0.64, 1] }}
              className="shrink-0"
            >
              <Serif className="text-[44px] tracking-[-0.02em] text-[--color-ink] leading-none">
                {stat.value}
              </Serif>
            </motion.div>
          )}
          <div className="min-w-0">
            <div className="text-[15px] leading-[1.5] text-[--color-ink-muted]">
              {stat.label}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
              {stat.caption}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LandingProblem() {
  return (
    <section id="product" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-[--color-coral-deep] font-medium">
          The state of AI at work
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[18ch]">
          AI tools are powerful.{" "}
          <span className="italic text-[--color-ink-faint]">
            If you know how to use them.
          </span>
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
        <div className="space-y-5">
          <Reveal>
            <p className="serif text-[20px] leading-[1.55] text-[--color-ink]">
              Every AI tool today puts the burden on the human.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-[16px] leading-[1.7] text-[--color-ink-muted] max-w-[56ch]">
              Non-technical users can&rsquo;t write effective prompts. Setup
              requires IT, engineers, or AI expertise. Companies spend weeks on
              training, not results &mdash; and then watch adoption flatline three
              sprints in.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[16px] leading-[1.7] text-[--color-ink-muted] max-w-[56ch]">
              The tools are powerful. The interface is the wrong shape.
            </p>
          </Reveal>
        </div>

        <div className="space-y-3">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>

      {/* Pull quote */}
      <Reveal delay={0.05}>
        <figure className="mt-16 lg:mt-20 max-w-3xl border-l-2 border-[--color-coral] pl-6 lg:pl-8">
          <blockquote className="serif italic text-[clamp(24px,3vw,36px)] leading-[1.25] text-[--color-ink]">
            &ldquo;We bought ChatGPT Enterprise. Nobody uses it.&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-[12px] tracking-[0.12em] uppercase text-[--color-ink-faint]">
            &mdash; Head of Ops, 150-person SaaS company
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
