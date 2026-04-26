import { Check, X } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { Card } from "@/src/components/ui/card";

const ROWS: Array<{ old: string; saathi: string }> = [
  { old: "Human learns prompts", saathi: "AI learns how YOU work" },
  { old: "Generic setup required", saathi: "Personalized from day 1" },
  { old: "Static, no memory", saathi: "Gets smarter over time" },
  { old: "Technical users only", saathi: "Anyone can use it" },
  { old: "You adapt to AI", saathi: "AI adapts to you" },
];

export function LandingFlip() {
  return (
    <section className="bg-[--color-paper-hi]/40 border-y border-[--color-paper-edge]">
      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <div className="text-[12px] tracking-[0.14em] uppercase text-[--color-coral-deep] font-medium">
          The flip
        </div>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
          We invert the model.{" "}
          <span className="italic text-[--color-ink-faint]">The AI upskills itself.</span>
        </h2>
        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-[--color-ink-muted]">
          Saathi flips the burden. Instead of teaching people to talk to AI, we
          teach AI to learn from people &mdash; their tools, their patterns, their
          taste. The way a new colleague would.
        </p>

        <Card className="mt-12 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-2 border-b border-[--color-paper-edge] bg-white">
            <div className="px-6 py-4 border-r border-[--color-paper-edge]">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[--color-ink-faint]">
                Old AI tools
              </div>
            </div>
            <div className="px-6 py-4">
              <Serif className="text-[18px] text-[--color-coral-deep]">Saathi</Serif>
            </div>
          </div>

          <ul>
            {ROWS.map((row, i) => (
              <li
                key={row.old}
                className={
                  "grid grid-cols-2 transition-colors duration-200 hover:bg-[--color-paper-hi]/40 " +
                  (i < ROWS.length - 1
                    ? "border-b border-[--color-paper-edge]"
                    : "")
                }
              >
                <div className="px-6 py-5 border-r border-[--color-paper-edge] flex items-start gap-3 text-[--color-ink-muted]">
                  <X
                    className="w-4 h-4 mt-0.5 shrink-0 text-[--color-ink-faint]"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-snug">{row.old}</span>
                </div>
                <div className="px-6 py-5 flex items-start gap-3 text-[--color-ink]">
                  <Check
                    className="w-4 h-4 mt-0.5 shrink-0 text-[--color-coral-deep]"
                    aria-hidden
                  />
                  <span className="serif text-[16px] leading-snug">
                    {row.saathi}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  );
}
