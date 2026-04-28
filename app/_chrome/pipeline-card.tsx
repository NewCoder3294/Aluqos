"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar } from "./avatar";
import type { PipelineItem } from "@/src/workflows/projections";

// "What's coming up" — workflow runs scheduled in the future. Countdown is
// computed client-side every minute so it stays accurate without a refresh.
// SSR renders the initial label and we mark it suppressHydrationWarning to
// avoid a noisy mismatch when the server and the first client tick disagree
// by a few seconds.

function formatCountdown(targetMs: number): string {
  const delta = targetMs - Date.now();
  if (delta <= 0) return "any moment now";
  const min = Math.floor(delta / 60_000);
  if (min < 60) return `in ${min}m`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  if (hr < 24) return remMin === 0 ? `in ${hr}h` : `in ${hr}h ${remMin}m`;
  const days = Math.floor(hr / 24);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}

export function PipelineCard({ items }: { items: PipelineItem[] }) {
  // Force re-render every 30s so the countdowns stay fresh without polling.
  const [, force] = useState(0);
  useEffect(() => {
    const i = setInterval(() => force((n) => n + 1), 30_000);
    return () => clearInterval(i);
  }, []);

  return (
    <Card className="alex-fade-up alex-stagger-3">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock size={14} strokeWidth={2} className="text-coral-deep" />
          What&apos;s coming up
        </CardTitle>
        <Link
          href="/workflows"
          className="text-[11px] uppercase tracking-[0.14em] text-ink-faint hover:text-coral-deep transition-colors"
        >
          All workflows →
        </Link>
      </CardHeader>
      <CardContent compact className="p-0">
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-ink-faint">
              No scheduled work yet. Approve one of my ideas below and I&apos;ll get on a cadence.
            </p>
          </div>
        ) : (
          <ul>
            {items.map((item, idx) => (
              <li
                key={item.workflow_id}
                className={
                  "flex items-center gap-3 px-5 py-3.5 hover:bg-paper-hi/40 transition-colors" +
                  (idx !== items.length - 1 ? " border-b border-paper-edge" : "")
                }
              >
                {item.recipient_name ? (
                  <Avatar name={item.recipient} initials={item.recipient_name.charAt(0)} size="sm" />
                ) : (
                  <Avatar name="self" initials="·" size="sm" tone="neutral" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-ink truncate">{item.title}</div>
                  <div className="text-[12px] text-ink-muted mt-0.5">
                    I&apos;ll {item.next_action}.
                  </div>
                </div>
                <span
                  className="text-[12px] text-coral-deep font-medium tabular-nums shrink-0"
                  suppressHydrationWarning
                >
                  {formatCountdown(new Date(item.next_run_at).getTime())}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
