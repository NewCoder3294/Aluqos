"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { TypewriterLine } from "@/src/components/typewriter-line";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchOnboardingForUnderstand, persistUnderstood } from "@/src/server/run-understand";
import { PhaseHeader, PhaseFooter } from "../_chrome/phase-header";

type Understood = { project_context: string; role_and_priorities: string; how_you_communicate: string };

export function Phase2Reading({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setUnderstoodStore = useWalkthrough(s => s.setUnderstood);
  const [lines, setLines] = useState<string[]>([]);
  const [understood, setUnderstood] = useState<Understood | null>(null);
  const [editMode, setEditMode] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      const ctx = await fetchOnboardingForUnderstand(employeeId);

      const queue = [
        ...ctx.docs.map(d => `Reading ${d.filename}…`),
        "Picking up your writing style…",
        "Understanding your priorities…",
      ];
      for (const l of queue) {
        setLines(prev => [...prev, l]);
        await new Promise(r => setTimeout(r, 800));
      }

      const res = await fetch("/api/ai/understand", {
        method: "POST", body: JSON.stringify(ctx),
      });
      const text = await res.text();
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start < 0 || end < 0) {
        setUnderstood({ project_context: "I read what I could. Let's keep going.", role_and_priorities: "Let's confirm your priorities below.", how_you_communicate: "I'll calibrate as we go." });
        return;
      }
      try {
        const parsed = JSON.parse(text.slice(start, end + 1)) as Understood;
        setUnderstood(parsed);
        setUnderstoodStore(parsed);
      } catch {
        setUnderstood({ project_context: text.slice(start, end + 1), role_and_priorities: "", how_you_communicate: "" });
      }
    })();
  }, [employeeId, setUnderstoodStore]);

  return (
    <>
      <PhaseHeader
        phase={2}
        title={understood ? "Here's what I understood." : "I'm reading everything."}
        subtitle={
          understood
            ? "Confirm what landed. You can edit anything before we keep going."
            : "Skimming your docs and picking up your style. This takes a moment."
        }
        estimate="~1 min"
      />

      <div className="bg-white border border-paper-edge rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)] flex flex-col min-h-[560px]">
        {!understood && (
          <>
            <div className="px-5 py-3 border-b border-paper-edge flex items-center justify-between bg-paper-hi shrink-0">
              <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
                Reading
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-coral-deep">
                <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-coral pulse-coral" />
                live
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <ol className="px-6 py-5 space-y-2 w-full">
                {lines.map((l, i) => (
                  <li
                    key={i}
                    className={
                      "text-[14px] leading-relaxed " +
                      (i === lines.length - 1 ? "text-ink" : "text-ink-muted")
                    }
                  >
                    {i === lines.length - 1 ? (
                      <TypewriterLine text={l} />
                    ) : (
                      <span className="flex items-center gap-2">
                        <span aria-hidden className="text-coral">✓</span>
                        {l}
                      </span>
                    )}
                  </li>
                ))}
                {lines.length === 0 && (
                  <li className="text-[13px] text-ink-faint italic">Opening your docs…</li>
                )}
              </ol>
            </div>
          </>
        )}

        {understood && (
          <>
            <div className="flex-1 flex flex-col divide-y divide-paper-edge">
              <SummaryCard
                label="Project context"
                value={understood.project_context}
                editable={editMode}
                onChange={v => setUnderstood({ ...understood, project_context: v })}
              />
              <SummaryCard
                label="Your role & priorities"
                value={understood.role_and_priorities}
                editable={editMode}
                onChange={v => setUnderstood({ ...understood, role_and_priorities: v })}
              />
              <SummaryCard
                label="How you communicate"
                value={understood.how_you_communicate}
                editable={editMode}
                onChange={v => setUnderstood({ ...understood, how_you_communicate: v })}
              />
            </div>

            <div className="px-6 py-4 flex flex-wrap gap-2 justify-end bg-paper-hi/40 border-t border-paper-edge shrink-0">
              <Button variant="outline" size="md" onClick={() => setEditMode(true)}>
                Let me correct this
              </Button>
              <Button
                variant="ink"
                size="md"
                onClick={async () => { await persistUnderstood(employeeId, understood); setPhase(3); }}
              >
                That&apos;s right, keep going
              </Button>
            </div>
          </>
        )}
      </div>

      <PhaseFooter phase={2} />
    </>
  );
}

function SummaryCard({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="px-6 py-5 space-y-2">
      <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
        {label}
      </div>
      {editable ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-paper-edge rounded p-3 text-[15px] leading-relaxed serif focus:outline-none focus:border-coral transition-colors"
          rows={3}
        />
      ) : (
        <Serif className="text-[15.5px] leading-relaxed text-ink block">
          {value}
        </Serif>
      )}
    </div>
  );
}
