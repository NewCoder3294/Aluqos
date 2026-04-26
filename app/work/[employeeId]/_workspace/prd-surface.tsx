"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/toast";
import { PrdSection } from "./prd-section";
import { ExportRow } from "./export-row";
import { FollowUps } from "./follow-ups";
import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import {
  createPrd, fetchPrdInputs, persistPrdSections, persistPrdEdit, loadIssueFixture,
} from "@/src/server/run-prd";

const SECTION_ORDER: PrdSectionKey[] = ["problem","goals","user_stories","scope","out_of_scope","success_metrics"];

export function PrdSurface({
  employeeId,
  initialPrds,
  bootstrap,
}: {
  employeeId: string;
  initialPrds: Array<{ id: string; title: string; sections: Record<string, string>; source_issue: string | null }>;
  bootstrap: boolean;
}) {
  const ws = useWorkspace();
  const ran = useRef(false);
  const [latest, setLatest] = useState(initialPrds[0] ?? null);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    if (bootstrap && !initialPrds.length) {
      void runFreshPrd();
    } else if (latest) {
      ws.setPrd({ id: latest.id, title: latest.title });
      Object.entries(latest.sections).forEach(([k, v]) => ws.appendSection(k as PrdSectionKey, v));
      ws.setStatus("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runFreshPrd() {
    const issue = await loadIssueFixture();
    const sourceLabel = `Issue #47 — ${issue.title}`;
    const inputs = await fetchPrdInputs(employeeId, sourceLabel);
    const created = await createPrd(employeeId, "", sourceLabel);
    setLatest({ id: created.id, title: "", sections: {}, source_issue: sourceLabel });
    ws.setPrd({ id: created.id, title: "" });
    ws.setStatus("drafting");

    const res = await fetch("/api/ai/prd", { method: "POST", body: JSON.stringify(inputs) });
    const text = await res.text();
    const start = text.indexOf("{"); const end = text.lastIndexOf("}");
    if (start < 0 || end < 0) { ws.finishStreaming(); return; }
    const parsed = JSON.parse(text.slice(start, end + 1));
    const sections: Record<string, string> = parsed.sections ?? {};
    for (const key of SECTION_ORDER) {
      const body = sections[key] ?? "";
      ws.setStreamingSection(key);
      for (let i = 0; i < body.length; i += 4) {
        ws.appendSection(key, body.slice(i, i + 4));
        await new Promise(r => setTimeout(r, 18));
      }
    }
    ws.finishStreaming();
    await persistPrdSections(created.id, employeeId, sections, parsed.title ?? "");
    setLatest({ id: created.id, title: parsed.title, sections, source_issue: sourceLabel });
  }

  if (!ws.prdId) {
    return <EmptyState />;
  }

  return (
    <section className="p-10 space-y-6 overflow-y-auto">
      <div>
        <Serif as="h2" className="text-[24px]">{ws.title || "Drafting…"}</Serif>
        <p className="text-[12px] text-[--color-ink-faint] mt-1">Drafted by Alex · sourced from {latest?.source_issue ?? "—"}</p>
      </div>

      <div className="space-y-6">
        {SECTION_ORDER.map(k => (
          <PrdSection
            key={k}
            sectionKey={k}
            text={ws.sections[k] ?? ""}
            streaming={ws.streamingSection === k}
            onCommit={(newText) => {
              ws.appendSection(k, "");
              if (ws.prdId) persistPrdEdit(ws.prdId, k, newText);
            }}
          />
        ))}
      </div>

      <FollowUps employeeId={employeeId} />
      <ExportRow />
      <ActivityFeed />
    </section>
  );
}

function EmptyState() {
  const [draft, setDraft] = useState("");
  return (
    <section className="p-10 grid place-items-center min-h-[60vh]">
      <div className="max-w-[440px] w-full text-center space-y-6 bg-[--color-paper-hi] border border-[--color-paper-edge] rounded-md p-10">
        <div className="flex justify-center">
          <div
            className="w-12 h-12 rounded-full text-white grid place-items-center"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            <Serif className="text-[18px]">A</Serif>
          </div>
        </div>
        <div className="space-y-2">
          <Serif as="h2" className="text-[22px] leading-tight">
            I&apos;m here when you&apos;re ready.
          </Serif>
          <p className="text-[13.5px] text-[--color-ink-faint] leading-relaxed">
            Pick a task from the left, or tell me what&apos;s next.
          </p>
        </div>
        <div className="flex gap-2 pt-1">
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="What should I work on?"
            className="flex-1 bg-white border border-[--color-paper-edge] rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[--color-coral]"
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
      </div>
    </section>
  );
}

function ActivityFeed() {
  const events = [
    { id: "a-1", verb: "Drafted Issue #47 PRD", when: "just now" },
    { id: "a-2", verb: "Read q2-roadmap.pdf", when: "2m ago" },
    { id: "a-3", verb: "Read saathi-mvp/README.md", when: "3m ago" },
    { id: "a-4", verb: "Onboarding completed", when: "5m ago" },
  ];
  return (
    <div className="pt-6 mt-6 border-t border-[--color-paper-edge]">
      <div className="label mb-3">Activity</div>
      <ul className="space-y-2">
        {events.map(e => (
          <li key={e.id} className="flex items-center gap-3 text-[13px]">
            <span
              aria-hidden
              className="w-[7px] h-[7px] rounded-full bg-[--color-coral] shrink-0"
            />
            <span className="text-[--color-ink]">{e.verb}</span>
            <span className="text-[--color-ink-faint] text-[11.5px] ml-auto">{e.when}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
