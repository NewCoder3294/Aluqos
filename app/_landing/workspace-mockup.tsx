"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Serif } from "@/src/components/serif";
import { Activity, Bell, FileText, Flag, Search, Sparkles } from "lucide-react";
import { EASE } from "./motion-primitives";

// A faithful, decorative rendering of the Saathi workspace with subtle live
// motion. Wrapped by the caller in pointer-events-none so it reads as a
// screenshot — the motion is purely visual.

const TITLES = [
  "Drafting Issue #47 PRD…",
  "Refining the goals section…",
  "Adding API spec to scope…",
];

const STATUSES = [
  "Drafting PRD",
  "Refining goals",
  "Adding API spec",
];

const FEED_POOL: Array<{ t: string; s: string }> = [
  { t: "Drafted goals section", s: "just now" },
  { t: "Read q2-roadmap.pdf", s: "just now" },
  { t: "Asked: who owns dashboards?", s: "just now" },
  { t: "Pulled issue-47 from GitHub", s: "just now" },
  { t: "Cross-referenced slack-#analytics", s: "just now" },
  { t: "Drafted API spec table", s: "just now" },
  { t: "Linked design doc v3", s: "just now" },
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

  // Cycle the typewriter / status pill every 6s.
  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setCycle(c => (c + 1) % TITLES.length), 6000);
    return () => clearInterval(id);
  }, [reduced]);

  const title = useTypewriter(TITLES[cycle]!, 1400, reduced);
  const status = STATUSES[cycle]!;

  // Activity feed — prepend a new event every 6s; cap at 4 visible.
  const [feed, setFeed] = React.useState<Array<{ id: number; t: string; s: string }>>(() => [
    { id: 0, t: "Drafted Problem section", s: "just now" },
    { id: 1, t: "Asked: who owns dashboards?", s: "1 min ago" },
    { id: 2, t: "Read q2-roadmap.pdf", s: "2 min ago" },
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
        "rounded-xl border border-[--color-paper-edge] bg-white overflow-hidden",
        "shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)]",
        // Subtle hover scale — pure CSS, never noticeable but adds life.
        "transition-transform duration-[400ms] ease-out hover:scale-[1.005]",
        // Fade-out at the bottom so the mockup feels like an emergent surface.
        "[mask-image:linear-gradient(to_bottom,black_88%,transparent)]",
      )}
    >
      {/* Browser chrome */}
      <div className="h-10 bg-[--color-paper-hi] border-b border-[--color-paper-edge] flex items-center px-3.5 gap-2 relative">
        <span className="w-2.5 h-2.5 rounded-full bg-[#e07a5f]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#e6c46a]" aria-hidden />
        <span className="w-2.5 h-2.5 rounded-full bg-[#a3b48a]" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[11px] text-[--color-ink-faint] tracking-[0.02em] tabular-nums">
            saathi.ai/work/alex
          </div>
        </div>
      </div>

      {/* Top toolbar */}
      <div className="h-12 border-b border-[--color-paper-edge] flex items-center px-5 gap-4 bg-white">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full text-white grid place-items-center text-[11px] serif"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="serif text-[13px] text-[--color-ink]">Alex</span>
            <span className="text-[9px] text-[--color-ink-faint] uppercase tracking-[0.12em]">
              Product Manager
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <span className="serif text-[14px] text-[--color-ink-muted]">
            Bulk export for the analytics dashboard
          </span>
        </div>

        {/* Status pill — reflects the typewriter cycle */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[--color-paper-edge] bg-[--color-paper-hi]">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-[--color-coral] pulse-coral" aria-hidden />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[--color-coral]" />
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={status}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="text-[10.5px] uppercase tracking-[0.1em] text-[--color-ink-muted]"
            >
              {status}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 text-[--color-ink-faint]">
          <Search className="w-3.5 h-3.5" />
          <Bell className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Section progress strip — pills fill left to right over ~8s */}
      <ProgressStrip reduced={reduced} />

      {/* Body: 3-column layout — taller for the new bigger hero */}
      <div className="grid grid-cols-[180px_1fr_220px] h-[520px] bg-[--color-paper]">
        {/* Left rail */}
        <aside className="border-r border-[--color-paper-edge] bg-white p-4 flex flex-col gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-2">
              Phase
            </div>
            <ul className="space-y-2 text-[12px]">
              <li className="flex items-center gap-2 text-[--color-ink-faint]">
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-paper-edge]" />
                Brief
              </li>
              <li className="flex items-center gap-2 text-[--color-ink-faint]">
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-paper-edge]" />
                Reading
              </li>
              <li className="flex items-center gap-2 text-[--color-ink]">
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-coral]" />
                <span className="serif">Drafting</span>
              </li>
              <li className="flex items-center gap-2 text-[--color-ink-faint]">
                <span className="w-1.5 h-1.5 rounded-full bg-[--color-paper-edge]" />
                Review
              </li>
            </ul>
          </div>

          <div className="border-t border-[--color-paper-edge] pt-3">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-2">
              Sources
            </div>
            <ul className="space-y-2 text-[11.5px] text-[--color-ink-muted]">
              <li className="flex items-center gap-1.5 truncate">
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">q2-roadmap.pdf</span>
              </li>
              <li className="flex items-center gap-1.5 truncate">
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">issue-47.json</span>
              </li>
              <li className="flex items-center gap-1.5 truncate">
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">slack-#analytics</span>
              </li>
              <li className="flex items-center gap-1.5 truncate">
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">design-doc-v3</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto border-t border-[--color-paper-edge] pt-3">
            <div className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-1.5">
              Plan
            </div>
            <div className="flex items-center gap-1.5 text-[11.5px] text-[--color-ink-muted]">
              <Flag className="w-3 h-3 text-[--color-coral]" />3 to own &middot; 2 to assist
            </div>
          </div>
        </aside>

        {/* Center surface — PRD card */}
        <section className="p-6 overflow-hidden">
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Sources", value: "4" },
              { label: "Sections", value: "6" },
              { label: "Confidence", value: "92%" },
            ].map(k => (
              <div
                key={k.label}
                className="bg-white border border-[--color-paper-edge] rounded-md px-3 py-2.5"
              >
                <div className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
                  {k.label}
                </div>
                <div className="serif text-[20px] text-[--color-ink] tabular-nums leading-tight mt-0.5">
                  {k.value}
                </div>
              </div>
            ))}
          </div>

          {/* PRD card */}
          <div className="bg-white border border-[--color-paper-edge] rounded-md overflow-hidden">
            <div className="px-4 py-2.5 bg-[--color-paper-hi] border-b border-[--color-paper-edge] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[--color-coral]" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={cycle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint]"
                  >
                    {title}
                    <span className="inline-block w-[2px] h-2.5 bg-[--color-coral] align-middle ml-0.5 animate-pulse" />
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[10px] text-[--color-ink-faint] tabular-nums">2:14</span>
            </div>
            <div className="p-5 space-y-3">
              <Serif as="h4" className="text-[18px] leading-tight">
                Bulk export for the analytics dashboard
              </Serif>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
                Problem
              </div>
              <p className="text-[12.5px] leading-relaxed text-[--color-ink-muted]">
                Ops users on enterprise plans regularly need to pull{" "}
                <span className="bg-[--color-coral]/10 px-0.5">90 days of</span>{" "}
                dashboard data for board prep. Today they screenshot panels one at
                a time.
              </p>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint] pt-1">
                Proposed solution
              </div>
              <p className="text-[12.5px] leading-relaxed text-[--color-ink-muted]">
                Add a <span className="serif italic">Bulk export</span> action to
                the dashboard header. CSV + PDF, server-rendered, scoped to the
                current filter set.
              </p>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint] pt-1">
                Goals
              </div>
              <ul className="space-y-1.5 text-[12.5px] leading-relaxed text-[--color-ink-muted]">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[--color-coral] mt-2 shrink-0" />
                  Reduce board-prep time from 4 hours to under 15 minutes.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[--color-coral] mt-2 shrink-0" />
                  Server-side rendering so exports match the live dashboard.
                  <span className="inline-block w-[2px] h-3 bg-[--color-coral] align-middle ml-0.5 animate-pulse" />
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Right rail — Activity (live) */}
        <aside className="border-l border-[--color-paper-edge] bg-white p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Activity className="w-3 h-3 text-[--color-coral]" />
            <span className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
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
                        (i === 0 ? "bg-[--color-coral]" : "bg-[--color-paper-edge]")
                      }
                    />
                    {i < feed.length - 1 && (
                      <span className="w-px flex-1 bg-[--color-paper-edge] mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[11.5px] text-[--color-ink] leading-tight">
                      {e.t}
                    </div>
                    <div className="text-[10px] text-[--color-ink-faint] mt-0.5">
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

function ProgressStrip({ reduced }: { reduced: boolean }) {
  // 5 pills filling left-to-right over an 8s loop, then briefly reset.
  const PILLS = 5;
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setTick(t => t + 1), 100);
    return () => clearInterval(id);
  }, [reduced]);

  // Phase 0..1 across 8s. After full, briefly hold, then reset.
  const phase = (tick % 90) / 80; // 0..1.125; >1 means "all full + hold"

  return (
    <div className="px-5 py-2.5 border-b border-[--color-paper-edge] bg-white">
      <div className="flex items-center gap-2">
        {Array.from({ length: PILLS }).map((_, i) => {
          // Each pill activates at phase >= i / PILLS
          const active: number = reduced ? (i < 3 ? 1 : 0) : phase * PILLS - i;
          const fill = Math.max(0, Math.min(1, active));
          return (
            <div
              key={i}
              className="relative h-1 flex-1 rounded-full bg-[--color-paper-hi] overflow-hidden"
            >
              <div
                className="absolute inset-y-0 left-0 bg-[--color-coral] rounded-full"
                style={{ width: `${fill * 100}%`, transition: "width 0.1s linear" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Local cn — kept tiny to avoid a circular import path.
function cn(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}
