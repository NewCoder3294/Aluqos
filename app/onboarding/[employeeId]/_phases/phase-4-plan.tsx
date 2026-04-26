"use client";

import { useEffect, useRef, useState } from "react";
import { Serif } from "@/src/components/serif";
import { StatusPill } from "@/src/components/status-pill";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { fetchPlanInputs, persistPlan } from "@/src/server/run-plan";
import type { ActionPlan, ActionItem } from "@/src/ai/prompts/propose-action-plan";

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
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <Serif as="h2" className="text-[28px]">Here's how I'd work with you.</Serif>
        {streaming && <StatusPill>Drafting</StatusPill>}
      </div>

      {!plan && (
        <p className="serif italic text-[--color-ink-faint] text-[15px]">Putting it together…</p>
      )}

      {plan && (
        <>
          <Tier label="I will own" items={plan.own ?? []} />
          <Tier label="I will assist on" items={plan.assist ?? []} />
          <Tier label="I will flag" items={plan.flag ?? []} />
        </>
      )}

      <div className="flex justify-end pt-2">
        <Button
          variant="ink"
          size="md"
          disabled={!plan}
          onClick={async () => { if (!plan) return; await persistPlan(employeeId, plan); setPhase(5); }}
        >
          Looks good — let me approve
        </Button>
      </div>
    </section>
  );
}

function Tier({ label, items }: { label: string; items: ActionItem[] }) {
  return (
    <div className="space-y-2">
      <Serif italic className="text-[14px] text-[--color-ink-muted]">{label}</Serif>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={i} className="bg-white border border-[--color-paper-edge] rounded p-3">
            <div className="text-[14px] text-[--color-ink]">{it.title}</div>
            <div className="text-[12.5px] text-[--color-ink-faint] mt-1 italic">{it.rationale}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
