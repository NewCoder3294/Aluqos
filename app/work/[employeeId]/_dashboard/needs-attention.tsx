"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";
import type { AttentionItem } from "./data/types";

export function NeedsAttention({
  employeeId,
  items,
}: {
  employeeId: string;
  items: AttentionItem[];
}) {
  const blockerCount = items.filter((i) => i.blocker).length;
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
          {items.map((item, idx) => {
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
              idx !== items.length - 1 && "border-b border-paper-edge",
            );
            return (
              <li key={item.id}>
                {item.href ? (
                  <Link href={`/${item.href}`} className={cn(rowClass, "block")}>
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
