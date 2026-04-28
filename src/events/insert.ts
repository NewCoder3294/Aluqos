import { serverClient } from "@/src/db/client";
import type { ActivityEvent } from "./types";

export async function insertActivityEvent(event: ActivityEvent): Promise<string> {
  const sb = serverClient();
  const { data, error } = await sb
    .from("activity_events")
    .upsert(
      {
        tenant_id: event.tenant_id,
        source: event.source,
        source_event_id: event.source_event_id,
        actor: event.actor,
        verb: event.verb,
        object: event.object,
        context_json: event.context_json,
        occurred_at: event.occurred_at.toISOString(),
      },
      { onConflict: "source,source_event_id", ignoreDuplicates: false }
    )
    .select("id")
    .single();
  if (error) throw new Error(`insertActivityEvent failed: ${error.message}`);
  return data.id as string;
}
