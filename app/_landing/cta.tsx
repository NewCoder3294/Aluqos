import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";

export function LandingCTA() {
  return (
    <section id="pricing" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Card tone="primary" className="px-8 lg:px-16 py-14 lg:py-20 text-center">
        <Serif as="h2" className="text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch] mx-auto">
          Stop asking humans to learn AI.
        </Serif>
        <p className="serif italic text-[clamp(22px,3vw,32px)] leading-[1.2] text-[--color-coral-deep] mt-3 max-w-[20ch] mx-auto">
          Let AI learn humans.
        </p>
        <p className="mt-6 text-[16px] text-[--color-ink-muted]">
          Free for the first 12 design partners.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <form action={hireProductManager}>
            <Button variant="ink" size="lg" type="submit">
              Hire your first AI employee
            </Button>
          </form>
          <Button variant="outline" size="lg" asChild>
            <a href="mailto:hello@saathi.ai">Talk to founders</a>
          </Button>
        </div>
      </Card>
    </section>
  );
}
