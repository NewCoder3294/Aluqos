"use client";

import Link from "next/link";
import { cn } from "@/src/lib/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import type { PipelineColumnData } from "./data/types";

export function Pipeline({
  employeeId,
  title = "Pipeline",
  columns,
}: {
  employeeId: string;
  title?: string;
  columns: PipelineColumnData[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/work/${employeeId}/prds`}>View all →</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
        {columns.map((col) => (
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
                <Link
                  href={`/work/${employeeId}/prds`}
                  className="block w-full text-[11.5px] text-ink-faint hover:text-coral-deep transition-colors px-3 py-2 text-left"
                >
                  +{col.truncatedExtra} more →
                </Link>
              )}
            </div>
          </div>
        ))}
        </div>
      </CardContent>
    </Card>
  );
}
