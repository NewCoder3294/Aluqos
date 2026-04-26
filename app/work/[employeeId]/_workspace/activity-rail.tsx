"use client";

import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/toast";
import {
  Check,
  Circle,
  Eye,
  FileText,
  GitBranch,
  Send,
  Sparkles,
} from "lucide-react";

type EventType = "draft" | "refine" | "read" | "done" | "send";
type FeedItem = {
  id: string;
  type: EventType;
  verb: string;
  detail?: string;
  when: string;
  bucket: "today" | "earlier";
};

const FEED: FeedItem[] = [
  { id: "a-1", type: "draft", verb: "Drafted Issue #47 PRD", detail: "6 sections generated", when: "just now", bucket: "today" },
  { id: "a-2", type: "read", verb: "Read q2-roadmap.pdf", detail: "page 3 of 12", when: "2m ago", bucket: "today" },
  { id: "a-3", type: "read", verb: "Read saathi-mvp/README.md", when: "3m ago", bucket: "today" },
  { id: "a-4", type: "refine", verb: "Tightened Goals", detail: "removed redundant bullet", when: "5m ago", bucket: "today" },
  { id: "a-5", type: "send", verb: "Mock-shared with Marie", detail: "for review", when: "8m ago", bucket: "today" },
  { id: "a-6", type: "done", verb: "Onboarding completed", when: "12m ago", bucket: "today" },
  { id: "a-7", type: "draft", verb: "Drafted Q1 retrospective", detail: "Notion", when: "Yesterday", bucket: "earlier" },
  { id: "a-8", type: "read", verb: "Read product-strategy.pdf", when: "Yesterday", bucket: "earlier" },
  { id: "a-9", type: "refine", verb: "Refined Success metrics", when: "2 days ago", bucket: "earlier" },
];

const VERSIONS = [
  { id: "v3", label: "v3 (current)", note: "Refined goals & success metrics", when: "just now" },
  { id: "v2", label: "v2", note: "Added user stories", when: "5m ago" },
  { id: "v1", label: "v1", note: "Initial draft", when: "8m ago" },
];

type Task = { id: string; title: string; tier: "own" | "assist" | "flag"; done: boolean };
const INITIAL_TASKS: Task[] = [
  { id: "t-1", title: "Lock scope with engineering", tier: "own", done: false },
  { id: "t-2", title: "Pull metrics baseline from Mixpanel", tier: "own", done: false },
  { id: "t-3", title: "Help Marie with API spec", tier: "assist", done: false },
  { id: "t-4", title: "Flag rollout risk to Nicolas", tier: "flag", done: true },
];

function iconFor(type: EventType) {
  const cls = "size-3.5 text-ink-faint shrink-0";
  switch (type) {
    case "draft":
      return <FileText className={cls} />;
    case "refine":
      return <Sparkles className={cls} />;
    case "read":
      return <Eye className={cls} />;
    case "done":
      return <Check className={cls} />;
    case "send":
      return <Send className={cls} />;
  }
}

