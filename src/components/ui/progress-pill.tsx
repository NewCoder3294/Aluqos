import * as React from "react";
import { cn } from "@/src/lib/cn";

export type ProgressPillState = "full" | "half" | "empty";

export function ProgressPill({
  state,
  label,
  className,
}: {
  state: ProgressPillState;
  label?: string;
  className?: string;
}) {
  return (
    <span
      title={label}
      aria-label={label}
      className={cn(
        "block h-1 w-8 rounded-full overflow-hidden bg-[--color-paper-edge]/70 cursor-help transition-transform hover:scale-y-[1.6]",
        className,
      )}
    >
      <span
        className={cn(
          "block h-full rounded-full transition-all",
          state === "full" && "w-full bg-[--color-coral]",
          state === "half" && "w-1/2 bg-[--color-coral] opacity-80 pulse-coral",
          state === "empty" && "w-0",
        )}
      />
    </span>
  );
}
