"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Serif } from "@/src/components/serif";
import {
  Activity,
  Bell,
  Check,
  FileText,
  Mail,
  MessageSquare,
  Mic,
  Search,
  Sparkles,
} from "lucide-react";
import { EASE } from "./motion-primitives";

// Decorative rendering of the Aluqos PM workspace. The agent has ingested
// email, Slack, meetings, and docs — without prompts or instructions — and
// is proposing the user's top priorities for approval. Wrapped by the caller
// in pointer-events-none so it reads as a screenshot.

const TITLES = [
  "Synthesizing 47 emails + 4 meetings…",
  "Cross-referencing #product, #incidents…",
  "Proposing 3 priorities for review.",
];

const STATUSES = ["Ingesting", "Synthesizing", "Ready"];

// Priority that just received fresh input on each cycle (drives the coral
// "updating" indicator on the corresponding row).
const ACTIVE_PRIORITY = [0, 1, 2];

const CONTEXT_CHANNELS = [
  { Icon: Mail, label: "Inbox", count: "47 emails" },
  { Icon: MessageSquare, label: "Slack", count: "5 channels" },
  { Icon: Mic, label: "Meetings", count: "4 recordings" },
  { Icon: FileText, label: "Docs", count: "q2-roadmap.pdf" },
] as const;

type SourceChip = { Icon: typeof Mail; label: string };

const PRIORITIES: Array<{
  rank: string;
  title: string;
  why: string;
  sources: SourceChip[];
}> = [
  {
    rank: "P1",
    title: "Bulk export for the analytics dashboard",
    why: "Ops mentioned this 3× this week — board prep due in 8 days.",
    sources: [
      { Icon: Mail, label: "4 emails" },
      { Icon: MessageSquare, label: "#product" },
      { Icon: Mic, label: "1:1 w/ Sarah" },
    ],
  },
  {
    rank: "P2",
    title: "API rate-limit incident response",
    why: "Two customer escalations Mon–Tue. Engineering paged twice.",
    sources: [
      { Icon: Mail, label: "6 emails" },
      { Icon: MessageSquare, label: "#incidents" },
    ],
  },
  {
    rank: "P3",
    title: "Q2 roadmap revision",
    why: "Roadmap doc is stale. Three PMs asked at Tuesday standup.",
    sources: [
      { Icon: FileText, label: "q2-roadmap.pdf" },
      { Icon: Mic, label: "standup Tue" },
    ],
  },
];

const FEED_POOL: Array<{ t: string; s: string }> = [
  { t: "Listened to 1:1 with Sarah (32m)", s: "just now" },
  { t: "Synced 12 emails from this morning", s: "just now" },
  { t: "Cross-referenced #product, #analytics", s: "just now" },
  { t: "Joined Tuesday standup recording", s: "just now" },
  { t: "Updated P1 with new escalation email", s: "just now" },
  { t: "Observed reply patterns in #incidents", s: "just now" },
  { t: "Re-ranked P2 — 4th customer escalation", s: "just now" },
];

/** Typewriter that types `text` then idles. Returns the visible substring. */
function useTypewriter(text: string, durationMs: number, reduced: boolean) {
  const [out, setOut] = React.useState(reduced ? text : "");
  React.useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    setOut("");
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const chars = Math.floor(t * text.length);
      setOut(text.slice(0, chars));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs, reduced]);
  return out;
}

