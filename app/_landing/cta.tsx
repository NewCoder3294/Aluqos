"use client";

import { Serif } from "@/src/components/serif";
import { Card } from "@/src/components/ui/card";
import { Reveal } from "./motion-primitives";
import { EarlyAccessDialog } from "./early-access-dialog";

export function LandingCTA() {
  return (
    <section id="get-started" className="max-w-6xl mx-auto px-6 py-16 lg:py-24">
      <Reveal>
        <Card
          tone="primary"
          className="relative overflow-hidden px-8 lg:px-16 py-12 lg:py-16"
        >
          <span
            aria-hidden
            className="cta-breathe pointer-events-none absolute inset-0"
          />
          <div className="relative text-center">
            <Serif
              as="h2"
              className="text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[-0.02em] max-w-[22ch] mx-auto"
            >
              Stop asking humans to learn AI.
            </Serif>
            <p className="serif italic text-[clamp(22px,3vw,32px)] leading-[1.2] text-coral-deep mt-3 max-w-[20ch] mx-auto">
              Let AI learn humans.
            </p>
            <p className="mt-6 text-[16px] text-ink-muted max-w-[48ch] mx-auto">
              Tell us the most repetitive thing on your team&rsquo;s plate. We&rsquo;ll
              show you what Aluqos would propose.
            </p>
            <div className="mt-10 flex justify-center">
              <EarlyAccessDialog source="footer-cta" triggerLabel="Request early access" />
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
