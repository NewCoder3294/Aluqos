"use client";

import { Mic, Check, Clock, FileText, Hash } from "lucide-react";
import { Serif } from "@/src/components/serif";

// Headline candidates for the meetings panel (kept for the team to pick):
//   A. "Your AI showed up to your 9am."                                       ← chosen
//   B. "It joined the meeting. Took notes. Drafted the follow-up. You approved once."
//   C. "Meet the AI that earns its seat in your team's calendar."
// We picked A because it's the shortest concrete-moment hook — names the
// time, names the act, lets the subhead carry the outcome without the
// reader having to parse a comma-string of verbs.

function MeetingMockup() {
  // Stylized "meeting" mockup. Two action items pinned live; sidebar shows
  // "3 actions queued for your approval." Same design vocabulary as the
  // OBSERVING / PROPOSED / AUTONOMY cards in how.tsx.
  return (
    <div className="rounded-2xl border border-paper-edge bg-white shadow-[0_24px_60px_-30px_rgba(31,29,26,0.25)] overflow-hidden">
      {/* Header: meeting title + live recording indicator */}
      <div className="px-5 py-3.5 border-b border-paper-edge flex items-center justify-between gap-3 bg-paper-hi/40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-coral text-white grid place-items-center shrink-0">
            <Mic className="w-3.5 h-3.5" aria-hidden />
          </div>
          <div className="min-w-0">
            <div className="serif text-[14px] text-ink leading-tight truncate">
              Product standup · Tuesday
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint mt-0.5">
              4 attendees · 24 min
            </div>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-coral-deep">
          <span className="size-1.5 rounded-full bg-coral pulse-coral" aria-hidden />
          Recording · live
        </span>
      </div>

      {/* Body: two-column layout — transcript pulse + approval sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-0">
        {/* Action items column */}
        <div className="px-5 py-5 border-b lg:border-b-0 lg:border-r border-paper-edge">
          <div className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint mb-3">
            Pinned live by Aluqos
          </div>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2.5 px-3 py-2.5 rounded-md bg-paper-hi/60 border border-paper-edge">
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-coral-deep" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] leading-snug text-ink">
                  Action item · Nick to confirm Q3 launch date with legal
                </div>
                <div className="text-[10.5px] text-ink-faint mt-0.5">
                  flagged at 12:04 · linked to Linear #PRD-219
                </div>
              </div>
            </li>
            <li className="flex items-start gap-2.5 px-3 py-2.5 rounded-md bg-paper-hi/60 border border-paper-edge">
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-coral-deep" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] leading-snug text-ink">
                  Decision · ship bulk-export to ops-only this sprint
                </div>
                <div className="text-[10.5px] text-ink-faint mt-0.5">
                  flagged at 18:21 · 3 stakeholders to notify
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Approval sidebar */}
        <div className="px-5 py-5 bg-paper-hi/30">
          <div className="text-[10.5px] uppercase tracking-[0.12em] text-coral-deep mb-3 flex items-center gap-1.5">
            <Clock className="w-3 h-3" aria-hidden />
            3 actions · queued for your approval
          </div>
          <ul className="space-y-2">
            <ApprovalRow icon={<FileText className="w-3.5 h-3.5" aria-hidden />} title="Draft follow-up email" sub="to 3 stakeholders" />
            <ApprovalRow icon={<Hash className="w-3.5 h-3.5" aria-hidden />} title="Post recap to #product" sub="thread linked" />
            <ApprovalRow icon={<FileText className="w-3.5 h-3.5" aria-hidden />} title="Update PRD #219" sub="2 sections affected" />
          </ul>
          <button
            type="button"
            className="mt-4 w-full text-[12px] uppercase tracking-[0.12em] py-2 rounded-md bg-ink text-paper hover:bg-ink-muted transition-colors"
          >
            Approve all
          </button>
        </div>
      </div>
    </div>
  );
}

function ApprovalRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <li className="flex items-center gap-2.5 px-3 py-2 rounded-md bg-white border border-paper-edge">
      <span className="w-6 h-6 rounded-full bg-coral/10 text-coral-deep grid place-items-center shrink-0">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] text-ink leading-snug truncate">{title}</div>
        <div className="text-[10.5px] text-ink-faint truncate">{sub}</div>
      </div>
    </li>
  );
}

export function LandingMeetings() {
  return (
    <section
      id="meetings"
      aria-labelledby="meetings-heading"
      className="relative max-w-[1280px] mx-auto px-6 py-16 lg:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center">
        {/* Copy column */}
        <div>
          <div className="text-[12px] tracking-[0.14em] uppercase text-coral-deep font-medium">
            Tuesday morning
          </div>
          <h2
            id="meetings-heading"
            className="serif mt-4 text-[clamp(32px,4.4vw,52px)] leading-[1.1] tracking-[-0.02em] max-w-[18ch]"
          >
            Your AI showed up to{" "}
            <span className="italic-serif text-coral-deep">your 9am.</span>
          </h2>
          <p className="mt-5 text-[16px] lg:text-[17px] leading-[1.6] text-ink-muted max-w-[48ch]">
            You&rsquo;re running standup. Aluqos is in the call. By the time you
            close your laptop, your action items are tracked, your PRD draft is
            queued, and three workflows are waiting for one click of approval.
          </p>
          <p className="mt-4 italic-serif text-[16px] leading-[1.5] text-ink max-w-[44ch]">
            The same brain that watched the meeting is the one writing the automations.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              // TODO(nicolas): swap href to the recorded Loom walkthrough.
              href="#meetings"
              className="inline-flex items-center gap-1.5 rounded-md border border-paper-edge bg-white px-4 py-2.5 text-[13px] font-medium text-ink hover:border-coral/40 hover:text-coral-deep transition-colors"
            >
              See it in a 3-minute walkthrough →
            </a>
          </div>
        </div>

        {/* Mockup column */}
        <div>
          <MeetingMockup />
          <div className="mt-4 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint flex items-center gap-2">
            <Serif className="text-coral text-[12px]">Fig. 02</Serif>
            <span>Live notes + queued approvals from a real PM standup. Names redacted.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
