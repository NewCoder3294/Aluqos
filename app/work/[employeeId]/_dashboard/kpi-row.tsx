import { cn } from "@/src/lib/cn";

type Kpi = {
  label: string;
  value: string;
  caption?: string;
  tone?: "default" | "warning";
};

const KPIS: Kpi[] = [
  { label: "PRDs drafted today", value: "1", caption: "+1 vs. yesterday" },
  { label: "Needs review", value: "2", caption: "awaiting your input", tone: "warning" },
  { label: "Items flagged", value: "3", caption: "needs your eye", tone: "warning" },
  { label: "Avg time-to-PRD", value: "8m 14s", caption: "−2m vs. last week" },
];

export function KpiRow() {
  return (
    <div className="grid grid-cols-4 gap-5">
      {KPIS.map((k) => (
        <div
          key={k.label}
          className={cn(
            "bg-white border border-paper-edge rounded-md p-5 transition-colors",
            "hover:border-coral/30",
          )}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "size-1.5 rounded-full",
                k.tone === "warning" ? "bg-coral" : "bg-paper-edge",
              )}
            />
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint font-medium">
              {k.label}
            </span>
          </div>
          <div className="serif text-[36px] leading-none text-ink mt-3 tabular-nums tracking-[-0.02em]">
            {k.value}
          </div>
          {k.caption && (
            <div className="text-[11.5px] text-ink-faint mt-2.5">{k.caption}</div>
          )}
        </div>
      ))}
    </div>
  );
}
