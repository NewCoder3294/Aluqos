"use client";

import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import { fakeNotionExport } from "@/src/fakes/notion-export";
import { JiraSendButton } from "@/src/fakes/jira-toast";
import { SlackSendButton } from "@/src/fakes/slack-modal";
import { Button } from "@/src/components/ui/button";
import type { GeneratedPrd } from "@/src/ai/prompts/generate-prd";

const KEYS: PrdSectionKey[] = ["problem","goals","user_stories","scope","out_of_scope","success_metrics"];

export function ExportRow() {
  const ws = useWorkspace();
  const onNotion = () => {
    const sections = Object.fromEntries(KEYS.map(k => [k, ws.sections[k] ?? ""])) as GeneratedPrd["sections"];
    fakeNotionExport({ title: ws.title || "Untitled PRD", sections });
  };
  return (
    <div className="flex gap-2 pt-4 border-t border-[--color-paper-edge] mt-6 items-center">
      <Button variant="ink" size="md" onClick={onNotion}>
        Export to Notion
      </Button>
      <JiraSendButton label="Update Jira" />
      <SlackSendButton />
    </div>
  );
}
