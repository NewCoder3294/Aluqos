"use client";

import { useWorkspace, type PrdSectionKey } from "@/src/store/workspace";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { fakeNotionExport } from "@/src/fakes/notion-export";
import { fakeJiraCreate } from "@/src/fakes/jira-toast";
import { toast } from "@/src/components/toast";
import type { GeneratedPrd } from "@/src/ai/prompts/generate-prd";
import { ArrowUpRight, Send } from "lucide-react";

const KEYS: PrdSectionKey[] = ["problem", "goals", "user_stories", "scope", "out_of_scope", "success_metrics"];

type Destination = {
  id: "notion" | "jira" | "slack";
  name: string;
  glyph: React.ReactNode;
  context: string;
  sub: string;
  onSend: (title: string, sections: GeneratedPrd["sections"]) => void;
};

const DESTINATIONS: Destination[] = [
  {
    id: "notion",
    name: "Notion",
    glyph: <NotionGlyph />,
    context: "Aluqos PRDs database",
    sub: "last sent: never",
    onSend: (title, sections) => fakeNotionExport({ title, sections }),
  },
  {
    id: "jira",
    name: "Jira",
    glyph: <JiraGlyph />,
    context: "ENG · Engineering backlog",
    sub: "last sent: never",
    onSend: () => {
      try {
        fakeJiraCreate("ENG");
      } catch {
        // fakeJiraCreate handles its own UI; swallow to keep the demo resilient
      }
    },
  },
  {
    id: "slack",
    name: "Slack",
    glyph: <SlackGlyph />,
    context: "Send to #product-feedback",
    sub: "last sent: never",
    onSend: () => {
      toast.success("Sent to #product-feedback");
    },
  },
];

export function SendCard() {
  const ws = useWorkspace();

  const handleSend = (dest: Destination) => {
    const sections = Object.fromEntries(
      KEYS.map(k => [k, ws.sections[k] ?? ""]),
    ) as GeneratedPrd["sections"];
    const title = ws.title || "Untitled PRD";
    dest.onSend(title, sections);
  };

  return (
    <Card tone="default">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[14px]">
          <Send className="size-3.5 text-[--color-coral-deep]" />
          Send
        </CardTitle>
        <span className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint]">
          Mock destinations
        </span>
      </CardHeader>
      <CardContent compact className="space-y-2 !p-3">
        {DESTINATIONS.map(d => (
          <Button
            key={d.id}
            type="button"
            variant="outline"
            size="md"
            onClick={() => handleSend(d)}
            className="group w-full justify-start gap-3 px-3 py-2.5 rounded-md normal-case tracking-normal h-auto hover:border-[--color-coral]/60 hover:bg-[--color-paper-hi]/30"
          >
            <span className="size-7 rounded-md bg-[--color-paper-hi] border border-[--color-paper-edge] grid place-items-center shrink-0 group-hover:bg-white">
              {d.glyph}
            </span>
            <span className="flex-1 min-w-0 text-left">
              <span className="block text-[13px] text-[--color-ink] leading-tight truncate">
                {d.name}
              </span>
              <span className="block text-[11px] text-[--color-ink-faint] leading-tight mt-0.5 truncate">
                {d.context}
              </span>
            </span>
            <span className="flex items-center gap-1 text-[10.5px] uppercase tracking-[0.1em] text-[--color-ink-faint] shrink-0">
              {d.sub}
              <ArrowUpRight className="size-3" />
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function NotionGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#1f1d1a"
        d="M4.5 4.7C4 5 4 5.5 4 6v12c0 .6 0 1 .5 1.4l13 .8c.7 0 1-.3 1-1.1V8.3c0-.4-.1-.7-.4-.9L7 4.5c-.7-.1-1.5 0-2 .2zm10.4 4.7v8.4c0 .3-.1.4-.4.3l-3.7-.2c-.2 0-.3-.2-.3-.4V8.7l4 .5c.3 0 .4.2.4.5z"
      />
    </svg>
  );
}

function JiraGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0052cc" aria-hidden>
      <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zM17.363 5.736H5.785a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.218 5.218 0 0 0 18.363 18.22V6.74a1.005 1.005 0 0 0-1-1.004zM23.155 0H11.577a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.218 5.218 0 0 0 24.156 12.49V1.005A1.005 1.005 0 0 0 23.155 0z" />
    </svg>
  );
}

function SlackGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#E01E5A"
        d="M5.04 15.16a2.52 2.52 0 1 1-2.52-2.52h2.52v2.52zm1.27 0a2.52 2.52 0 0 1 5.04 0v6.32a2.52 2.52 0 1 1-5.04 0v-6.32z"
      />
      <path
        fill="#36C5F0"
        d="M8.83 5.04a2.52 2.52 0 1 1 2.52-2.52v2.52H8.83zm0 1.27a2.52 2.52 0 0 1 0 5.04H2.52a2.52 2.52 0 1 1 0-5.04h6.31z"
      />
      <path
        fill="#2EB67D"
        d="M18.96 8.83a2.52 2.52 0 1 1 2.52 2.52h-2.52V8.83zm-1.27 0a2.52 2.52 0 0 1-5.04 0V2.52a2.52 2.52 0 1 1 5.04 0v6.31z"
      />
      <path
        fill="#ECB22E"
        d="M15.16 18.96a2.52 2.52 0 1 1-2.52 2.52v-2.52h2.52zm0-1.27a2.52 2.52 0 0 1 0-5.04h6.32a2.52 2.52 0 1 1 0 5.04h-6.32z"
      />
    </svg>
  );
}
