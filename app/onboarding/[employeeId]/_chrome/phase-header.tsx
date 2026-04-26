"use client";

import { Serif } from "@/src/components/serif";
import { Badge } from "@/src/components/ui/badge";
import type { Phase } from "@/src/store/walkthrough";

const DAY_LABELS: Record<Phase, string> = {
  1: "Day one — getting acquainted",
  2: "Day one — reading the room",
  3: "Day one — picking up your style",
  4: "Day one — planning the work",
  5: "Day one — your call",
  6: "Already on it.",
};

export function PhaseHeader({
  phase,
  title,
  subtitle,
  estimate,
  right,
}: {
  phase: Phase;
  title: string;
  subtitle: string;
  estimate?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-paper-edge rounded-lg shadow-[0_2px_8px_rgba(31,29,26,0.06)] px-6 py-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Serif italic className="text-[12px] text-ink-faint block">
            {DAY_LABELS[phase]}
          </Serif>
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-coral-deep font-medium mt-1.5">
            Phase {phase}
          </div>
          <Serif as="h1" className="text-[26px] leading-tight mt-1 text-ink">
            {title}
          </Serif>
          <p className="text-[13.5px] text-ink-muted mt-1.5 leading-snug">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {estimate && <Badge variant="outline">{estimate}</Badge>}
          {right}
        </div>
      </div>
    </div>
  );
}

export function PhaseFooter({
  phase,
  total = 6,
  children,
}: {
  phase: Phase;
  total?: number;
  children?: React.ReactNode;
}) {
  const pct = Math.min(100, Math.round((phase / total) * 100));
  return (
    <div className="bg-white border border-paper-edge rounded-lg px-5 py-3 flex items-center gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint tabular-nums shrink-0">
          {phase} / {total}
        </span>
        <span className="flex-1 h-[3px] bg-paper-edge/60 rounded-full overflow-hidden">
          <span
            className="block h-full bg-coral rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </span>
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
