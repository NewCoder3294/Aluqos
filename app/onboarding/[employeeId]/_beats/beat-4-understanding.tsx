"use client";

import { motion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import {
  UNDERSTANDING_CARDS,
  UNDERSTANDING_CTA,
  UNDERSTANDING_CTA_ALT,
  UNDERSTANDING_HEADLINE,
  UNDERSTANDING_SUBHEAD,
} from "@/src/data/onboarding-script";
import { AlexAvatar } from "./avatar";
import { BeatCard } from "./beat-card";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Beat4Understanding() {
  const setPhase = useWalkthrough(s => s.setPhase);

  return (
    <BeatCard size="lg" className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <AlexAvatar size="md" />
        <Serif as="h2" className="text-[clamp(28px,3.6vw,40px)] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">
          {UNDERSTANDING_HEADLINE}
        </Serif>
        <p className="serif italic text-[16px] text-ink-faint max-w-[44ch]">
          {UNDERSTANDING_SUBHEAD}
        </p>
      </motion.div>

      <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        {UNDERSTANDING_CARDS.map((card, i) => {
          // Each card is its own beat — wide stagger so they land sequentially,
          // not as a wave. Internal stagger reveals eyebrow → title → body so
          // each card feels like Alex naming a finding then explaining it.
          const cardBase = 0.4 + i * 0.55;
          return (
            <motion.div
              key={card.eyebrow}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: cardBase }}
              className="bg-paper-hi/60 border border-paper-edge rounded-lg p-6 flex flex-col gap-3"
            >
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: cardBase + 0.05 }}
                className="text-[11px] uppercase tracking-[0.14em] text-coral-deep font-medium"
              >
                {card.eyebrow}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: cardBase + 0.18 }}
              >
                <Serif as="h3" className="text-[20px] leading-[1.2] tracking-[-0.01em]">
                  {card.title}
                </Serif>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: EASE, delay: cardBase + 0.34 }}
                className="text-[14px] leading-[1.55] text-ink-muted"
              >
                {card.body}
              </motion.p>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay: 2.2 }}
        className="mt-12 flex flex-col sm:flex-row items-center gap-3"
      >
        <Button variant="ink" size="lg" onClick={() => setPhase(5)}>
          {UNDERSTANDING_CTA}
        </Button>
        <Button variant="quiet" size="md" onClick={() => setPhase(2)}>
          {UNDERSTANDING_CTA_ALT}
        </Button>
      </motion.div>
    </BeatCard>
  );
}
