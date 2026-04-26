"use client";

import { useEffect, useState } from "react";

export function TypewriterLine({
  text,
  speedMs = 18,
  onDone,
}: {
  text: string;
  speedMs?: number;
  onDone?: () => void;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setI(i + 1), speedMs);
    return () => clearTimeout(t);
  }, [i, text, speedMs, onDone]);
  return <span>{text.slice(0, i)}<span className="text-coral">▍</span></span>;
}
