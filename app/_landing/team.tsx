import { Check } from "lucide-react";
import { hireProductManager } from "@/src/server/hire";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";

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

export function LandingTeam() {
  return (
    <section id="roles" className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
      <div className="text-[12px] tracking-[0.14em] uppercase text-[--color-coral-deep] font-medium">
        The starting team
      </div>
      <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[24ch]">
        Three colleagues.{" "}
        <span className="italic text-[--color-ink-faint]">
          Hire any of them today.
        </span>
      </h2>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLES.map(role => (
          <Card key={role.name} className="flex flex-col">
            {/* Header band */}
            <div className="px-5 py-4 bg-[--color-paper-hi] border-b border-[--color-paper-edge] flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full text-white grid place-items-center serif text-[18px]"
                style={{ background: role.gradient }}
                aria-hidden
              >
                {role.initial}
              </div>
              <div className="min-w-0">
                <Serif className="text-[17px] block leading-tight">
                  {role.name}
                </Serif>
                <div className="text-[11px] uppercase tracking-[0.12em] text-[--color-ink-faint] mt-0.5">
                  {role.role}
                </div>
              </div>
            </div>

            <CardContent className="flex-1 flex flex-col gap-5">
              <ul className="space-y-2.5">
                {role.capabilities.map(cap => (
                  <li
                    key={cap}
                    className="flex items-start gap-2.5 text-[14px] leading-snug text-[--color-ink-muted]"
                  >
                    <Check
                      className="w-4 h-4 mt-0.5 shrink-0 text-[--color-coral-deep]"
                      aria-hidden
                    />
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
        ))}
      </div>
    </section>
  );
}
