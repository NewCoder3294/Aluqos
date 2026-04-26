"use client";

import { useRef, useState } from "react";
import { Button } from "@/src/components/ui/button";

export function VoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks.current = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = e => chunks.current.push(e.data);
    rec.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", new File([blob], "voice.webm", { type: "audio/webm" }));
      const res = await fetch("/api/voice", { method: "POST", body: fd });
      const { text } = await res.json();
      if (text) onTranscript(text);
      stream.getTracks().forEach(t => t.stop());
    };
    rec.start();
    mediaRef.current = rec;
    setRecording(true);
  }
  function stop() {
    mediaRef.current?.stop();
    setRecording(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={recording ? stop : start}
      title={recording ? "Stop recording" : "Speak instead"}
      aria-label={recording ? "Stop recording" : "Speak instead"}
      aria-pressed={recording}
      className={
        recording
          ? "bg-[--color-coral] border-[--color-coral] hover:bg-[--color-coral] hover:border-[--color-coral]"
          : ""
      }
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={recording ? "#fff" : "currentColor"} strokeWidth="2"><path d="M12 19v3M8 22h8"/><rect x="9" y="3" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/></svg>
    </Button>
  );
}
