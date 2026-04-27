"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Mic } from "lucide-react";
import { Serif } from "@/src/components/serif";
import { Card, CardContent } from "@/src/components/ui/card";
import { EASE, Reveal } from "./motion-primitives";

/* ---------- Visual mocks ---------- */

function MemoryMock() {
  const items: Array<{ kind: string; label: string }> = [
    { kind: "Read", label: "README.md" },
    { kind: "Watched", label: "#product-feedback" },
    { kind: "Recalled", label: "v3.2 spec from March" },
  ];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.45, ease: EASE }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-paper-hi/70 border border-paper-edge"
        >
          <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint shrink-0">
            {item.kind}
          </span>
          <span className="serif text-[12.5px] text-ink truncate">
            {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function VoiceMock() {
  return (
    <div className="rounded-md border border-paper-edge bg-paper-hi/50 p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-coral text-white grid place-items-center shrink-0">
        <Mic className="w-3.5 h-3.5" aria-hidden />
      </div>
      <div className="flex items-end gap-[3px] h-7 flex-1">
        {[0.3, 0.7, 0.45, 0.9, 0.6, 0.4, 0.85, 0.5, 0.7, 0.35, 0.6, 0.45].map((h, i) => (
          <motion.span
            key={i}
            initial={{ scaleY: 0.2 }}
            whileInView={{ scaleY: h }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.35, ease: EASE }}
            className="w-[3px] bg-coral-deep rounded-full origin-bottom"
            style={{ height: "100%" }}
          />
        ))}
      </div>
      <span className="text-[11px] text-ink-faint serif italic shrink-0">0:08</span>
    </div>
  );
}

