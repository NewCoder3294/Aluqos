"use client";

import { useState } from "react";
import { toast } from "@/src/components/toast";
import { Button } from "@/src/components/ui/button";

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
      <Button
        variant="outline"
        size="md"
        onClick={() => { setOpen(true); setStep("auth"); }}
        className="gap-2 text-sm normal-case tracking-normal"
      >
        <SlackGlyph /> Connect Slack
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-[440px] rounded-lg bg-white shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center gap-3">
              <SlackGlyph />
              <div className="text-[15px] font-medium">
                {step === "auth" ? "Authorize Aluqos" : "Choose a channel"}
              </div>
            </div>
            {step === "auth" && (
              <div className="p-5 text-[13.5px] text-stone-700 space-y-3">
                <p>Aluqos will be able to:</p>
                <ul className="list-disc pl-5 text-stone-600 space-y-1">
                  <li>View messages in channels Aluqos is added to</li>
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
              <Button
                variant="quiet"
                size="sm"
                onClick={() => setOpen(false)}
                className="text-sm normal-case tracking-normal text-stone-600"
              >
                Cancel
              </Button>
              {step === "auth" ? (
                <Button
                  variant="ink"
                  size="sm"
                  onClick={async () => {
                    setBusy(true);
                    await new Promise(r => setTimeout(r, 1500));
                    setBusy(false);
                    setStep("channels");
                  }}
                  disabled={busy}
                  className="!bg-[#4a154b] hover:!bg-[#3a1138] text-sm normal-case tracking-normal"
                >
                  {busy ? "Authorizing…" : "Allow"}
                </Button>
              ) : (
                <Button
                  variant="ink"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    toast.success(`Connected to ${picked}`, { icon: <SlackGlyph /> });
                    onConnected?.(picked);
                  }}
                  className="!bg-[#4a154b] hover:!bg-[#3a1138] text-sm normal-case tracking-normal"
                >
                  Use this channel
                </Button>
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
    <Button
      variant="outline"
      size="sm"
      onClick={() => toast.success(`Sent to ${channel}`, { icon: <SlackGlyph /> })}
      className="gap-1.5 text-xs normal-case tracking-normal hover:border-[#4a154b]"
    >
      <SlackGlyph /> Send to Slack
    </Button>
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
