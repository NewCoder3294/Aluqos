"use client";

import { Check } from "lucide-react";
import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Reveal } from "./motion-primitives";

// The marketing site centers Alex (PM) — the only role with a working
// product surface today. Jordan and Sam are listed as "Next up" so the
// page tells one strong story instead of three half-told ones.

const HERO_ROLE = {
  initial: "A",
  name: "Alex",
  role: "AI Product Manager",
  gradient: "linear-gradient(135deg,#e07a5f,#c46449)",
  capabilities: [
    "Auto-discovers PM workflows from your Slack, Linear, and roadmap edits",
    "Drafts PRDs, status updates, and stakeholder emails — pending your approval",
    "Tracks feature requests, prioritizes backlog, and surfaces what's at risk",
    "Picks up your tone and decision style from week one — no prompting",
  ],
};

const NEXT_UP: Array<{ initial: string; name: string; role: string; gradient: string; tease: string }> = [
  {
    initial: "J",
    name: "Jordan",
    role: "AI Program Manager",
    gradient: "linear-gradient(135deg,#5a4f3d,#3a3026)",
    tease: "Cross-team milestones, risks, and weekly status reports — auto-drafted.",
  },
  {
    initial: "S",
    name: "Sam",
    role: "AI Marketing Employee",
    gradient: "linear-gradient(135deg,#7a8b5c,#5a6e3d)",
    tease: "Brand-voice content, campaign briefs, and performance summaries — on rails.",
  },
];

export function LandingTeam() {
  return (
    <section id="roles" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <Reveal>
        <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
          Available now
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[24ch]">
          Meet Alex.{" "}
          <span className="italic text-ink-faint">Your first AI hire.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mt-5 max-w-[58ch] text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted">
          We&rsquo;re starting with the role that pays back fastest: a Product Manager.
          One Aluqos PM observes your team for a week, then ships the workflows that
          claw back the hours you keep losing to busywork.
        </p>
      </Reveal>

      {/* Centerpiece — Alex */}
      <Reveal delay={0.15}>
        <Card className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 overflow-hidden">
          <div
            className="relative px-8 py-10 lg:p-12 flex flex-col justify-between min-h-[280px]"
            style={{ background: HERO_ROLE.gradient }}
          >
            <div className="flex items-center gap-4 text-white">
              <div
                className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 grid place-items-center serif text-[28px] shrink-0"
                aria-hidden
              >
                {HERO_ROLE.initial}
              </div>
              <div className="min-w-0">
                <Serif className="text-[28px] block leading-tight text-white">
                  {HERO_ROLE.name}
                </Serif>
                <div className="text-[11px] uppercase tracking-[0.14em] text-white/80 mt-1">
                  {HERO_ROLE.role}
                </div>
              </div>
            </div>
            <Badge variant="coral" className="self-start mt-8 bg-white text-coral-deep border-white">
              Available now
            </Badge>
          </div>

          <CardContent className="flex flex-col gap-6 p-8 lg:p-12">
            <ul className="space-y-3.5">
              {HERO_ROLE.capabilities.map((cap) => (
                <li
                  key={cap}
                  className="flex items-start gap-3 text-[15px] leading-snug text-ink"
                >
                  <Check className="w-4 h-4 mt-1 shrink-0 text-coral-deep" aria-hidden />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-2">
              <form action={hireProductManager}>
                <Button variant="ink" size="lg" type="submit">
                  Hire Alex →
                </Button>
              </form>
              <div className="mt-3 text-[12px] text-ink-faint">
                Day one: read-only. Day eight: shipping work.
              </div>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Next up — Jordan & Sam, demoted */}
      <Reveal delay={0.25}>
        <div className="mt-14">
          <div className="text-[11px] tracking-[0.14em] uppercase text-ink-faint font-medium">
            Next up
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {NEXT_UP.map((r) => (
              <div
                key={r.name}
                className="rounded-lg border border-paper-edge bg-paper-hi/40 p-5 flex items-start gap-4"
              >
                <div
                  className="w-11 h-11 rounded-full text-white grid place-items-center serif text-[16px] shrink-0 opacity-70"
                  style={{ background: r.gradient }}
                  aria-hidden
                >
                  {r.initial}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <Serif className="text-[17px] leading-tight">{r.name}</Serif>
                    <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
                      {r.role}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[13px] leading-snug text-ink-muted">
                    {r.tease}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 self-start">
                  Coming soon
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
