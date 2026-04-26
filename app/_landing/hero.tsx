"use client";

import { motion, useReducedMotion } from "motion/react";
import { hireProductManager } from "@/src/server/hire";
import { Button } from "@/src/components/ui/button";
import { WorkspaceMockup } from "./workspace-mockup";
import { DemoDialog } from "./demo-dialog";
import { EASE, Reveal } from "./motion-primitives";

export function LandingHero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="top"
      className="relative pt-28 pb-10 lg:pt-36 lg:pb-16 overflow-hidden"
    >
      {/* Headline + CTA */}
      <div className="max-w-[920px] mx-auto px-6 text-center">
        <Reveal>
          <h1 className="serif text-[clamp(60px,9vw,116px)] leading-[0.98] tracking-[-0.03em] text-ink">
            AI employees that learn how you work.{" "}
            <span className="italic text-coral-deep block">
              Not the other way around.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 mx-auto max-w-[58ch] text-[19px] lg:text-[21px] leading-[1.55] text-ink-muted">
            Build AI employees in minutes. No prompts, no engineers, no
            upskilling &mdash; they shadow how you work and start contributing on
            day one.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <form action={hireProductManager}>
              <Button variant="ink" size="lg" type="submit">
                Get early access
              </Button>
            </form>
            <DemoDialog />
          </div>
        </Reveal>
      </div>

      {/* Mockup — full width, big, breathing */}
      <div className="mt-16 lg:mt-20 max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.15, ease: EASE }}
          aria-hidden
          className="pointer-events-none select-none"
        >
          <div className="relative">
            <div className="absolute -inset-6 lg:-inset-8 bg-paper-hi rounded-2xl -z-10" />
            <WorkspaceMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
