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
  { id: "e2", agent: "jordan", verb: "Posted standup digest in", subject: "#eng-team", timestamp: "12m ago", group: "Today" },
  { id: "e3", agent: "sam", verb: "Published LinkedIn post", subject: "Beacon Labs case study", timestamp: "38m ago", group: "Today" },
  { id: "e4", agent: "jordan", verb: "Flagged risk on", subject: "Q2 milestone", href: "jordan/risks", timestamp: "1h ago", group: "Today" },
  { id: "e5", agent: "alex", verb: "Updated PRD", subject: "Issue #44 — Quick filters", href: "prd/issue-44", timestamp: "2h ago", group: "Today" },
  { id: "e6", agent: "sam", verb: "Approved campaign brief", subject: "Q2 launch — email sequence", timestamp: "3h ago", group: "Today" },
  { id: "e7", agent: "jordan", verb: "Drafted standup notes for", subject: "Apr 25", timestamp: "30m ago", group: "Today" },
  { id: "e8", agent: "sam", verb: "Started brand voice review on", subject: "3 LinkedIn drafts", href: "sam/brand-voice", timestamp: "45m ago", group: "Today" },

  // ---- Yesterday ----
  { id: "e9", agent: "jordan", verb: "Sent status update to", subject: "#leadership", timestamp: "yesterday", group: "Yesterday" },
  { id: "e10", agent: "alex", verb: "Drafted scope memo for", subject: "Bulk export feature", timestamp: "yesterday", group: "Yesterday" },
  { id: "e11", agent: "sam", verb: "Shipped Twitter thread", subject: "Q2 launch teaser", timestamp: "yesterday", group: "Yesterday" },
  { id: "e12", agent: "alex", verb: "Closed PRD review on", subject: "Issue #41 — Rename workspace", href: "prd/issue-41", timestamp: "yesterday", group: "Yesterday" },
  { id: "e13", agent: "jordan", verb: "Pulled retro notes from", subject: "Sprint 23", timestamp: "yesterday", group: "Yesterday" },

  // ---- Earlier this week ----
  { id: "e14", agent: "sam", verb: "Approved hero mockup v3 for", subject: "Q2 launch landing page", timestamp: "2d ago", group: "Earlier this week" },
  { id: "e15", agent: "alex", verb: "Refreshed PRD", subject: "Issue #38 — Saved searches API", href: "prd/issue-38", timestamp: "2d ago", group: "Earlier this week" },
  { id: "e16", agent: "jordan", verb: "Posted standup digest in", subject: "#eng-team", timestamp: "2d ago", group: "Earlier this week" },
  { id: "e17", agent: "sam", verb: "Drafted Demo Day announcement", subject: "for #marketing review", timestamp: "3d ago", group: "Earlier this week" },
  { id: "e18", agent: "alex", verb: "Replied to Marie in", subject: "#product-feedback", timestamp: "3d ago", group: "Earlier this week" },
  { id: "e19", agent: "jordan", verb: "Resolved risk on", subject: "Sprint 23 capacity", href: "jordan/risks", timestamp: "3d ago", group: "Earlier this week" },
  { id: "e20", agent: "sam", verb: "Published blog post", subject: "How Beacon Labs replaced four tools", timestamp: "4d ago", group: "Earlier this week" },

  // ---- Last week ----
  { id: "e21", agent: "alex", verb: "Approved PRD", subject: "Issue #36 — Mobile detail view", href: "prd/issue-36", timestamp: "1w ago", group: "Last week" },
  { id: "e22", agent: "jordan", verb: "Sent status update to", subject: "#leadership", timestamp: "1w ago", group: "Last week" },
  { id: "e23", agent: "sam", verb: "Updated brand voice deck", subject: "v2 — punchy headlines", href: "sam/brand-voice", timestamp: "1w ago", group: "Last week" },
  { id: "e24", agent: "alex", verb: "Closed PRD review on", subject: "Issue #35 — Daily summaries", href: "prd/issue-35", timestamp: "1w ago", group: "Last week" },
  { id: "e25", agent: "jordan", verb: "Posted retro readout for", subject: "Sprint 22", timestamp: "1w ago", group: "Last week" },
  { id: "e26", agent: "sam", verb: "Approved press kit refresh", subject: "for Q2 launch", timestamp: "1w ago", group: "Last week" },
  { id: "e27", agent: "alex", verb: "Triaged backlog into", subject: "Q2 milestones", timestamp: "1w ago", group: "Last week" },
  { id: "e28", agent: "jordan", verb: "Flagged risk on", subject: "Auth migration timeline", href: "jordan/risks", timestamp: "1w ago", group: "Last week" },
];
