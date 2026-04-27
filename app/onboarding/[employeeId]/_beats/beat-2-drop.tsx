"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, FileText, Code2 } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { useWalkthrough } from "@/src/store/walkthrough";
import { DROP_CTA, DROP_TARGETS, type DropTarget } from "@/src/data/onboarding-script";
import { AlexAvatar } from "./avatar";
import { BeatCard } from "./beat-card";

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS: Record<DropTarget["id"], typeof Code2> = {
  github: Code2,
  notion: FileText,
};

export function Beat2Drop() {
  const setPhase = useWalkthrough(s => s.setPhase);
  const [dropped, setDropped] = useState<Record<DropTarget["id"], boolean>>({
    github: false,
    notion: false,
  });

  const allDropped = DROP_TARGETS.every(t => dropped[t.id]);

  return (
    <BeatCard size="md" className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <AlexAvatar size="md" />
        <Serif as="p" italic className="text-[18px] text-ink-faint max-w-[36ch]">
          Drop in whatever you&rsquo;d hand a new hire on day one.
        </Serif>
      </motion.div>

      <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
        {DROP_TARGETS.map((target, i) => {
          const Icon = ICONS[target.id];
          const isDropped = dropped[target.id];
          return (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 + i * 0.08 }}
            >
              <DropTargetCard
                Icon={Icon}
                target={target}
                dropped={isDropped}
                onDrop={() =>
                  setDropped(prev => ({ ...prev, [target.id]: true }))
                }
              />
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {allDropped && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-10"
          >
            <Button variant="ink" size="lg" onClick={() => setPhase(3)}>
              {DROP_CTA}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </BeatCard>
  );
}

function DropTargetCard({
  Icon,
  target,
  dropped,
  onDrop,
}: {
  Icon: typeof Code2;
  target: DropTarget;
  dropped: boolean;
  onDrop: () => void;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      onClick={() => !dropped && onDrop()}
      onDragOver={e => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={e => {
        e.preventDefault();
        setHover(false);
        if (!dropped) onDrop();
      }}
      aria-label={`Drop ${target.label}`}
      className={cn(
        "w-full h-44 rounded-lg cursor-pointer select-none transition-colors",
        "flex flex-col items-center justify-center gap-3 px-6 text-center",
        "border-2 border-dashed",
        dropped
          ? "border-coral/60 bg-coral/5"
          : hover
            ? "border-coral/50 bg-paper-hi"
            : "border-paper-edge/80 bg-paper-hi/40",
      )}
    >
        <AnimatePresence mode="wait">
          {dropped ? (
            <motion.div
              key="dropped"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="flex flex-col items-center gap-2"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-coral/10 text-coral-deep text-[13px] font-medium">
                <Check className="w-4 h-4" />
                {target.fixtureName}
              </span>
              <span className="text-[12px] text-ink-faint">
                Got it.
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-2"
            >
              <Icon className="w-7 h-7 text-ink-faint" aria-hidden />
              <Serif className="text-[18px] text-ink">{target.label}</Serif>
              <span className="text-[12.5px] text-ink-faint max-w-[28ch]">
                {target.helper}
              </span>
            </motion.div>
          )}
      </AnimatePresence>
    </button>
  );
}
