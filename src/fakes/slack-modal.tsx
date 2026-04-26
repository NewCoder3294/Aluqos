"use client";

import { useState } from "react";
import { toast } from "@/src/components/toast";

const CHANNELS = ["#product-feedback", "#design-review", "#general", "#eng-standup"];

export function SlackConnectButton({
  onConnected,
}: {
  onConnected?: (channel: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"auth" | "channels" | "done">("auth");
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState<string>("#product-feedback");

  return (
    <>
      <button
        onClick={() => { setOpen(true); setStep("auth"); }}
        className="px-4 py-2 rounded-md border border-[--color-paper-edge] bg-white text-sm hover:border-[--color-coral]"
      >
        <span className="inline-flex items-center gap-2"><SlackGlyph /> Connect Slack</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[440px] rounded-lg bg-white shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-3">
              <SlackGlyph />
              <div className="text-[15px] font-medium">
                {step === "auth" ? "Authorize Saathi" : "Choose a channel"}
              </div>
            </div>
            {step === "auth" && (
              <div className="p-5 text-[13.5px] text-stone-700 space-y-3">
                <p>Saathi will be able to:</p>
                <ul className="list-disc pl-5 text-stone-600 space-y-1">
                  <li>View messages in channels Saathi is added to</li>
                  <li>Post messages as Alex</li>
                </ul>
              </div>
            )}
            {step === "channels" && (
              <div className="p-5 space-y-2">
                {CHANNELS.map(c => (
                  <label key={c} className="flex items-center gap-2 text-[13.5px] cursor-pointer">
                    <input
                      type="radio"
                      name="ch"
                      checked={picked === c}
                      onChange={() => setPicked(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            )}
            <div className="px-5 py-3 bg-stone-50 flex justify-end gap-2 border-t border-stone-200">
              <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm text-stone-600">
                Cancel
              </button>
              {step === "auth" ? (
                <button
                  onClick={async () => {
                    setBusy(true);
                    await new Promise(r => setTimeout(r, 1500));
                    setBusy(false);
                    setStep("channels");
                  }}
                  disabled={busy}
                  className="px-3 py-1.5 text-sm rounded bg-[#4a154b] text-white disabled:opacity-60"
                >
                  {busy ? "Authorizing…" : "Allow"}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    toast.success(`Connected to ${picked}`, { icon: <SlackGlyph /> });
                    onConnected?.(picked);
                  }}
                  className="px-3 py-1.5 text-sm rounded bg-[#4a154b] text-white"
                >
                  Use this channel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function SlackSendButton({ channel = "#product-feedback" }: { channel?: string }) {
  return (
    <button
      onClick={() => toast.success(`Sent to ${channel}`, { icon: <SlackGlyph /> })}
      className="px-3 py-1.5 text-xs rounded border border-[--color-paper-edge] bg-white hover:border-[#4a154b]"
    >
      <span className="inline-flex items-center gap-1.5"><SlackGlyph /> Send to Slack</span>
    </button>
  );
}

function SlackGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path fill="#e01e5a" d="M5 15a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 0 1 4 0v5a2 2 0 1 1-4 0v-5z"/>
      <path fill="#36c5f0" d="M9 5a2 2 0 1 1 2-2v2H9zm0 1a2 2 0 0 1 0 4H4a2 2 0 1 1 0-4h5z"/>
      <path fill="#2eb67d" d="M19 9a2 2 0 1 1 2 2h-2V9zm-1 0a2 2 0 0 1-4 0V4a2 2 0 1 1 4 0v5z"/>
      <path fill="#ecb22e" d="M15 19a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 0 1 0-4h5a2 2 0 1 1 0 4h-5z"/>
    </svg>
  );
}
