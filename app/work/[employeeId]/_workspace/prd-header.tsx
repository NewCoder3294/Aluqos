"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";
import { Clock, MoreHorizontal, Plus } from "lucide-react";
import { toast } from "@/src/components/toast";

export function PrdHeader({
  title,
  sourceIssue,
  isStreaming,
  sectionsComplete,
  totalSections = 6,
  ownerName = "Alex",
}: {
  title: string;
  sourceIssue: string | null;
  isStreaming: boolean;
  sectionsComplete: number;
  totalSections?: number;
  ownerName?: string;
}) {
  const issueLabel = sourceIssue ? extractIssueId(sourceIssue) : "Issue #47";
  const progressPct = Math.round((sectionsComplete / totalSections) * 100);

  return (
    <Card tone="primary">
      <CardContent className="space-y-6 !p-8">
        <div className="flex items-start justify-between gap-3">
          <Serif as="h2" className="text-[24px] leading-tight text-ink truncate">
            {title || "Drafting…"}
          </Serif>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => toast.info("Coming soon")}>
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.info("Coming soon")}
              aria-label="More actions"
              className="size-8 rounded-md"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>

        {/* Properties table */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <PropRow label="Status">
            {isStreaming ? (
              <Badge variant="coral">
                <span className="w-[6px] h-[6px] rounded-full bg-coral pulse-coral" />
                Drafting
              </Badge>
            ) : (
              <Badge variant="coral">Drafting</Badge>
            )}
          </PropRow>
          <PropRow label="Priority">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] bg-coral/10 text-coral-deep border border-coral/20">
              <span className="w-[6px] h-[6px] rounded-full bg-coral-light" />
              High
            </span>
          </PropRow>
          <PropRow label="Owner">
            <span className="inline-flex items-center gap-1.5 text-[13px] text-ink">
              <span
                className="w-4 h-4 rounded-full text-white grid place-items-center text-[9px] shrink-0"
                style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
              >
                <Serif>{ownerName.charAt(0)}</Serif>
              </span>
              {ownerName}
            </span>
          </PropRow>
          <PropRow label="Created">
            <span className="inline-flex items-center gap-1.5 text-[13px] text-ink">
              <Clock className="size-3 text-ink-faint" />
              just now
            </span>
          </PropRow>
          <PropRow label="Source">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[12px] bg-paper-hi border border-paper-edge text-ink-muted">
              <GithubGlyph />
              {issueLabel}
            </span>
          </PropRow>
          <PropRow label="Sections">
            <span className="inline-flex items-center gap-2 text-[13px] text-ink w-full">
              <span className="tabular-nums shrink-0">
                {sectionsComplete} of {totalSections}
              </span>
              <span className="flex-1 max-w-[120px] h-1 bg-paper-edge/70 rounded-full overflow-hidden">
                <span
                  className="block h-full bg-coral rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </span>
            </span>
          </PropRow>
          <PropRow label="Tags">
            <span className="flex flex-wrap items-center gap-1">
              <TagChip>analytics</TagChip>
              <TagChip>feature</TagChip>
              <TagChip>needs-prd</TagChip>
            </span>
          </PropRow>
          <PropRow label="Reviewer">
            <Button
              type="button"
              variant="quiet"
              size="sm"
              onClick={() => toast.info("Coming soon")}
              className="gap-1 text-[12.5px] normal-case tracking-normal px-0 py-0"
            >
              <Plus className="size-3" />
              Add reviewer
            </Button>
          </PropRow>
        </div>
      </CardContent>
    </Card>
  );
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-3 py-1 px-1.5 -mx-1.5 rounded transition-colors hover:bg-paper-hi/40">
      <div className="text-[10.5px] uppercase tracking-[0.1em] text-ink-faint font-medium">
        {label}
      </div>
      <div className="min-w-0 text-[13px] text-ink">{children}</div>
    </div>
  );
}

function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] bg-paper-hi border border-paper-edge text-ink-muted">
      {children}
    </span>
  );
}

function GithubGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" aria-hidden className="text-ink-muted">
      <path
        fill="currentColor"
        d="M12 0a12 12 0 0 0-3.79 23.4c.6.11.83-.26.83-.58v-2c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.34-1.76c-1.09-.75.08-.74.08-.74a2.52 2.52 0 0 1 1.84 1.24 2.55 2.55 0 0 0 3.49 1 2.56 2.56 0 0 1 .76-1.6c-2.67-.31-5.47-1.34-5.47-5.94a4.66 4.66 0 0 1 1.24-3.23 4.34 4.34 0 0 1 .12-3.18s1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23a4.34 4.34 0 0 1 .12 3.18 4.66 4.66 0 0 1 1.24 3.23c0 4.61-2.81 5.62-5.49 5.92a2.86 2.86 0 0 1 .81 2.22v3.29c0 .32.22.69.83.58A12 12 0 0 0 12 0z"
      />
    </svg>
  );
}

function extractIssueId(label: string): string {
  const m = label.match(/Issue\s+#\d+/i);
  return m ? m[0] : label.slice(0, 24);
}
