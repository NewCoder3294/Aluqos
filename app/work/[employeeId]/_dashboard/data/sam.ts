import type { DashboardData } from "./types";

export const SAM_DATA: DashboardData = {
  greetingName: "Nick",
  greetingSubline: "Here's what Sam has been up to.",
  kpis: [
    { label: "Posts published this week", value: "7", caption: "+3 vs. last week" },
    { label: "Drafts in review", value: "4", caption: "awaiting your input", tone: "warning" },
    { label: "Brand voice score", value: "94", caption: "↑ 6 pts vs. last month" },
    { label: "Audience reached (7d)", value: "38.2k", caption: "↑ 12% vs. last week" },
  ],
  attention: [
    {
      id: "s1",
      type: "LINKEDIN",
      title: "Launch announcement post ready for review — going live Tuesday",
      context: "1h ago",
      cta: "Review",
      blocker: true,
      toastMessage: "Loaded the draft.",
    },
    {
      id: "s2",
      type: "EMAIL",
      title: "Demo Day invite — subject line A/B variants ready",
      context: "2h ago",
      cta: "Pick",
      blocker: true,
      toastMessage: "Opening the variant picker.",
    },
    {
      id: "s3",
      type: "VOICE",
      title: "Brand voice drift detected on latest blog draft",
      context: "3h ago",
      cta: "Resolve",
      blocker: true,
      toastMessage: "Showing the drift markup.",
    },
    {
      id: "s4",
      type: "PERMISSION",
      title: "Customer testimonial from Marie at Nike — needs sign-off",
      context: "5h ago",
      cta: "Approve",
      toastMessage: "Sent the request to Marie.",
    },
    {
      id: "s5",
      type: "CALENDAR",
      title: "Q2 content calendar due Tuesday — 4 slots empty",
      context: "yesterday",
      cta: "Draft",
      toastMessage: "Drafting fillers based on the roadmap…",
    },
  ],
  events: [
    { time: "8:30 AM", title: "Demand-gen review" },
    { time: "11:00", title: "Brand voice sync" },
    { time: "2:00 PM", title: "Press briefing prep" },
    { time: "4:00", title: "Content calendar review", muted: true },
  ],
  pipelineTitle: "Campaigns",
  pipelineColumns: [
    {
      id: "brief",
      label: "Brief",
      dotColor: "bg-paper-edge",
      totalCount: 2,
      cards: [
        { id: "br1", title: "Demo Day public launch", sub: "Brief · scoping" },
        { id: "br2", title: "Q3 onboarding refresh", sub: "Brief · proposed" },
      ],
    },
    {
      id: "drafting",
      label: "Drafting",
      dotColor: "bg-coral",
      totalCount: 1,
      cards: [
        {
          id: "dr1",
          title: "Bulk export — feature announcement",
          sub: "Sam is on it",
          progress: 45,
        },
      ],
    },
    {
      id: "review",
      label: "In review",
      dotColor: "bg-coral-light",
      totalCount: 2,
      cards: [
        { id: "rv1", title: "Aluqos vs. ChatGPT Enterprise — comparison post", sub: "in review · 2 reviewers" },
        { id: "rv2", title: "Founder voice — 'why we built this'", sub: "in review · 1 reviewer" },
      ],
    },
    {
      id: "live",
      label: "Live",
      dotColor: "bg-[#7a8b5c]",
      totalCount: 3,
      cards: [
        { id: "lv1", title: "Launch teaser — week 1", sub: "live · 3d ago" },
        { id: "lv2", title: "AI employees explainer", sub: "live · 5d ago" },
        { id: "lv3", title: "Customer story — Marie at Nike", sub: "live · 1w ago" },
      ],
    },
    {
      id: "wrapped",
      label: "Wrapped",
      dotColor: "bg-ink-muted",
      totalCount: 15,
      cards: [
        { id: "wr1", title: "Q1 launch series — week 4", sub: "wrapped" },
        { id: "wr2", title: "Q1 launch series — week 3", sub: "wrapped" },
        { id: "wr3", title: "Q1 launch series — week 2", sub: "wrapped" },
      ],
      truncatedExtra: 12,
    },
  ],
};
