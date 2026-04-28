"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListFilter, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { cn } from "@/src/lib/cn";

type PrdStatus = "draft" | "review" | "shipped";

export type PrdRow = {
  id: string;
  title: string;
  issue: string;
  words: number;
  sectionsDone: number;
  sectionsTotal: number;
  status: PrdStatus;
  lastEdited: string;
};

const DOT_BY_STATUS: Record<PrdStatus, string> = {
  draft: "bg-coral",
  review: "bg-coral-light",
  shipped: "bg-ink-muted",
};

const LABEL_BY_STATUS: Record<PrdStatus, string> = {
  draft: "Draft",
  review: "In review",
  shipped: "Shipped",
};

const VARIANT_BY_STATUS: Record<PrdStatus, "coral" | "default" | "outline"> = {
  draft: "coral",
  review: "default",
  shipped: "outline",
};

type FilterValue = "all" | PrdStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "In review" },
  { value: "shipped", label: "Shipped" },
];

export function PrdsList({
  employeeId,
  prds,
}: {
  employeeId: string;
  prds: PrdRow[];
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = useMemo(
    () => (filter === "all" ? prds : prds.filter(p => p.status === filter)),
    [prds, filter],
  );

  const filterActive = filter !== "all";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {filterActive ? `${LABEL_BY_STATUS[filter]} · ${filtered.length}` : `All PRDs · ${prds.length} total`}
        </CardTitle>
        <Button
          variant={filterOpen || filterActive ? "ink" : "outline"}
          size="sm"
          onClick={() => setFilterOpen(o => !o)}
          aria-expanded={filterOpen}
          aria-label="Filter PRDs"
        >
          <ListFilter size={14} strokeWidth={2} />
          Filter
          {filterActive && (
            <span className="ml-1 text-[10px] tabular-nums px-1 py-0.5 rounded bg-paper-edge text-ink-faint leading-none">
              1
            </span>
          )}
        </Button>
      </CardHeader>

      {filterOpen && (
        <div className="px-5 py-3 border-b border-paper-edge bg-paper-hi/30 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mr-1">Status</span>
          {FILTERS.map(f => {
            const selected = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "text-[12px] px-2.5 py-1 rounded-full border transition-colors",
                  selected
                    ? "bg-ink text-white border-ink"
                    : "bg-white text-ink-muted border-paper-edge hover:border-coral/40 hover:text-ink",
                )}
              >
                {f.label}
              </button>
            );
          })}
          {filterActive && (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="ml-auto inline-flex items-center gap-1 text-[11px] text-ink-faint hover:text-coral-deep"
            >
              <X size={12} strokeWidth={2} />
              Clear
            </button>
          )}
        </div>
      )}

      <CardContent compact className="p-0">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-[13px] text-ink-faint">
            No PRDs match this filter.
          </div>
        ) : (
          <ul>
            {filtered.map((prd, idx) => (
              <li key={prd.id}>
                <Link
                  href={`/prds/${prd.id}`}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-hi/40 cursor-pointer",
                    idx !== filtered.length - 1 && "border-b border-paper-edge",
                  )}
                >
                  <span className={cn("size-2 rounded-full shrink-0", DOT_BY_STATUS[prd.status])} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] text-ink font-medium truncate">{prd.title}</div>
                    <div className="text-[12px] text-ink-faint mt-0.5">
                      {prd.issue} · {prd.words.toLocaleString()} words · {prd.sectionsDone}/{prd.sectionsTotal} sections
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={VARIANT_BY_STATUS[prd.status]}>{LABEL_BY_STATUS[prd.status]}</Badge>
                    <span className="text-[12px] text-ink-faint italic w-[110px] text-right">last edited {prd.lastEdited}</span>
                    <Button variant="outline" size="sm" asChild>
                      <span>Open →</span>
                    </Button>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
