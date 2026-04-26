"use client";

import { useState } from "react";
import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import { persistPrdEdit } from "@/src/server/run-prd";
import { Button } from "@/src/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { fakeNotionExport } from "@/src/fakes/notion-export";
import { JiraSendButton } from "@/src/fakes/jira-toast";
import { SlackSendButton } from "@/src/fakes/slack-modal";
import type { GeneratedPrd } from "@/src/ai/prompts/generate-prd";
import { Serif } from "@/src/components/serif";

const PRESETS = ["Add API spec", "Write engineering tickets", "Simplify", "Tighten scope"];
const KEYS: PrdSectionKey[] = ["problem", "goals", "user_stories", "scope", "out_of_scope", "success_metrics"];

export function ActionCard({ employeeId }: { employeeId: string }) {
  void employeeId;
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

  const onNotion = () => {
    const sections = Object.fromEntries(KEYS.map(k => [k, ws.sections[k] ?? ""])) as GeneratedPrd["sections"];
    fakeNotionExport({ title: ws.title || "Untitled PRD", sections });
  };

  return (
    <Card tone="primary">
      <CardHeader>
        <CardTitle>Take it further</CardTitle>
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full text-white grid place-items-center text-[10px]"
            style={{ background: "linear-gradient(135deg,#e07a5f,#c46449)" }}
          >
            <Serif>A</Serif>
          </div>
          <span className="text-[11px] text-[--color-ink-faint] uppercase tracking-[0.1em]">
            Powered by Alex
          </span>
        </div>
      </CardHeader>
      <CardContent compact>
        {/* Refine */}
        <div className="space-y-3">
          <div className="label">Refine</div>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map(p => (
              <Button key={p} variant="outline" size="chip" disabled={busy} onClick={() => refine(p)}>
                {p}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={custom}
              onChange={e => setCustom(e.target.value)}
              placeholder="Ask Alex to revise something specific…"
              className="flex-1 bg-white border border-[--color-paper-edge] rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[--color-coral]"
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
        </div>

        {/* hairline */}
        <div className="border-t border-[--color-paper-edge] my-5" />

        {/* Send */}
        <div className="space-y-3">
          <div className="label">Send to</div>
          <div className="flex gap-2 flex-wrap items-center">
            <Button variant="ink" size="md" onClick={onNotion}>
              Export to Notion
            </Button>
            <JiraSendButton label="Update Jira" />
            <SlackSendButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
