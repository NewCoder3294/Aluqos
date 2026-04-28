"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { cn } from "@/src/lib/cn";
import { AGENTS, type AgentId } from "./data/overview";
import { type ActivityEvent, type ActivityGroup } from "./data/activity";

type Filter = "all" | AgentId;

const GROUP_ORDER: ActivityGroup[] = ["Today", "Yesterday", "Earlier this week", "Last week"];

export function ActivityFeed({
  employeeId,
  events,
}: {
  employeeId: string;
  events: ActivityEvent[];
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.agent === filter);
  }, [events, filter]);

  // Group by day-bucket while preserving insertion order.
  const grouped = useMemo(() => {
    const map = new Map<ActivityGroup, ActivityEvent[]>();
    for (const g of GROUP_ORDER) map.set(g, []);
    for (const e of filtered) map.get(e.group)?.push(e);
    return map;
  }, [filtered]);

  const counts = useMemo(() => {
    return {
      all: events.length,
      alex: events.filter((e) => e.agent === "alex").length,
    };
  }, [events]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All activity</CardTitle>
        <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
          {filtered.length} event{filtered.length === 1 ? "" : "s"}
        </span>
      </CardHeader>
      <CardContent compact className="p-0">
        <div className="px-5 pt-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList>
              <TabsTrigger value="all" count={counts.all}>All</TabsTrigger>
              <TabsTrigger value="alex" count={counts.alex}>Alex</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div>
          {GROUP_ORDER.map((group) => {
            const items = grouped.get(group) ?? [];
            if (items.length === 0) return null;
            return (
              <section key={group}>
                <div className="px-5 pt-5 pb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint font-medium">
                  {group}
                </div>
                <ul>
                  {items.map((event, idx) => {
                    const meta = AGENTS[event.agent];
                    const inner = (
                      <div className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-paper-hi/40">
                        <span
                          className={cn(
                            "size-7 rounded-full shrink-0 flex items-center justify-center mt-0.5",
                            meta.avatarGradient,
                          )}
                          aria-hidden
                        >
                          <span className="size-2.5 rounded-full bg-white/45" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] text-ink leading-snug">
                            <span className="font-medium">{meta.name}</span>{" "}
                            <span className="text-ink-muted">{event.verb}</span>{" "}
                            <span
                              className={cn(
                                event.href ? "text-coral-deep hover:underline" : "text-ink",
                              )}
                            >
                              {event.subject}
                            </span>
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.1em] text-ink-faint mt-1">
                            {meta.role}
                          </div>
                        </div>
                        <span className="text-[12px] text-ink-faint shrink-0 mt-0.5">
                          {event.timestamp}
                        </span>
                      </div>
                    );
                    const showBorder = idx !== items.length - 1;
                    return (
                      <li
                        key={event.id}
                        className={cn(showBorder && "border-b border-paper-edge")}
                      >
                        {event.href ? (
                          <Link
                            href={`/${event.href}`}
                            className="block"
                          >
                            {inner}
                          </Link>
                        ) : (
                          inner
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
