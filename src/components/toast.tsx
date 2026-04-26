"use client";

import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--color-paper-hi)",
          border: "1px solid var(--color-paper-edge)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-sans)",
          fontSize: "13px",
          boxShadow: "0 4px 18px rgba(31, 29, 26, 0.10)",
        },
      }}
    />
  );
}

export const toast = {
  success: (msg: string, opts?: { description?: string; icon?: React.ReactNode }) =>
    sonnerToast.success(msg, opts),
  info: (msg: string, opts?: { description?: string }) => sonnerToast.message(msg, opts),
  error: (msg: string) => sonnerToast.error(msg),
};
