"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

type Role = {
  initial: string;
  name: string;
  role: string;
  gradient: string;
  capabilities: string[];
  cta: { label: string; action?: typeof hireProductManager } | { label: string; comingSoon: true };
};

const ROLES: Role[] = [
  {
    initial: "A",
    name: "Alex",
    role: "AI Product Manager",
    gradient: "linear-gradient(135deg,#e07a5f,#c46449)",
    capabilities: [
      "Writes PRDs from Slack & meeting notes",
      "Tracks feature requests & prioritizes backlog",
      "Drafts roadmap updates for stakeholders",
      "Summarizes sprint reviews automatically",
    ],
    cta: { label: "Hire Alex", action: hireProductManager },
  },
  {
    initial: "J",
    name: "Jordan",
    role: "AI Program Manager",
    gradient: "linear-gradient(135deg,#5a4f3d,#3a3026)",
    capabilities: [
      "Attends meetings, takes notes & follows up",
      "Tracks milestones, risks & blockers",
      "Auto-generates weekly status reports",
      "Updates Jira, Notion & Asana in real time",
    ],
    cta: { label: "Coming soon", comingSoon: true },
  },
  {
    initial: "S",
    name: "Sam",
    role: "AI Marketing Employee",
    gradient: "linear-gradient(135deg,#7a8b5c,#5a6e3d)",
    capabilities: [
      "Learns your brand voice from day one",
      "Drafts posts, emails & campaign briefs",
      "Pulls & summarizes performance analytics",
      "Schedules & publishes content automatically",
    ],
    cta: { label: "Coming soon", comingSoon: true },
  },
];

function RoleCard({ role, index }: { role: Role; index: number }) {
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
          {/* Header band */}
          <div className="px-5 py-4 bg-paper-hi border-b border-paper-edge flex items-center gap-3">
            <motion.div
              variants={{ hover: { rotate: 8 } }}
              transition={{ duration: 0.45, ease: EASE }}
              className="w-11 h-11 rounded-full text-white grid place-items-center serif text-[18px] shrink-0"
              style={{ background: role.gradient }}
              aria-hidden
            >
              {role.initial}
            </motion.div>
            <div className="min-w-0 flex-1">
              <Serif className="text-[17px] block leading-tight">
                {role.name}
              </Serif>
              <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mt-0.5">
                {role.role}
              </div>
            </div>
            {"comingSoon" in role.cta ? (
              <Badge variant="outline" className="shrink-0">
                Coming soon
              </Badge>
            ) : (
              <Badge variant="coral" className="shrink-0">
                Available now
              </Badge>
            )}
          </div>

          <CardContent className="flex-1 flex flex-col gap-5">
            <ul className="space-y-2.5">
              {role.capabilities.map((cap, i) => (
                <motion.li
                  key={cap}
                  variants={{
                    hover: {
                      color: "var(--color-ink)",
                      transition: { delay: i * 0.05, duration: 0.25, ease: EASE },
                    },
                  }}
                  className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-muted"
                >
                  <Check
                    className="w-4 h-4 mt-0.5 shrink-0 text-coral-deep"
                    aria-hidden
                  />
                  <span>{cap}</span>
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              {"comingSoon" in role.cta ? (
                <Badge variant="outline">{role.cta.label}</Badge>
              ) : (
                <form action={role.cta.action}>
                  <Button variant="ink" size="md" type="submit">
                    {role.cta.label}
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

export function LandingTeam() {
  return (
    <section id="roles" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          The starting team
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[24ch]">
          Three colleagues.{" "}
          <span className="italic text-ink-faint">
            Hire any of them today.
          </span>
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLES.map((role, i) => (
          <RoleCard key={role.name} role={role} index={i} />
        ))}
      </div>
    </section>
  );
}
