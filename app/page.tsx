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

export default function Home() {
  return (
    <div className="min-h-screen bg-[--color-paper] text-[--color-ink]">
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
  );
}
