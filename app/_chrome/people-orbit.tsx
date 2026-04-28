import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar } from "./avatar";
import type { Person } from "@/src/workflows/projections";

// "The people in your orbit" — a small avatar grid of inferred contacts
// with role chips and a one-line hint each. The role classification is
// what makes this cool: stakeholders show up first with a coral chip,
// collaborators next, ambient team-members last.

const ROLE_LABEL: Record<Person["role"], string> = {
  stakeholder: "Stakeholder",
  collaborator: "Collaborator",
  team: "Team",
};

const ROLE_CHIP_CLASS: Record<Person["role"], string> = {
  stakeholder: "bg-coral/12 border-coral/30 text-coral-deep",
  collaborator: "bg-paper-hi border-paper-edge text-ink-muted",
  team: "bg-paper-hi/60 border-paper-edge text-ink-faint",
};

export function PeopleOrbit({ people }: { people: Person[] }) {
  return (
    <Card className="alex-fade-up alex-stagger-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users size={14} strokeWidth={2} className="text-coral-deep" />
          The people in your orbit
        </CardTitle>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Inferred from your activity
        </span>
      </CardHeader>
      <CardContent compact className="p-5">
        {people.length === 0 ? (
          <p className="text-[13px] text-ink-faint">
            I&apos;ll fill this in as I see who you work with most.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {people.slice(0, 6).map((p) => (
              <li
                key={p.email}
                className="flex items-center gap-3 rounded-md border border-paper-edge bg-paper-hi/30 px-3.5 py-3"
              >
                <Avatar name={p.name} initials={p.initials} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-ink truncate">{p.name}</span>
                    <span
                      className={
                        "shrink-0 inline-flex items-center rounded-full border px-1.5 py-px text-[10px] uppercase tracking-[0.1em] font-medium " +
                        ROLE_CHIP_CLASS[p.role]
                      }
                    >
                      {ROLE_LABEL[p.role]}
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-muted leading-snug truncate">
                    {p.hint}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
