import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import type { CalendarEvent } from "./data/types";

export function Today({
  employeeId,
  events,
}: {
  employeeId: string;
  events: CalendarEvent[];
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today</CardTitle>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/calendar`}>Calendar →</Link>
        </Button>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul>
          {events.map((e, idx) => (
            <li
              key={`${e.time}-${e.title}`}
              className={cn(
                "flex items-baseline gap-4 px-5 py-3.5",
                idx !== events.length - 1 && "border-b border-paper-edge",
                e.muted && "opacity-70",
              )}
            >
              <span className="text-[12px] tabular-nums tracking-[0.02em] text-ink-faint shrink-0 w-[60px]">
                {e.time}
              </span>
              <span className="text-[14px] text-ink">{e.title}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
