"use client";

import { useCallback, useEffect, useState } from "react";
import { Mailbox, Clock } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { DraftCard } from "@/app/_chrome/draft-card";
import type { Draft } from "@/src/workflows/queries";

const POLL_MS = 1000;

export function InboxList({
  initialDrafts,
  nextRunHint,
}: {
  initialDrafts: Draft[];
  /** Friendly copy for the empty state showing when the next thing happens */
  nextRunHint: string | null;
}) {
  const [drafts, setDrafts] = useState<Draft[]>(initialDrafts);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/drafts", { cache: "no-store" });
      if (!res.ok) return;
      const json = (await res.json()) as { drafts: Draft[] };
      setDrafts(json.drafts);
    } catch {
      // ignore — next tick retries
    }
  }, []);

  useEffect(() => {
    const i = setInterval(refresh, POLL_MS);
    return () => clearInterval(i);
  }, [refresh]);

  if (drafts.length === 0) {
    return (
      <Card className="alex-fade-up alex-stagger-1">
        <CardContent compact className="px-8 py-14 text-center">
          <Mailbox size={32} strokeWidth={1.5} className="mx-auto text-ink-faint mb-3" />
          <div className="text-[16px] text-ink mb-1.5">Nothing waiting on you</div>
          <p className="text-[13px] text-ink-muted max-w-md mx-auto leading-relaxed">
            I&apos;m on it. Drafts land here when scheduled work fires — you&apos;ll get a chance
            to look before anything goes out.
          </p>
          {nextRunHint && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-paper-edge bg-paper-hi/40 px-3.5 py-2">
              <Clock size={12} strokeWidth={2} className="text-coral-deep" />
              <span className="text-[12px] text-ink-muted">{nextRunHint}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {drafts.map((draft, idx) => (
        <div key={draft.id} className={`alex-stagger-${Math.min(idx + 1, 6)}`}>
          <DraftCard draft={draft} onAfterAction={refresh} />
        </div>
      ))}
    </div>
  );
}
