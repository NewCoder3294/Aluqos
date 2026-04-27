// Mock data for the global "All · Overview" dashboard.
// Aggregates work across Alex (PM), Jordan (PGM), and Sam (Marketing).

export type AgentId = "alex" | "jordan" | "sam";

export type AgentMeta = {
  id: AgentId;
  name: string;
  role: string;
  /** Tailwind class for the gradient avatar circle. */
  avatarGradient: string;
  /** Tailwind background class for the small color dot. */
  dotClass: string;
};

export const AGENTS: Record<AgentId, AgentMeta> = {
  alex: {
    id: "alex",
    name: "Alex",
    role: "PM",
    avatarGradient: "bg-gradient-to-br from-coral to-coral-deep",
    dotClass: "bg-coral",
  },
  jordan: {
    id: "jordan",
    name: "Jordan",
    role: "PGM",
    avatarGradient: "bg-gradient-to-br from-[#8a7a5d] to-[#5a4f3d]",
    dotClass: "bg-[#5a4f3d]",
  },
  sam: {
    id: "sam",
    name: "Sam",
    role: "Marketing",
    avatarGradient: "bg-gradient-to-br from-[#9aa97a] to-[#5e6e3f]",
    dotClass: "bg-[#7a8b5c]",
  },
};

export type OverviewKpi = {
  label: string;
  value: string;
  caption: string;
  tone?: "default" | "warning";
};

export const OVERVIEW_KPIS: OverviewKpi[] = [
  { label: "Active employees", value: "1", caption: "Alex" },
  { label: "Items needing review", value: "4", caption: "from Alex", tone: "warning" },
  { label: "Work shipped this week", value: "7", caption: "+2 vs last week" },
  { label: "Time saved (est.)", value: "14h", caption: "this week" },
];

export type OverviewAttention = {
  id: string;
  agent: AgentId;
  type: string;
  title: string;
  context: string;
  cta: string;
  blocker?: boolean;
  href?: string;
};

export const OVERVIEW_ATTENTION: OverviewAttention[] = [
  {
    id: "a1",
    agent: "alex",
    type: "PRD",
    title: "Issue #47 PRD ready for review",
    context: "drafted 3m ago",
    cta: "Review",
    blocker: true,
    href: "prd/issue-47",
  },
  {
    id: "a2",
    agent: "alex",
    type: "Scope",
    title: "Bulk export — scope expanded beyond brief",
    context: "flagged 12m ago",
    cta: "Resolve",
    blocker: true,
  },
  {
    id: "a7",
    agent: "alex",
    type: "PRD",
    title: "PRD #44 stale — last edited 5 days ago",
    context: "5d ago",
    cta: "Refresh",
    href: "prd/issue-44",
  },
  {
    id: "a9",
    agent: "alex",
    type: "Backlog",
    title: "Q2 milestone triage — 6 issues unsorted",
    context: "yesterday",
    cta: "Triage",
    href: "backlog",
  },
];

export type TeamStatus = {
  agent: AgentId;
  state: "Drafting" | "Reviewing" | "Idle";
  detail: string;
  /** Optional progress 0-100 to show subtle progress bar. */
  progress?: number;
  href: string;
};

export const TEAM_TODAY: TeamStatus[] = [
  {
    agent: "alex",
    state: "Drafting",
    detail: "Drafting Issue #47 PRD",
    progress: 60,
    href: "",
  },
];

export type WorkInFlight = {
  id: string;
  agent: AgentId;
  title: string;
  stage: string;
  progress: number;
  href?: string;
};

export const WORK_IN_FLIGHT: WorkInFlight[] = [
  {
    id: "w1",
    agent: "alex",
    title: "Issue #47 — Bulk export for analytics",
    stage: "Drafting",
    progress: 60,
    href: "prd/issue-47",
  },
  {
    id: "w4",
    agent: "alex",
    title: "Issue #44 — Quick filters on dashboard",
    stage: "In review",
    progress: 90,
    href: "prd/issue-44",
  },
  {
    id: "w6",
    agent: "alex",
    title: "Issue #38 — Saved searches API",
    stage: "Refining",
    progress: 35,
    href: "prd/issue-38",
  },
];

export type RecentActivity = {
  id: string;
  agent: AgentId;
  verb: string;
  subject: string;
  timestamp: string;
  href?: string;
};

export const RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: "r1",
    agent: "alex",
    verb: "Drafted PRD for",
    subject: "Issue #47 — Bulk export",
    timestamp: "just now",
    href: "prd/issue-47",
  },
  {
    id: "r5",
    agent: "alex",
    verb: "Updated PRD",
    subject: "Issue #44 — Quick filters",
    timestamp: "2h ago",
    href: "prd/issue-44",
  },
  {
    id: "r9",
    agent: "alex",
    verb: "Replied to Marie in",
    subject: "#product-feedback",
    timestamp: "3h ago",
  },
  {
    id: "r8",
    agent: "alex",
    verb: "Drafted scope memo for",
    subject: "Bulk export feature",
    timestamp: "yesterday",
  },
];
