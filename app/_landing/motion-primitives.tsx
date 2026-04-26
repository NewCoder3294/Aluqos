"use client";

import * as React from "react";
import { motion, useScroll, useSpring, type HTMLMotionProps } from "motion/react";
import { cn } from "@/src/lib/cn";

// Smooth ease-out-expo curve. Confident, fast, never bouncy.
export const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** vertical translation in px when hidden. default 24 */
  y?: number;
  /** duration in seconds. default 0.6 */
  duration?: number;
  /** if true, only fade — no slide. */
  fade?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Subtle scroll-reveal. Children fade + translate-y once when entering viewport.
 * Reduced motion = instant.
 */
export function Reveal({
  delay = 0,
  y = 24,
  duration = 0.6,
  fade = false,
  className,
  children,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: fade ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Sticky 2px coral progress bar at the top of the page.
 * Fills from 0% to 100% as the user scrolls the document.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[2px]",
        "bg-[--color-coral]",
        "pointer-events-none",
      )}
    />
  );
}
