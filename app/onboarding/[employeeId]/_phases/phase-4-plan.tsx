"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchPlanInputs, persistPlan } from "@/src/server/run-plan";
import type { ActionPlan, ActionItem } from "@/src/ai/prompts/propose-action-plan";

const TIER_META: Record<"own" | "assist" | "flag", { label: string }> = {
  own: { label: "I will own" },
  assist: { label: "I will assist on" },
  flag: { label: "I will flag" },
};

export function Phase4Plan({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const setPlanStore = useWalkthrough(s => s.setActionPlan);
  const setSubStep = useWalkthrough(s => s.setSubStep);
  const [plan, setPlan] = useState<ActionPlan | null>(null);
  const [streaming, setStreaming] = useState(true);
  const ran = useRef(false);

  useEffect(() => {
    setSubStep(1, 1);
  }, [setSubStep]);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    (async () => {
      const inputs = await fetchPlanInputs(employeeId);
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        body: JSON.stringify(inputs),
      });
      const text = await res.text();
      const s = text.indexOf("{");
      const e = text.lastIndexOf("}");
      if (s < 0 || e < 0) {
        setStreaming(false);
        return;
      }
      try {
        const parsed = JSON.parse(text.slice(s, e + 1)) as ActionPlan;
        setPlan(parsed);
        setPlanStore(parsed);
      } catch {
        /* graceful */
      }
      setStreaming(false);
    })();
  }, [employeeId, setPlanStore]);

  return (
    <>
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-[720px] flex flex-col items-center text-center gap-8">
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
            Phase 4 · Your action plan
          </span>

          <Serif as="h1" className="font-medium leading-[1.05]">
            <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>
              Here&apos;s how I&apos;d work with you.
            </span>
          </Serif>

          <Serif italic className="text-[16px] text-ink-muted">
            A draft plan grouped by ownership. Skim each tier, then approve.
          </Serif>

          {!plan && (
            <Serif italic className="text-[16px] text-ink-faint pt-4">
              {streaming ? "Putting it together…" : "I couldn't draft a plan. You can still continue."}
            </Serif>
          )}

          {plan && (
            <div className="w-full flex flex-col gap-10 text-left pt-4">
              <Tier tier="own" items={plan.own ?? []} />
              <Tier tier="assist" items={plan.assist ?? []} />
              <Tier tier="flag" items={plan.flag ?? []} />
            </div>
          )}
        </div>
      </section>

      <div className="fixed bottom-6 right-6 flex items-center gap-3 font-sans text-[11px] text-ink-faint z-30">
        <span className="tabular-nums uppercase tracking-[0.14em]">4 / 6</span>
        <span className="opacity-40">·</span>
        <Button
          variant="ink"
          size="sm"
          disabled={!plan}
          onClick={async () => {
            if (!plan) return;
            await persistPlan(employeeId, plan);
            setPhase(5);
          }}
        >
          Looks good — let me approve
          <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </>
  );
}

function Tier({ tier, items }: { tier: "own" | "assist" | "flag"; items: ActionItem[] }) {
  const meta = TIER_META[tier];
  if (items.length === 0) return null;
  return (
    <div className="space-y-3">
      <Serif italic className="text-[14px] text-coral block">
        {meta.label}
      </Serif>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              aria-hidden
              className="w-[6px] h-[6px] rounded-full bg-coral mt-[9px] shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] text-ink leading-snug">{it.title}</div>
              {it.rationale && (
                <div className="text-[13px] text-ink-faint mt-1 italic leading-snug serif">
                  {it.rationale}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
