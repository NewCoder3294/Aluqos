"use client";

import { useMemo } from "react";
import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { useWorkspace } from "@/src/store/workspace";
import { toast } from "@/src/components/toast";
import { ChevronRight, ExternalLink, Plus } from "lucide-react";

type Upload = { id: string; filename: string };

const FILE_META: Array<{ size: string; progress: number }> = [
  { size: "84 KB",  progress: 60 },
  { size: "212 KB", progress: 100 },
  { size: "146 KB", progress: 100 },
  { size: "62 KB",  progress: 100 },
  { size: "98 KB",  progress: 100 },
];

export function LeftRail({
  employeeId,
  employeeName,
  uploads,
  actionPlan,
  prds,
  onPickTask,
}: {
  employeeId: string;
  employeeName: string;
  uploads: Upload[];
  actionPlan: { own: { title: string }[]; assist: { title: string }[]; flag: { title: string }[] } | null;
  prds: Array<{ id: string; title: string }>;
  onPickTask?: (title: string) => void;
}) {
  void employeeId;
  const status = useWorkspace(s => s.status);
  const ws = useWorkspace();

  const livingFile = ws.prdId ? "saathi-mvp/issue-47.json" : null;

  const events = useMemo(
    () => [
      { id: "ev-1", verb: "Started a new PRD", when: "just now" },
      { id: "ev-2", verb: "Read q2-roadmap.pdf", when: "2m ago" },
      { id: "ev-3", verb: "Drafted Issue #47 PRD", when: "4m ago" },
    ],
    [],
  );

  const recentPrds = (prds ?? []).slice(0, 3);

  return (
    <aside className="bg-paper-hi border-r border-paper-edge h-full overflow-y-auto flex flex-col">
      {/* Header band — identity anchor */}
      <div className="px-4 pt-4 pb-3 border-b border-paper-edge">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full text-white grid place-items-center shrink-0"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            <Serif className="text-[16px]">{employeeName.charAt(0)}</Serif>
          </div>
          <div className="min-w-0">
            <Serif className="text-[15px] block truncate leading-tight">{employeeName}</Serif>
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium leading-tight mt-0.5">
              AI Product Manager
            </div>
          </div>
        </div>
        <div className="mt-2.5">
          <StatusPill active={status !== "idle"}>
            {statusVerb(status)}
            {livingFile ? ` ${livingFile}` : ""}
          </StatusPill>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3 flex-1">
        {/* Today */}
        <Card tone="muted">
          <CardHeader className="!py-2.5 !px-4">
            <CardTitle className="text-[13px]">Today</CardTitle>
            <span className="text-[10.5px] tabular-nums text-ink-faint">
              {events.length} events
            </span>
          </CardHeader>
          <CardContent compact className="!p-4">
            <ol className="relative pl-4">
              <span
                aria-hidden
                className="absolute left-[5px] top-1 bottom-1 w-px bg-paper-edge"
              />
              {events.map(e => (
                <li key={e.id} className="relative pb-2.5 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[11px] top-[5px] w-[7px] h-[7px] rounded-full bg-coral"
                  />
                  <div className="text-[12.5px] text-ink leading-snug">{e.verb}</div>
                  <div className="text-[10.5px] text-ink-faint mt-0.5">{e.when}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Source materials */}
        <Card tone="muted">
          <CardHeader className="!py-2.5 !px-4">
            <CardTitle className="text-[13px]">Source materials</CardTitle>
            <Button variant="quiet" size="sm" onClick={() => toast.info("Coming soon")}>
              + Add
            </Button>
          </CardHeader>
          <CardContent compact className="!p-4">
            <ul className="space-y-2 text-[12.5px]">
              {uploads.map((u, idx) => {
                const meta = FILE_META[idx] ?? { size: "—", progress: 100 };
                const reading = meta.progress < 100;
                return (
                  <li key={u.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileGlyph />
                      <span className="flex-1 truncate text-ink">{u.filename}</span>
                      <span className="text-[10.5px] tabular-nums text-ink-faint shrink-0">
                        {meta.size}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 pl-[16px]">
                      <span className="flex-1 h-1 bg-paper-edge/70 rounded-full overflow-hidden">
                        <span
                          className={
                            "block h-full rounded-full transition-all " +
                            (reading ? "bg-coral pulse-coral" : "bg-coral/70")
                          }
                          style={{ width: `${meta.progress}%` }}
                        />
                      </span>
                      <span
                        className={
                          "text-[9.5px] uppercase tracking-[0.1em] shrink-0 " +
                          (reading ? "text-coral-deep" : "text-ink-faint")
                        }
                      >
                        {reading ? "reading…" : "✓ read"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Action plan */}
        {actionPlan && (
          <Card tone="muted">
            <CardHeader className="!py-2.5 !px-4">
              <CardTitle className="text-[13px]">Action plan</CardTitle>
            </CardHeader>
            <CardContent compact className="!p-4">
              <Tier label="I will own" tone="own" items={actionPlan.own} onPickTask={onPickTask} />
              <Tier label="I will assist" tone="assist" items={actionPlan.assist} onPickTask={onPickTask} />
              <Tier label="I will flag" tone="flag" items={actionPlan.flag} onPickTask={onPickTask} />
            </CardContent>
          </Card>
        )}

        {/* Recent work */}
        <Card tone="muted">
          <CardHeader className="!py-2.5 !px-4">
            <CardTitle className="text-[13px]">Recent work</CardTitle>
          </CardHeader>
          <CardContent compact className="!p-4">
            {recentPrds.length === 0 ? (
              <div className="text-[11.5px] text-ink-faint italic leading-relaxed">
                No PRDs yet — your work will collect here.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {recentPrds.map(p => (
                  <li
                    key={p.id}
                    className="group bg-white border border-paper-edge rounded px-2.5 py-1.5 hover:border-coral transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] text-ink truncate">
                        {p.title || "Untitled PRD"}
                      </div>
                      <div className="text-[10.5px] text-ink-faint mt-0.5">
                        shipped 3m ago
                      </div>
                    </div>
                    <ChevronRight className="size-3 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity" />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* + Add task */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info("Coming soon")}
          className="w-full"
        >
          <Plus className="size-3.5" />
          Add task
        </Button>

        {/* Footer */}
        <div className="mt-auto pt-2 pb-1">
          <Button
            type="button"
            variant="quiet"
            size="sm"
            onClick={() => toast.info("Coming soon")}
            className="gap-1 text-[11px] normal-case tracking-normal px-0 py-0"
          >
            Need a hand? Docs
            <ExternalLink className="size-3" />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function statusVerb(status: string) {
  switch (status) {
    case "drafting":
      return "Drafting";
    case "editing":
      return "Editing";
    case "exporting":
      return "Exporting";
    default:
      return "Idle";
  }
}

function FileGlyph() {
  return (
    <svg
      width="11"
      height="13"
      viewBox="0 0 11 13"
      aria-hidden
      className="text-ink-faint shrink-0"
    >
      <path
        d="M1 1h6l3 3v8H1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M7 1v3h3" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Tier({
  label,
  tone,
  items,
  onPickTask,
}: {
  label: string;
  tone: "own" | "assist" | "flag";
  items: { title: string }[];
  onPickTask?: (title: string) => void;
}) {
  if (!items?.length) return null;
  const dotColor =
    tone === "own"
      ? "var(--color-coral-deep)"
      : tone === "assist"
        ? "var(--color-coral)"
        : "var(--color-ink-muted)";
  return (
    <div className="space-y-1.5 mb-2.5 last:mb-0">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="w-[7px] h-[7px] rounded-full"
          style={{ background: dotColor }}
        />
        <Serif italic className="text-[12px] text-ink-faint">
          {label}
        </Serif>
      </div>
      <div className="space-y-1 pl-3.5">
        {items.map((it, i) => (
          <div
            key={i}
            onClick={() => onPickTask?.(it.title)}
            className="group flex items-center gap-2 text-[12px] bg-white border border-paper-edge rounded px-2 py-1.5 cursor-pointer hover:border-coral hover:bg-paper-hi transition-colors"
          >
            <span className="flex-1 min-w-0 truncate">{it.title}</span>
            <ChevronRight className="size-3 text-ink-faint opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
