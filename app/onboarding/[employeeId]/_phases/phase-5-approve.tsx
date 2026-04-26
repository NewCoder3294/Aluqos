"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { startWorking } from "@/src/server/start-working";
import type { ActionItem } from "@/src/ai/prompts/propose-action-plan";

const AUTONOMY = [
  { val: "ask_always", label: "Ask everything" },
  { val: "ask_external", label: "Ask for external actions" },
  { val: "just_do_it", label: "Just do it" },
] as const;

export function Phase5Approve({ employeeId }: { employeeId: string }) {
  const plan = useWalkthrough(s => s.actionPlanDraft);
  const [approvals, setApprovals] = useState<Record<string, "approved"|"modified"|"removed">>({});
  const [mods, setMods] = useState<Record<string, string>>({});
  const [autonomy, setAutonomy] = useState<typeof AUTONOMY[number]["val"]>("ask_external");
  const [submitting, setSubmitting] = useState(false);

  const tiers: Array<{ label: string; items: ActionItem[]; tier: string }> = [
    { label: "I will own", items: (plan?.own as ActionItem[]) ?? [], tier: "own" },
    { label: "I will assist on", items: (plan?.assist as ActionItem[]) ?? [], tier: "assist" },
    { label: "I will flag", items: (plan?.flag as ActionItem[]) ?? [], tier: "flag" },
  ];

  const setApproval = (key: string, val: "approved"|"modified"|"removed") =>
    setApprovals(a => ({ ...a, [key]: val }));

  const counts = {
    own: tiers[0].items.filter((_, i) => approvals[`own-${i}`] !== "removed").length,
    assist: tiers[1].items.filter((_, i) => approvals[`assist-${i}`] !== "removed").length,
    flag: tiers[2].items.filter((_, i) => approvals[`flag-${i}`] !== "removed").length,
  };

  return (
    <section className="space-y-8">
      <Serif as="h2" className="text-[28px]">Your call.</Serif>

      {tiers.map(t => (
        <div key={t.tier} className="space-y-2">
          <Serif italic className="text-[14px] text-[--color-ink-muted]">{t.label}</Serif>
          <ul className="space-y-2">
            {t.items.map((it, i) => {
              const k = `${t.tier}-${i}`;
              const state = approvals[k] ?? "approved";
              return (
                <li key={k} className={`bg-white border rounded p-3 ${state === "removed" ? "opacity-40 line-through" : "border-[--color-paper-edge]"}`}>
                  <div className="text-[14px]">{state === "modified" ? (
                    <input
                      defaultValue={mods[k] ?? it.title}
                      onChange={e => setMods(m => ({ ...m, [k]: e.target.value }))}
                      className="w-full bg-transparent border-b border-[--color-paper-edge] focus:outline-none"
                    />
                  ) : it.title}</div>
                  <div className="text-[12.5px] text-[--color-ink-faint] mt-1 italic">{it.rationale}</div>
                  <div className="flex gap-1 mt-2">
                    {(["approved","modified","removed"] as const).map(opt => (
                      <Button
                        key={opt}
                        variant="ghost"
                        size="sm"
                        aria-pressed={state === opt}
                        data-state={state === opt ? "active" : "inactive"}
                        onClick={() => setApproval(k, opt)}
                        className={state === opt ? "bg-[--color-ink] text-[--color-paper] hover:bg-[--color-ink] hover:text-[--color-paper]" : ""}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="space-y-3 pt-2 border-t border-[--color-paper-edge]">
        <div className="label">Autonomy</div>
        <div className="flex gap-2">
          {AUTONOMY.map(a => (
            <Button
              key={a.val}
              variant={autonomy === a.val ? "ink" : "outline"}
              size="chip"
              aria-pressed={autonomy === a.val}
              onClick={() => setAutonomy(a.val)}
            >
              {a.label}
            </Button>
          ))}
        </div>
      </div>

      <p className="text-[14px] text-[--color-ink-muted]">
        Alex will own <strong>{counts.own}</strong> tasks, assist on <strong>{counts.assist}</strong>, and flag <strong>{counts.flag}</strong> things.
      </p>

      <div className="flex justify-end">
        <Button
          variant="ink"
          size="lg"
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);
            await startWorking(employeeId, approvals, autonomy, mods);
          }}
        >
          {submitting ? "Starting…" : "Start working"}
        </Button>
      </div>
    </section>
  );
}
