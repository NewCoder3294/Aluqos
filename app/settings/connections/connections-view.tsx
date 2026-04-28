"use client";

import { useState } from "react";
import { SOURCES, type SourceId } from "@/src/config/sources";
import type { Connection } from "@/src/connections/queries";
import { StatusPill } from "./status-pill";

export function ConnectionsView({ initialConnections }: { initialConnections: Connection[] }) {
  const [connections, setConnections] = useState(initialConnections);

  const byId = new Map(connections.map((c) => [c.source, c]));

  async function handleDisconnect(source: SourceId) {
    const ok = confirm(`Disconnect ${SOURCES[source].displayName}? Historical events stay; new events stop ingesting.`);
    if (!ok) return;
    await fetch(`/api/connections/${source}`, { method: "DELETE" });
    setConnections((prev) => prev.filter((c) => c.source !== source));
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <h1 className="font-serif text-3xl mb-6">Connections</h1>
      <p className="text-sm text-muted-foreground mb-8">
        What may Alex see. Connect a source to start ingesting events. Disconnect at any time.
      </p>
      <ul className="space-y-4">
        {(["linear", "github", "calendar", "slack"] as SourceId[]).map((id) => {
          const cfg = SOURCES[id];
          const conn = byId.get(id);
          return (
            <li key={id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded" style={{ backgroundColor: `#${cfg.brandColor}` }} />
                <div>
                  <div className="font-medium">{cfg.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {cfg.v1Status === "live"
                      ? conn?.consent_active
                        ? "Connected"
                        : "Not connected"
                      : cfg.v1Status === "parallel-track"
                      ? "Approval pending — Slack production scopes"
                      : "Coming soon"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {conn?.consent_active && <StatusPill source={id} />}
                {conn?.consent_active ? (
                  <button onClick={() => handleDisconnect(id)} className="text-sm text-red-600 underline">Disconnect</button>
                ) : cfg.v1Status === "live" ? (
                  <a href={`/api/oauth/${id}/authorize`} className="rounded bg-coral px-3 py-1 text-sm text-white">
                    Connect
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">unavailable</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
