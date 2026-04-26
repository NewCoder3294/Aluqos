import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { WorkspaceMockup } from "./workspace-mockup";
import { DemoDialog } from "./demo-dialog";

export function LandingHero() {
  return (
    <section
      id="top"
      className="relative max-w-6xl mx-auto px-6 pt-14 lg:pt-24 pb-16 lg:pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[44fr_56fr] gap-10 lg:gap-14 items-center">
        {/* Left: copy */}
        <div>
          <div className="text-[12px] tracking-[0.14em] uppercase text-[--color-coral-deep] font-medium">
            AI Employees that learn
          </div>

          <h1 className="serif mt-5 text-[clamp(44px,7vw,80px)] leading-[1.05] tracking-[-0.02em] text-[--color-ink]">
            AI employees that learn how you work.{" "}
            <span className="italic text-[--color-ink-faint] block">
              Not the other way around.
            </span>
          </h1>

          <p className="mt-7 max-w-[56ch] text-[18px] lg:text-[20px] leading-[1.55] text-[--color-ink-muted]">
            Build AI employees in minutes. No prompts, no engineers, no
            upskilling &mdash; they shadow how you work and start contributing on
            day one.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <form action={hireProductManager}>
              <Button variant="ink" size="lg" type="submit">
                Get early access
              </Button>
            </form>
            <DemoDialog />
          </div>

          <p className="mt-6 text-[12px] text-[--color-ink-faint]">
            Backed by YC &middot; 12 design partners onboarding now
          </p>
        </div>

        {/* Right: product mockup */}
        <div
          aria-hidden
          className="pointer-events-none select-none"
        >
          <div className="relative">
            {/* soft paper backdrop behind the screenshot */}
            <div className="absolute -inset-6 bg-[--color-paper-hi] rounded-2xl -z-10" />
            <WorkspaceMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
