import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/cn";

type Event = { time: string; title: string; muted?: boolean };

const EVENTS: Event[] = [
  { time: "9:00 AM", title: "Sprint planning" },
  { time: "11:30", title: "1:1 with Olivia" },
  { time: "2:00 PM", title: "Demo rehearsal" },
  { time: "4:30", title: "Eng sync", muted: true },
];

export function Today() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today</CardTitle>
        <button
          type="button"
          className="text-[11.5px] uppercase tracking-[0.12em] text-ink-faint hover:text-coral-deep transition-colors"
        >
          Calendar →
        </button>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul>
          {EVENTS.map((e, idx) => (
            <li
              key={`${e.time}-${e.title}`}
              className={cn(
                "flex items-baseline gap-4 px-5 py-3.5",
                idx !== EVENTS.length - 1 && "border-b border-paper-edge",
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
