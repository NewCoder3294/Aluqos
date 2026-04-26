import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";

const STATS: Array<{ value: string; label: string; caption: string }> = [
  {
    value: "90%",
    label: "of non-technical employees never adopt AI tools",
    caption: "Gartner, 2024",
  },
  {
    value: "6 weeks",
    label: "average ramp on a new AI workflow",
    caption: "Internal interviews, n=23",
  },
  {
    value: "$0",
    label:
      "of ChatGPT Enterprise revenue used by ops teams at one 150-person SaaS",
    caption: "Saathi customer interview",
  },
];

export function LandingProblem() {
  return (
    <section id="product" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <div className="text-[12px] tracking-[0.14em] uppercase text-[--color-coral-deep] font-medium">
        The state of AI at work
      </div>
      <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[18ch]">
        AI tools are powerful. <span className="italic text-[--color-ink-faint]">If you know how to use them.</span>
      </h2>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
        <div className="space-y-5">
          <p className="serif text-[20px] leading-[1.55] text-[--color-ink]">
            Every AI tool today puts the burden on the human.
          </p>
          <p className="text-[16px] leading-[1.7] text-[--color-ink-muted] max-w-[56ch]">
            Non-technical users can&rsquo;t write effective prompts. Setup
            requires IT, engineers, or AI expertise. Companies spend weeks on
            training, not results &mdash; and then watch adoption flatline three
            sprints in.
          </p>
          <p className="text-[16px] leading-[1.7] text-[--color-ink-muted] max-w-[56ch]">
            The tools are powerful. The interface is the wrong shape.
          </p>
        </div>

        <div className="space-y-3">
          {STATS.map(s => (
            <Card key={s.value}>
              <CardContent className="flex items-baseline gap-5">
                <Serif className="text-[44px] tracking-[-0.02em] text-[--color-ink] leading-none shrink-0">
                  {s.value}
                </Serif>
                <div className="min-w-0">
                  <div className="text-[15px] leading-[1.5] text-[--color-ink-muted]">
                    {s.label}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
                    {s.caption}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pull quote */}
      <figure className="mt-16 lg:mt-20 max-w-3xl border-l-2 border-[--color-coral] pl-6 lg:pl-8">
        <blockquote className="serif italic text-[clamp(24px,3vw,36px)] leading-[1.25] text-[--color-ink]">
          &ldquo;We bought ChatGPT Enterprise. Nobody uses it.&rdquo;
        </blockquote>
        <figcaption className="mt-4 text-[12px] tracking-[0.12em] uppercase text-[--color-ink-faint]">
          &mdash; Head of Ops, 150-person SaaS company
        </figcaption>
      </figure>
    </section>
  );
}
