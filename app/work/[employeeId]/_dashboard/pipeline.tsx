"use client";

import Link from "next/link";
import { cn } from "@/src/lib/cn";

type PipelineCard = {
  id: string;
  title: string;
  sub: string;
  progress?: number;
  href?: string;
};

type PipelineColumn = {
  id: string;
  label: string;
  dotColor: string;
  cards: PipelineCard[];
  totalCount: number;
  truncatedExtra?: number;
};

const COLUMNS: PipelineColumn[] = [
  {
    id: "backlog",
    label: "Backlog",
    dotColor: "bg-paper-edge",
    totalCount: 4,
    cards: [
      { id: "b1", title: "Add filter saved-views", sub: "Backlog · proposed by Alex", href: "prd/issue-b1" },
      { id: "b2", title: "Improve onboarding completion", sub: "Backlog · 2 supporters", href: "prd/issue-b2" },
      { id: "b3", title: "Slack import for status updates", sub: "Backlog · idea", href: "prd/issue-b3" },
      { id: "b4", title: "Sprint planning automation", sub: "Backlog · idea", href: "prd/issue-b4" },
    ],
  },
  {
    id: "drafting",
    label: "Drafting",
    dotColor: "bg-coral",
    totalCount: 1,
    cards: [
      {
        id: "d1",
        title: "Issue #47 — Bulk export for analytics",
        sub: "drafting now",
        progress: 60,
        href: "prd/issue-47",
      },
    ],
  },
  {
    id: "review",
    label: "In review",
    dotColor: "bg-coral-light",
    totalCount: 2,
    cards: [
      { id: "r1", title: "Issue #44 — Quick filters on dashboard", sub: "Issue #44 · 2 reviewers", href: "prd/issue-44" },
      { id: "r2", title: "Issue #41 — Rename workspace flow", sub: "Issue #41 · 1 reviewer", href: "prd/issue-41" },
    ],
  },
  {
    id: "approved",
    label: "Approved",
    dotColor: "bg-[#7a8b5c]",
    totalCount: 3,
    cards: [
      { id: "a1", title: "Issue #38 — Saved searches API", sub: "Issue #38 · approved 2d ago", href: "prd/issue-38" },
      { id: "a2", title: "Issue #36 — Mobile detail view", sub: "Issue #36 · approved 4d ago", href: "prd/issue-36" },
      { id: "a3", title: "Issue #35 — Daily summaries", sub: "Issue #35 · approved 1w ago", href: "prd/issue-35" },
    ],
  },
  {
    id: "shipped",
    label: "Shipped",
    dotColor: "bg-ink-muted",
    totalCount: 12,
    cards: [
      { id: "s1", title: "Issue #34 — Onboarding gating", sub: "shipped 1w ago", href: "prd/issue-34" },
      { id: "s2", title: "Issue #32 — Notion export", sub: "shipped 2w ago", href: "prd/issue-32" },
      { id: "s3", title: "Issue #31 — Voice notes", sub: "shipped 3w ago", href: "prd/issue-31" },
    ],
    truncatedExtra: 9,
  },
];

export function Pipeline({ employeeId }: { employeeId: string }) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="serif text-[22px] tracking-[-0.01em] text-ink">Pipeline</h2>
        <button
          type="button"
          className="text-[11.5px] uppercase tracking-[0.12em] text-ink-faint hover:text-coral-deep transition-colors"
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className={cn("size-2 rounded-full shrink-0", col.dotColor)} />
              <span className="text-[10.5px] uppercase tracking-[0.14em] text-ink-faint font-medium">
                {col.label}
              </span>
              <span className="ml-auto text-[10.5px] tabular-nums text-ink-faint bg-paper-hi border border-paper-edge rounded-full px-1.5 py-px">
                {col.totalCount}
              </span>
            </div>

            <div className="space-y-2">
              {col.cards.map((card) => {
                const inner = (
                  <div
                    className={cn(
                      "bg-white border border-paper-edge rounded-md p-3 space-y-1.5 transition-colors",
                      card.href
                        ? "hover:bg-paper-hi/40 hover:border-coral/30 cursor-pointer"
                        : "hover:bg-paper-hi/40",
                    )}
                  >
                    <div className="text-[13.5px] text-ink font-medium leading-snug">
                      {card.title}
                    </div>
                    <div className="text-[11.5px] text-ink-faint">{card.sub}</div>
                    {typeof card.progress === "number" && (
                      <div className="h-1 w-full bg-paper-edge/60 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-coral"
                          style={{ width: `${card.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
                return card.href ? (
                  <Link key={card.id} href={`/work/${employeeId}/${card.href}`} className="block">
                    {inner}
                  </Link>
                ) : (
                  <div key={card.id}>{inner}</div>
                );
              })}

              {col.truncatedExtra && (
                <button
                  type="button"
                  className="w-full text-[11.5px] text-ink-faint hover:text-coral-deep transition-colors px-3 py-2 text-left"
                >
                  +{col.truncatedExtra} more →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
