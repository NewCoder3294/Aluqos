"use client";

import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/src/components/ui/button";
import { Serif } from "@/src/components/serif";

const STORAGE_KEY = "aluqos.earlyAccessRequests";

type EarlyAccessRequest = {
  name: string;
  email: string;
  company: string;
  notes: string;
  submittedAt: string;
};

function persistRequest(req: EarlyAccessRequest) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: EarlyAccessRequest[] = raw ? JSON.parse(raw) : [];
    list.push(req);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently.
  }
}

export function EarlyAccessDialog({
  trigger,
  triggerLabel = "Request early access",
  triggerVariant = "ink",
  triggerSize = "lg",
}: {
  trigger?: ReactNode;
  triggerLabel?: string;
  triggerVariant?: "ink" | "outline" | "coral" | "quiet" | "ghost";
  triggerSize?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const open = () => {
    setSubmitted(false);
    ref.current?.showModal();
  };

  const close = () => ref.current?.close();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    persistRequest({
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      notes: String(fd.get("notes") ?? "").trim(),
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <>
      {trigger ? (
        <span onClick={open} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") open(); }} className="inline-flex">
          {trigger}
        </span>
      ) : (
        <Button type="button" variant={triggerVariant} size={triggerSize} onClick={open}>
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
          {submitted ? (
            <div className="text-center">
              <Serif as="h3" className="text-[26px] leading-tight">
                You&rsquo;re on the list.
              </Serif>
              <p className="mt-3 text-[14px] text-ink-muted max-w-[36ch] mx-auto">
                We review applications weekly. Expect to hear back within a few days.
              </p>
              <div className="mt-6">
                <Button type="button" variant="ink" size="md" onClick={close}>
                  Close
                </Button>
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

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <Field label="Name" name="name" required autoComplete="name" />
                <Field label="Work email" name="email" type="email" required autoComplete="email" />
                <Field label="Company" name="company" required autoComplete="organization" />
                <Field label="What would you put an AI employee on first?" name="notes" textarea />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="quiet" size="md" onClick={close}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="ink" size="md">
                    Submit
                  </Button>
                </div>
              </form>
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
