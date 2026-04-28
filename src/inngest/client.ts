import { Inngest, eventType, staticSchema } from "inngest";

/**
 * Typed event registry — the single source of truth for events this app
 * sends and receives via Inngest. New events should be added here so
 * `inngest.send(events.<name>.toEventInput({...}))` and function triggers
 * stay type-safe.
 *
 * Inngest v4 attaches schemas per-trigger (vs. v3's client-level generic),
 * so each event is declared via `eventType` + `staticSchema` and consumed
 * by both senders and `inngest.createFunction` triggers.
 */
export const events = {
  "backfill/start": eventType("backfill/start", {
    schema: staticSchema<{
      tenantId: string;
      source: "linear" | "github" | "calendar" | "slack";
    }>(),
  }),
} as const;

export const inngest = new Inngest({ id: "aluqos" });