export function WorkspaceMockup() {
  const reduced = useReducedMotion() ?? false;
  const [cycle, setCycle] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setCycle(c => (c + 1) % TITLES.length), 6000);
    return () => clearInterval(id);
  }, [reduced]);

  const title = useTypewriter(TITLES[cycle]!, 1400, reduced);
  const status = STATUSES[cycle]!;
  const activePriority = ACTIVE_PRIORITY[cycle]!;

  // Active context channel — cycles every 2.4s through Inbox/Slack/Meetings/Docs.
  const [activeChannel, setActiveChannel] = React.useState(0);
  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setActiveChannel(c => (c + 1) % CONTEXT_CHANNELS.length),
      2400,
    );
    return () => clearInterval(id);
  }, [reduced]);

  // Confidence ticks up each cycle, then resets — feels like the agent
  // gaining certainty as it gathers context.
  const [confidence, setConfidence] = React.useState(87);
  React.useEffect(() => {
    if (reduced) {
      setConfidence(92);
      return;
    }
    setConfidence(87);
    let raf = 0;
    const start = performance.now();
    const target = 93;
    const baseline = 87;
    const dur = 5400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setConfidence(Math.round(baseline + (target - baseline) * t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cycle, reduced]);

  const [feed, setFeed] = React.useState<Array<{ id: number; t: string; s: string }>>(() => [
    { id: 0, t: "Identified 3 priorities for review", s: "just now" },
    { id: 1, t: "Joined Tuesday standup recording", s: "1 min ago" },
    { id: 2, t: "Synced 47 emails from this week", s: "2 min ago" },
  ]);

  React.useEffect(() => {
    if (reduced) return;
    let nextId = 100;
    let pick = 0;
    const id = setInterval(() => {
      const evt = FEED_POOL[pick % FEED_POOL.length]!;
      pick += 1;
      setFeed(prev => {
        const aged = prev.map((p, i) => ({
          ...p,
          s: i === 0 ? "just now" : i === 1 ? "1 min ago" : `${i + 1} min ago`,
        }));
        const next = [{ id: nextId++, t: evt.t, s: "just now" }, ...aged];
        return next.slice(0, 4);
      });
    }, 6000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div
      className={cn(
        "rounded-xl border border-paper-edge bg-white overflow-hidden",
        "shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)]",
        "transition-transform duration-[400ms] ease-out hover:scale-[1.005]",
        "[mask-image:linear-gradient(to_bottom,black_88%,transparent)]",
      )}
    >
      {/* Browser chrome */}
      <div className="h-10 bg-paper-hi border-b border-paper-edge flex items-center px-3.5 gap-2 relative">
        <span className="w-2.5 h-2.5 rounded-full bg-[#e07a5f]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e6c46a]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#a3b48a]" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[11px] text-ink-faint tracking-[0.02em] tabular-nums">
            aluqos.ai/work/alex
          </div>
        </div>
      </div>

      {/* Top toolbar */}
      <div className="h-12 border-b border-paper-edge flex items-center px-5 gap-4 bg-white">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full text-white grid place-items-center text-[11px] serif"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="serif text-[13px] text-ink">Alex</span>
            <span className="text-[9px] text-ink-faint uppercase tracking-[0.12em]">
              Product Manager
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="serif text-[14px] text-ink-muted">
            Your week · proposed priorities
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-paper-edge bg-paper-hi">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-coral pulse-coral" aria-hidden />
            <span className="relative w-1.5 h-1.5 rounded-full bg-coral" />
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="text-[10.5px] uppercase tracking-[0.1em] text-ink-muted"
            >
              {status}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 text-ink-faint">
          <Search className="w-3.5 h-3.5" />
          <Bell className="w-3.5 h-3.5" />
        </div>
      </div>

      <ProgressStrip reduced={reduced} />

      <div className="grid grid-cols-[180px_1fr_220px] h-[520px] bg-paper">
        {/* Left rail — simplified: identity + multi-channel context */}
        <aside className="border-r border-paper-edge bg-white p-4 flex flex-col gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-2">
              Context
            </div>
            <ul className="space-y-1 text-[11.5px] text-ink-muted">
              {CONTEXT_CHANNELS.map((c, i) => {
                const Icon = c.Icon;
                const active = i === activeChannel;
                return (
                  <li
                    key={c.label}
                    className={cn(
                      "flex items-center gap-2 rounded px-1.5 -mx-1.5 py-1.5 transition-colors duration-300",
                      active ? "bg-coral/10" : "",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-3 h-3 shrink-0",
                        active ? "text-coral" : "text-ink-faint",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-ink leading-tight">
                        {c.label}
                      </div>
                      <div className="text-[10px] text-ink-faint truncate">
                        {c.count}
                      </div>
                    </div>
                    {active && (
                      <span className="size-1 rounded-full bg-coral pulse-coral" />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-auto pt-3 border-t border-paper-edge">
            <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint mb-1.5">
              Last sync
            </div>
            <div className="text-[11px] text-ink-muted tabular-nums">
              2 min ago
            </div>
          </div>
        </aside>

        {/* Center surface — Priorities card */}
        <section className="p-6 overflow-hidden">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Sources", value: "12" },
              { label: "Themes", value: "3" },
              { label: "Confidence", value: `${confidence}%` },
            ].map(k => (
              <div
                key={k.label}
                className="bg-white border border-paper-edge rounded-md px-3 py-2.5"
              >
                <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {k.label}
                </div>
                <div className="serif text-[20px] text-ink tabular-nums leading-tight mt-0.5">
                  {k.value}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-paper-edge rounded-md overflow-hidden">
            <div className="px-4 py-2.5 bg-paper-hi border-b border-paper-edge flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-coral" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cycle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] uppercase tracking-[0.12em] text-ink-faint"
                  >
                    {title}
                    <span className="inline-block w-[2px] h-2.5 bg-coral align-middle ml-0.5 animate-pulse" />
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] text-ink-faint tabular-nums">2:14</span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <Serif as="h4" className="text-[16px] leading-tight">
                  Your top 3 priorities this week
                </Serif>
                <p className="text-[11.5px] text-ink-faint mt-1 italic-serif">
                  Synthesized from your inbox, Slack, meetings, and docs — no
                  instructions given.
                </p>
              </div>

              <div className="space-y-2">
                {PRIORITIES.map((p, i) => (
                  <PriorityRow
                    key={p.rank}
                    p={p}
                    active={i === activePriority}
                  />
                ))}
              </div>

              {/* Approval CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-paper-edge">
                <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  Awaiting approval
                </span>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded text-[11px] text-ink-muted border border-paper-edge bg-white">
                    Adjust
                  </span>
                  <span className="px-2.5 py-1 rounded text-[11px] text-paper bg-ink flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Approve all
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right rail — Activity (live) */}
        <aside className="border-l border-paper-edge bg-white p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Activity className="w-3 h-3 text-coral" />
            <span className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">
              Activity
            </span>
          </div>
          <ol className="space-y-3 relative">
            <AnimatePresence initial={false}>
              {feed.map((e, i) => (
                <motion.li
                  key={e.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex gap-2"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        "w-1.5 h-1.5 rounded-full mt-1 " +
                        (i === 0 ? "bg-coral" : "bg-paper-edge")
                      }
                    />
                    {i < feed.length - 1 && (
                      <span className="w-px flex-1 bg-paper-edge mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[11.5px] text-ink leading-tight">
                      {e.t}
                    </div>
                    <div className="text-[10px] text-ink-faint mt-0.5">
                      {e.s}
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </aside>
      </div>
    </div>
  );
}

function PriorityRow({
  p,
  active,
}: {
  p: (typeof PRIORITIES)[number];
  active: boolean;
}) {
  return (
    <motion.div
      animate={{
        backgroundColor: active ? "rgba(196,100,73,0.04)" : "rgba(196,100,73,0)",
      }}
      transition={{ duration: 0.4, ease: EASE }}
      className={cn(
        "relative pl-3 pr-3 py-2.5 -mx-1 rounded-md border-l-2 transition-colors duration-300",
        active ? "border-coral" : "border-transparent",
      )}
    >
      <div className="flex items-baseline gap-2 mb-1">
        <span className="serif text-[11px] text-coral-deep font-medium tracking-wider tabular-nums">
          {p.rank}
        </span>
        <span className="text-[13px] text-ink leading-tight flex-1">
          {p.title}
        </span>
        <AnimatePresence>
          {active && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-coral"
            >
              <span className="size-1 rounded-full bg-coral pulse-coral" />
              updating
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <p className="text-[11.5px] text-ink-muted leading-snug mb-2">{p.why}</p>
      <div className="flex flex-wrap gap-1.5">
        {p.sources.map((s, i) => {
          const Icon = s.Icon;
          return (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-paper-hi border border-paper-edge text-[9.5px] text-ink-faint"
            >
              <Icon className="w-2.5 h-2.5" />
              {s.label}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

function ProgressStrip({ reduced }: { reduced: boolean }) {
  const PILLS = 5;
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, [reduced]);

  const phase = (tick % 90) / 80;

  return (
    <div className="px-5 py-2.5 border-b border-paper-edge bg-white">
      <div className="flex items-center gap-2">
        {Array.from({ length: PILLS }).map((_, i) => {
          const active: number = reduced ? (i < 3 ? 1 : 0) : phase * PILLS - i;
          const fill = Math.max(0, Math.min(1, active));
          return (
            <div
              key={i}
              className="relative h-1 flex-1 rounded-full bg-paper-hi overflow-hidden"
            >
              <div
                className="absolute inset-y-0 left-0 bg-coral rounded-full"
                style={{ width: `${fill * 100}%`, transition: "width 0.1s linear" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}
