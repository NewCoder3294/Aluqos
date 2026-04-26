"use client";

import { useEffect, useRef, useState } from "react";
import { PrdSection } from "./prd-section";
import { PrdHeader } from "./prd-header";
import { RefineCard } from "./refine-card";
import { SendCard } from "./send-card";
import { ActivityRail } from "./activity-rail";
import { KpiStrip } from "./kpi-strip";
import { SectionProgressStrip } from "./section-progress-strip";
import { EmptyState } from "./empty-state";
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
  uploads?: Array<{ id: string; filename: string }>;
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
    return (
      <div className="flex-1 overflow-y-auto">
        <EmptyState />
      </div>
    );
  }

  const isStreaming = ws.streamingSection !== null;
  const sectionsComplete = SECTION_ORDER.filter(k => (ws.sections[k] ?? "").trim().length > 0).length;

  return (
    <>
      {/* Center column — work surface */}
      <section className="h-full overflow-y-auto bg-[--color-paper]">
        <div className="px-6 py-5 space-y-4 max-w-[920px] mx-auto">
          <KpiStrip />

          <PrdHeader
            title={ws.title}
            sourceIssue={latest?.source_issue ?? null}
            isStreaming={isStreaming}
            sectionsComplete={sectionsComplete}
            totalSections={SECTION_ORDER.length}
          />

          <SectionProgressStrip
            sections={ws.sections}
            streamingSection={ws.streamingSection}
          />

          <div className="space-y-3">
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

          <div className="space-y-3 pt-1">
            <RefineCard />
            <SendCard />
          </div>
        </div>
      </section>

      {/* Right column — activity rail */}
      <aside className="h-full overflow-y-auto bg-[--color-paper-hi] border-l border-[--color-paper-edge] p-3">
        <ActivityRail />
      </aside>
    </>
  );
}
