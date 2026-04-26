"use client";

import { useState } from "react";
import { toast } from "@/src/components/toast";

export function GithubConnectButton({
  onConnected,
  preset = "nicolasdossantos/saathi-mvp",
}: {
  onConnected?: (repo: string) => void;
  preset?: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-md border border-[--color-paper-edge] bg-white text-sm text-[--color-ink] hover:border-[--color-coral]"
      >
        <span className="inline-flex items-center gap-2">
          <GithubGlyph /> Connect GitHub
        </span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[420px] rounded-lg bg-white shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-3">
              <GithubGlyph />
              <div className="text-[15px] font-medium">Authorize Saathi</div>
            </div>
            <div className="p-5 text-[13.5px] text-stone-700 space-y-3">
              <p>Saathi by <strong>nicolasdossantos</strong> wants to access your repositories.</p>
              <ul className="list-disc pl-5 text-stone-600 space-y-1">
                <li>Read repository contents</li>
                <li>Read issues</li>
                <li>Read pull requests</li>
              </ul>
            </div>
            <div className="px-5 py-3 bg-stone-50 flex justify-end gap-2 border-t border-stone-200">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-sm text-stone-600"
                disabled={busy}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setBusy(true);
                  await new Promise(r => setTimeout(r, 1800));
                  setBusy(false);
                  setOpen(false);
                  toast.success(`Connected to ${preset}`, { icon: <GithubGlyph /> });
                  onConnected?.(preset);
                }}
                className="px-3 py-1.5 text-sm rounded bg-[#1f883d] text-white disabled:opacity-60"
                disabled={busy}
              >
                {busy ? "Authorizing…" : "Authorize Saathi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GithubGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 .2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2.2.5-2.7-1-2.7-1-.4-.9-.9-1.2-.9-1.2-.7-.5.1-.5.1-.5.8.1 1.2.8 1.2.8.7 1.2 1.9.9 2.4.7.1-.5.3-.9.5-1.1-1.7-.2-3.6-.9-3.6-3.9 0-.9.3-1.6.8-2.2-.1-.2-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.6 7.6 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.6.8 1.3.8 2.2 0 3-1.9 3.7-3.6 3.9.3.3.6.8.6 1.6v2.4c0 .2.1.5.5.4A8 8 0 0 0 8 .2z"/>
    </svg>
  );
}
