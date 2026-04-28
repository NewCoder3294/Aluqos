import { cn } from "@/src/lib/cn";
import type { DraftConfidence } from "@/src/dev/store";

// Three-dot confidence indicator. Filled left-to-right (1=low, 2=medium,
// 3=high). Used on draft cards (inbox + workflows) so the user can see at a
// glance how sure Alex is about the voice match.

const LABEL: Record<DraftConfidence, string> = {
  high: "Strong voice match",
  medium: "Decent voice match",
  low: "Less sure — please review",
};

const FILLED: Record<DraftConfidence, number> = { low: 1, medium: 2, high: 3 };

export function ConfidenceDots({
  confidence,
  showLabel = true,
  className,
}: {
  confidence: DraftConfidence;
  showLabel?: boolean;
  className?: string;
}) {
  const fill = FILLED[confidence];
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      title={LABEL[confidence]}
    >
      <span className="inline-flex items-center gap-[3px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "size-[6px] rounded-full",
              i < fill ? "bg-coral-deep" : "bg-paper-edge",
            )}
          />
        ))}
      </span>
      {showLabel && (
        <span className="text-[11px] text-ink-faint">{LABEL[confidence]}</span>
      )}
    </span>
  );
}
