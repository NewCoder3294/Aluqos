"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TypewriterLine } from "@/src/components/typewriter-line";
import { useWalkthrough } from "@/src/store/walkthrough";
import { READING_LINES } from "@/src/data/onboarding-script";
import { AlexAvatar } from "./avatar";
import { BeatCard } from "./beat-card";

const EASE = [0.16, 1, 0.3, 1] as const;
const FINAL_HOLD_MS = 1100;
const TYPE_SPEED_MS = 22;

export function Beat3Reading() {
  const setPhase = useWalkthrough(s => s.setPhase);
  const [activeIndex, setActiveIndex] = useState(0);
  const [waiting, setWaiting] = useState(true);

  // Wait the line's pre-delay before mounting the typewriter.
  useEffect(() => {
    if (activeIndex >= READING_LINES.length) return;
    const line = READING_LINES[activeIndex];
    const t = setTimeout(() => setWaiting(false), line.delayMs);
    return () => clearTimeout(t);
  }, [activeIndex]);

  // After the last line finishes typing + hold, advance to beat 4.
  useEffect(() => {
    if (activeIndex < READING_LINES.length) return;
    const t = setTimeout(() => setPhase(4), FINAL_HOLD_MS);
    return () => clearTimeout(t);
  }, [activeIndex, setPhase]);

  return (
    <BeatCard size="sm" className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <AlexAvatar size="md" pulsing />
      </motion.div>

      <ul
        aria-live="polite"
        className="mt-10 max-w-[42ch] w-full space-y-3 text-[17px] leading-[1.4]"
      >
        {READING_LINES.slice(0, activeIndex + (waiting ? 0 : 1)).map((line, i) => (
          <motion.li
            key={line.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className={
              i === activeIndex
                ? "text-ink"
                : "text-ink-faint"
            }
          >
            {i === activeIndex ? (
              <TypewriterLine
                text={line.text}
                speedMs={TYPE_SPEED_MS}
                onDone={() => {
                  setActiveIndex(i + 1);
                  setWaiting(true);
                }}
              />
            ) : (
              line.text
            )}
          </motion.li>
        ))}
      </ul>
    </BeatCard>
  );
}
