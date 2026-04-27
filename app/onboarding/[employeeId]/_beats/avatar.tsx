"use client";

import { motion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { cn } from "@/src/lib/cn";

const SIZES = {
  hero: "w-32 h-32 text-[44px]",
  md: "w-16 h-16 text-[24px]",
  sm: "w-11 h-11 text-[18px]",
} as const;

export function AlexAvatar({
  size = "hero",
  pulsing = false,
  className,
}: {
  size?: keyof typeof SIZES;
  pulsing?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "relative grid place-items-center rounded-full text-white shrink-0",
        SIZES[size],
        className,
      )}
      style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Serif>A</Serif>
      {pulsing && (
        <>
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(224,122,95,0.32)" }}
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
          />
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(224,122,95,0.22)" }}
            animate={{ scale: [1, 1.9], opacity: [0.35, 0] }}
            transition={{
              duration: 1.8,
              ease: "easeOut",
              repeat: Infinity,
              delay: 0.6,
            }}
          />
        </>
      )}
    </motion.div>
  );
}
