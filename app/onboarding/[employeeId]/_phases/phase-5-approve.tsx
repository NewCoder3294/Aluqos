"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
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
                      <button
                        key={opt}
                        onClick={() => setApproval(k, opt)}
                        className={`text-[11px] uppercase tracking-[0.1em] px-2 py-1 rounded ${state === opt ? "bg-[--color-ink] text-[--color-paper]" : "text-[--color-ink-faint]"}`}
                      >{opt}</button>
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
            <button
              key={a.val}
              onClick={() => setAutonomy(a.val)}
              className={`px-3 py-1.5 text-[12px] rounded border ${autonomy === a.val ? "bg-[--color-ink] text-[--color-paper] border-[--color-ink]" : "border-[--color-paper-edge]"}`}
            >{a.label}</button>
          ))}
        </div>
      </div>

      <p className="text-[14px] text-[--color-ink-muted]">
        Alex will own <strong>{counts.own}</strong> tasks, assist on <strong>{counts.assist}</strong>, and flag <strong>{counts.flag}</strong> things.
      </p>

      <div className="flex justify-end">
        <button
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);
            await startWorking(employeeId, approvals, autonomy, mods);
          }}
          className="px-7 py-3 text-[12px] uppercase tracking-[0.12em] text-[--color-paper] bg-[--color-ink] disabled:opacity-50"
        >
          {submitting ? "Starting…" : "Start working"}
        </button>
      </div>
    </section>
  );
}
