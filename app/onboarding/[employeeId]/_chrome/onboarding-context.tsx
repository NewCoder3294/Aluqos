"use client";

import { Serif } from "@/src/components/serif";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Badge } from "@/src/components/ui/badge";
import { useWalkthrough, type Phase } from "@/src/store/walkthrough";
import { Lightbulb } from "lucide-react";

const NEXT_PHASES: Record<Phase, Array<{ n: Phase; title: string; preview: string }>> = {
  1: [
    { n: 2, title: "Reading", preview: "I'll read your docs and reflect them back" },
    { n: 3, title: "Observe", preview: "5 questions about how you work" },
    { n: 4, title: "Plan", preview: "I'll show you what I'll own" },
  ],
  2: [
    { n: 3, title: "Observe", preview: "5 questions about how you work" },
    { n: 4, title: "Plan", preview: "I'll show you what I'll own" },
    { n: 5, title: "Approve", preview: "Your call on every line" },
  ],
  3: [
    { n: 4, title: "Plan", preview: "I'll show you what I'll own" },
    { n: 5, title: "Approve", preview: "Your call on every line" },
    { n: 6, title: "Begin", preview: "Getting started" },
  ],
  4: [
    { n: 5, title: "Approve", preview: "Your call on every line" },
    { n: 6, title: "Begin", preview: "Getting started" },
  ],
  5: [
    { n: 6, title: "Begin", preview: "Getting started" },
  ],
  6: [],
};

export function OnboardingContext({
  uploads,
}: {
  uploads: Array<{ id: string; filename: string }>;
}) {
  const phase = useWalkthrough(s => s.phase);
  const briefDraft = useWalkthrough(s => s.briefDraft);
  const understood = useWalkthrough(s => s.understoodDraft);

  const briefProject =
    typeof briefDraft.project === "string" ? (briefDraft.project as string) : "";
  const briefRole =
    typeof briefDraft.role === "string" ? (briefDraft.role as string) : "";
  const briefPriorities = Array.isArray(briefDraft.priorities)
    ? (briefDraft.priorities as string[])
    : [];

  const hasGathered = uploads.length > 0 || !!briefProject || !!understood;
  const next = NEXT_PHASES[phase] ?? [];

  return (
    <aside className="bg-[--color-paper-hi] border-l border-[--color-paper-edge] h-full overflow-y-auto flex flex-col">
      <Tabs defaultValue="gathered" className="flex flex-col h-full">
        <div className="px-3 pt-3">
          <Card tone="muted" className="overflow-visible">
            <CardHeader className="!px-3 !py-2">
              <TabsList className="border-b-0 -mx-1">
                <TabsTrigger value="gathered" count={uploads.length}>
                  Gathered
                </TabsTrigger>
                <TabsTrigger value="next" count={next.length}>
                  Coming next
                </TabsTrigger>
                <TabsTrigger value="tip">Tip</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent compact className="!p-3 space-y-3">
              <TabsContent value="gathered" className="space-y-3">
                {!hasGathered && (
                  <EmptyState>Nothing yet. Hand me your first doc.</EmptyState>
                )}

                {uploads.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint] font-medium">
                      Uploaded files
                    </div>
                    <ul className="space-y-1.5">
                      {uploads.map((u, idx) => {
                        const reading = phase === 2 && idx === uploads.length - 1;
                        return (
                          <li
                            key={u.id}
                            className="flex items-center gap-2 bg-white border border-[--color-paper-edge] rounded px-2 py-1.5 text-[12px]"
                          >
                            <FileGlyph />
                            <span className="flex-1 truncate text-[--color-ink]">
                              {u.filename}
                            </span>
                            <span
                              className={
                                "text-[9.5px] uppercase tracking-[0.1em] shrink-0 " +
                                (reading
                                  ? "text-[--color-coral-deep]"
                                  : "text-[--color-ink-faint]")
                              }
                            >
                              {reading ? "reading…" : "✓ read"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {(briefProject || briefRole || briefPriorities.length > 0) && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint] font-medium">
                      Brief snapshot
                    </div>
                    <div className="bg-white border border-[--color-paper-edge] rounded p-2.5 space-y-1.5 text-[12px]">
                      {briefProject && (
                        <BriefRow label="Project" value={briefProject} />
                      )}
                      {briefRole && <BriefRow label="Role" value={briefRole} />}
                      {briefPriorities.length > 0 && (
                        <BriefRow label="Top priority" value={briefPriorities[0] ?? ""} />
                      )}
                    </div>
                  </div>
                )}

                {understood && phase >= 3 && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-[--color-ink-faint] font-medium">
                      Voice
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="coral">Direct</Badge>
                      <Badge variant="coral">Punchy</Badge>
                      <Badge variant="outline">Numbers-first</Badge>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="next" className="space-y-2">
                {next.length === 0 ? (
                  <EmptyState>You&apos;re at the finish line.</EmptyState>
                ) : (
                  <ul className="space-y-1.5">
                    {next.map(p => (
                      <li
                        key={p.n}
                        className="bg-white border border-[--color-paper-edge] rounded px-2.5 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-[0.12em] text-[--color-ink-faint] font-medium tabular-nums">
                            Phase {p.n}
                          </span>
                          <Serif className="text-[13px] text-[--color-ink]">
                            {p.title}
                          </Serif>
                        </div>
                        <div className="text-[11.5px] text-[--color-ink-faint] mt-0.5 leading-snug">
                          {p.preview}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="tip">
                <div className="bg-white border border-[--color-paper-edge] rounded p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="size-3.5 text-[--color-coral]" />
                    <Serif italic className="text-[12px] text-[--color-ink-muted]">
                      First-day pro tip
                    </Serif>
                  </div>
                  <p className="text-[12.5px] leading-relaxed text-[--color-ink]">
                    Drop in a roadmap doc and a sample PRD — that&apos;s enough for me to
                    write like you. The more raw material I see, the closer my voice gets.
                  </p>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </aside>
  );
}

function BriefRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-[--color-ink-faint] shrink-0 w-[64px]">{label}</span>
      <span className="flex-1 text-[--color-ink] truncate">{value}</span>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11.5px] text-[--color-ink-faint] italic leading-relaxed bg-white/40 border border-dashed border-[--color-paper-edge] rounded px-3 py-3">
      {children}
    </div>
  );
}

function FileGlyph() {
  return (
    <svg
      width="11"
      height="13"
      viewBox="0 0 11 13"
      aria-hidden
      className="text-[--color-ink-faint] shrink-0"
    >
      <path
        d="M1 1h6l3 3v8H1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M7 1v3h3" fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
