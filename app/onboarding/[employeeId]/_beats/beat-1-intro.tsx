"use client";

import { motion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import { GREETING } from "@/src/data/onboarding-script";
import { AlexAvatar } from "./avatar";
import { BeatCard } from "./beat-card";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Beat1Intro() {
  const setPhase = useWalkthrough(s => s.setPhase);

  return (
    <BeatCard size="sm" className="text-center flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <AlexAvatar pulsing />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
        className="mt-10 max-w-[28ch]"
      >
        <Serif as="h1" className="text-[clamp(36px,5vw,56px)] leading-[1.05] tracking-[-0.02em]">
          {GREETING.hi}
        </Serif>
        <Serif
          as="p"
          italic
          className="mt-5 text-[clamp(20px,2.4vw,26px)] leading-[1.3] text-ink-faint"
        >
          {GREETING.pitch}
        </Serif>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE, delay: 1.4 }}
        className="mt-12"
      >
        <Button variant="ink" size="lg" onClick={() => setPhase(2)}>
          Let&rsquo;s go
        </Button>
      </motion.div>
    </BeatCard>
  );
}
