import type { DashboardData } from "./types";

export const JORDAN_DATA: DashboardData = {
  greetingName: "Nick",
  greetingSubline: "Here's what Jordan has been up to.",
  kpis: [
    { label: "Meetings handled today", value: "5", caption: "+2 vs. yesterday" },
    { label: "Action items extracted", value: "14", caption: "all assigned" },
    { label: "Risks flagged", value: "2", caption: "needs your eye", tone: "warning" },
    { label: "Status updates drafted", value: "3", caption: "1 sent · 2 pending" },
  ],
  attention: [
    {
      id: "j1",
      type: "RISK",
      title: "Q2 'Bulk export' milestone slipping by 1 sprint",
      context: "flagged 30m ago",
      cta: "Review",
      blocker: true,
      toastMessage: "Pulled the related thread for you.",
    },
    {
      id: "j2",
      type: "MEETING",
      title: "Sprint review tomorrow — agenda not finalized",
      context: "yesterday",
      cta: "Draft",
      blocker: true,
      toastMessage: "Drafting an agenda from this week's tickets…",
    },
    {
      id: "j3",
      type: "STANDUP",
      title: "3 action items from Tuesday standup are unassigned",
      context: "2d ago",
      cta: "Assign",
      toastMessage: "Suggested owners based on commit history.",
    },
    {
      id: "j4",
      type: "STATUS",
      title: "Weekly status update ready for review — sending to #leadership at 4pm",
      context: "1h ago",
      cta: "Review",
      blocker: true,
      toastMessage: "Loaded the draft for you.",
    },
    {
      id: "j5",
      type: "BLOCKER",
      title: "Engineering capacity flagged — 2 features at risk",
      context: "3h ago",
      cta: "Resolve",
      toastMessage: "Pulled the capacity report.",
    },
  ],
  events: [
    { time: "9:00 AM", title: "Standup (eng)" },
    { time: "10:30", title: "Sprint review prep" },
    { time: "1:00 PM", title: "1:1 with Maya" },
    { time: "3:30", title: "Stakeholder sync", muted: true },
  ],
  pipelineTitle: "Sprints",
  pipelineColumns: [
    {
      id: "planning",
      label: "Planning",
      dotColor: "bg-paper-edge",
      totalCount: 3,
      cards: [
        { id: "p1", title: "Sprint 24 — Q2 wrap-up", sub: "Planning · scoping" },
        { id: "p2", title: "Sprint 25 — Onboarding polish", sub: "Planning · proposed" },
        { id: "p3", title: "Sprint 26 — TBD", sub: "Planning · idea" },
      ],
    },
    {
      id: "active",
      label: "Active",
      dotColor: "bg-coral",
      totalCount: 1,
      cards: [
        {
          id: "ac1",
          title: "Sprint 23 — Bulk export & filters",
          sub: "in progress · day 6 of 10",
          progress: 65,
        },
      ],
    },
    {
      id: "review",
      label: "Review",
      dotColor: "bg-coral-light",
      totalCount: 2,
      cards: [
        { id: "rv1", title: "Sprint 22 — Mobile detail view", sub: "Sprint 22 · in review" },
        { id: "rv2", title: "Sprint 21 — Saved searches", sub: "Sprint 21 · in review" },
      ],
    },
    {
      id: "closed",
      label: "Closed",
      dotColor: "bg-[#7a8b5c]",
      totalCount: 3,
      cards: [
        { id: "c1", title: "Sprint 20 — Daily summaries", sub: "closed 1w ago" },
        { id: "c2", title: "Sprint 19 — Onboarding gating", sub: "closed 2w ago" },
        { id: "c3", title: "Sprint 18 — Notion export", sub: "closed 3w ago" },
      ],
    },
    {
      id: "archived",
      label: "Archived",
      dotColor: "bg-ink-muted",
      totalCount: 8,
      cards: [
        { id: "ar1", title: "Sprint 17 — Voice notes", sub: "archived" },
        { id: "ar2", title: "Sprint 16 — Status updates v1", sub: "archived" },
        { id: "ar3", title: "Sprint 15 — Risk register", sub: "archived" },
      ],
      truncatedExtra: 5,
    },
  ],
};
