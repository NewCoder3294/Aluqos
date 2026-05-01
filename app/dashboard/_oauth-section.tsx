import { KpiCard } from "@/src/components/ui/kpi-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { MOCK_KPIS, MOCK_THREADS } from "@/src/dashboard/oauth-mock";
import type { GmailInboxStats } from "@/src/integrations/gmail/client";

// The OAuth-only section that renders for Google-authenticated viewers above
// the existing dashboard widgets. The Inbox KpiCard is the only real number;
// everything else is mock content seeded for visual completeness until the
// downstream Gmail/calendar integrations land.
export function OAuthGmailSection({
  fullName,
  email,
  stats,
}: {
  fullName: string;
  email: string | null;
  stats: GmailInboxStats | null;
}) {
  const inboxValue = stats ? stats.messagesUnread.toLocaleString() : "—";
  const inboxTrend = stats
    ? `of ${stats.messagesTotal.toLocaleString()} total`
    : "Reconnect Gmail to refresh";
  const inboxTrendVariant = stats ? "neutral" : "warning";

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="serif text-[20px] tracking-[-0.01em] text-ink">
            Hi {fullName.split(" ")[0]},
          </h2>
          <p className="text-[12px] text-ink-faint mt-0.5">
            Signed in via Google{email ? ` · ${email}` : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard
          label="Inbox"
          value={
            <>
              {inboxValue}
              <span className="text-[14px] text-ink-faint ml-1">unread</span>
            </>
          }
          trend={inboxTrend}
          trendVariant={inboxTrendVariant}
        />
        {MOCK_KPIS.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            trendVariant={kpi.trendVariant}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Recent threads</CardTitle>
            <CardDescription>
              Sample previews — full thread reading lands when Gmail ingestion
              ships.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent compact>
          <ul className="divide-y divide-paper-edge">
            {MOCK_THREADS.map((thread) => (
              <li
                key={thread.id}
                className="py-3 flex items-start gap-3 first:pt-0 last:pb-0"
              >
                <span
                  className={`mt-1.5 size-2 rounded-full shrink-0 ${
                    thread.unread ? "bg-coral" : "bg-paper-edge"
                  }`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-[13px] text-ink truncate">
                      {thread.sender}
                    </div>
                    <div className="text-[11px] text-ink-faint shrink-0">
                      {thread.receivedAt}
                    </div>
                  </div>
                  <div className="text-[13px] text-ink mt-0.5 truncate">
                    {thread.subject}
                  </div>
                  <div className="text-[12px] text-ink-muted mt-0.5 truncate">
                    {thread.preview}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}
