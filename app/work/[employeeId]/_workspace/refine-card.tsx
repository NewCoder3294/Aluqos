"use client";

import { useState } from "react";
import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import { persistPrdEdit } from "@/src/server/run-prd";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Sparkles } from "lucide-react";

const PRESETS = ["Add API spec", "Write engineering tickets", "Simplify", "Tighten scope"];

export function RefineCard() {
  const ws = useWorkspace();
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);

  async function refine(action: string) {
    if (!ws.prdId || busy) return;
    setBusy(true);
    ws.setStatus("drafting");

    const sections = ws.sections;
    const res = await fetch("/api/ai/refine", {
      method: "POST",
      body: JSON.stringify({ sections, action, voice_summary: undefined }),
    });
    const text = await res.text();
    const s = text.indexOf("{");
    const e = text.lastIndexOf("}");
    if (s < 0 || e < 0) {
      ws.finishStreaming();
      setBusy(false);
      return;
    }
    const parsed = JSON.parse(text.slice(s, e + 1)) as { section_key: PrdSectionKey; new_content: string };

    ws.setStreamingSection(parsed.section_key);
    useWorkspace.setState({ sections: { ...ws.sections, [parsed.section_key]: "" } });
    for (let i = 0; i < parsed.new_content.length; i += 4) {
      ws.appendSection(parsed.section_key, parsed.new_content.slice(i, i + 4));
      await new Promise(r => setTimeout(r, 14));
    }
    ws.finishStreaming();
    if (ws.prdId) await persistPrdEdit(ws.prdId, parsed.section_key, parsed.new_content);
    setBusy(false);
    setCustom("");
  }

  return (
    <Card tone="primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[14px]">
          <Sparkles className="size-3.5 text-coral-deep" />
          Refine
        </CardTitle>
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">
          Powered by Alex
        </span>
      </CardHeader>
      <CardContent compact className="space-y-3 !p-7">
        <div className="flex gap-1.5 flex-wrap">
          {PRESETS.map(p => (
            <Button
              key={p}
              variant="outline"
              size="chip"
              disabled={busy}
              onClick={() => refine(p)}
            >
              {p}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={custom}
            onChange={e => setCustom(e.target.value)}
            placeholder="Ask Alex to revise something specific…"
            className="flex-1 min-w-0 bg-white border border-paper-edge rounded px-3 py-2 text-[13px] focus:outline-none focus:border-coral focus:ring-2 focus:ring-coral/20"
            onKeyDown={e => {
              if (e.key === "Enter" && custom.trim()) refine(custom.trim());
            }}
          />
          <Button
            variant="ink"
            size="md"
            onClick={() => custom.trim() && refine(custom.trim())}
            disabled={busy || !custom.trim()}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
