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

/* Tiny logo glyphs — minimal, on-paper. */
function SlackGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
      <g fill="currentColor">
        <rect x="2.5" y="9.5" width="5" height="2" rx="1" />
        <rect x="9.5" y="2.5" width="2" height="5" rx="1" />
        <rect x="16.5" y="12.5" width="5" height="2" rx="1" />
        <rect x="12.5" y="16.5" width="2" height="5" rx="1" />
      </g>
    </svg>
  );
}
function NotionGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="3.5" width="16" height="17" rx="1.5" />
      <path d="M8 7.5v9M8 7.5l8 9M16 7.5v9" strokeLinecap="round" />
    </svg>
  );
}
function JiraGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden fill="currentColor">
      <path d="M12 2 L20 10 L16 10 A6 6 0 0 0 10 4 Z" opacity="0.85" />
      <path d="M4 12 L8 12 A6 6 0 0 0 14 18 L14 22 Z" />
    </svg>
  );
}
function GithubGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden fill="currentColor">
      <path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.6.6-3.2-1.2-3.2-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.4-1.1.7-1.3-2.1-.2-4.3-1-4.3-4.6 0-1 .4-1.9 1-2.5-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.5 1 2.5 0 3.6-2.2 4.4-4.3 4.6.4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5z" />
    </svg>
  );
}
function DriveGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden fill="currentColor">
      <path d="M9 3 L15 3 L21 14 L18 14 L12 3.5 Z" />
      <path d="M3 14 L9 3 L12 8.5 L6 19 Z" opacity="0.75" />
      <path d="M6 19 L18 14 L21 14 L18 19 Z" opacity="0.55" />
    </svg>
  );
}
function LinearGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M3 14 L10 21" />
      <path d="M3 9 L15 21" />
      <path d="M4 5 L19 20" />
      <path d="M9 3 L21 15" />
      <path d="M14 3 L21 10" />
    </svg>
  );
}

function IntegrationsMock() {
  const glyphs = [
    { name: "Slack", G: SlackGlyph },
    { name: "Notion", G: NotionGlyph },
    { name: "Jira", G: JiraGlyph },
    { name: "GitHub", G: GithubGlyph },
    { name: "Drive", G: DriveGlyph },
    { name: "Linear", G: LinearGlyph },
  ];
  return (
    <div className="grid grid-cols-6 gap-2">
      {glyphs.map(({ name, G }, i) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: EASE }}
          aria-label={name}
          className="aspect-square rounded-md border border-paper-edge bg-paper-hi/60 grid place-items-center text-ink-muted hover:text-coral-deep transition-colors"
        >
          <G />
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
  const inView = useInView(ref, { once: true, margin: "-10%" });

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
    let acc: string[] = [];

    const run = async () => {
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
            eyebrow="Integrations"
            title="Lives in your tools"
            subtitle="Slack &middot; Notion &middot; Jira &middot; GitHub &middot; Drive &middot; Linear"
            visual={<IntegrationsMock />}
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
