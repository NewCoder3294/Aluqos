import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Avatar } from "./avatar";
import type { WinItem } from "@/src/workflows/projections";

// "What I shipped for you" — last few sent drafts. Proof Alex is doing
// real work. Tap to view (future detail page); for now just renders the
// subject + recipient + relative time.

function fmtRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return days === 1 ? "yesterday" : `${days}d ago`;
}

export function WinsCard({ wins }: { wins: WinItem[] }) {
  return (
    <Card className="alex-fade-up alex-stagger-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 size={14} strokeWidth={2} className="text-coral-deep" />
          What I shipped for you
        </CardTitle>
        <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
          Last {wins.length} send{wins.length === 1 ? "" : "s"}
        </span>
      </CardHeader>
      <CardContent compact className="p-0">
        {wins.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-[13px] text-ink-faint">
              I haven&apos;t sent anything yet. Approve a draft from the Inbox and the first one will land here.
            </p>
          </div>
        ) : (
          <ul>
            {wins.map((w, idx) => (
              <li
                key={w.draft_id}
                className={
                  "flex items-center gap-3 px-5 py-3.5 hover:bg-paper-hi/40 transition-colors" +
                  (idx !== wins.length - 1 ? " border-b border-paper-edge" : "")
                }
              >
                {w.recipient_name ? (
                  <Avatar name={w.recipient} initials={w.recipient_name.charAt(0)} size="sm" />
                ) : (
                  <Avatar name="self" initials="·" size="sm" tone="neutral" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-ink truncate">{w.subject}</div>
                  <div className="text-[12px] text-ink-muted mt-0.5">
                    {w.recipient_name ? `Sent to ${w.recipient_name}` : "Sent to yourself"}
                  </div>
                </div>
                <span className="text-[11px] text-ink-faint shrink-0 tabular-nums">
                  {fmtRelative(w.sent_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
