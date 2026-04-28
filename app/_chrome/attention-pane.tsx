import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar } from "./avatar";
import type { AttentionItem } from "@/src/workflows/projections";

// "What I'm watching right now" — recent activity events with Alex's plan
// for each one. The annotation is the soul of this surface: it's how the
// user *sees* the agent thinking, not just an event log.

function fmtRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

const VERB_LABEL: Record<string, string> = {
  created: "created",
  updated: "moved",
  commented: "commented on",
  removed: "removed",
};

export function AttentionPane({ items }: { items: AttentionItem[] }) {
  return (
    <Card className="alex-fade-up alex-stagger-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye size={14} strokeWidth={2} className="text-coral-deep" />
          What I'm watching right now
        </CardTitle>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          {items.length} signal{items.length === 1 ? "" : "s"}
        </span>
      </CardHeader>
      <CardContent compact className="p-0">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-ink-faint">
              All quiet. I&apos;ll let you know when something matters.
            </p>
          </div>
        ) : (
          <ul>
            {items.map((item, idx) => (
              <li
                key={item.id}
                className={
                  "flex items-start gap-3 px-5 py-3.5 hover:bg-paper-hi/40 transition-colors" +
                  (idx !== items.length - 1 ? " border-b border-paper-edge" : "")
                }
              >
                <Avatar
                  name={item.actor_name}
                  initials={item.actor_initials ?? "·"}
                  size="sm"
                  tone={item.actor_initials ? "coral" : "neutral"}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {item.identifier && (
                      <span className="text-[11px] font-medium text-ink-faint tabular-nums">
                        {item.identifier}
                      </span>
                    )}
                    <span className="text-[14px] text-ink truncate">
                      {item.actor_name ?? "Someone"}{" "}
                      <span className="text-ink-faint">
                        {VERB_LABEL[item.verb] ?? item.verb}
                      </span>{" "}
                      <span className="text-ink">{item.object ?? "(untitled)"}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="alex-breathe size-1 rounded-full bg-coral shrink-0" aria-hidden />
                    <p className="text-[12.5px] text-ink-muted italic-serif leading-relaxed">
                      {item.annotation}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-ink-faint shrink-0 tabular-nums pt-0.5">
                  {fmtRelative(item.occurred_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
