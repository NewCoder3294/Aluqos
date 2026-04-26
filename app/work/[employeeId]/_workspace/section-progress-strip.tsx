"use client";

import { ProgressPill, type ProgressPillState } from "@/src/components/ui/progress-pill";
import type { PrdSectionKey } from "@/src/store/workspace";

const ORDER: { key: PrdSectionKey; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "goals", label: "Goals" },
  { key: "user_stories", label: "User stories" },
  { key: "scope", label: "Scope" },
  { key: "out_of_scope", label: "Out of scope" },
  { key: "success_metrics", label: "Success metrics" },
];

export function SectionProgressStrip({
  sections,
  streamingSection,
}: {
  sections: Partial<Record<PrdSectionKey, string>>;
  streamingSection: PrdSectionKey | null;
}) {
  const total = ORDER.length;
  const filled = ORDER.filter(s => (sections[s.key] ?? "").trim().length > 0 && streamingSection !== s.key).length;
  return (
    <div className="flex items-center gap-3 py-1.5 px-1">
      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
        Sections
      </span>
      <div className="flex items-center gap-1.5">
        {ORDER.map(s => {
          const text = (sections[s.key] ?? "").trim();
          let state: ProgressPillState = "empty";
          if (streamingSection === s.key) state = "half";
          else if (text.length > 0) state = "full";
          return <ProgressPill key={s.key} state={state} label={s.label} />;
        })}
      </div>
      <span className="ml-auto text-[11px] tabular-nums text-ink-faint">
        {filled} / {total} complete
      </span>
    </div>
  );
}
