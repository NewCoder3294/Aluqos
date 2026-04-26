"use client";

import { Serif } from "@/src/components/serif";
import { Card } from "@/src/components/ui/card";
import { Reveal } from "./motion-primitives";
import { EarlyAccessDialog } from "./early-access-dialog";

export function LandingCTA() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Reveal>
        <Card
          tone="primary"
          className="relative overflow-hidden px-8 lg:px-16 py-14 lg:py-20"
        >
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
              We&rsquo;re onboarding the first 12 design partners now.
            </p>
            <div className="mt-10 flex justify-center">
              <EarlyAccessDialog />
            </div>
            <div className="mt-6 text-[12.5px] text-ink-faint">
              Free for the first 12 design partners.
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
