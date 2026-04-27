// Mock data for the global Files (Drive-like) view.

import type { AgentId } from "./overview";

export type FileType = "folder" | "md" | "pdf" | "audio" | "image";

export type FileNode = {
  id: string;
  name: string;
  type: FileType;
  /** Owner is an agent or "mixed" for shared. */
  owner: AgentId | "mixed";
  /** Human-friendly modified label, e.g. "2h ago", "1d ago". */
  modified: string;
  /** Item count for folders. */
  itemCount?: number;
  /** Size for files, e.g. "12 KB". */
  size?: string;
  /** Folder slug used for routing (for type=folder only). */
  slug?: string;
  /** Markdown-ish preview body for md files. */
  preview?: string;
};

/** Root-level entries shown by default. */
export const ROOT_ENTRIES: FileNode[] = [
  { id: "f-prds", name: "PRDs", type: "folder", owner: "alex", modified: "2h ago", itemCount: 12, slug: "PRDs" },
  { id: "f-source", name: "Source materials", type: "folder", owner: "alex", modified: "1d ago", itemCount: 4, slug: "Source materials" },
  { id: "f-drafts", name: "Drafts", type: "folder", owner: "alex", modified: "4h ago", itemCount: 3, slug: "Drafts" },
  { id: "f-shared", name: "Shared with me", type: "folder", owner: "mixed", modified: "2d ago", itemCount: 2, slug: "Shared with me" },
  {
    id: "fl-okrs",
    name: "Q2 OKRs · v3.md",
    type: "md",
    owner: "alex",
    modified: "1d ago",
    size: "14 KB",
    preview: `# Q2 OKRs — v3

## Objective 1: Make the bulk export usable for power users
- KR1: Ship Issue #47 (bulk export) to GA · target Apr 30
- KR2: 50% of Pro accounts run at least one export within first 14 days
- KR3: < 3% support tickets cite export confusion (post-launch)

## Objective 2: Reduce dashboard time-to-insight
- KR1: Quick filters (Issue #44) shipped behind feature flag
- KR2: Median time from dashboard load → first filter < 8s
- KR3: Saved searches API live (Issue #38) — at least 3 client surfaces using it

## Objective 3: Tighten the PM ↔ engineering loop
- KR1: All PRDs include the "What we're not doing" section
- KR2: Eng signoff median < 2 business days for medium PRDs
- KR3: Quarterly retro identifies one specific process change to land next quarter

## Notes
v3 changes from v2: dropped the mobile detail-view OKR — Issue #36 is in flight but not a Q2 commitment. Replaced with the saved-searches KR per discussion with Marie.`,
  },
  {
    id: "fl-deck",
    name: "Issue #47 · launch readiness.md",
    type: "md",
    owner: "alex",
    modified: "3h ago",
    size: "11 KB",
    preview: `# Issue #47 — Bulk export launch readiness

## Status: Drafting

A walkthrough of what's left before we can flip the flag for Pro accounts.

### Done
- Backend export job scaffolding (eng)
- Schema for export-job rows
- Email-on-complete delivery
- Rate limit (3 concurrent jobs / org)

### In flight
- Pro-account gating (waiting on billing helper)
- "Export ready" toast in UI
- Audit log entries

### Not started
- Doc page in help center
- Marketing one-liner for changelog

### Risks
1. **Concurrent jobs > limit** — eng surfaced this last sync. Need decision on whether to queue or reject.
2. **CSV column ordering** — customer interviews flagged inconsistency vs. the in-app view; should match.
3. **Timezones in date columns** — currently UTC; users want local.

### Decisions needed
- [ ] Queue vs. reject when over limit
- [ ] Local vs. UTC default for date columns
- [ ] Free-tier call-to-upgrade copy`,
  },
  {
    id: "fl-prd44",
    name: "PRD-44 · Quick filters.md",
    type: "md",
    owner: "alex",
    modified: "2h ago",
    size: "18 KB",
    preview: `# PRD-44 · Quick filters on dashboard

**Owner:** Alex (PM)
**Status:** In review
**Eng lead:** TBD
**Target:** Q2

## Problem
Dashboard users currently scroll through full lists to find specific records. Customer interviews (Acme, Beacon Labs, Northwind) all surfaced the same complaint: "I just want to see open tickets from this week."

## Solution
A row of pill-style filter chips above the dashboard table. Filters are user-saveable as "saved views" (depends on Issue #38).

## What we're not doing
- Full-text search (separate effort)
- Custom column visibility (later)
- Mobile filter UX (Issue #36)

## Open questions
- Default filter set per role?
- Filter combination logic — AND or OR?
`,
  },
];

