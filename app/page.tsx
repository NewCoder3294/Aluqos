"use client";

import { MotionConfig } from "motion/react";
import { LandingNav } from "./_landing/nav";
import { LandingHeroEditorial } from "./_landing/hero-editorial";
import { LandingTrust } from "./_landing/trust";
import { LandingIntegrations } from "./_landing/integrations";
import { LandingHow } from "./_landing/how";
import { LandingTeam } from "./_landing/team";
import { LandingFounders } from "./_landing/founders";
import { LandingCTA } from "./_landing/cta";
import { LandingFooter } from "./_landing/footer";
import { ScrollProgress } from "./_landing/motion-primitives";

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="landing-root min-h-screen bg-paper text-ink">
        <ScrollProgress />
        <LandingNav />
        <main>
          <LandingHeroEditorial />
          <LandingTrust />
          <LandingHow />
          <LandingIntegrations />
          <LandingTeam />
          <LandingFounders />
          <LandingCTA />
        </main>
        <LandingFooter />
      </div>
    </MotionConfig>
  );
}
