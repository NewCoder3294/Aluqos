"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type Event = {
  time: string;
  title: string;
  kind: "meeting" | "review" | "focus" | "external";
};

type Day = {
  weekday: string;
  date: string;
  isToday?: boolean;
  events: Event[];
};

type Week = {
  range: string;
  label: string;
  blurb: string;
  days: Day[];
};

const KIND_DOT: Record<Event["kind"], string> = {
  meeting: "bg-paper-edge",
  review: "bg-coral",
  focus: "bg-[#7a8b5c]",
  external: "bg-coral-light",
};

const KIND_LABEL: Record<Event["kind"], string> = {
  meeting: "Meeting",
  review: "Review",
  focus: "Focus",
  external: "External",
};

const WEEKS: Week[] = [
  {
    range: "Apr 21 – Apr 27",
    label: "last week",
    blurb:
      "Closed two design-partner calls and shipped the analytics retention rewrite. Friday was almost entirely focus time.",
    days: [
      { weekday: "Monday", date: "Apr 21", events: [
        { time: "9:30", title: "Standup", kind: "meeting" },
        { time: "11:00", title: "Customer call — Beacon Labs", kind: "external" },
        { time: "2:00", title: "Roadmap working session", kind: "focus" },
      ]},
      { weekday: "Tuesday", date: "Apr 22", events: [
        { time: "10:00", title: "1:1 with Marie", kind: "meeting" },
        { time: "1:30", title: "PRD #44 review", kind: "review" },
        { time: "4:00", title: "Eng sync", kind: "meeting" },
      ]},
      { weekday: "Wednesday", date: "Apr 23", events: [
        { time: "9:00", title: "Sprint planning", kind: "meeting" },
        { time: "12:00", title: "Discovery — Northwave", kind: "external" },
        { time: "3:00", title: "Spec review · saved views", kind: "review" },
      ]},
      { weekday: "Thursday", date: "Apr 24", events: [
        { time: "10:00", title: "1:1 with Jordan", kind: "meeting" },
        { time: "2:00", title: "Demo critique", kind: "review" },
      ]},
      { weekday: "Friday", date: "Apr 25", events: [
        { time: "11:00", title: "Sprint retro", kind: "meeting" },
        { time: "1:00", title: "Quiet time — analytics rewrite", kind: "focus" },
      ]},
      { weekday: "Saturday", date: "Apr 26", events: [
        { time: "10:00", title: "Catch-up reading", kind: "focus" },
      ]},
      { weekday: "Sunday", date: "Apr 27", events: [
        { time: "5:00", title: "Investor coffee — Lina", kind: "external" },
      ]},
    ],
  },
  {
    range: "Apr 28 – May 4",
    label: "this week",
    blurb:
      "Alex is protecting four hours of focus time on Tuesday and Friday. Two design-partner calls this week — both joining the YC demo critique on Thursday.",
    days: [
      { weekday: "Monday", date: "Apr 28", isToday: true, events: [
        { time: "9:00", title: "Sprint planning", kind: "meeting" },
        { time: "11:30", title: "1:1 with Olivia", kind: "meeting" },
        { time: "2:00", title: "Demo rehearsal — YC", kind: "review" },
        { time: "4:30", title: "Eng sync", kind: "meeting" },
      ]},
      { weekday: "Tuesday", date: "Apr 29", events: [
        { time: "10:00", title: "Design partner — Beacon Labs", kind: "external" },
        { time: "1:00", title: "PRD #47 review", kind: "review" },
        { time: "3:30", title: "Roadmap working session", kind: "focus" },
      ]},
      { weekday: "Wednesday", date: "Apr 30", events: [
        { time: "9:30", title: "Standup", kind: "meeting" },
        { time: "11:00", title: "Discovery — Northwave", kind: "external" },
        { time: "2:00", title: "Spec review · saved views", kind: "review" },
        { time: "5:00", title: "Office hours w/ YC partner", kind: "external" },
      ]},
      { weekday: "Thursday", date: "May 1", events: [
        { time: "10:00", title: "Sprint review", kind: "review" },
        { time: "1:30", title: "1:1 with Jordan", kind: "meeting" },
        { time: "4:00", title: "Demo dry-run", kind: "review" },
      ]},
      { weekday: "Friday", date: "May 2", events: [
        { time: "9:00", title: "Sprint retro", kind: "meeting" },
        { time: "11:00", title: "Design partner — Acme Health", kind: "external" },
        { time: "2:00", title: "PRD #46 finalization", kind: "focus" },
      ]},
      { weekday: "Saturday", date: "May 3", events: [
        { time: "10:00", title: "Demo Day prep block", kind: "focus" },
        { time: "3:00", title: "Founder coffee — Lina (ex-Linear)", kind: "external" },
      ]},
      { weekday: "Sunday", date: "May 4", events: [
        { time: "11:00", title: "Quiet time — script the demo", kind: "focus" },
        { time: "6:00", title: "Investor dinner", kind: "external" },
      ]},
    ],
  },
  {
    range: "May 5 – May 11",
    label: "next week",
    blurb:
      "YC Demo Day on Tuesday afternoon. Sprint resets Wednesday — Alex has space blocked Thursday and Friday for the post-demo cleanup.",
    days: [
      { weekday: "Monday", date: "May 5", events: [
        { time: "9:00", title: "Final demo rehearsal", kind: "review" },
        { time: "1:00", title: "1:1 with Marie", kind: "meeting" },
        { time: "3:00", title: "Quiet time — script polish", kind: "focus" },
      ]},
      { weekday: "Tuesday", date: "May 6", events: [
        { time: "9:00", title: "Standup", kind: "meeting" },
        { time: "1:00", title: "YC Demo Day", kind: "external" },
        { time: "6:00", title: "Founder reception", kind: "external" },
      ]},
      { weekday: "Wednesday", date: "May 7", events: [
        { time: "10:00", title: "Sprint planning", kind: "meeting" },
        { time: "2:00", title: "Investor follow-ups", kind: "external" },
      ]},
      { weekday: "Thursday", date: "May 8", events: [
        { time: "9:00", title: "Quiet time — backlog grooming", kind: "focus" },
        { time: "2:00", title: "Eng sync", kind: "meeting" },
      ]},
      { weekday: "Friday", date: "May 9", events: [
        { time: "10:00", title: "Customer interviews — Acme", kind: "external" },
        { time: "1:00", title: "Quiet time — strategy memo", kind: "focus" },
      ]},
      { weekday: "Saturday", date: "May 10", events: [
        { time: "11:00", title: "Off — recharge", kind: "focus" },
      ]},
      { weekday: "Sunday", date: "May 11", events: [
        { time: "5:00", title: "Investor dinner — Sequoia", kind: "external" },
      ]},
    ],
  },
];

