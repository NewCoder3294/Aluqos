"use client";

import { useEffect } from "react";
import { X, FileText, FileType2, Image as ImageIcon, Mic } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { AGENTS } from "./data/overview";
import type { FileNode } from "./data/files";

function renderInline(text: string): React.ReactNode {
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/;
  const out: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length) {
    const m = rest.match(re);
    if (!m || m.index === undefined) {
      out.push(rest);
      break;
    }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    if (m[2]) out.push(<strong key={key++} className="font-medium text-ink">{m[2]}</strong>);
    else if (m[3]) out.push(<em key={key++} className="italic">{m[3]}</em>);
    else if (m[4]) out.push(<code key={key++} className="px-1 py-0.5 rounded bg-paper-hi text-[12.5px] font-mono">{m[4]}</code>);
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

function renderMarkdownish(body: string): React.ReactNode {
  const lines = body.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^#{1,3}\s/.test(line)) {
      const m = line.match(/^(#{1,3})\s+(.*)$/)!;
      const level = m[1].length;
      const text = m[2];
      const cls =
        level === 1
          ? "serif text-[26px] tracking-[-0.01em] text-ink mt-0 mb-3"
          : level === 2
          ? "serif text-[19px] tracking-[-0.005em] text-ink mt-6 mb-2"
          : "serif text-[15px] text-ink mt-5 mb-1.5 font-medium";
      blocks.push(
        level === 1 ? (
          <h1 key={i} className={cls}>{text}</h1>
        ) : level === 2 ? (
          <h2 key={i} className={cls}>{text}</h2>
        ) : (
          <h3 key={i} className={cls}>{text}</h3>
        ),
      );
      i++;
      continue;
    }
    if (/^\s*-?\s*\[\s*[xX ]?\s*\]\s/.test(line)) {
      const items: { checked: boolean; text: string }[] = [];
      while (i < lines.length && /^\s*-?\s*\[\s*[xX ]?\s*\]\s/.test(lines[i])) {
        const m = lines[i].match(/\[\s*([xX ]?)\s*\]\s+(.*)$/)!;
        items.push({ checked: m[1].toLowerCase() === "x", text: m[2] });
        i++;
      }
      blocks.push(
        <ul key={`tl-${i}`} className="space-y-1 my-3 text-[14px] text-ink leading-[1.6]">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span
                aria-hidden
                className={cn(
                  "mt-[5px] size-[14px] shrink-0 rounded-sm border",
                  it.checked ? "bg-ink border-ink" : "bg-white border-paper-edge",
                )}
              />
              <span className={cn(it.checked && "line-through text-ink-faint")}>
                {renderInline(it.text)}
              </span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\s*[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1 my-3 text-[14px] text-ink leading-[1.6]">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^#{1,3}\s/.test(lines[i]) && !/^\s*[-*]\s/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`p-${i}`} className="text-[14px] text-ink leading-[1.65] my-3">
        {renderInline(para.join(" "))}
      </p>,
    );
  }
  return blocks;
}

export function FilePreviewSheet({
  file,
  onClose,
}: {
  file: FileNode | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [file, onClose]);

  if (!file) return null;

  const ownerLabel = file.owner === "mixed" ? "Shared" : AGENTS[file.owner].name;
  const ownerGradient =
    file.owner === "mixed" ? "bg-paper-edge" : AGENTS[file.owner].avatarGradient;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cursor-default"
      />

      <aside
        role="dialog"
        aria-label={`Preview of ${file.name}`}
        className="absolute right-0 top-0 h-full w-full sm:w-[640px] lg:w-[760px] bg-paper border-l border-paper-edge shadow-[-8px_0_24px_rgba(31,29,26,0.08)] flex flex-col"
      >
        <header className="shrink-0 flex items-center gap-3 px-6 py-4 border-b border-paper-edge bg-paper">
          <div className="shrink-0 size-9 rounded-md bg-paper-hi border border-paper-edge flex items-center justify-center">
            {file.type === "md" ? (
              <FileText size={18} strokeWidth={1.5} className="text-ink-muted" />
            ) : file.type === "pdf" ? (
              <FileType2 size={18} strokeWidth={1.5} className="text-ink-muted" />
            ) : file.type === "image" ? (
              <ImageIcon size={18} strokeWidth={1.5} className="text-ink-muted" />
            ) : (
              <Mic size={18} strokeWidth={1.5} className="text-ink-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-medium text-ink truncate">{file.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={cn(
                  "size-3.5 rounded-full flex items-center justify-center",
                  ownerGradient,
                )}
                aria-hidden
              >
                <span className="size-1.5 rounded-full bg-white/55" />
              </span>
              <span className="text-[11.5px] text-ink-faint">
                {ownerLabel} · {file.modified}
                {file.size ? ` · ${file.size}` : ""}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md p-1.5 text-ink-faint hover:text-ink hover:bg-paper-hi transition-colors"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {file.type === "md" && file.preview ? (
            <article className="max-w-[720px] mx-auto px-8 py-8">
              {renderMarkdownish(file.preview)}
            </article>
          ) : file.type === "md" ? (
            <div className="px-8 py-10 text-ink-faint text-[14px]">
              No preview content captured for this file yet.
            </div>
          ) : file.type === "pdf" ? (
            <div className="px-8 py-8">
              <div className="max-w-[640px] mx-auto bg-white border border-paper-edge rounded-md shadow-[0_2px_12px_rgba(31,29,26,0.06)] aspect-[8.5/11] flex flex-col p-10 gap-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  PDF preview
                </div>
                <div className="serif text-[24px] tracking-[-0.01em] text-ink leading-tight">
                  {file.name.replace(/\.pdf$/, "")}
                </div>
                <div className="h-px bg-paper-edge w-16 my-2" />
                <div className="space-y-2">
                  <div className="h-2 bg-paper-edge/60 rounded w-[88%]" />
                  <div className="h-2 bg-paper-edge/60 rounded w-[94%]" />
                  <div className="h-2 bg-paper-edge/60 rounded w-[72%]" />
                  <div className="h-2 bg-paper-edge/60 rounded w-[90%]" />
                  <div className="h-2 bg-paper-edge/60 rounded w-[60%]" />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-paper-hi rounded h-24" />
                  <div className="bg-paper-hi rounded h-24" />
                </div>
                <div className="mt-auto text-[10.5px] uppercase tracking-[0.18em] text-ink-faint">
                  Page 1 · preview
                </div>
              </div>
            </div>
          ) : file.type === "image" ? (
            <div className="px-8 py-8">
              <div className="max-w-[640px] mx-auto aspect-[4/3] rounded-md bg-gradient-to-br from-coral/30 via-paper-edge to-[#9aa97a]/30 border border-paper-edge flex items-center justify-center text-ink-faint text-[12px]">
                Image preview
              </div>
            </div>
          ) : file.type === "audio" ? (
            <div className="px-8 py-10">
              <div className="max-w-[640px] mx-auto bg-white border border-paper-edge rounded-md p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-coral text-white flex items-center justify-center">
                    <Mic size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[14px] font-medium text-ink">{file.name}</div>
                    <div className="text-[11.5px] text-ink-faint">{file.size}</div>
                  </div>
                </div>
                <div className="flex items-end gap-[2px] h-16">
                  {Array.from({ length: 80 }).map((_, idx) => {
                    const h = 20 + Math.abs(Math.sin(idx * 0.7) * 60);
                    return (
                      <span
                        key={idx}
                        className="flex-1 bg-paper-edge rounded-sm"
                        style={{ height: `${h}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-faint tabular-nums">
                  <span>00:00</span>
                  <span>—:—</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
