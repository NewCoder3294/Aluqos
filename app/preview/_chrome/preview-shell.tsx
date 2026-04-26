"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TopToolbar } from "@/src/components/top-toolbar";
import { OnboardingRail } from "@/app/onboarding/[employeeId]/_chrome/onboarding-rail";
import { OnboardingContext } from "@/app/onboarding/[employeeId]/_chrome/onboarding-context";
import { useWalkthrough } from "@/src/store/walkthrough";

// Hardcoded scenario shared across all three previews so the user judges
// layout, not content. Phase 1, step 5 of 7 ("Team"), with prior 4 steps
// already answered.
export const PREVIEW_BRIEF = {
  project: "Aluqos",
  role: "Founder",
  priorities: [
    "Ship YC demo",
    "Close 10 design partners",
    "Hit $10K MRR",
  ],
  time_sink: "Drafting PRDs from scratch every week",
} as const;

const EMPLOYEE = { id: "preview", name: "Alex", role: "AI Product Manager" };

const OPTIONS = [
  { slug: "option-a", label: "Earnest content fills the space" },
  { slug: "option-b", label: "Alex's notebook beside the question" },
  { slug: "option-c", label: "Multi-question stacked screens" },
] as const;

type OptionSlug = (typeof OPTIONS)[number]["slug"];

function PreviewBanner({ active }: { active: OptionSlug }) {
  const idx = OPTIONS.findIndex(o => o.slug === active);
  const current = OPTIONS[idx];
  const prev = OPTIONS[(idx - 1 + OPTIONS.length) % OPTIONS.length];
  const next = OPTIONS[(idx + 1) % OPTIONS.length];
  const letter = active.slice(-1).toUpperCase();
  return (
    <div className="sticky top-0 z-50 h-8 px-3 bg-coral text-paper-hi text-[12px] flex items-center gap-3 font-sans">
      <span className="uppercase tracking-[0.14em] text-[10.5px] font-medium opacity-90">
        Preview mode
      </span>
      <span className="opacity-60">·</span>
      <span className="truncate">
        Option {letter} — {current?.label}
      </span>
      <span className="ml-auto flex items-center gap-3">
        <Link
          href={`/preview/${prev?.slug}`}
          className="hover:underline underline-offset-4"
        >
          ← {prev?.slug.slice(-1).toUpperCase()}
        </Link>
        {OPTIONS.map(o => (
          <Link
            key={o.slug}
            href={`/preview/${o.slug}`}
            className={
              "hover:underline underline-offset-4 " +
              (o.slug === active ? "font-medium" : "opacity-80")
            }
          >
            {o.slug.slice(-1).toUpperCase()}
          </Link>
        ))}
        <Link
          href={`/preview/${next?.slug}`}
          className="hover:underline underline-offset-4"
        >
          {next?.slug.slice(-1).toUpperCase()} →
        </Link>
      </span>
    </div>
  );
}

export function PreviewShell({
  active,
  children,
}: {
  active: OptionSlug;
  children: React.ReactNode;
}) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setBrief = useWalkthrough(s => s.setBrief);

  // Seed the store on mount so the left rail (phase progress) and right rail
  // ("Gathered" tab) read realistic state. We force phase 1 because all three
  // previews target the Phase 1 content card.
  useEffect(() => {
    setPhase(1);
    setBrief({ ...PREVIEW_BRIEF });
  }, [setPhase, setBrief]);

  // Mock uploads list — empty in Phase 1 (no docs handed over yet) keeps the
  // right rail in its natural state for the comparison.
  const uploads: Array<{ id: string; filename: string }> = [];

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-paper">
      <PreviewBanner active={active} />
      <main className="flex-1 min-h-0 flex flex-col">
        <TopToolbar
          employeeName={EMPLOYEE.name}
          centerLabel="Onboarding"
          trail={["Phase 1"]}
        />
        <div className="grid grid-cols-[280px_1fr_340px] flex-1 min-h-0 overflow-hidden">
          <OnboardingRail employeeName={EMPLOYEE.name} uploadCount={uploads.length} />

          <section className="h-full overflow-y-auto">
            <div className="max-w-[680px] mx-auto px-6 py-8 space-y-5">{children}</div>
          </section>

          <OnboardingContext uploads={uploads} />
        </div>
      </main>
    </div>
  );
}