/** Per-folder content. Keyed by folder slug. */
export const FOLDER_CONTENTS: Record<string, FileNode[]> = {
  "PRDs": [
    {
      id: "p1", name: "PRD-47 · Bulk export.md", type: "md", owner: "alex", modified: "3m ago", size: "22 KB",
      preview: `# PRD-47 · Bulk export

**Owner:** Alex (PM) · **Status:** Drafting · **Target:** May 5

## Problem
Pro accounts have repeatedly asked for the ability to export their full dataset in CSV. Today they're scraping the dashboard with browser tools.

## Goals
1. Single-click export of any list view to CSV
2. Email delivery for jobs > 60s
3. Audit log entry for compliance

## Non-goals
- XLSX export (later)
- Scheduled exports (later)
- Column customization (use existing view)

## User stories
- As a Pro admin, I can click "Export" on any list view and download the result as CSV.
- As a Pro admin running a large export, I get an email when it's ready.
- As a compliance lead, I can see who exported what and when.

## Open questions
- [ ] Free-tier behavior (block, prompt to upgrade, or limit row count?)
- [ ] CSV vs UTF-8 BOM for Excel compatibility
- [ ] Date column timezone default
`,
    },
    {
      id: "p2", name: "PRD-44 · Quick filters.md", type: "md", owner: "alex", modified: "2h ago", size: "18 KB",
      preview: `# PRD-44 · Quick filters

Filter pills above the dashboard. See full PRD in root.`,
    },
    {
      id: "p3", name: "PRD-41 · Rename workspace flow.md", type: "md", owner: "alex", modified: "1w ago", size: "14 KB",
      preview: `# PRD-41 · Rename workspace flow

Confirm modal + grace period before renaming public URLs.`,
    },
    {
      id: "p4", name: "PRD-38 · Saved searches API.md", type: "md", owner: "alex", modified: "2w ago", size: "20 KB",
      preview: `# PRD-38 · Saved searches API

Public API to create, list, and delete saved searches per user. Required by Quick filters (Issue #44).`,
    },
    {
      id: "p5", name: "PRD-36 · Mobile detail view.md", type: "md", owner: "alex", modified: "3w ago", size: "16 KB",
      preview: `# PRD-36 · Mobile detail view

Compact card layout for items on viewports < 768px.`,
    },
    {
      id: "p6", name: "PRD-35 · Daily summaries.md", type: "md", owner: "alex", modified: "1mo ago", size: "12 KB",
      preview: `# PRD-35 · Daily summaries

Email digest at 8am local time, opt-in.`,
    },
    {
      id: "p7", name: "PRD-34 · Onboarding gating.md", type: "md", owner: "alex", modified: "1mo ago", size: "11 KB",
      preview: `# PRD-34 · Onboarding gating

Block app access until first-run setup is complete.`,
    },
    {
      id: "p8", name: "PRD-32 · Notion export.md", type: "md", owner: "alex", modified: "2mo ago", size: "13 KB",
      preview: `# PRD-32 · Notion export

One-way push of records into a Notion database.`,
    },
    {
      id: "p9", name: "PRD-31 · Voice notes.md", type: "md", owner: "alex", modified: "2mo ago", size: "15 KB",
      preview: `# PRD-31 · Voice notes

Record short audio clips attached to records. Whisper transcript on completion.`,
    },
    {
      id: "p10", name: "PRD-29 · Smart digests.md", type: "md", owner: "alex", modified: "2mo ago", size: "9 KB",
      preview: `# PRD-29 · Smart digests

LLM-summarized weekly recap per workspace.`,
    },
    {
      id: "p11", name: "PRD-27 · Slack import.md", type: "md", owner: "alex", modified: "3mo ago", size: "10 KB",
      preview: `# PRD-27 · Slack import

Forward a Slack message to a special address; it becomes a record.`,
    },
    {
      id: "p12", name: "PRD-25 · Saved views.md", type: "md", owner: "alex", modified: "3mo ago", size: "8 KB",
      preview: `# PRD-25 · Saved views

Per-user named view configurations (filters + sort + columns).`,
    },
  ],
  "Source materials": [
    {
      id: "sm1", name: "Customer interviews · Q2.md", type: "md", owner: "alex", modified: "2d ago", size: "32 KB",
      preview: `# Customer interviews — Q2

Six 30-min sessions across Acme, Beacon Labs, Northwind, plus 3 prospects.

## Themes
1. **Bulk export is table stakes** — every account asked unprompted
2. **Mobile is a viewing tool, not editing** — no one wants to edit on mobile
3. **Quick filters > full search** — most needs are "open this week"
4. **Notion is the most-mentioned destination** — 4/6 sessions

## Quotes worth keeping
- *"I'd pay double if I could just export to CSV."* — Marie, Acme
- *"On mobile I just need to see the status, not edit."* — Devon, Beacon Labs
- *"I want to land on the dashboard and immediately filter to today."* — Priya, Northwind`,
    },
    {
      id: "sm2", name: "Competitor scan.pdf", type: "pdf", owner: "alex", modified: "1w ago", size: "5.1 MB",
    },
    {
      id: "sm3", name: "All-hands recording.m4a", type: "audio", owner: "mixed", modified: "1w ago", size: "44 MB",
    },
    {
      id: "sm4", name: "Sales call · Beacon Labs.m4a", type: "audio", owner: "mixed", modified: "2w ago", size: "38 MB",
    },
  ],
  "Drafts": [
    {
      id: "d1", name: "Untitled PRD · Issue #51.md", type: "md", owner: "alex", modified: "4h ago", size: "2 KB",
      preview: `# Issue #51 — (working title)

Rough notes from this morning's chat with Priya. Something about per-account theming?

- They have multiple sub-orgs, want different brand colors
- Logo upload per sub-org
- Maybe just custom CSS variable injection?

To explore.`,
    },
    {
      id: "d2", name: "Q3 hypothesis dump.md", type: "md", owner: "alex", modified: "1d ago", size: "1 KB",
      preview: `# Q3 hypothesis dump

Random ideas to triage:
- Native iOS app
- Public REST API (currently internal-only)
- Per-team dashboards
- Workspace templates`,
    },
    {
      id: "d3", name: "Roadmap one-pager · draft.md", type: "md", owner: "alex", modified: "2d ago", size: "4 KB",
      preview: `# Roadmap one-pager — draft

For board pre-read. Boil down the Q2 OKRs into 3 narrative bullets.

1. **Power-user features land**: bulk export + quick filters
2. **API surface area grows**: saved searches API unlocks integrations
3. **Mobile gets a real story**: not feature parity, but a focused viewing UX`,
    },
  ],
  "Shared with me": [
    {
      id: "sh1", name: "Q2 board pre-read.pdf", type: "pdf", owner: "mixed", modified: "2d ago", size: "1.9 MB",
    },
    {
      id: "sh2", name: "Investor update · Apr.md", type: "md", owner: "mixed", modified: "1w ago", size: "11 KB",
      preview: `# Investor update — April

Highlights:
- ARR: +18% MoM
- 4 design partners onboarded
- Beacon Labs case study published

Asks:
- Intros to Series A funds focused on horizontal SaaS
- Help with VP Eng search`,
    },
  ],
};
