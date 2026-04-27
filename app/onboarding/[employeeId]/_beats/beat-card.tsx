"use client";

import { cn } from "@/src/lib/cn";

/**
 * Visual container for the magical-onboarding beats so the content reads as
 * "a card on the workshop desk" rather than floating in the dot grid.
 *
 * Beat 5 has its own document card (PRD reveal) and does not use this.
 */
export function BeatCard({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  /** Inner content max-width — narrow for greeting, wide for understanding cards. */
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const maxW =
    size === "sm" ? "max-w-2xl" : size === "lg" ? "max-w-5xl" : "max-w-3xl";

  return (
    <div className={cn("w-full mx-auto", maxW)}>
      <div
        className={cn(
          "relative bg-white border border-paper-edge rounded-xl",
          "shadow-[0_4px_24px_rgba(31,29,26,0.06)]",
          "px-8 py-12 sm:px-12 sm:py-16",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
