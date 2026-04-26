"use client";

import { useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { startWorking } from "@/src/server/start-working";
import type { ActionItem } from "@/src/ai/prompts/propose-action-plan";
import { PhaseHeader, PhaseFooter } from "../_chrome/phase-header";

const AUTONOMY = [
  { val: "ask_always", label: "Ask everything" },
  { val: "ask_external", label: "Ask for external actions" },
  { val: "just_do_it", label: "Just do it" },
] as const;

const TIER_META: Record<"own" | "assist" | "flag", { label: string; dotColor: string }> = {
  own: { label: "I will own", dotColor: "var(--color-coral-deep)" },
  assist: { label: "I will assist on", dotColor: "var(--color-coral)" },
  flag: { label: "I will flag", dotColor: "var(--color-ink-muted)" },
};

export function Phase5Approve({ employeeId }: { employeeId: string }) {
  const plan = useWalkthrough(s => s.actionPlanDraft);
  const [approvals, setApprovals] = useState<Record<string, "approved"|"modified"|"removed">>({});
  const [mods, setMods] = useState<Record<string, string>>({});
  const [autonomy, setAutonomy] = useState<typeof AUTONOMY[number]["val"]>("ask_external");
  const [submitting, setSubmitting] = useState(false);

  const tiers: Array<{ tier: "own" | "assist" | "flag"; items: ActionItem[] }> = [
    { tier: "own", items: (plan?.own as ActionItem[]) ?? [] },
    { tier: "assist", items: (plan?.assist as ActionItem[]) ?? [] },
    { tier: "flag", items: (plan?.flag as ActionItem[]) ?? [] },
  ];

  const setApproval = (key: string, val: "approved"|"modified"|"removed") =>
    setApprovals(a => ({ ...a, [key]: val }));

  const counts = {
    own: tiers[0].items.filter((_, i) => approvals[`own-${i}`] !== "removed").length,
    assist: tiers[1].items.filter((_, i) => approvals[`assist-${i}`] !== "removed").length,
    flag: tiers[2].items.filter((_, i) => approvals[`flag-${i}`] !== "removed").length,
  };

  return (
    <>
      <PhaseHeader
        phase={5}
        title="Your call."
        subtitle="Approve, edit, or remove anything. This locks in what I'll do on day one."
        estimate="~2 min"
      />

      <div className="bg-white border border-paper-edge rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)] divide-y divide-paper-edge flex flex-col min-h-[560px]">
        {tiers.map(t => {
          const meta = TIER_META[t.tier];
          return (
            <section key={t.tier}>
              <header className="flex items-center justify-between px-5 py-2.5 bg-paper-hi border-b border-paper-edge">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className="w-[7px] h-[7px] rounded-full"
                    style={{ background: meta.dotColor }}
                  />
                  <Serif italic className="text-[13px] text-ink-muted">
                    {meta.label}
                  </Serif>
                </div>
                <span className="text-[10.5px] tabular-nums text-ink-faint">
                  {t.items.length} {t.items.length === 1 ? "item" : "items"}
                </span>
              </header>

              {t.items.length === 0 ? (
                <div className="px-5 py-3 text-[12.5px] text-ink-faint italic">
                  Nothing in this tier.
                </div>
              ) : (
                <ul className="divide-y divide-paper-edge/70">
                  {t.items.map((it, i) => {
                    const k = `${t.tier}-${i}`;
                    const state = approvals[k] ?? "approved";
                    const removed = state === "removed";
                    return (
                      <li
                        key={k}
                        className={
                          "group px-5 py-3 transition-colors hover:bg-paper-hi/40 " +
                          (removed ? "opacity-60" : "")
                        }
                      >
                        <div className="flex items-start gap-3">
                          <span
                            aria-hidden
                            className="w-[7px] h-[7px] rounded-full mt-[7px] shrink-0"
                            style={{ background: meta.dotColor }}
                          />
                          <div className="flex-1 min-w-0">
                            {state === "modified" ? (
                              <input
                                defaultValue={mods[k] ?? it.title}
                                onChange={e => setMods(m => ({ ...m, [k]: e.target.value }))}
                                className="w-full bg-transparent border-b border-paper-edge text-[14px] text-ink focus:outline-none focus:border-coral transition-colors"
                              />
                            ) : (
                              <div
                                className={
                                  "text-[14px] text-ink leading-snug " +
                                  (removed ? "line-through" : "")
                                }
                              >
                                {it.title}
                              </div>
                            )}
                            {it.rationale && (
                              <div className="text-[12px] text-ink-faint mt-1 italic leading-snug">
                                {it.rationale}
                              </div>
                            )}
                          </div>
                          <div
                            role="group"
                            aria-label="Approval"
                            className="inline-flex items-center bg-paper-hi border border-paper-edge rounded-md p-0.5 shrink-0"
                          >
                            {(["approved", "modified", "removed"] as const).map(opt => {
                              const active = state === opt;
                              return (
                                <Button
                                  key={opt}
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  aria-pressed={active}
                                  onClick={() => setApproval(k, opt)}
                                  className={
                                    "px-2.5 py-1 text-[10.5px] uppercase tracking-[0.1em] rounded " +
                                    (active
                                      ? "bg-ink text-paper hover:bg-ink hover:text-paper"
                                      : "hover:text-ink hover:bg-white")
                                  }
                                >
                                  {opt}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {/* Autonomy + summary */}
      <div className="bg-white border border-paper-edge rounded-lg shadow-[0_1px_2px_rgba(31,29,26,0.04)] p-5 space-y-4">
        <div className="space-y-2">
          <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium">
            Autonomy
          </div>
          <div className="flex flex-wrap gap-2">
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

        <p className="text-[13.5px] text-ink-muted leading-relaxed">
          Alex will own <strong className="text-ink">{counts.own}</strong> tasks,
          assist on <strong className="text-ink">{counts.assist}</strong>, and flag{" "}
          <strong className="text-ink">{counts.flag}</strong> things.
        </p>

        <div className="flex justify-end pt-2 border-t border-paper-edge">
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
      </div>

      <PhaseFooter phase={5} />
    </>
  );
}
