import { cn } from "@/src/lib/cn";
import { Avatar } from "./avatar";
import type { AlexStatus } from "@/src/workflows/projections";

// The dashboard's hero greeting. Avatar + name + the one-sentence "what
// I'm doing right now" line. The breathing dot fires only when Alex has
// active work in flight (a pending or mid-cancel-window draft).

export function AlexStatusCard({
  greetingName,
  status,
}: {
  greetingName: string;
  status: AlexStatus;
}) {
  const greetingHour = new Date().getHours();
  const partOfDay =
    greetingHour < 5 ? "Up early" :
    greetingHour < 12 ? "Good morning" :
    greetingHour < 17 ? "Good afternoon" :
    greetingHour < 21 ? "Good evening" : "Late one";

  return (
    <section className="alex-fade-up flex items-start gap-5 rounded-xl bg-white border border-paper-edge px-7 py-6 shadow-[0_2px_8px_rgba(31,29,26,0.04)]">
      <Avatar name="Alex" initials="A" size="lg" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint font-medium">
            Alex · Product Manager
          </span>
          {status.tone === "live" && (
            <span
              className="alex-breathe size-1.5 rounded-full bg-coral"
              title="Alex has active work in flight"
              aria-label="Active"
            />
          )}
        </div>
        <h1 className="serif text-[26px] tracking-[-0.02em] text-ink leading-tight">
          {partOfDay}, {greetingName}.
        </h1>
        <p
          className={cn(
            "mt-1.5 text-[14px] leading-relaxed",
            status.tone === "live" ? "text-ink" : "text-ink-muted",
          )}
        >
          {status.line}
        </p>
      </div>
    </section>
  );
}
