"use client";

import { MotionConfig } from "motion/react";
import { LandingNav } from "./_landing/nav";
import { LandingHero } from "./_landing/hero";
import { LandingTrust } from "./_landing/trust";
import { LandingProblem } from "./_landing/problem";
import { LandingFlip } from "./_landing/flip";
import { LandingHow } from "./_landing/how";
import { LandingTeam } from "./_landing/team";
import { LandingWhyNow } from "./_landing/why-now";
import { LandingCTA } from "./_landing/cta";
import { LandingFooter } from "./_landing/footer";
import { ScrollProgress } from "./_landing/motion-primitives";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[--color-paper] text-[--color-ink]">
        <ScrollProgress />
        <LandingNav />
        <main>
          <LandingHero />
          <LandingTrust />
          <LandingProblem />
          <LandingFlip />
          <LandingHow />
          <LandingTeam />
          <LandingWhyNow />
          <LandingCTA />
        </main>
        <LandingFooter />
      </div>
    </MotionConfig>
  );
}