export function ActivityRail() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const today = FEED.filter(e => e.bucket === "today");
  const earlier = FEED.filter(e => e.bucket === "earlier");

  return (
    <Card tone="default" className="flex flex-col h-full">
      <Tabs defaultValue="activity" className="flex flex-col flex-1 min-h-0">
        <div className="px-3 pt-2 bg-paper-hi border-b border-paper-edge">
          <TabsList className="border-b-0 -mb-px">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="comments" count={1}>
              Comments
            </TabsTrigger>
            <TabsTrigger value="versions" count={3}>
              Versions
            </TabsTrigger>
            <TabsTrigger value="tasks" count={tasks.filter(t => !t.done).length}>
              Tasks
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent compact className="flex-1 min-h-0 overflow-y-auto !p-0">
          <TabsContent value="activity">
            <FeedGroup label="Today" items={today} />
            <FeedGroup label="Earlier" items={earlier} />
          </TabsContent>

          <TabsContent value="comments" className="p-4 space-y-4">
            <div className="flex gap-2.5">
              <span
                className="w-7 h-7 rounded-full text-white grid place-items-center text-[10px] shrink-0"
                style={{ background: "linear-gradient(135deg,#7a6f5c,#5a4f3d)" }}
              >
                M
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-[12.5px] text-ink font-medium">Marie</span>
                  <span className="text-[10.5px] text-ink-faint">2m ago</span>
                </div>
                <p className="text-[12.5px] text-ink-muted leading-relaxed mt-0.5">
                  Looks good. Add the API spec section before sharing.
                </p>
              </div>
            </div>
            <div className="border-t border-paper-edge pt-3">
              <div className="flex gap-2">
                <input
                  placeholder="Reply to Marie…"
                  className="flex-1 min-w-0 bg-white border border-paper-edge rounded px-3 py-1.5 text-[12.5px] focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      toast.info("Coming soon");
                      (e.currentTarget as HTMLInputElement).value = "";
                    }
                  }}
                />
                <Button variant="ink" size="sm" onClick={() => toast.info("Coming soon")}>
                  Reply
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="versions">
            <ul className="divide-y divide-paper-edge/60">
              {VERSIONS.map(v => (
                <li
                  key={v.id}
                  className="px-4 py-2.5 flex items-center gap-3 hover:bg-paper-hi/40 cursor-pointer transition-colors"
                  onClick={() => toast.info("Coming soon", { description: `Restore ${v.label}` })}
                >
                  <GitBranch className="size-3.5 text-ink-faint shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] text-ink truncate">{v.label}</div>
                    <div className="text-[11px] text-ink-faint truncate">{v.note}</div>
                  </div>
                  <span className="text-[10.5px] text-ink-faint shrink-0">{v.when}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="tasks">
            <ul className="divide-y divide-paper-edge/60">
              {tasks.map(t => (
                <li
                  key={t.id}
                  className="px-4 py-2.5 flex items-center gap-3 hover:bg-paper-hi/40 transition-colors"
                >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setTasks(prev =>
                        prev.map(p => (p.id === t.id ? { ...p, done: !p.done } : p)),
                      )
                    }
                    aria-label={t.done ? "Mark incomplete" : "Mark complete"}
                    aria-pressed={t.done}
                    className="size-4 rounded p-0 [&_svg]:size-3 hover:border-coral"
                  >
                    {t.done ? <Check className="text-coral-deep" /> : null}
                  </Button>
                  <span
                    className={
                      "flex-1 min-w-0 text-[12.5px] " +
                      (t.done
                        ? "line-through text-ink-faint"
                        : "text-ink")
                    }
                  >
                    {t.title}
                  </span>
                  <TierDot tier={t.tier} />
                </li>
              ))}
            </ul>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

function FeedGroup({ label, items }: { label: string; items: FeedItem[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
        {label}
      </div>
      <ul className="divide-y divide-paper-edge/40">
        {items.map(e => (
          <li
            key={e.id}
            className="flex items-start gap-2.5 px-4 py-2 hover:bg-paper-hi/40 transition-colors"
          >
            <span className="mt-0.5">{iconFor(e.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] text-ink leading-snug truncate">
                {e.verb}
              </div>
              {e.detail && (
                <div className="text-[11px] text-ink-faint leading-snug truncate">
                  {e.detail}
                </div>
              )}
            </div>
            <span className="text-[10.5px] text-ink-faint shrink-0 mt-0.5">
              {e.when}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TierDot({ tier }: { tier: "own" | "assist" | "flag" }) {
  const color =
    tier === "own"
      ? "var(--color-coral-deep)"
      : tier === "assist"
        ? "var(--color-coral)"
        : "var(--color-ink-muted)";
  const label =
    tier === "own" ? "I will own" : tier === "assist" ? "I will assist" : "I will flag";
  return (
    <span title={label} className="inline-flex items-center gap-1 shrink-0">
      <Circle className="size-2 fill-current" style={{ color }} />
    </span>
  );
}
