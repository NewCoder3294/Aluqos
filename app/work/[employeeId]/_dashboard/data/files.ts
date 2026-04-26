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
};

/** Root-level entries shown by default. */
export const ROOT_ENTRIES: FileNode[] = [
  { id: "f-prds", name: "PRDs", type: "folder", owner: "alex", modified: "2h ago", itemCount: 12, slug: "PRDs" },
  { id: "f-status", name: "Status updates", type: "folder", owner: "jordan", modified: "1h ago", itemCount: 5, slug: "Status updates" },
  { id: "f-camp", name: "Campaigns", type: "folder", owner: "sam", modified: "3h ago", itemCount: 9, slug: "Campaigns" },
  { id: "f-source", name: "Source materials", type: "folder", owner: "mixed", modified: "1d ago", itemCount: 4, slug: "Source materials" },
  { id: "f-brand", name: "Brand assets", type: "folder", owner: "sam", modified: "5h ago", itemCount: 8, slug: "Brand assets" },
  { id: "f-stand", name: "Standups", type: "folder", owner: "jordan", modified: "30m ago", itemCount: 6, slug: "Standups" },
  { id: "f-drafts", name: "Drafts", type: "folder", owner: "mixed", modified: "4h ago", itemCount: 3, slug: "Drafts" },
  { id: "f-shared", name: "Shared with me", type: "folder", owner: "mixed", modified: "2d ago", itemCount: 2, slug: "Shared with me" },
  { id: "fl-okrs", name: "Q2 OKRs · v3.md", type: "md", owner: "alex", modified: "1d ago", size: "14 KB" },
  { id: "fl-deck", name: "Demo Day deck · final.pdf", type: "pdf", owner: "sam", modified: "3h ago", size: "4.2 MB" },
  { id: "fl-retro", name: "Sprint 23 retro notes.md", type: "md", owner: "jordan", modified: "2d ago", size: "9 KB" },
  { id: "fl-bvd", name: "Brand voice deck.pdf", type: "pdf", owner: "sam", modified: "1w ago", size: "6.7 MB" },
];

