/**
 * Canned content for the demo onboarding flow ("magic moment" per
 * Saathi_MVP_Spec.docx). Every visible string in onboarding lives here so
 * copy can be tuned without touching component code, and so the same script
 * can be replayed deterministically for YC demos.
 *
 * Swap to live Claude streaming later by replacing reads of this module
 * with calls to the AI layer; component shapes stay identical.
 */

export type DropTarget = {
  id: "github" | "notion";
  label: string;
  helper: string;
  fixtureName: string;
};

export type ReadingLine = {
  text: string;
  /** ms to wait BEFORE starting this line (after the previous one finished typing). */
  delayMs: number;
};

export type UnderstandingCard = {
  eyebrow: string;
  title: string;
  body: string;
};

export type PRDSection =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "subheading"; text: string }
  | { kind: "bullets"; items: string[] };

export const GREETING = {
  hi: "Hi, I'm Alex.",
  pitch: "Drop me into your project and I'll get up to speed.",
  bio: "AI Product Manager",
};

export const DROP_TARGETS: DropTarget[] = [
  {
    id: "github",
    label: "GitHub repo",
    helper: "Drop a link, or anything — I'll find my way around.",
    fixtureName: "saathi-app",
  },
  {
    id: "notion",
    label: "Notion product spec",
    helper: "PDF, doc, screenshot — whatever you've got.",
    fixtureName: "Product Spec.pdf",
  },
];

export const DROP_CTA = "Get to work →";

export const READING_LINES: ReadingLine[] = [
  { text: "Reading your codebase…", delayMs: 200 },
  { text: "Mapping the data model…", delayMs: 600 },
  { text: "Understanding your roadmap…", delayMs: 600 },
  { text: "Reviewing 23 open issues…", delayMs: 600 },
  { text: "Found 3 patterns in how you write tickets…", delayMs: 700 },
  { text: "Caught up.", delayMs: 900 },
];

export const UNDERSTANDING_HEADLINE = "Here's what I picked up.";
export const UNDERSTANDING_SUBHEAD =
  "Tell me if I got it right — or what I'm missing.";

export const UNDERSTANDING_CARDS: UnderstandingCard[] = [
  {
    eyebrow: "Your product",
    title: "Saathi",
    body: "AI employees that learn how the user works — drop-in colleagues for product, program management, and marketing.",
  },
  {
    eyebrow: "This sprint",
    title: "Three things in flight",
    body: "Bulk export for the analytics dashboard, retention reporting, and mobile auth polish.",
  },
  {
    eyebrow: "Three open problems I see",
    title: "Issue #47, #44, #38",
    body: "Bulk export has no PRD. #44 has stale acceptance criteria. #38 needs a smaller scope before sprint.",
  },
];

export const UNDERSTANDING_CTA = "That's right →";
export const UNDERSTANDING_CTA_ALT = "Not quite — let me adjust";

export const PRD_PREAMBLE =
  "I noticed Issue #47 has no PRD yet. I've drafted one.";

export const PRD_TITLE = "PRD — Bulk export for the analytics dashboard";
export const PRD_META = "Issue #47 · drafted by Alex · just now";

