"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { TypewriterLine } from "@/src/components/typewriter-line";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchOnboardingForUnderstand, persistUnderstood } from "@/src/server/run-understand";

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

  if (!understood) {
    return (
      <section className="space-y-3">
        {lines.map((l, i) => (
          <div key={i} className="text-[15px] text-[--color-ink-muted]">
            {i === lines.length - 1 ? <TypewriterLine text={l} /> : <span>· {l}</span>}
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <Serif as="h2" className="text-[28px]">Here's what I understood.</Serif>
      <SummaryBlock label="Project context" value={understood.project_context} editable={editMode} onChange={v => setUnderstood({ ...understood, project_context: v })} />
      <SummaryBlock label="Your role & priorities" value={understood.role_and_priorities} editable={editMode} onChange={v => setUnderstood({ ...understood, role_and_priorities: v })} />
      <SummaryBlock label="How you communicate" value={understood.how_you_communicate} editable={editMode} onChange={v => setUnderstood({ ...understood, how_you_communicate: v })} />

      <div className="flex gap-3 pt-4">
        <button
          onClick={async () => { await persistUnderstood(employeeId, understood); setPhase(3); }}
          className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink]"
        >That's right, keep going</button>
        <button
          onClick={() => setEditMode(true)}
          className="px-5 py-2 text-[12px] uppercase tracking-[0.12em] border border-[--color-paper-edge]"
        >Let me correct this</button>
      </div>
    </section>
  );
}

function SummaryBlock({ label, value, editable, onChange }: { label: string; value: string; editable: boolean; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="label">{label}</div>
      {editable ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-[--color-paper-edge] rounded p-3 text-[15px] leading-relaxed serif"
          rows={3}
        />
      ) : (
        <p className="serif text-[16px] leading-relaxed">{value}</p>
      )}
    </div>
  );
}