/** Per-folder content. Keyed by folder slug. */
export const FOLDER_CONTENTS: Record<string, FileNode[]> = {
  "PRDs": [
    { id: "p1", name: "PRD-47 · Bulk export.md", type: "md", owner: "alex", modified: "3m ago", size: "22 KB" },
    { id: "p2", name: "PRD-44 · Quick filters.md", type: "md", owner: "alex", modified: "5d ago", size: "18 KB" },
    { id: "p3", name: "PRD-41 · Rename workspace flow.md", type: "md", owner: "alex", modified: "1w ago", size: "14 KB" },
    { id: "p4", name: "PRD-38 · Saved searches API.md", type: "md", owner: "alex", modified: "2w ago", size: "20 KB" },
    { id: "p5", name: "PRD-36 · Mobile detail view.md", type: "md", owner: "alex", modified: "3w ago", size: "16 KB" },
    { id: "p6", name: "PRD-35 · Daily summaries.md", type: "md", owner: "alex", modified: "1mo ago", size: "12 KB" },
    { id: "p7", name: "PRD-34 · Onboarding gating.md", type: "md", owner: "alex", modified: "1mo ago", size: "11 KB" },
    { id: "p8", name: "PRD-32 · Notion export.md", type: "md", owner: "alex", modified: "2mo ago", size: "13 KB" },
    { id: "p9", name: "PRD-31 · Voice notes.md", type: "md", owner: "alex", modified: "2mo ago", size: "15 KB" },
    { id: "p10", name: "PRD-29 · Smart digests.md", type: "md", owner: "alex", modified: "2mo ago", size: "9 KB" },
    { id: "p11", name: "PRD-27 · Slack import.md", type: "md", owner: "alex", modified: "3mo ago", size: "10 KB" },
    { id: "p12", name: "PRD-25 · Saved views.md", type: "md", owner: "alex", modified: "3mo ago", size: "8 KB" },
  ],
  "Status updates": [
    { id: "s1", name: "Week of Apr 22.md", type: "md", owner: "jordan", modified: "1h ago", size: "6 KB" },
    { id: "s2", name: "Week of Apr 15.md", type: "md", owner: "jordan", modified: "1w ago", size: "7 KB" },
    { id: "s3", name: "Week of Apr 8.md", type: "md", owner: "jordan", modified: "2w ago", size: "5 KB" },
    { id: "s4", name: "Week of Apr 1.md", type: "md", owner: "jordan", modified: "3w ago", size: "6 KB" },
    { id: "s5", name: "Week of Mar 25.md", type: "md", owner: "jordan", modified: "1mo ago", size: "5 KB" },
  ],
  "Campaigns": [
    { id: "c1", name: "Q2 launch · brief.md", type: "md", owner: "sam", modified: "3h ago", size: "11 KB" },
    { id: "c2", name: "Q2 launch · email sequence.md", type: "md", owner: "sam", modified: "1d ago", size: "9 KB" },
    { id: "c3", name: "Q2 launch · twitter thread.md", type: "md", owner: "sam", modified: "2d ago", size: "4 KB" },
    { id: "c4", name: "Beacon Labs case study.pdf", type: "pdf", owner: "sam", modified: "4d ago", size: "2.1 MB" },
    { id: "c5", name: "Hero mockup v3.png", type: "image", owner: "sam", modified: "5d ago", size: "3.4 MB" },
    { id: "c6", name: "OG card draft.png", type: "image", owner: "sam", modified: "5d ago", size: "1.2 MB" },
    { id: "c7", name: "Demo Day announcement.md", type: "md", owner: "sam", modified: "1w ago", size: "5 KB" },
    { id: "c8", name: "Customer story · Acme.md", type: "md", owner: "sam", modified: "2w ago", size: "8 KB" },
    { id: "c9", name: "Launch playbook.pdf", type: "pdf", owner: "sam", modified: "3w ago", size: "1.8 MB" },
  ],
  "Source materials": [
    { id: "sm1", name: "Customer interviews · Q2.md", type: "md", owner: "alex", modified: "2d ago", size: "32 KB" },
    { id: "sm2", name: "Competitor scan.pdf", type: "pdf", owner: "alex", modified: "1w ago", size: "5.1 MB" },
    { id: "sm3", name: "All-hands recording.m4a", type: "audio", owner: "jordan", modified: "1w ago", size: "44 MB" },
    { id: "sm4", name: "Sales call · Beacon Labs.m4a", type: "audio", owner: "sam", modified: "2w ago", size: "38 MB" },
  ],
  "Brand assets": [
    { id: "b1", name: "Brand voice deck.pdf", type: "pdf", owner: "sam", modified: "1w ago", size: "6.7 MB" },
    { id: "b2", name: "Logo · primary.png", type: "image", owner: "sam", modified: "2w ago", size: "240 KB" },
    { id: "b3", name: "Logo · mark only.png", type: "image", owner: "sam", modified: "2w ago", size: "180 KB" },
    { id: "b4", name: "Color tokens.md", type: "md", owner: "sam", modified: "1mo ago", size: "3 KB" },
    { id: "b5", name: "Type system.md", type: "md", owner: "sam", modified: "1mo ago", size: "4 KB" },
    { id: "b6", name: "Tone of voice.md", type: "md", owner: "sam", modified: "2mo ago", size: "7 KB" },
    { id: "b7", name: "Photo library cover.png", type: "image", owner: "sam", modified: "2mo ago", size: "5.2 MB" },
    { id: "b8", name: "Press kit.pdf", type: "pdf", owner: "sam", modified: "3mo ago", size: "8.4 MB" },
  ],
  "Standups": [
    { id: "st1", name: "Standup · Apr 25.md", type: "md", owner: "jordan", modified: "30m ago", size: "3 KB" },
    { id: "st2", name: "Standup · Apr 24.md", type: "md", owner: "jordan", modified: "yesterday", size: "3 KB" },
    { id: "st3", name: "Standup · Apr 23.md", type: "md", owner: "jordan", modified: "2d ago", size: "3 KB" },
    { id: "st4", name: "Standup · Apr 22.md", type: "md", owner: "jordan", modified: "3d ago", size: "3 KB" },
    { id: "st5", name: "Standup · Apr 21.md", type: "md", owner: "jordan", modified: "4d ago", size: "3 KB" },
    { id: "st6", name: "Standup · Apr 18.md", type: "md", owner: "jordan", modified: "1w ago", size: "3 KB" },
  ],
  "Drafts": [
    { id: "d1", name: "Untitled PRD · Issue #51.md", type: "md", owner: "alex", modified: "4h ago", size: "2 KB" },
    { id: "d2", name: "Twitter thread · idea.md", type: "md", owner: "sam", modified: "1d ago", size: "1 KB" },
    { id: "d3", name: "Risk memo draft.md", type: "md", owner: "jordan", modified: "2d ago", size: "4 KB" },
  ],
  "Shared with me": [
    { id: "sh1", name: "Q2 board pre-read.pdf", type: "pdf", owner: "mixed", modified: "2d ago", size: "1.9 MB" },
    { id: "sh2", name: "Investor update · Apr.md", type: "md", owner: "mixed", modified: "1w ago", size: "11 KB" },
  ],
};
