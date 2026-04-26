"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";
import { User, Clock, CheckSquare, MoreHorizontal } from "lucide-react";
import { toast } from "@/src/components/toast";

export function PrdHeader({
  title,
  sourceIssue,
  isStreaming,
  sectionsComplete,
}: {
  title: string;
  sourceIssue: string | null;
  isStreaming: boolean;
  sectionsComplete: number;
}) {
  const issueLabel = sourceIssue ? extractIssueId(sourceIssue) : null;
  return (
    <Card tone="primary">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {issueLabel && <Badge variant="outline">{issueLabel}</Badge>}
            {isStreaming ? (
              <Badge variant="coral">
                <span className="w-[6px] h-[6px] rounded-full bg-[--color-coral] pulse-coral" />
                Drafting
              </Badge>
            ) : (
              <Badge variant="green">
                <span className="w-[6px] h-[6px] rounded-full bg-emerald-500" />
                Draft
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Coming soon")}
            >
              Share
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast.info("Coming soon")}
              aria-label="More actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Serif as="h2" className="text-[28px] leading-tight text-[--color-ink]">
          {title || "Drafting…"}
        </Serif>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-[--color-ink-faint]">
          <MetaItem icon={<User className="w-3.5 h-3.5" />} label="Drafted by Alex" />
          <MetaItem icon={<Clock className="w-3.5 h-3.5" />} label="Last edit · just now" />
          <MetaItem
            icon={<CheckSquare className="w-3.5 h-3.5" />}
            label={`${sectionsComplete} section${sectionsComplete === 1 ? "" : "s"} complete`}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MetaItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[--color-ink-faint]">{icon}</span>
      <span>{label}</span>
    </span>
  );
}

function extractIssueId(label: string): string {
  const m = label.match(/Issue\s+#\d+/i);
  return m ? m[0] : label.slice(0, 24);
}
