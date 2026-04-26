import { Serif } from "@/src/components/serif";
import { Activity, Bell, FileText, Flag, Search, Sparkles } from "lucide-react";

// A faithful, decorative static rendering of the Saathi workspace.
// Pure JSX/Tailwind — no live components, no event handlers. Kept inside a
// pointer-events-none container by the caller so it reads as a screenshot.

export function WorkspaceMockup() {
  return (
    <div className="rounded-xl border border-[--color-paper-edge] bg-white overflow-hidden shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)]">
      {/* Browser chrome */}
      <div className="h-9 bg-[--color-paper-hi] border-b border-[--color-paper-edge] flex items-center px-3 gap-2 relative">
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
      <div className="h-11 border-b border-[--color-paper-edge] flex items-center px-4 gap-3 bg-white">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full text-white grid place-items-center text-[10px] serif"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            A
          </div>
          <div className="flex flex-col leading-tight">
            <span className="serif text-[12px] text-[--color-ink]">Alex</span>
            <span className="text-[9px] text-[--color-ink-faint] uppercase tracking-[0.12em]">
              Product Manager
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="serif text-[13px] text-[--color-ink-muted]">
            Bulk export for the analytics dashboard
          </span>
        </div>
        <div className="flex items-center gap-3 text-[--color-ink-faint]">
          <Search className="w-3.5 h-3.5" />
          <Bell className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Body: 3-column layout */}
      <div className="grid grid-cols-[150px_1fr_180px] h-[360px] bg-[--color-paper]">
        {/* Left rail */}
        <aside className="border-r border-[--color-paper-edge] bg-white p-3 flex flex-col gap-3">
          <div>
            <div className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-2">
              Phase
            </div>
            <ul className="space-y-1.5 text-[11px]">
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
            <div className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-2">
              Sources
            </div>
            <ul className="space-y-1.5 text-[10.5px] text-[--color-ink-muted]">
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
            </ul>
          </div>

          <div className="mt-auto border-t border-[--color-paper-edge] pt-3">
            <div className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint] mb-1.5">
              Plan
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] text-[--color-ink-muted]">
              <Flag className="w-3 h-3 text-[--color-coral]" />
              3 to own · 2 to assist
            </div>
          </div>
        </aside>

        {/* Center surface — PRD card */}
        <section className="p-5 overflow-hidden">
          {/* KPI strip */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: "Sources", value: "3" },
              { label: "Sections", value: "6" },
              { label: "Confidence", value: "92%" },
            ].map(k => (
              <div
                key={k.label}
                className="bg-white border border-[--color-paper-edge] rounded-md px-2.5 py-2"
              >
                <div className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
                  {k.label}
                </div>
                <div className="serif text-[16px] text-[--color-ink] tabular-nums leading-tight mt-0.5">
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
                <span className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
                  Drafting PRD
                </span>
              </div>
              <span className="text-[9px] text-[--color-ink-faint] tabular-nums">2:14</span>
            </div>
            <div className="p-4 space-y-2.5">
              <Serif as="h4" className="text-[15px] leading-tight">
                Bulk export for the analytics dashboard
              </Serif>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
                Problem
              </div>
              <p className="text-[11.5px] leading-relaxed text-[--color-ink-muted]">
                Ops users on enterprise plans regularly need to pull{" "}
                <span className="bg-[--color-coral]/10 px-0.5">90 days of</span>{" "}
                dashboard data for board prep. Today they screenshot panels one at
                a time.
              </p>
              <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint] pt-1">
                Proposed solution
              </div>
              <p className="text-[11.5px] leading-relaxed text-[--color-ink-muted]">
                Add a <span className="serif italic">Bulk export</span> action to
                the dashboard header. CSV + PDF, server-rendered, scoped to the
                current filter set
                <span className="inline-block w-[2px] h-3 bg-[--color-coral] align-middle ml-0.5 animate-pulse" />
              </p>
            </div>
          </div>
        </section>

        {/* Right rail — Activity */}
        <aside className="border-l border-[--color-paper-edge] bg-white p-3">
          <div className="flex items-center gap-1.5 mb-3">
            <Activity className="w-3 h-3 text-[--color-coral]" />
            <span className="text-[9px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
              Activity
            </span>
          </div>
          <ol className="space-y-3">
            {[
              { t: "Read q2-roadmap.pdf", s: "2 min ago" },
              { t: "Asked: who owns dashboards?", s: "1 min ago" },
              { t: "Drafted Problem section", s: "just now" },
            ].map((e, i) => (
              <li key={i} className="flex gap-2">
                <div className="flex flex-col items-center">
                  <span
                    className={
                      "w-1.5 h-1.5 rounded-full mt-1 " +
                      (i === 2 ? "bg-[--color-coral]" : "bg-[--color-paper-edge]")
                    }
                  />
                  {i < 2 && <span className="w-px flex-1 bg-[--color-paper-edge] mt-1" />}
                </div>
                <div className="flex-1">
                  <div className="text-[10.5px] text-[--color-ink] leading-tight">
                    {e.t}
                  </div>
                  <div className="text-[9px] text-[--color-ink-faint] mt-0.5">
                    {e.s}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
