"use client";

import { useEffect, useState } from "react";
import type { SourceId } from "@/src/config/sources";

type Status = {
  status: "queued" | "running" | "completed" | "failed" | "partial" | "none";
  events_ingested?: number;
};

export function StatusPill({ source }: { source: SourceId }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch(`/api/backfill/${source}/status`);
        const json = (await res.json()) as Status;
        if (!cancelled) setStatus(json);
      } catch {
        // network blip — try again next tick
      }
    }
    tick();
    const interval = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [source]);

  if (!status || status.status === "none") return null;
  if (status.status === "completed") {
    return <span className="text-xs text-green-600">{status.events_ingested ?? 0} events synced</span>;
  }
  if (status.status === "running") {
    return <span className="text-xs text-amber-600">Syncing your last 30 days...</span>;
  }
  if (status.status === "failed") {
    return <span className="text-xs text-red-600">Sync failed — try reconnecting</span>;
  }
  return <span className="text-xs">{status.status}</span>;
}
