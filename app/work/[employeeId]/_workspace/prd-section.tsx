"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

const LABELS: Record<string, string> = {
  problem: "Problem statement",
  goals: "Goals",
  user_stories: "User stories",
  scope: "Scope",
  out_of_scope: "Out of scope",
  success_metrics: "Success metrics",
};

export function PrdSection({
  sectionKey,
  text,
  streaming,
  onCommit,
}: {
  sectionKey: string;
  text: string;
  streaming: boolean;
  onCommit: (newText: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit],
    content: text,
    editable: editing,
    immediatelyRender: false,
    onBlur: ({ editor }) => onCommit(editor.getText()),
  }, [editing]);

  useEffect(() => {
    if (!editing && editor && text !== editor.getText()) {
      editor.commands.setContent(text);
    }
  }, [text, editor, editing]);

  const isEmpty = text.trim().length === 0;
  const showSkeleton = streaming && isEmpty;
  const showPreStream = !streaming && isEmpty;
  const showEdit = !streaming && !isEmpty;

  return (
    <Card tone="default">
      <CardHeader>
        <h3 className="serif text-[12px] uppercase tracking-[0.14em] text-coral-deep">
          {LABELS[sectionKey] ?? sectionKey}
        </h3>
        {streaming ? (
          <Badge variant="coral">
            <span className="w-[6px] h-[6px] rounded-full bg-coral pulse-coral" />
            Streaming
          </Badge>
        ) : editing ? (
          <Button variant="quiet" size="sm" onClick={() => setEditing(false)}>
            Done
          </Button>
        ) : showEdit ? (
          <Button variant="quiet" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        ) : (
          <Badge variant="outline">Pending</Badge>
        )}
      </CardHeader>
      <CardContent compact className="!p-7">
        {showSkeleton ? (
          <div className="space-y-2 py-1" aria-label="Loading section content">
            <div className="h-3 rounded w-full bg-gradient-to-r from-paper-hi via-paper-edge/40 to-paper-hi animate-pulse" />
            <div className="h-3 rounded w-[92%] bg-gradient-to-r from-paper-hi via-paper-edge/40 to-paper-hi animate-pulse" />
            <div className="h-3 rounded w-[78%] bg-gradient-to-r from-paper-hi via-paper-edge/40 to-paper-hi animate-pulse" />
            <div className="h-3 rounded w-[64%] bg-gradient-to-r from-paper-hi via-paper-edge/40 to-paper-hi animate-pulse" />
          </div>
        ) : showPreStream ? (
          <div className="text-[12px] text-ink-faint italic py-1">
            Alex will draft this once the previous section settles…
          </div>
        ) : editing ? (
          <EditorContent
            editor={editor}
            className="serif text-[15px] leading-[1.65] prose prose-stone max-w-none"
          />
        ) : (
          <p className="serif text-[15px] leading-[1.65] whitespace-pre-wrap text-ink">
            {text}
            {streaming && <span className="text-coral">▍</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
