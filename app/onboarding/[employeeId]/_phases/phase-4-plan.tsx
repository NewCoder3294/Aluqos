"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchPlanInputs, persistPlan } from "@/src/server/run-plan";
import type { ActionPlan, ActionItem } from "@/src/ai/prompts/propose-action-plan";
import { PhaseHeader, PhaseFooter } from "../_chrome/phase-header";

const TIER_META: Record<
  "own" | "assist" | "flag",
  { label: string; dotColor: string; subtitle: string }
> = {
  own: {
    label: "I will own",
    dotColor: "var(--color-coral-deep)",
    subtitle: "Tasks I'll drive end-to-end",
  },
  assist: {
    label: "I will assist on",
    dotColor: "var(--color-coral)",
    subtitle: "Drafts and prep, you finish",
  },
  flag: {
    label: "I will flag",
    dotColor: "var(--color-ink-muted)",
    subtitle: "I'll surface, you decide",
  },
};

export function Phase4Plan({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setPlanStore = useWalkthrough(s => s.setActionPlan);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [streaming, setStreaming] = useState(true);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const inputs = await fetchPlanInputs(employeeId);
      const res = await fetch("/api/ai/plan", { method: "POST", body: JSON.stringify(inputs) });
      const text = await res.text();
      const s = text.indexOf("{"); const e = text.lastIndexOf("}");
      if (s < 0 || e < 0) { setStreaming(false); return; }
      try {
        const parsed = JSON.parse(text.slice(s, e + 1)) as ActionPlan;
        setPlan(parsed);
        setPlanStore(parsed);
      } catch { /* graceful */ }
      setStreaming(false);
    })();
  }, [employeeId, setPlanStore]);

  return (
    <>
      <PhaseHeader
        phase={4}
        title="Here's how I'd work with you."
        subtitle="A draft plan grouped by ownership. Sub-cards below let you skim each tier at a glance."
        estimate="~1 min"
        right={streaming ? <StatusPill active>Drafting</StatusPill> : undefined}
      />

      <div className="bg-white border border-[--color-paper-edge] rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)] p-5 space-y-4">
        {!plan && (
          <p className="serif italic text-[--color-ink-faint] text-[15px]">Putting it together…</p>
        )}

        {plan && (
          <>
            <Tier tier="own" items={plan.own ?? []} />
            <Tier tier="assist" items={plan.assist ?? []} />
            <Tier tier="flag" items={plan.flag ?? []} />
          </>
        )}

        <div className="flex justify-end pt-2 border-t border-[--color-paper-edge]">
          <Button
            variant="ink"
            size="md"
            disabled={!plan}
            onClick={async () => { if (!plan) return; await persistPlan(employeeId, plan); setPhase(5); }}
          >
            Looks good — let me approve
          </Button>
        </div>
      </div>

      <PhaseFooter phase={4} />
    </>
  );
}

function Tier({ tier, items }: { tier: "own" | "assist" | "flag"; items: ActionItem[] }) {
  const meta = TIER_META[tier];
  return (
    <div className="bg-[--color-paper-hi]/40 border border-[--color-paper-edge] rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[--color-paper-edge] bg-[--color-paper-hi]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="w-[7px] h-[7px] rounded-full shrink-0"
            style={{ background: meta.dotColor }}
          />
          <Serif italic className="text-[13px] text-[--color-ink-muted]">
            {meta.label}
          </Serif>
          <span className="text-[10.5px] text-[--color-ink-faint] truncate hidden sm:inline">
            · {meta.subtitle}
          </span>
        </div>
        <span className="text-[10.5px] tabular-nums text-[--color-ink-faint] shrink-0">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-3 text-[12.5px] text-[--color-ink-faint] italic">
          Nothing in this tier yet.
        </div>
      ) : (
        <ul className="divide-y divide-[--color-paper-edge]">
          {items.map((it, i) => (
            <li key={i} className="px-4 py-3 flex items-start gap-3 bg-white">
              <span
                aria-hidden
                className="w-[7px] h-[7px] rounded-full mt-[7px] shrink-0"
                style={{ background: meta.dotColor }}
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] text-[--color-ink] leading-snug">{it.title}</div>
                {it.rationale && (
                  <div className="text-[12px] text-[--color-ink-faint] mt-1 italic leading-snug">
                    {it.rationale}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