export const PRD_SECTIONS: PRDSection[] = [
  { kind: "subheading", text: "Problem" },
  {
    kind: "paragraph",
    text: "Power users on Pro and Enterprise plans regularly request offline access to their analytics. Today they screenshot dashboards or copy-paste tables, which loses formatting, breaks filters, and makes board-deck handoffs painful. Three of our top 10 accounts have asked for this in the last 14 days.",
  },
  { kind: "subheading", text: "Goals" },
  {
    kind: "bullets",
    items: [
      "One-click export of any dashboard view to CSV and PDF, including the active filter set.",
      "Server-side rendering for PDFs so charts render the same as in-app.",
      "Async job pattern — exports under 10s feel instant; larger jobs email a link when ready.",
    ],
  },
  { kind: "subheading", text: "User stories" },
  {
    kind: "bullets",
    items: [
      "As an ops lead, I export this week's funnel as a PDF with my current date range applied, so I can drop it into the Monday board update.",
      "As a finance partner, I export raw rows as CSV with the same filters I see on screen, so my downstream model lines up with the dashboard.",
      "As an admin, I see who exported what and when, so I can answer compliance questions without guesswork.",
    ],
  },
  { kind: "subheading", text: "Scope" },
  {
    kind: "bullets",
    items: [
      "CSV + PDF export of dashboards in Analytics v2.",
      "Filter parity — exports match what the user sees.",
      "Audit log row per export with actor, dashboard, format.",
    ],
  },
  { kind: "subheading", text: "Out of scope" },
  {
    kind: "bullets",
    items: [
      "Excel (.xlsx) export — defer to follow-up if customer demand persists.",
      "Scheduled / recurring exports — separate brief.",
      "Custom branding on PDFs — Enterprise feature, separate scope.",
    ],
  },
  { kind: "subheading", text: "Success metrics" },
  {
    kind: "bullets",
    items: [
      "≥ 30% of weekly Pro/Enterprise active accounts use export at least once within 30 days of launch.",
      "P95 export latency < 8s for dashboards with under 50k rows.",
      "Zero P0 / P1 incidents tied to export in the first 60 days.",
    ],
  },
];

export const PRD_APPROVE = "Looks great — start working";
export const PRD_REFINE = "Refine";

/**
 * Same content as PRD_SECTIONS, but flattened to the section-key shape the
 * /work PRD surface expects. Used to seed the user's first PRD into the DB
 * during start-working so /work shows the exact PRD they just watched
 * stream — no drift between the magic moment and the real work surface.
 *
 * Keys must match SECTION_ORDER in app/work/[id]/_workspace/prd-surface.tsx:
 * problem, goals, user_stories, scope, out_of_scope, success_metrics.
 */
export const PRD_DEMO_SECTIONS: Record<
  "problem" | "goals" | "user_stories" | "scope" | "out_of_scope" | "success_metrics",
  string
> = {
  problem:
    "Power users on Pro and Enterprise plans regularly request offline access to their analytics. Today they screenshot dashboards or copy-paste tables, which loses formatting, breaks filters, and makes board-deck handoffs painful. Three of our top 10 accounts have asked for this in the last 14 days.",
  goals: [
    "One-click export of any dashboard view to CSV and PDF, including the active filter set.",
    "Server-side rendering for PDFs so charts render the same as in-app.",
    "Async job pattern — exports under 10s feel instant; larger jobs email a link when ready.",
  ].join("\n"),
  user_stories: [
    "As an ops lead, I export this week's funnel as a PDF with my current date range applied, so I can drop it into the Monday board update.",
    "As a finance partner, I export raw rows as CSV with the same filters I see on screen, so my downstream model lines up with the dashboard.",
    "As an admin, I see who exported what and when, so I can answer compliance questions without guesswork.",
  ].join("\n"),
  scope: [
    "CSV + PDF export of dashboards in Analytics v2.",
    "Filter parity — exports match what the user sees.",
    "Audit log row per export with actor, dashboard, format.",
  ].join("\n"),
  out_of_scope: [
    "Excel (.xlsx) export — defer to follow-up if customer demand persists.",
    "Scheduled / recurring exports — separate brief.",
    "Custom branding on PDFs — Enterprise feature, separate scope.",
  ].join("\n"),
  success_metrics: [
    "≥ 30% of weekly Pro/Enterprise active accounts use export at least once within 30 days of launch.",
    "P95 export latency < 8s for dashboards with under 50k rows.",
    "Zero P0 / P1 incidents tied to export in the first 60 days.",
  ].join("\n"),
};

export const PRD_DEMO_SOURCE_ISSUE = "Issue #47 — Bulk export for the analytics dashboard";
