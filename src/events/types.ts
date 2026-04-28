import type { SourceId } from "@/src/config/sources";

export type ActivityEvent = {
  tenant_id: string;
  source: SourceId;
  source_event_id: string;
  actor: string | null;
  verb: string;
  object: string | null;
  context_json: Record<string, unknown>;
  occurred_at: Date;
};
