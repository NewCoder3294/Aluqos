// Mock data for the global activity feed.

import type { AgentId } from "./overview";

export type ActivityGroup = "Today" | "Yesterday" | "Earlier this week" | "Last week";

export type ActivityEvent = {
  id: string;
  agent: AgentId;
  verb: string;
  subject: string;
  /** Optional href relative to /work/[employeeId]/. */
  href?: string;
  timestamp: string;
  group: ActivityGroup;
};

export const ACTIVITY_FEED: ActivityEvent[] = [
  // ---- Today ----
  { id: "e1", agent: "alex", verb: "Drafted PRD for", subject: "Issue #47 — Bulk export", href: "prd/issue-47", timestamp: "just now", group: "Today" },
  { id: "e5", agent: "alex", verb: "Updated PRD", subject: "Issue #44 — Quick filters", href: "prd/issue-44", timestamp: "2h ago", group: "Today" },
  { id: "e18", agent: "alex", verb: "Replied to Marie in", subject: "#product-feedback", timestamp: "3h ago", group: "Today" },

  // ---- Yesterday ----
  { id: "e10", agent: "alex", verb: "Drafted scope memo for", subject: "Bulk export feature", timestamp: "yesterday", group: "Yesterday" },
  { id: "e12", agent: "alex", verb: "Closed PRD review on", subject: "Issue #41 — Rename workspace", href: "prd/issue-41", timestamp: "yesterday", group: "Yesterday" },

  // ---- Earlier this week ----
  { id: "e15", agent: "alex", verb: "Refreshed PRD", subject: "Issue #38 — Saved searches API", href: "prd/issue-38", timestamp: "2d ago", group: "Earlier this week" },
  { id: "e27", agent: "alex", verb: "Triaged backlog into", subject: "Q2 milestones", timestamp: "3d ago", group: "Earlier this week" },

  // ---- Last week ----
  { id: "e21", agent: "alex", verb: "Approved PRD", subject: "Issue #36 — Mobile detail view", href: "prd/issue-36", timestamp: "1w ago", group: "Last week" },
  { id: "e24", agent: "alex", verb: "Closed PRD review on", subject: "Issue #35 — Daily summaries", href: "prd/issue-35", timestamp: "1w ago", group: "Last week" },
];
