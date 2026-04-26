"use client";

import { motion } from "motion/react";
import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

type Path = {
  eyebrow: string;
  title: string;
  description: string;
  cta: React.ReactNode;
};

function PathCard({ path, index }: { path: Path; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -3 }}
      className="flex"
    >
      <Card className="w-full flex flex-col">
        <CardContent className="flex-1 flex flex-col gap-4">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-coral-deep font-medium">
            {path.eyebrow}
          </div>
          <Serif as="h3" className="text-[22px] leading-tight tracking-[-0.01em]">
            {path.title}
          </Serif>
          <p className="text-[14px] leading-[1.6] text-ink-muted">
            {path.description}
          </p>
          <div className="mt-auto pt-3">{path.cta}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function LandingCTA() {
  const paths: Path[] = [
    {
      eyebrow: "Try the demo",
      title: "Hire your first AI employee.",
      description:
        "Walk through the onboarding flow. Brief Alex on your team and watch them ship a PRD live.",
      cta: (
        <form action={hireProductManager}>
          <Button variant="ink" size="md" type="submit">
            Get early access &rarr;
          </Button>
        </form>
      ),
    },
    {
      eyebrow: "Talk to founders",
      title: "15 minutes, no slides.",
      description:
        "Tell us how your team works today. We'll tell you whether Aluqos fits — straight up.",
      cta: (
        <Button variant="outline" size="md" asChild>
          <a href="mailto:hello@aluqos.ai">Book a 15-min intro &rarr;</a>
        </Button>
      ),
    },
    {
      eyebrow: "Read the build log",
      title: "How we got here.",
      description:
        "The decisions, the dead-ends, and what shipped this month. Updated on Fridays.",
      cta: (
        <Button variant="quiet" size="md" asChild>
          <a href="#">See what we shipped &rarr;</a>
        </Button>
      ),
    },
  ];

  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Reveal>
        <Card
          tone="primary"
          className="relative overflow-hidden px-8 lg:px-16 py-14 lg:py-20"
        >
          {/* Slow ambient breathing — coral/3 → coral/6 → coral/3 over 8s */}
          <span
            aria-hidden
            className="cta-breathe pointer-events-none absolute inset-0"
          />
          <div className="relative text-center">
            <Serif
              as="h2"
              className="text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch] mx-auto"
            >
              Stop asking humans to learn AI.
            </Serif>
            <p className="serif italic text-[clamp(22px,3vw,32px)] leading-[1.2] text-coral-deep mt-3 max-w-[20ch] mx-auto">
              Let AI learn humans.
            </p>
            <p className="mt-6 text-[16px] text-ink-muted max-w-[44ch] mx-auto">
              Three ways in. Pick the one that fits where you are today.
            </p>
          </div>
          <div className="relative mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {paths.map((p, i) => (
              <PathCard key={p.eyebrow} path={p} index={i} />
            ))}
          </div>
          <div className="relative mt-10 text-center text-[12.5px] text-ink-faint">
            Free for the first 12 design partners.
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
