"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { TypewriterLine } from "@/src/components/typewriter-line";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchOnboardingForUnderstand, persistUnderstood } from "@/src/server/run-understand";

type Understood = {
  project_context: string;
  role_and_priorities: string;
  how_you_communicate: string;
};

const SECTIONS: ReadonlyArray<{ key: keyof Understood; label: string }> = [
  { key: "project_context", label: "Project context" },
  { key: "role_and_priorities", label: "Your role and priorities" },
  { key: "how_you_communicate", label: "How you communicate" },
] as const;

export function Phase2Reading({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setUnderstoodStore = useWalkthrough(s => s.setUnderstood);
  const setSubStep = useWalkthrough(s => s.setSubStep);
  const [lines, setLines] = useState<string[]>([]);
  const [understood, setUnderstood] = useState<Understood | null>(null);
  const [editMode, setEditMode] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    setSubStep(1, 1);
  }, [setSubStep]);

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
        method: "POST",
        body: JSON.stringify(ctx),
      });
      const text = await res.text();
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start < 0 || end < 0) {
        setUnderstood({
          project_context: "I read what I could. Let's keep going.",
          role_and_priorities: "Let's confirm your priorities below.",
          how_you_communicate: "I'll calibrate as we go.",
        });
        return;
      }
      try {
        const parsed = JSON.parse(text.slice(start, end + 1)) as Understood;
        setUnderstood(parsed);
        setUnderstoodStore(parsed);
      } catch {
        setUnderstood({
          project_context: text.slice(start, end + 1),
          role_and_priorities: "",
          how_you_communicate: "",
        });
      }
    })();
  }, [employeeId, setUnderstoodStore]);

  // Show only the last 5 lines while streaming.
  const visibleLines = lines.slice(-5);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      {!understood && (
        <div className="w-full max-w-[640px] flex flex-col items-center text-center gap-7">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
            Phase 2 · Reading
          </span>

          <Serif as="h1" className="font-medium leading-[1.05]">
            <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
              I&apos;m reading everything.
            </span>
          </Serif>

          <Serif italic className="text-[16px] text-ink-muted">
            Skimming your docs and picking up your style. This takes a moment.
          </Serif>

          <ol className="w-full space-y-3 pt-4">
            {visibleLines.length === 0 && (
              <li className="text-[14px] text-ink-faint italic serif">
                Opening your docs…
              </li>
            )}
            {visibleLines.map((l, i) => {
              const isLast = i === visibleLines.length - 1;
              return (
                <li
                  key={`${l}-${lines.length - visibleLines.length + i}`}
                  className={
                    "serif italic text-[15px] leading-relaxed transition-colors " +
                    (isLast ? "text-coral-deep" : "text-ink-muted")
                  }
                >
                  {isLast ? <TypewriterLine text={l} /> : l}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {understood && (
        <div className="w-full max-w-[720px] flex flex-col items-center text-center gap-8">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
            Phase 2 · What I understood
          </span>

          <Serif as="h1" className="font-medium leading-[1.05]">
            <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
              Here&apos;s what I understood.
            </span>
          </Serif>

          <Serif italic className="text-[16px] text-ink-muted">
            Confirm what landed. You can edit anything before we keep going.
          </Serif>

          <div className="w-full flex flex-col gap-7 text-left pt-2">
            {SECTIONS.map(section => (
              <div key={section.key} className="space-y-2">
                <Serif italic className="text-[13px] text-coral block">
                  {section.label}
                </Serif>
                {editMode ? (
                  <textarea
                    value={understood[section.key]}
                    onChange={e =>
                      setUnderstood({ ...understood, [section.key]: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-transparent border-b border-paper-edge focus:border-coral focus:outline-none text-[17px] leading-relaxed serif py-2 transition-colors text-ink resize-none"
                  />
                ) : (
                  <Serif className="text-[17px] leading-relaxed text-ink block">
                    {understood[section.key]}
                  </Serif>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setEditMode(true)}
              disabled={editMode}
            >
              Let me correct this
            </Button>
            <Button
              variant="ink"
              size="md"
              onClick={async () => {
                await persistUnderstood(employeeId, understood);
                setPhase(3);
              }}
            >
              That&apos;s right, keep going
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Bottom-right phase indicator (no Back/Next during streaming/review) */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3 font-sans text-[11px] text-ink-faint z-30">
        <span className="tabular-nums uppercase tracking-[0.14em]">2 / 6</span>
      </div>
    </section>
  );
}
