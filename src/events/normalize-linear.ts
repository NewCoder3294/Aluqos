import type { ActivityEvent } from "./types";
import { sanitizeUserText } from "./sanitize";

const VERB_BY_ACTION: Record<string, string> = {
  create: "created",
  update: "updated",
  remove: "removed",
};

type LinearWebhookPayload = {
  action: string;
  type: string;
  data: Record<string, unknown>;
};

export function normalizeLinearWebhook(
  payload: LinearWebhookPayload,
  tenantId: string,
): ActivityEvent | null {
  const { action, type, data } = payload;

  if (type === "Issue") {
    const verb =
      action === "create" ? "created" : (VERB_BY_ACTION[action] ?? action);
    const occurredAtStr =
      action === "create"
        ? (data.createdAt as string)
        : (data.updatedAt as string);
    return {
      tenant_id: tenantId,
      source: "linear",
      source_event_id: `linear:Issue:${action}:${data.id}:${occurredAtStr}`,
      actor: extractActor(data.creator),
      verb,
      object: sanitizeUserText(String(data.title ?? "")),
      context_json: {
        type: "Issue",
        identifier: data.identifier ?? null,
        state: extractState(data.state),
      },
      occurred_at: new Date(occurredAtStr),
    };
  }

  if (type === "Comment" && action === "create") {
    return {
      tenant_id: tenantId,
      source: "linear",
      source_event_id: `linear:Comment:create:${data.id}:${data.createdAt}`,
      actor: extractActor(data.user),
      verb: "commented",
      object: sanitizeUserText(String(data.body ?? "")),
      context_json: {
        type: "Comment",
        issue_identifier: extractIssueIdentifier(data.issue),
      },
      occurred_at: new Date(data.createdAt as string),
    };
  }

  return null;
}

function extractActor(value: unknown): string | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  return (v.email as string) || (v.name as string) || null;
}

function extractState(value: unknown): string | null {
  if (typeof value !== "object" || value === null) return null;
  return (value as { name?: string }).name ?? null;
}

function extractIssueIdentifier(value: unknown): string | null {
  if (typeof value !== "object" || value === null) return null;
  return (value as { identifier?: string }).identifier ?? null;
}