function AutonomyMock() {
  const modes = [
    { id: "ask",      label: "Ask always",        sub: "Confirm every action",        icon: "?" },
    { id: "external", label: "Ask before external", sub: "Send to Slack/email needs OK", icon: "↗", active: true },
    { id: "go",       label: "Just do it",         sub: "Run with full autonomy",        icon: "→" },
  ];
  return (
    <div className="space-y-2">
      {modes.map((m, i) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07, duration: 0.4, ease: EASE }}
          className={`flex items-center gap-3 rounded-md border p-2.5 ${
            m.active
              ? "border-coral/35 bg-coral/[0.06]"
              : "border-paper-edge bg-white"
          }`}
        >
          <div
            className={`w-7 h-7 rounded-full grid place-items-center text-[12px] shrink-0 ${
              m.active ? "bg-coral text-paper" : "bg-paper-hi text-ink-faint border border-paper-edge"
            }`}
            aria-hidden
          >
            {m.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className={`text-[12.5px] ${m.active ? "text-ink font-medium" : "text-ink"}`}>
              {m.label}
            </div>
            <div className="text-[10.5px] text-ink-faint truncate">{m.sub}</div>
          </div>
          {m.active && (
            <span className="text-[9.5px] uppercase tracking-[0.12em] text-coral-deep shrink-0">
              Current
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ApprovalMock() {
  return (
    <div className="rounded-md border border-paper-edge bg-paper-hi/50 p-3">
      <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.12em] text-ink-faint mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-coral animate-pulse" aria-hidden />
        Pending your review
      </div>
      <div className="serif text-[13px] text-ink mb-3 truncate">
        PRD &mdash; Bulk export for ops
      </div>
      <div className="flex items-center gap-1 p-1 rounded-md bg-white border border-paper-edge">
        <button
          type="button"
          className="flex-1 text-[11px] uppercase tracking-[0.12em] py-1.5 rounded text-ink-faint hover:text-ink"
        >
          Discard
        </button>
        <button
          type="button"
          className="flex-1 text-[11px] uppercase tracking-[0.12em] py-1.5 rounded text-ink-muted hover:text-ink"
        >
          Edit
        </button>
        <button
          type="button"
          className="flex-1 text-[11px] uppercase tracking-[0.12em] py-1.5 rounded bg-ink text-paper"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

function StreamMock() {
  const reduced = useReducedMotion() ?? false;
  const ref = React.useRef<HTMLDivElement>(null);
  // Loop forever once visible so a fast-scrolling visitor still catches the
  // animation on the way back. Pause between cycles so it doesn't feel busy.
  const inView = useInView(ref, { margin: "-10%" });

  const lines = [
    "Reading q2-roadmap.pdf",
    "Cross-checking issue 47 in Linear",
    "Drafting PRD: Bulk export for ops",
  ];

  const [shown, setShown] = React.useState<string[]>(reduced ? lines : []);
  const [cursorIdx, setCursorIdx] = React.useState(reduced ? lines.length - 1 : -1);

  React.useEffect(() => {
    if (reduced || !inView) return;
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        let acc: string[] = [];
        setShown([]);
        setCursorIdx(-1);
        await new Promise(r => setTimeout(r, 200));
        for (let i = 0; i < lines.length; i++) {
          if (cancelled) return;
          setCursorIdx(i);
          const target = lines[i];
          for (let n = 1; n <= target.length; n++) {
            if (cancelled) return;
            const partial = [...acc];
            partial[i] = target.slice(0, n);
            setShown(partial);
            await new Promise(r => setTimeout(r, 18));
          }
          acc = [...acc];
          acc[i] = target;
          await new Promise(r => setTimeout(r, 220));
        }
        // Hold the completed state for a beat before resetting.
        setCursorIdx(-1);
        await new Promise(r => setTimeout(r, 2400));
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className="rounded-md border border-paper-edge bg-paper-hi/40 p-4 lg:p-5 min-h-[110px]">
      <div className="space-y-1.5">
        {lines.map((full, i) => {
          const text = shown[i] ?? "";
          const isActive = cursorIdx === i;
          return (
            <div
              key={i}
              className="serif italic text-[15px] lg:text-[16px] leading-snug text-ink-muted"
            >
              <span>{text}</span>
              {isActive && text.length < full.length ? (
                <span
                  aria-hidden
                  className="inline-block w-[2px] h-[1em] bg-coral align-[-2px] ml-[1px] animate-pulse"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Cell ---------- */

type CellProps = {
  index: number;
  className: string;
  eyebrow?: string;
  title: string;
  subtitle: string;
  visual: React.ReactNode;
};

function BentoCell({ index, className, eyebrow, title, subtitle, visual }: CellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      className={"flex " + className}
    >
      <Card className="flex flex-col w-full">
        <CardContent className="flex flex-col gap-4 h-full">
          {eyebrow ? (
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-coral-deep font-medium">
              {eyebrow}
            </div>
          ) : null}
          <div>
            <Serif as="h3" className="text-[22px] lg:text-[24px] leading-tight tracking-[-0.01em]">
              {title}
            </Serif>
            <p className="mt-2 text-[14px] leading-[1.6] text-ink-muted max-w-[44ch]">
              {subtitle}
            </p>
          </div>
          <div className="mt-auto pt-2">{visual}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------- Section ---------- */

export function LandingBento() {
  return (
    <section id="features" className="bg-paper-hi/40 border-y border-paper-edge">
      <div className="max-w-6xl mx-auto px-6 py-24 lg:py-32">
        <Reveal>
          <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
            What makes it work
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[22ch]">
            Everything an employee needs.{" "}
            <span className="italic text-ink-faint">
              Nothing you have to configure.
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
          <BentoCell
            index={0}
            className="md:col-span-2"
            eyebrow="Memory"
            title="Persistent memory"
            subtitle="They remember every conversation, doc, and decision — like a colleague who's been there since Day 1."
            visual={<MemoryMock />}
          />
          <BentoCell
            index={1}
            className="md:col-span-1"
            eyebrow="Voice"
            title="Speak, don't type"
            subtitle="Drop a voice memo. Alex transcribes and ships."
            visual={<VoiceMock />}
          />
          <BentoCell
            index={2}
            className="md:col-span-1"
            eyebrow="Autonomy"
            title="Asks before it ships"
            subtitle="Pick the leash. Confirm everything, only outbound, or full autonomy &mdash; switch any time."
            visual={<AutonomyMock />}
          />
          <BentoCell
            index={3}
            className="md:col-span-2"
            eyebrow="Trust by design"
            title="Trust by design"
            subtitle="Every action shows its work. Approve PRDs before they ship, status updates before they send."
            visual={<ApprovalMock />}
          />
          <BentoCell
            index={4}
            className="md:col-span-3"
            eyebrow="Speed"
            title="Streams in real time"
            subtitle="Token-by-token responses. Sub-second time-to-first-byte. No loading spinners — Alex types in front of you."
            visual={<StreamMock />}
          />
        </div>
      </div>
    </section>
  );
}
