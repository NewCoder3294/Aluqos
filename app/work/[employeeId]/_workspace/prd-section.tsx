"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h3 className="serif text-[14px] uppercase tracking-[0.14em] text-[--color-coral-deep]">
          {LABELS[sectionKey] ?? sectionKey}
        </h3>
        {!streaming && !editing && (
          <button onClick={() => setEditing(true)} className="label cursor-pointer">edit</button>
        )}
        {editing && (
          <button onClick={() => setEditing(false)} className="label cursor-pointer">done</button>
        )}
      </div>
      {editing ? (
        <EditorContent editor={editor} className="serif text-[15px] leading-[1.65] prose prose-stone max-w-none" />
      ) : (
        <p className="serif text-[15px] leading-[1.65] whitespace-pre-wrap">
          {text}
          {streaming && <span className="text-[--color-coral]">▍</span>}
        </p>
      )}
    </div>
  );
}
