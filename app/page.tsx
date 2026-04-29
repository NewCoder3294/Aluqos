"use client";

import { MotionConfig } from "motion/react";
import { LandingNav } from "./_landing/nav";
import { LandingHeroEditorial } from "./_landing/hero-editorial";
import { LandingTrust } from "./_landing/trust";
import { LandingHow } from "./_landing/how";
import { LandingIntegrations } from "./_landing/integrations";
import { LandingArchitecture } from "./_landing/architecture";
import { LandingFounders } from "./_landing/founders";
import { LandingCTA } from "./_landing/cta";
import { LandingFooter } from "./_landing/footer";
import { ScrollProgress } from "./_landing/motion-primitives";

// Sections kept on disk but unmounted (waiting on Nicolas):
//   - meetings.tsx, three-agents.tsx, skills-library.tsx, faq.tsx
//     (LOI-content round; pulled out pending direction)
//   - team.tsx ("Meet Alex") — replaced by architecture.tsx

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
          <LandingArchitecture />
          <LandingFounders />
          <LandingCTA />
        </main>
        <LandingFooter />
      </div>
    </MotionConfig>
  );
}
