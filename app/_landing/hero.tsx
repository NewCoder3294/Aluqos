"use client";

import { motion, useReducedMotion } from "motion/react";
import { Clock } from "lucide-react";
import { hireProductManager } from "@/src/server/hire";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { WorkspaceMockup } from "./workspace-mockup";
import { DemoDialog } from "./demo-dialog";
import { EASE, Reveal } from "./motion-primitives";

export function LandingHero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="top"
      className="relative pt-24 pb-8 lg:pt-32 lg:pb-12"
    >
      {/* Centered text block */}
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <Reveal>
          <div className="flex flex-col items-center gap-3">
            <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
              AI Employees that learn
            </div>
            <Badge variant="outline" className="gap-1.5 px-2.5 py-1 uppercase tracking-[0.14em] text-[10.5px] text-ink-faint">
              <Clock className="w-3 h-3" aria-hidden />
              5-min onboarding
            </Badge>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="serif mt-6 text-[clamp(56px,8vw,96px)] leading-[1.02] tracking-[-0.025em] text-ink">
            AI employees that learn how you work.{" "}
            <span className="italic text-ink-faint block">
              Not the other way around.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-7 mx-auto max-w-[56ch] text-[18px] lg:text-[20px] leading-[1.55] text-ink-muted">
            Build AI employees in minutes. No prompts, no engineers, no
            upskilling &mdash; they shadow how you work and start contributing on
            day one.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <form action={hireProductManager}>
              <Button variant="ink" size="lg" type="submit">
                Get early access
              </Button>
            </form>
            <DemoDialog />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-6 text-[12.5px] text-ink-faint">
            Trusted by teams at{" "}
            <span className="font-medium text-ink-muted">Nike</span>
            <span aria-hidden> &middot; </span>
            <span className="font-medium text-ink-muted">UCSD</span>
            <span aria-hidden> &middot; </span>
            <span className="font-medium text-ink-muted">T-Mobile</span>
            <span aria-hidden> &middot; </span>
            <span className="font-medium text-ink-muted">Shipd</span>
            <span aria-hidden> &middot; </span>
            <span className="font-medium text-ink-muted">HPE</span>
          </p>
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
            {/* soft paper backdrop behind the screenshot */}
            <div className="absolute -inset-6 lg:-inset-8 bg-paper-hi rounded-2xl -z-10" />
            <WorkspaceMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
