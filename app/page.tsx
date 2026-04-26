"use client";

import { MotionConfig } from "motion/react";
import { LandingNav } from "./_landing/nav";
import { LandingHero } from "./_landing/hero";
import { LandingTrust } from "./_landing/trust";
import { LandingCustomerWins } from "./_landing/customer-wins";
import { LandingProblem } from "./_landing/problem";
import { LandingFlip } from "./_landing/flip";
import { LandingUseCases } from "./_landing/use-cases";
import { LandingBento } from "./_landing/bento";
import { LandingHow } from "./_landing/how";
import { LandingTeam } from "./_landing/team";
import { LandingWhyNow } from "./_landing/why-now";
import { LandingCTA } from "./_landing/cta";
import { LandingFooter } from "./_landing/footer";
import { ScrollProgress } from "./_landing/motion-primitives";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper text-ink">
        <ScrollProgress />
        <LandingNav />
        <main>
          <LandingHero />
          <LandingTrust />
          <LandingCustomerWins />
          <LandingProblem />
          <LandingFlip />
          <LandingUseCases />
          <LandingBento />
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
