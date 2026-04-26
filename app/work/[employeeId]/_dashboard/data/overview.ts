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
  { label: "Active employees", value: "3", caption: "Alex, Jordan, Sam" },
  { label: "Items needing review", value: "8", caption: "across all agents", tone: "warning" },
  { label: "Work shipped this week", value: "19", caption: "+5 vs last week" },
  { label: "Time saved (est.)", value: "42h", caption: "this week" },
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
    id: "a3",
    agent: "jordan",
    type: "Risk",
    title: "Q2 milestone slipping — 3 stories at risk",
    context: "flagged 25m ago",
    cta: "Triage",
    blocker: true,
    href: "jordan/risks",
  },
  {
    id: "a4",
    agent: "jordan",
    type: "Standup",
    title: "Tomorrow's standup notes need a sign-off",
    context: "drafted 1h ago",
    cta: "Approve",
    href: "jordan/standups",
  },
  {
    id: "a5",
    agent: "sam",
    type: "Campaign",
    title: "Q2 launch campaign — copy waiting on you",
    context: "ready 2h ago",
    cta: "Approve",
    blocker: true,
    href: "sam/campaigns",
  },
  {
    id: "a6",
    agent: "sam",
    type: "Brand",
    title: "Voice drift detected on 3 LinkedIn drafts",
    context: "flagged 45m ago",
    cta: "Review",
    href: "sam/brand-voice",
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
    id: "a8",
    agent: "sam",
    type: "Performance",
    title: "Demo Day deck — final approval needed",
    context: "yesterday",
    cta: "Approve",
    href: "sam/performance",
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
  {
    agent: "jordan",
    state: "Reviewing",
    detail: "Pulling sprint review notes",
    progress: 30,
    href: "jordan",
  },
  {
    agent: "sam",
    state: "Idle",
    detail: "Brand voice review · idle",
    href: "sam",
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
    id: "w2",
    agent: "jordan",
    title: "Sprint 23 retrospective notes",
    stage: "Reviewing",
    progress: 75,
    href: "jordan/standups",
  },
  {
    id: "w3",
    agent: "sam",
    title: "Q2 launch campaign — Twitter thread",
    stage: "Drafting",
    progress: 45,
    href: "sam/campaigns",
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
    id: "w5",
    agent: "sam",
    title: "Demo Day deck final pass",
    stage: "Final review",
    progress: 85,
    href: "sam/performance",
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
    id: "r2",
    agent: "jordan",
    verb: "Posted standup digest in",
    subject: "#eng-team",
    timestamp: "12m ago",
  },
  {
    id: "r3",
    agent: "sam",
    verb: "Published LinkedIn post",
    subject: "Beacon Labs case study",
    timestamp: "38m ago",
  },
  {
    id: "r4",
    agent: "jordan",
    verb: "Flagged risk on",
    subject: "Q2 milestone",
    timestamp: "1h ago",
    href: "jordan/risks",
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
    id: "r6",
    agent: "sam",
    verb: "Approved campaign brief",
    subject: "Q2 launch — email sequence",
    timestamp: "3h ago",
  },
  {
    id: "r7",
    agent: "jordan",
    verb: "Sent status update to",
    subject: "#leadership",
    timestamp: "yesterday",
  },
  {
    id: "r8",
    agent: "alex",
    verb: "Drafted scope memo for",
    subject: "Bulk export feature",
    timestamp: "yesterday",
  },
];
