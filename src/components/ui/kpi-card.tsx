import * as React from "react";
import { cn } from "@/src/lib/cn";

type TrendVariant = "up" | "down" | "neutral" | "warning";

const TREND_CLASSES: Record<TrendVariant, string> = {
  up: "bg-emerald-50 text-emerald-700 border-emerald-200",
  down: "bg-[--color-paper-hi] text-[--color-ink-muted] border-[--color-paper-edge]",
  neutral: "bg-[--color-paper-hi] text-[--color-ink-muted] border-[--color-paper-edge]",
  warning: "bg-[--color-coral]/10 text-[--color-coral-deep] border-[--color-coral]/20",
};

export function KpiCard({
  label,
  value,
  trend,
  trendVariant = "neutral",
  icon,
  className,
}: {
  label: string;
  value: React.ReactNode;
  trend?: string;
  trendVariant?: TrendVariant;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex-1 min-w-0 bg-white border border-[--color-paper-edge] rounded-md px-4 py-3 transition-colors hover:border-[--color-coral]/40 hover:bg-[--color-paper-hi]/30",
        className,
      )}
    >
      {icon && (
        <span className="absolute top-3 right-3 text-[--color-ink-faint]">
          {icon}
        </span>
      )}
      <div className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint] font-medium">
        {label}
      </div>
      <div className="serif text-[24px] leading-tight text-[--color-ink] mt-1 tabular-nums">
        {value}
      </div>
      {trend && (
        <div
          className={cn(
            "inline-flex items-center mt-1.5 px-1.5 py-0.5 rounded-full text-[10.5px] tracking-[0.02em] border",
            TREND_CLASSES[trendVariant],
          )}
        >
          {trend}
        </div>
      )}
    </div>
  );
}
