"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Button } from "@/src/components/ui/button";
import { useWalkthrough } from "@/src/store/walkthrough";
import {
  PRD_APPROVE,
  PRD_META,
  PRD_PREAMBLE,
  PRD_REFINE,
  PRD_SECTIONS,
  PRD_TITLE,
  type PRDSection,
} from "@/src/data/onboarding-script";
import { startWorking } from "@/src/server/start-working";
import { AlexAvatar } from "./avatar";

const EASE = [0.16, 1, 0.3, 1] as const;
const PRD_REVEAL_DELAY_MS = 900;
const HEADING_HOLD_MS = 220;
const FINAL_HOLD_MS = 700;
const CHAR_INTERVAL_MS = 9;

export function Beat5PrdReveal({ employeeId }: { employeeId: string }) {
  const setPhase = useWalkthrough(s => s.setPhase);
  const [showPrd, setShowPrd] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  // Slide the PRD panel in after a beat, so the preamble lands first.
  useEffect(() => {
    const t = setTimeout(() => setShowPrd(true), PRD_REVEAL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // When all sections have been streamed, hold a beat then surface the CTAs.
  useEffect(() => {
    if (currentIndex < PRD_SECTIONS.length) return;
    const t = setTimeout(() => setDone(true), FINAL_HOLD_MS);
    return () => clearTimeout(t);
  }, [currentIndex]);

  const handleApprove = async () => {
    if (startedRef.current) return;
    startedRef.current = true;
    // No real autonomy/approvals collected in the magical flow — pass empty
    // payloads and let start-working bump phase to 6 + redirect to /work.
    await startWorking(employeeId, {}, "ask_external", {});
  };

  return (
    <div className="min-h-screen px-6 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14">
        {/* Left rail — Alex talks */}
        <motion.aside
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex flex-col items-start gap-4 lg:sticky lg:top-16 lg:self-start"
        >
          <AlexAvatar size="md" pulsing={!done} />
          <Serif italic className="text-[15px] text-ink-faint leading-[1.4] max-w-[26ch]">
            {PRD_PREAMBLE}
          </Serif>
        </motion.aside>

        {/* Right pane — PRD */}
        <AnimatePresence>
          {showPrd && (
            <motion.article
              key="prd"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="bg-white border border-paper-edge rounded-lg p-7 lg:p-10 shadow-[0_2px_12px_rgba(31,29,26,0.05)]"
            >
              <header className="border-b border-paper-edge pb-5">
                <div className="text-[11px] uppercase tracking-[0.14em] text-coral-deep font-medium">
                  Draft PRD
                </div>
                <Serif
                  as="h2"
                  className="mt-2 text-[clamp(22px,2.4vw,28px)] leading-[1.2] tracking-[-0.01em]"
                >
                  {PRD_TITLE}
                </Serif>
                <div className="mt-2 text-[12px] text-ink-faint">{PRD_META}</div>
              </header>

              <div className="mt-6 space-y-5">
                {PRD_SECTIONS.map((section, i) => {
                  if (i > currentIndex) return null;
                  if (i < currentIndex) {
                    return <PrdBlock key={i} section={section} streaming={false} />;
                  }
                  return (
                    <PrdBlock
                      key={i}
                      section={section}
                      streaming
                      onDone={() => setCurrentIndex(c => c + 1)}
                    />
                  );
                })}
              </div>

              <AnimatePresence>
                {done && (
                  <motion.footer
                    key="approve"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mt-10 pt-6 border-t border-paper-edge flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <Button variant="ink" size="lg" onClick={handleApprove}>
                      {PRD_APPROVE}
                    </Button>
                    <Button variant="quiet" size="md" onClick={() => setPhase(4)}>
                      {PRD_REFINE}
                    </Button>
                  </motion.footer>
                )}
              </AnimatePresence>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PrdBlock({
  section,
  streaming,
  onDone,
}: {
  section: PRDSection;
  streaming: boolean;
  onDone?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {section.kind === "subheading" && (
        <SubheadingBlock text={section.text} streaming={streaming} onDone={onDone} />
      )}
      {section.kind === "heading" && (
        <Serif as="h2" className="text-[22px] leading-[1.2]">
          {section.text}
        </Serif>
      )}
      {section.kind === "paragraph" && (
        <ParagraphBlock text={section.text} streaming={streaming} onDone={onDone} />
      )}
      {section.kind === "bullets" && (
        <BulletsBlock items={section.items} streaming={streaming} onDone={onDone} />
      )}
    </motion.div>
  );
}

function SubheadingBlock({
  text,
  streaming,
  onDone,
}: {
  text: string;
  streaming: boolean;
  onDone?: () => void;
}) {
  // Subheadings are labels — show fully and advance after a short hold so the
  // eye registers them before the body starts streaming under them.
  useEffect(() => {
    if (!streaming) return;
    const t = setTimeout(() => onDone?.(), HEADING_HOLD_MS);
    return () => clearTimeout(t);
  }, [streaming, onDone]);

  return (
    <h3 className="text-[12px] uppercase tracking-[0.14em] text-coral-deep font-medium">
      {text}
    </h3>
  );
}

function ParagraphBlock({
  text,
  streaming,
  onDone,
}: {
  text: string;
  streaming: boolean;
  onDone?: () => void;
}) {
  const visible = useStreamedText(text, streaming, onDone);
  return (
    <p className="text-[15px] leading-[1.6] text-ink mt-2">
      {visible}
      {streaming && visible.length < text.length && <Caret />}
    </p>
  );
}

function BulletsBlock({
  items,
  streaming,
  onDone,
}: {
  items: string[];
  streaming: boolean;
  onDone?: () => void;
}) {
  // Stream the bullets as one contiguous string with newline separators, then
  // split back into list items at render time. Keeps the UI as a real <ul>
  // while letting us share a single streaming hook.
  const joined = items.join("\n");
  const visibleJoined = useStreamedText(joined, streaming, onDone);
  const visibleItems = visibleJoined.split("\n");
  const stillStreaming =
    streaming && visibleJoined.length < joined.length;

  return (
    <ul className="mt-2 space-y-1.5">
      {visibleItems.map((item, i) => (
        <li
          key={i}
          className="text-[14.5px] leading-[1.55] text-ink pl-4 relative before:content-['·'] before:absolute before:left-0 before:text-coral-deep before:font-bold"
        >
          {item}
          {stillStreaming && i === visibleItems.length - 1 && <Caret />}
        </li>
      ))}
    </ul>
  );
}

function useStreamedText(
  text: string,
  streaming: boolean,
  onDone?: () => void,
) {
  const [chars, setChars] = useState(streaming ? 0 : text.length);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!streaming) {
      setChars(text.length);
      return;
    }
    setChars(0);
    doneRef.current = false;
  }, [text, streaming]);

  useEffect(() => {
    if (!streaming) return;
    if (chars >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
      return;
    }
    const t = setTimeout(() => setChars(c => c + 1), CHAR_INTERVAL_MS);
    return () => clearTimeout(t);
  }, [streaming, chars, text, onDone]);

  return text.slice(0, chars);
}

function Caret() {
  return (
    <span
      className="inline-block w-[2px] h-[1em] align-middle ml-0.5 bg-coral-deep"
      style={{ animation: "blink 1s steps(2) infinite" }}
    />
  );
}