const THIS_WEEK_IDX = 1;

export function CalendarView() {
  const [idx, setIdx] = useState(THIS_WEEK_IDX);
  const week = WEEKS[idx];
  const canPrev = idx > 0;
  const canNext = idx < WEEKS.length - 1;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>{week.range}</CardTitle>
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
              {week.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => canPrev && setIdx(idx - 1)}
              disabled={!canPrev}
              aria-label="Previous week"
            >
              <ChevronLeft size={14} strokeWidth={2} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIdx(THIS_WEEK_IDX)}
              disabled={idx === THIS_WEEK_IDX}
            >
              This week
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-2"
              onClick={() => canNext && setIdx(idx + 1)}
              disabled={!canNext}
              aria-label="Next week"
            >
              <ChevronRight size={14} strokeWidth={2} />
            </Button>
          </div>
        </CardHeader>
        <CardContent compact className="p-5">
          <p className="text-[13px] text-ink-faint leading-relaxed max-w-2xl">
            {week.blurb}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {week.days.map((day) => (
          <Card key={day.weekday} className={cn(day.isToday && "border-coral/40")}>
            <CardHeader className="bg-paper-hi/60">
              <div>
                <div className="serif italic text-[16px] tracking-[-0.01em] text-ink">{day.weekday}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mt-0.5">{day.date}</div>
              </div>
              {day.isToday && (
                <span className="text-[10px] uppercase tracking-[0.14em] text-coral-deep font-medium">Today</span>
              )}
            </CardHeader>
            <CardContent compact className="p-0">
              <ul>
                {day.events.map((ev, evIdx) => (
                  <li
                    key={`${day.weekday}-${evIdx}`}
                    className={cn(
                      "px-5 py-3 hover:bg-paper-hi/40 cursor-pointer transition-colors",
                      evIdx !== day.events.length - 1 && "border-b border-paper-edge",
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={cn("size-1.5 rounded-full shrink-0", KIND_DOT[ev.kind])} />
                      <span className="text-[12px] tabular-nums text-ink-faint w-10 shrink-0">{ev.time}</span>
                      <span className="text-[13px] text-ink truncate">{ev.title}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mt-1 ml-6">
                      {KIND_LABEL[ev.kind]}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
