// Mock data for the Google-authenticated dashboard variant. The Gmail inbox
// count is the only real number on this section; everything else is hard-coded
// placeholder content used to demonstrate what the surface will look like once
// downstream integrations land.

export type MockThread = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  receivedAt: string; // human-readable
  unread: boolean;
};

export type MockKpi = {
  label: string;
  value: string;
  trend?: string;
  trendVariant: "up" | "down" | "neutral" | "warning";
};

export const MOCK_THREADS: MockThread[] = [
  {
    id: "t1",
    sender: "Priya Shah",
    subject: "Re: Q2 hiring plan — comments inline",
    preview: "Loved the framing. Two pushbacks on engineering targets…",
    receivedAt: "12 min ago",
    unread: true,
  },
  {
    id: "t2",
    sender: "Stripe",
    subject: "Your invoice from Apr 28 is ready",
    preview: "Invoice #4421 for $2,840.00 has been issued.",
    receivedAt: "1 hr ago",
    unread: true,
  },
  {
    id: "t3",
    sender: "Marcus Lee",
    subject: "Design review tomorrow?",
    preview: "Could we shift the 10am to 11? Have a conflict…",
    receivedAt: "3 hr ago",
    unread: false,
  },
  {
    id: "t4",
    sender: "GitHub",
    subject: "[aluqos/saathi] PR #214 needs review",
    preview: "@adityacrao19 requested your review on \"Add gmail source\"",
    receivedAt: "Yesterday",
    unread: false,
  },
];

export const MOCK_KPIS: MockKpi[] = [
  {
    label: "VIPs waiting",
    value: "3",
    trend: "needs reply",
    trendVariant: "warning",
  },
  {
    label: "Drafts pending",
    value: "4",
    trend: "ready to send",
    trendVariant: "neutral",
  },
  {
    label: "Calendar conflicts",
    value: "1",
    trend: "this week",
    trendVariant: "neutral",
  },
];
