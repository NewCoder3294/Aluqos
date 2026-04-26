"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

type UseCase = {
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets: string[];
  stat: string;
  cta:
    | { label: string; action: typeof hireProductManager }
    | { label: string; comingSoon: true; agent: string };
};

const USE_CASES: UseCase[] = [
  {
    eyebrow: "Product teams",
    title: "Ship PRDs without burning your PMs.",
    subtitle:
      "Alex turns the noise of feature requests into something a roadmap can hold.",
    bullets: [
      "Drafts PRDs from Slack threads automatically",
      "Tracks feature requests across channels",
      "Roadmap updates that match your voice",
      "Sprint reviews summarized in 60 seconds",
    ],
    stat: "Average team saves 6h/week",
    cta: { label: "Hire Alex", action: hireProductManager },
  },
  {
    eyebrow: "Ops & program mgmt",
    title: "Status updates, action items, and risks — covered.",
    subtitle:
      "Jordan keeps the org honest about what was decided and what slipped.",
    bullets: [
      "Attends meetings, extracts action items",
      "Drafts weekly status updates for #leadership",
      "Maintains the risk register",
      "Updates Jira / Notion / Asana in real time",
    ],
    stat: "Reclaim 1.5 days per sprint",
    cta: { label: "Hire Jordan", comingSoon: true, agent: "Jordan" },
  },
  {
    eyebrow: "Marketing & content",
    title: "Brand voice that doesn't sound like AI.",
    subtitle:
      "Sam learns your voice from past content, then ships in your channels.",
    bullets: [
      "Learns your voice from past content",
      "Drafts posts, emails, campaigns end-to-end",
      "Catches brand voice drift automatically",
      "Schedules and publishes on your channels",
    ],
    stat: "Output 4× per week, voice score 94+",
    cta: { label: "Hire Sam", comingSoon: true, agent: "Sam" },
  },
];

function UseCaseCard({ uc, index }: { uc: UseCase; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      whileHover="hover"
      className="flex"
    >
      <motion.div
        variants={{
          hover: {
            y: -4,
            boxShadow: "0 18px 40px -22px rgba(31,29,26,0.22)",
          },
        }}
        transition={{ duration: 0.35, ease: EASE }}
        className="w-full"
      >
        <Card className="flex flex-col h-full">
          <CardContent className="flex-1 flex flex-col gap-5">
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-coral-deep font-medium">
              {uc.eyebrow}
            </div>
            <Serif as="h3" className="text-[22px] leading-tight tracking-[-0.01em]">
              {uc.title}
            </Serif>
            <p className="text-[14px] leading-[1.6] text-ink-muted">
              {uc.subtitle}
            </p>

            <ul className="space-y-2.5 mt-1">
              {uc.bullets.map(b => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-muted"
                >
                  <Check
                    className="w-4 h-4 mt-0.5 shrink-0 text-coral-deep"
                    aria-hidden
                  />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-5 border-t border-paper-edge flex items-center justify-between gap-3">
              <div className="text-[12px] text-ink-faint italic serif leading-snug min-w-0">
                {uc.stat}
              </div>
              {"comingSoon" in uc.cta ? (
                <Badge variant="outline" className="shrink-0">
                  {uc.cta.agent} — coming soon
                </Badge>
              ) : (
                <form action={uc.cta.action}>
                  <Button variant="ink" size="md" type="submit">
                    {uc.cta.label} &rarr;
                  </Button>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function LandingUseCases() {
  return (
    <section id="use-cases" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          Use cases
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[22ch]">
          Hire by{" "}
          <span className="italic text-ink-faint">what you need.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-ink-muted">
          Each AI employee is a specialist trained for a specific function — not
          a chat box you have to coax into being useful.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {USE_CASES.map((uc, i) => (
          <UseCaseCard key={uc.eyebrow} uc={uc} index={i} />
        ))}
      </div>
    </section>
  );
}
