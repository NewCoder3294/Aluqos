// Shared types for dashboard role data (Alex / Jordan / Sam).

export type Kpi = {
  label: string;
  value: string;
  caption?: string;
  tone?: "default" | "warning";
};

export type AttentionItem = {
  id: string;
  /** Small uppercase tag rendered before the title (e.g. "RISK", "MEETING"). */
  type: string;
  title: string;
  /** Time/context line (e.g. "30m ago"). */
  context: string;
  /** Coral dot when true, neutral edge dot otherwise. */
  blocker?: boolean;
  /** CTA label on the right (free-form to support role-specific verbs). */
  cta: string;
  /** Either an internal href (relative to /work/[employeeId]/) or a toast message. */
  href?: string;
  toastMessage?: string;
};

export type CalendarEvent = {
  time: string;
  title: string;
  muted?: boolean;
};

export type PipelineCardData = {
  id: string;
  title: string;
  sub: string;
  /** Coral progress bar 0-100. */
  progress?: number;
  /** Internal href (relative to /work/[employeeId]/). */
  href?: string;
};

export type PipelineColumnData = {
  id: string;
  label: string;
  /** Tailwind class name for the dot color. */
  dotColor: string;
  cards: PipelineCardData[];
  totalCount: number;
  truncatedExtra?: number;
};

export type DashboardData = {
  /** First name shown in greeting; usually the user's name (Nick). */
  greetingName: string;
  /** Italic subline under the greeting. */
  greetingSubline: string;
  kpis: Kpi[];
  attention: AttentionItem[];
  events: CalendarEvent[];
  pipelineTitle: string;
  pipelineColumns: PipelineColumnData[];
};
