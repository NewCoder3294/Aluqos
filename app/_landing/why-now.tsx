import { Brain, Plug, TrendingUp, Users } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";

type Reason = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
};

const REASONS: Reason[] = [
  {
    Icon: Brain,
    title: "LLMs are finally good enough to learn context.",
    body: "200K-token context windows, sub-second TTFT, multi-modal in/out — LLMs can finally observe and adapt the way a colleague would.",
  },
  {
    Icon: Plug,
    title: "OAuth + MCP made tool integration trivial.",
    body: "Connecting your AI to Slack, Notion, Jira, GitHub used to take weeks. Now it's a checkbox.",
  },
  {
    Icon: TrendingUp,
    title: "Enterprises are budgeting for AI — but have no adoption.",
    body: "Every CIO has a line item. None of them know what to deploy. We're the answer.",
  },
  {
    Icon: Users,
    title: "Non-technical buyers now have purchasing power.",
    body: "PMs, ops leads, marketing — they own AI budgets now. They don't want a prompt engineer; they want an employee.",
  },
];

export function LandingWhyNow() {
  return (
    <section
      id="why"
      className="bg-[--color-paper-hi]/40 border-y border-[--color-paper-edge]"
    >
      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <div className="text-[12px] tracking-[0.14em] uppercase text-[--color-coral-deep] font-medium">
          Why now
        </div>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[18ch]">
          The window <span className="italic text-[--color-ink-faint]">is open.</span>
        </h2>
        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-[--color-ink-muted]">
          Four shifts arrived in the last eighteen months. Together, they make
          AI employees practical for the first time.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
          {REASONS.map(r => (
            <Card key={r.title}>
              <CardContent className="flex flex-col gap-4">
                <r.Icon
                  className="w-5 h-5 text-[--color-coral-deep]"
                  aria-hidden
                />
                <Serif as="h3" className="text-[20px] leading-snug">
                  {r.title}
                </Serif>
                <p className="text-[14px] leading-[1.65] text-[--color-ink-muted]">
                  {r.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
