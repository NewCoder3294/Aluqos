"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";

type AttentionItem = {
  id: string;
  type: string;
  title: string;
  context: string;
  cta: "Review" | "Resolve" | "Reply" | "Draft" | "Refresh";
  blocker?: boolean;
  href?: string;
  toastMessage?: string;
};

const ITEMS: AttentionItem[] = [
  {
    id: "i1",
    type: "PRD",
    title: "Issue #47 PRD ready for review",
    context: "drafted 3m ago",
    cta: "Review",
    blocker: true,
    href: "prd/issue-47",
  },
  {
    id: "i2",
    type: "Scope",
    title: "Bulk export — scope expanded beyond original brief",
    context: "flagged 12m ago",
    cta: "Resolve",
    blocker: true,
    toastMessage: "Marked as resolved.",
  },
  {
    id: "i3",
    type: "Slack",
    title: "Marie asked about CSV format in #product-feedback",
    context: "45m ago",
    cta: "Reply",
    toastMessage: "Drafted a reply for your review.",
  },
  {
    id: "i4",
    type: "Meeting",
    title: "Sprint review tomorrow — no agenda yet",
    context: "yesterday",
    cta: "Draft",
    toastMessage: "Drafting a sprint-review agenda…",
  },
  {
    id: "i5",
    type: "PRD",
    title: "PRD #44 stale — last edited 5 days ago",
    context: "5d ago",
    cta: "Refresh",
    href: "prd/issue-44",
  },
];

export function NeedsAttention({ employeeId }: { employeeId: string }) {
  const blockerCount = ITEMS.filter((i) => i.blocker).length;
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Needs Attention</CardTitle>
        <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-coral/15 text-coral-deep text-[11px] font-medium tabular-nums">
          {blockerCount}
        </span>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul>
          {ITEMS.map((item, idx) => {
            const rowInner = (
              <>
                <span
                  className={cn(
                    "size-2 rounded-full shrink-0 mt-1.5 self-start",
                    item.blocker ? "bg-coral" : "bg-paper-edge",
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint shrink-0">
                      {item.type}
                    </span>
                    <span className="text-[15px] text-ink truncate">{item.title}</span>
                  </div>
                  <div className="text-[12px] text-ink-faint mt-0.5">{item.context}</div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0" asChild>
                  <span>{item.cta}</span>
                </Button>
              </>
            );
            const rowClass = cn(
              "flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-paper-hi/40 w-full text-left",
              idx !== ITEMS.length - 1 && "border-b border-paper-edge",
            );
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={`/work/${employeeId}/${item.href}`} className={cn(rowClass, "block")}>
                    <span className="flex items-center gap-3 w-full">{rowInner}</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (item.toastMessage) toast.info(item.toastMessage);
                    }}
                    className={rowClass}
                  >
                    {rowInner}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
