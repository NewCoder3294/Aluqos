"use client";

import { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";
import { toast } from "@/src/components/toast";
import { FileText, Sparkles, ClipboardCheck } from "lucide-react";

const QUICK_TASKS = [
  { id: "qt-prd", title: "Draft a PRD from a Slack message", icon: FileText },
  { id: "qt-sprint", title: "Summarize the last sprint", icon: ClipboardCheck },
  { id: "qt-brief", title: "Write a feature brief", icon: Sparkles },
] as const;

export function EmptyState() {
  const [draft, setDraft] = useState("");
  return (
    <section className="p-10 grid place-items-center min-h-[60vh]">
      <Card tone="primary" className="max-w-[680px] w-full">
        <CardContent className="!p-12 space-y-7">
          <div className="space-y-2 text-center">
            <Serif as="h2" className="text-[32px] leading-tight">
              Ready when you are.
            </Serif>
            <p className="text-[14px] text-ink-faint leading-relaxed">
              Pick a task on the left, or start something new.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK_TASKS.map(qt => {
              const Icon = qt.icon;
              return (
                <Button
                  key={qt.id}
                  variant="outline"
                  size="md"
                  onClick={() => toast.info("Coming soon", { description: qt.title })}
                  className="text-left p-4 rounded-md normal-case tracking-normal h-auto items-start flex-col hover:bg-paper-hi/40"
                >
                  <Icon className="w-4 h-4 text-coral-deep mb-2" />
                  <div className="text-[13px] text-ink leading-snug">
                    {qt.title}
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="What should I work on?"
              className="flex-1 bg-white border border-paper-edge rounded px-3 py-2.5 text-[13px] focus:outline-none focus:border-coral"
              onKeyDown={e => {
                if (e.key === "Enter" && draft.trim()) {
                  toast.info("Coming soon", { description: draft });
                  setDraft("");
                }
              }}
            />
            <Button
              variant="ink"
              size="md"
              disabled={!draft.trim()}
              onClick={() => {
                toast.info("Coming soon", { description: draft });
                setDraft("");
              }}
            >
              Go
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
