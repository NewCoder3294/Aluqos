"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
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

function RoleCardInner({ role }: { role: Role }) {
  return (
    <Card className="flex flex-col h-full">
      {/* Header band */}
      <div className="px-5 py-4 bg-paper-hi border-b border-paper-edge flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full text-white grid place-items-center serif text-[18px] shrink-0"
          style={{ background: role.gradient }}
          aria-hidden
        >
          {role.initial}
        </div>
        <div className="min-w-0 flex-1">
          <Serif className="text-[17px] block leading-tight">{role.name}</Serif>
          <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mt-0.5">
            {role.role}
          </div>
        </div>
        {"comingSoon" in role.cta ? (
          <Badge variant="outline" className="shrink-0">Coming soon</Badge>
        ) : (
          <Badge variant="coral" className="shrink-0">Available now</Badge>
        )}
      </div>

      <CardContent className="flex-1 flex flex-col gap-5">
        <ul className="space-y-2.5">
          {role.capabilities.map(cap => (
            <li key={cap} className="flex items-start gap-2.5 text-[14px] leading-snug text-ink-muted">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-coral-deep" aria-hidden />
              <span>{cap}</span>
            </li>
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
  );
}

export function LandingTeam() {
  const [active, setActive] = useState(0);
  const total = ROLES.length;

  // Signed offset from active, wrapped to [-1, 0, 1] so the carousel loops
  function getOffset(i: number) {
    let diff = i - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  }

  const next = () => setActive(a => (a + 1) % total);
  const prev = () => setActive(a => (a - 1 + total) % total);

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
          <span className="italic text-ink-faint">Hire any of them today.</span>
        </h2>
      </Reveal>

      {/* Stacked card carousel */}
      <div className="mt-16 relative h-[560px] sm:h-[600px] flex items-center justify-center">
        {ROLES.map((role, i) => {
          const offset = getOffset(i);
          const isActive = offset === 0;
          return (
            <motion.div
              key={role.name}
              role={isActive ? undefined : "button"}
              tabIndex={isActive ? -1 : 0}
              aria-label={isActive ? undefined : `View ${role.name}`}
              onClick={() => !isActive && setActive(i)}
              onKeyDown={e => {
                if (!isActive && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              animate={{
                x: offset * 280,
                scale: isActive ? 1 : 0.88,
                opacity: isActive ? 1 : 0.55,
                filter: isActive ? "blur(0px)" : "blur(5px)",
                zIndex: isActive ? 30 : 20 - Math.abs(offset),
              }}
              transition={{ duration: 0.5, ease: EASE }}
              className={`absolute w-[88vw] max-w-[460px] ${
                isActive ? "" : "cursor-pointer"
              }`}
            >
              <RoleCardInner role={role} />
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous role"
          className="w-10 h-10 rounded-full border border-paper-edge bg-paper-hi grid place-items-center text-ink-muted hover:text-ink hover:border-coral/40 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          {ROLES.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to ${r.name}`}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-8 bg-ink" : "w-1.5 bg-paper-edge hover:bg-ink-faint"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next role"
          className="w-10 h-10 rounded-full border border-paper-edge bg-paper-hi grid place-items-center text-ink-muted hover:text-ink hover:border-coral/40 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
