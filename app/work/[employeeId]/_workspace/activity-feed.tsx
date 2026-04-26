"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { FileText, Sparkles, Eye, Check } from "lucide-react";
import { toast } from "@/src/components/toast";

type EventType = "draft" | "refine" | "read" | "done";

const EVENTS: Array<{ id: string; type: EventType; verb: string; when: string }> = [
  { id: "a-1", type: "draft", verb: "Drafted Issue #47 PRD", when: "just now" },
  { id: "a-2", type: "read", verb: "Read q2-roadmap.pdf", when: "2m ago" },
  { id: "a-3", type: "read", verb: "Read saathi-mvp/README.md", when: "3m ago" },
  { id: "a-4", type: "done", verb: "Onboarding completed", when: "5m ago" },
];

function iconFor(type: EventType) {
  const cls = "w-3.5 h-3.5 text-[--color-ink-faint] shrink-0";
  switch (type) {
    case "draft":
      return <FileText className={cls} />;
    case "refine":
      return <Sparkles className={cls} />;
    case "read":
      return <Eye className={cls} />;
    case "done":
      return <Check className={cls} />;
  }
}

export function ActivityFeed() {
  return (
    <Card tone="default">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <Button
          variant="quiet"
          size="sm"
          onClick={() => toast.info("Coming soon")}
        >
          View all
        </Button>
      </CardHeader>
      <CardContent compact className="p-0">
        <ul className="divide-y divide-[--color-paper-edge]/60">
          {EVENTS.map(e => (
            <li
              key={e.id}
              className="flex items-center gap-3 px-5 py-2.5 text-[13px] hover:bg-[--color-paper-hi]/30 transition-colors"
            >
              {iconFor(e.type)}
              <span className="text-[--color-ink] flex-1 truncate">{e.verb}</span>
              <span className="text-[--color-ink-faint] text-[11.5px] ml-auto shrink-0">{e.when}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
