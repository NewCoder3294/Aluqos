import { cn } from "@/src/lib/cn";
import type { Kpi } from "./data/types";

export function KpiRow({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {kpis.map((k) => (
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
