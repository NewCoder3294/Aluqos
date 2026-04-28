export type SourceId = "linear" | "github" | "calendar" | "slack";

export type SourceConfig = {
  id: SourceId;
  displayName: string;
  brandColor: string;
  v1Status: "live" | "parallel-track" | "coming-soon";
  oauthScopes: string[];
  webhookSupported: boolean;
  webhookEvents?: string[];
  pollIntervalSec?: number;
};

export const SOURCES: Record<SourceId, SourceConfig> = {
  linear: {
    id: "linear",
    displayName: "Linear",
    brandColor: "5E6AD2",
    v1Status: "live",
    oauthScopes: ["read"],
    webhookSupported: true,
    webhookEvents: ["Issue", "Comment", "Project"],
  },
  github: {
    id: "github",
    displayName: "GitHub",
    brandColor: "24292E",
    v1Status: "coming-soon",
    oauthScopes: ["repo:read", "read:user", "user:email"],
    webhookSupported: true,
    webhookEvents: [
      "issues",
      "issue_comment",
      "pull_request",
      "pull_request_review",
      "pull_request_review_comment",
      "push",
      "commit_comment",
    ],
  },
  calendar: {
    id: "calendar",
    displayName: "Google Calendar",
    brandColor: "4285F4",
    v1Status: "coming-soon",
    oauthScopes: [
      "https://www.googleapis.com/auth/calendar.events.readonly",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
    webhookSupported: false,
    pollIntervalSec: 900,
  },
  slack: {
    id: "slack",
    displayName: "Slack",
    brandColor: "4A154B",
    v1Status: "parallel-track",
    oauthScopes: [
      "channels:history",
      "groups:history",
      "im:history",
      "users:read",
      "team:read",
    ],
    webhookSupported: true,
    webhookEvents: [
      "message.channels",
      "message.groups",
      "message.im",
      "app_mention",
    ],
  },
};

export function getSource(id: SourceId): SourceConfig {
  const config = SOURCES[id];
  if (!config) throw new Error(`unknown source: ${id}`);
  return config;
}
