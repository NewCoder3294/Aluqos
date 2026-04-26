"use client";

import { useMemo } from "react";
import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { useWorkspace } from "@/src/store/workspace";
import { toast } from "@/src/components/toast";

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
  uploads: Array<{ id: string; filename: string }>;
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
    []
  );

  const recentPrds = (prds ?? []).slice(0, 3);

  return (
    <aside className="bg-[--color-paper-hi] border-r border-[--color-paper-edge] overflow-y-auto flex flex-col">
      {/* Header band */}
      <div className="px-5 pt-5 pb-4 border-b border-[--color-paper-edge]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full text-white grid place-items-center shrink-0"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            <Serif className="text-[16px]">{employeeName.charAt(0)}</Serif>
          </div>
          <div className="min-w-0">
            <Serif className="text-[16px] block truncate">{employeeName}</Serif>
            <div className="label leading-tight">AI Product Manager</div>
          </div>
        </div>
        <div className="mt-3">
          <StatusPill active={status !== "idle"}>
            {statusVerb(status)}{livingFile ? ` ${livingFile}` : ""}
          </StatusPill>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-3 flex-1">
        {/* Today */}
        <Card tone="muted">
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent compact>
            <ol className="relative pl-4">
              <span
                aria-hidden
                className="absolute left-[5px] top-1 bottom-1 w-px bg-[--color-paper-edge]"
              />
              {events.map((e) => (
                <li key={e.id} className="relative pb-3 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[11px] top-[5px] w-[7px] h-[7px] rounded-full bg-[--color-coral]"
                  />
                  <div className="text-[13px] text-[--color-ink] leading-snug">{e.verb}</div>
                  <div className="text-[11px] text-[--color-ink-faint] mt-0.5">{e.when}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Source materials */}
        <Card tone="muted">
          <CardHeader>
            <CardTitle>Source materials</CardTitle>
            <Button variant="quiet" size="sm" onClick={() => toast.info("Coming soon")}>
              ＋ Add
            </Button>
          </CardHeader>
          <CardContent compact>
            <ul className="space-y-1.5 text-[13px]">
              {uploads.map((u, idx) => (
                <li key={u.id} className="flex items-center gap-2">
                  <FileGlyph />
                  <span className="flex-1 truncate text-[--color-ink]">{u.filename}</span>
                  <span
                    className={
                      idx === 0
                        ? "text-[10.5px] uppercase tracking-[0.1em] text-[--color-coral-deep]"
                        : "text-[10.5px] uppercase tracking-[0.1em] text-[--color-ink-faint]"
                    }
                  >
                    {idx === 0 ? "reading…" : "✓ read"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Action plan */}
        {actionPlan && (
          <Card tone="muted">
            <CardHeader>
              <CardTitle>Action plan</CardTitle>
            </CardHeader>
            <CardContent compact>
              <Tier label="I will own" tone="own" items={actionPlan.own} onPickTask={onPickTask} />
              <Tier label="I will assist" tone="assist" items={actionPlan.assist} onPickTask={onPickTask} />
              <Tier label="I will flag" tone="flag" items={actionPlan.flag} onPickTask={onPickTask} />
            </CardContent>
          </Card>
        )}

        {/* Recent work */}
        {recentPrds.length > 0 && (
          <Card tone="muted">
            <CardHeader>
              <CardTitle>Recent work</CardTitle>
            </CardHeader>
            <CardContent compact>
              <ul className="space-y-2">
                {recentPrds.map((p) => (
                  <li
                    key={p.id}
                    className="bg-white border border-[--color-paper-edge] rounded px-3 py-2 hover:border-[--color-coral] transition-colors cursor-pointer"
                  >
                    <div className="text-[13px] text-[--color-ink] truncate">{p.title || "Untitled PRD"}</div>
                    <div className="text-[11px] text-[--color-ink-faint] mt-0.5">shipped 3m ago</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* + Add task */}
        <div className="mt-auto pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Coming soon")}
            className="w-full"
          >
            ＋ Add task
          </Button>
        </div>
      </div>
    </aside>
  );
}

function statusVerb(status: string) {
  switch (status) {
    case "drafting": return "Drafting";
    case "editing": return "Editing";
    case "exporting": return "Exporting";
    default: return "Idle";
  }
}

function FileGlyph() {
  return (
    <svg
      width="11"
      height="13"
      viewBox="0 0 11 13"
      aria-hidden
      className="text-[--color-ink-faint] shrink-0"
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
    <div className="space-y-1.5 mb-3 last:mb-0">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="w-[7px] h-[7px] rounded-full"
          style={{ background: dotColor }}
        />
        <Serif italic className="text-[12.5px] text-[--color-ink-faint]">
          {label}
        </Serif>
      </div>
      <div className="space-y-1.5 pl-3.5">
        {items.map((it, i) => (
          <div
            key={i}
            onClick={() => onPickTask?.(it.title)}
            className="text-[12.5px] bg-white border border-[--color-paper-edge] rounded px-2.5 py-1.5 cursor-pointer hover:border-[--color-coral] hover:bg-[--color-paper-hi] transition-colors"
          >
            {it.title}
          </div>
        ))}
      </div>
    </div>
  );
}
