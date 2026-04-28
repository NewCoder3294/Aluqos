"use client";

import {
  useActionState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";
import { joinWaitlist, type WaitlistResult } from "@/src/server/waitlist";
import { hireProductManager } from "@/src/server/hire";

export function EarlyAccessDialog({
  trigger,
  triggerLabel = "Request early access",
  triggerVariant = "ink",
  triggerSize = "lg",
  source = "landing",
}: {
  trigger?: ReactNode;
  triggerLabel?: string;
  triggerVariant?: "ink" | "outline" | "coral" | "quiet" | "ghost";
  triggerSize?: "sm" | "md" | "lg";
  /** Free-text source tag stored with the signup (e.g. "hero", "cta", "use-cases"). */
  source?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState<
    WaitlistResult | null,
    FormData
  >(joinWaitlist, null);

  // Close listener for cleanup; nothing to do today, but keeps the dialog
  // resilient if we add transitional state later.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => {};
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();

  const success =
    state?.status === "ok" || state?.status === "duplicate" ? state : null;

  return (
    <>
      {trigger ? (
        <span
          onClick={open}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") open();
          }}
          className="inline-flex"
        >
          {trigger}
        </span>
      ) : (
        <Button
          type="button"
          variant={triggerVariant}
          size={triggerSize}
          onClick={open}
        >
          {triggerLabel}
        </Button>
      )}

      <dialog
        ref={ref}
        className="m-auto rounded-lg border border-paper-edge bg-paper-hi p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === ref.current) close();
        }}
      >
        <div className="w-[min(94vw,520px)] p-8 lg:p-10">
          {success ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="size-1.5 rounded-full bg-coral pulse-coral" />
                <span className="text-[10px] uppercase tracking-[0.18em] text-coral-deep">
                  {success.status === "duplicate"
                    ? "Already on list"
                    : "You're in"}
                </span>
              </div>
              <Serif as="h3" className="text-[26px] leading-tight">
                {success.status === "duplicate"
                  ? "We already have you."
                  : "You're on the list."}
              </Serif>
              <p className="mt-3 text-[14px] text-ink-muted max-w-[42ch] mx-auto leading-snug">
                {success.status === "duplicate"
                  ? `You're #${success.position} — we'll email you the moment your AI employee is ready.`
                  : `You're #${success.position}. We onboard a small cohort each week. We'll email you when it's your turn.`}
              </p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <form action={hireProductManager}>
                  <Button type="submit" variant="outline" size="md">
                    See it work in the meantime →
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={close}
                  className="text-[12px] text-ink-faint hover:text-ink transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              <Serif as="h3" className="text-[24px] leading-tight">
                Request early access
              </Serif>
              <p className="mt-2 text-[13.5px] text-ink-muted">
                Tell us a bit about you. We onboard a few teams each week.
              </p>

              <form action={formAction} noValidate className="mt-6 space-y-4">
                <input type="hidden" name="source" value={source} />

                {/* Honeypot — hidden from humans, visible to bots */}
                <div
                  aria-hidden
                  className="absolute left-[-9999px] top-[-9999px] opacity-0"
                >
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>

                <Field label="Name" name="name" autoComplete="name" required />
                <Field
                  label="Work email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
                <Field
                  label="Company"
                  name="company"
                  autoComplete="organization"
                />
                <Field
                  label="What's the most repetitive thing on your team's plate?"
                  name="notes"
                  textarea
                />

                {state?.status === "error" && (
                  <div className="text-[12px] text-coral-deep">
                    {state.message}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="quiet"
                    size="md"
                    onClick={close}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="ink"
                    size="md"
                    disabled={isPending}
                  >
                    {isPending ? "Submitting…" : "Submit"}
                  </Button>
                </div>
              </form>

              {/* Sibling form so server actions don't nest */}
              <div className="mt-5 pt-5 border-t border-paper-edge text-center">
                <form action={hireProductManager}>
                  <button
                    type="submit"
                    className="text-[12px] text-ink-faint hover:text-coral-deep underline-offset-2 hover:underline transition-colors"
                  >
                    Or see it work right now →
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  textarea?: boolean;
}) {
  const cls =
    "mt-1.5 w-full rounded-md border border-paper-edge bg-white px-3 py-2 text-[14px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/30";
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        {label}
        {required ? <span className="text-coral-deep"> *</span> : null}
      </span>
      {textarea ? (
        <textarea name={name} rows={3} className={cls} />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={cls}
        />
      )}
    </label>
  );
}
