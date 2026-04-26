"use client";

import { useEffect, useState } from "react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { startWorking } from "@/src/server/start-working";
import type { ActionItem } from "@/src/ai/prompts/propose-action-plan";

const AUTONOMY = [
  { val: "ask_always", label: "Ask everything", sub: "Approve before I send anything" },
  { val: "ask_external", label: "Ask for external actions", sub: "Drafts are mine; sending needs you" },
  { val: "just_do_it", label: "Just do it", sub: "I'll review when something looks off" },
] as const;

const TIER_META: Record<"own" | "assist" | "flag", { label: string }> = {
  own: { label: "I will own" },
  assist: { label: "I will assist on" },
  flag: { label: "I will flag" },
};

type ApprovalState = "approved" | "modified" | "removed";

export function Phase5Approve({ employeeId }: { employeeId: string }) {
  const plan = useWalkthrough(s => s.actionPlanDraft);
  const setSubStep = useWalkthrough(s => s.setSubStep);
  const [approvals, setApprovals] = useState<Record<string, ApprovalState>>({});
  const [mods, setMods] = useState<Record<string, string>>({});
  const [autonomy, setAutonomy] = useState<typeof AUTONOMY[number]["val"]>("ask_external");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSubStep(1, 1);
  }, [setSubStep]);

  const tiers: Array<{ tier: "own" | "assist" | "flag"; items: ActionItem[] }> = [
    { tier: "own", items: (plan?.own as ActionItem[]) ?? [] },
    { tier: "assist", items: (plan?.assist as ActionItem[]) ?? [] },
    { tier: "flag", items: (plan?.flag as ActionItem[]) ?? [] },
  ];

  const setApproval = (key: string, val: ApprovalState) =>
    setApprovals(a => ({ ...a, [key]: val }));

  const counts = {
    own: tiers[0].items.filter((_, i) => (approvals[`own-${i}`] ?? "approved") !== "removed").length,
    assist: tiers[1].items.filter((_, i) => (approvals[`assist-${i}`] ?? "approved") !== "removed").length,
    flag: tiers[2].items.filter((_, i) => (approvals[`flag-${i}`] ?? "approved") !== "removed").length,
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-[760px] flex flex-col items-center text-center gap-8">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint font-medium">
          Phase 5 · Your call
        </span>

        <Serif as="h1" className="font-medium leading-[1.05]">
          <span style={{ fontSize: "clamp(32px, 6vw, 56px)" }}>Approve the plan.</span>
        </Serif>

        <Serif italic className="text-[16px] text-ink-muted">
          Approve, edit, or remove anything. This locks in what I&apos;ll do on day one.
        </Serif>

        <div className="w-full flex flex-col gap-10 text-left pt-4">
          {tiers.map(t => {
            if (t.items.length === 0) return null;
            const meta = TIER_META[t.tier];
            return (
              <div key={t.tier} className="space-y-3">
                <Serif italic className="text-[14px] text-coral block">
                  {meta.label}
                </Serif>
                <ul className="space-y-4">
                  {t.items.map((it, i) => {
                    const k = `${t.tier}-${i}`;
                    const state = approvals[k] ?? "approved";
                    const removed = state === "removed";
                    return (
                      <li
                        key={k}
                        className={
                          "flex items-start gap-3 transition-opacity " +
                          (removed ? "opacity-50" : "")
                        }
                      >
                        <span
                          aria-hidden
                          className="w-[6px] h-[6px] rounded-full bg-coral mt-[9px] shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          {state === "modified" ? (
                            <input
                              defaultValue={mods[k] ?? it.title}
                              onChange={e => setMods(m => ({ ...m, [k]: e.target.value }))}
                              className="w-full bg-transparent border-b border-paper-edge text-[15px] text-ink focus:outline-none focus:border-coral transition-colors py-1"
                            />
                          ) : (
                            <div
                              className={
                                "text-[15px] text-ink leading-snug " +
                                (removed ? "line-through" : "")
                              }
                            >
                              {it.title}
                            </div>
                          )}
                          {it.rationale && (
                            <div className="text-[13px] text-ink-faint mt-1 italic leading-snug serif">
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
                              <button
                                key={opt}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setApproval(k, opt)}
                                className={
                                  "px-2.5 py-1 text-[10.5px] uppercase tracking-[0.1em] rounded transition-colors " +
                                  (active
                                    ? "bg-ink text-paper"
                                    : "text-ink-faint hover:text-ink hover:bg-white")
                                }
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Autonomy chooser */}
        <div className="w-full flex flex-col gap-4 pt-6 text-left">
          <Serif italic className="text-[14px] text-coral block text-center">
            How autonomous should I be?
          </Serif>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {AUTONOMY.map(a => {
              const selected = autonomy === a.val;
              return (
                <button
                  key={a.val}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setAutonomy(a.val)}
                  className={
                    "rounded-md border px-4 py-4 text-center transition-all " +
                    (selected
                      ? "border-ink bg-ink text-paper"
                      : "border-paper-edge bg-white text-ink hover:border-coral")
                  }
                >
                  <div className="text-[14px] font-medium">{a.label}</div>
                  <div
                    className={
                      "text-[12px] mt-1 " + (selected ? "text-paper/70" : "text-ink-faint")
                    }
                  >
                    {a.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live summary line */}
        <Serif italic className="text-[15px] text-ink-muted leading-relaxed pt-2">
          Alex will own <span className="text-ink not-italic">{counts.own}</span> tasks, assist on{" "}
          <span className="text-ink not-italic">{counts.assist}</span>, and flag{" "}
          <span className="text-ink not-italic">{counts.flag}</span> things.
        </Serif>

        <div className="pt-4">
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

      <div className="fixed bottom-6 right-6 flex items-center gap-3 font-sans text-[11px] text-ink-faint z-30">
        <span className="tabular-nums uppercase tracking-[0.14em]">5 / 6</span>
      </div>
    </section>
  );
}
