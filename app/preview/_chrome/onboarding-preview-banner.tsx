import Link from "next/link";

// Sticky-top coral banner for the four onboarding visual-language preview
// routes. Each route imports it with its own `active` slot. Format mirrors the
// existing /preview/option-* banners so the surrounding affordances stay
// familiar while the page content underneath swaps wholesale.
const ROUTES = [
  { idx: 1, slug: "onboarding-1", label: "Linear-style" },
  { idx: 2, slug: "onboarding-2", label: "Conversational" },
  { idx: 3, slug: "onboarding-3", label: "Minimal" },
  { idx: 4, slug: "onboarding-4", label: "Atmospheric" },
] as const;

export type OnboardingPreviewSlug = (typeof ROUTES)[number]["slug"];

export function OnboardingPreviewBanner({ active }: { active: OnboardingPreviewSlug }) {
  const current = ROUTES.find(r => r.slug === active);
  return (
    <div className="sticky top-0 z-50 bg-coral text-paper-hi text-[12px] py-1.5 px-4 flex items-center gap-3 font-sans">
      <span className="uppercase tracking-[0.14em] text-[10.5px] font-medium opacity-90">
        Preview mode
      </span>
      <span className="opacity-60">·</span>
      <span className="truncate">
        Onboarding {current?.idx} — {current?.label}
      </span>
      <span className="ml-auto flex items-center gap-3">
        {ROUTES.map(r => (
          <Link
            key={r.slug}
            href={`/preview/${r.slug}`}
            className={
              "hover:underline underline-offset-4 " +
              (r.slug === active ? "font-medium" : "opacity-80")
            }
          >
            {r.idx}
          </Link>
        ))}
      </span>
    </div>
  );
}
