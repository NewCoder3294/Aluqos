"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List as ListIcon,
  Folder,
  FileText,
  Mic,
  Image as ImageIcon,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";
import { AGENTS, type AgentId } from "./data/overview";
import {
  ROOT_ENTRIES,
  FOLDER_CONTENTS,
  type FileNode,
  type FileType,
} from "./data/files";
import { FilePreviewSheet } from "./file-preview-sheet";

type ViewMode = "grid" | "list";

function iconFor(type: FileType) {
  const props = { size: 28, strokeWidth: 1.5 };
  switch (type) {
    case "folder":
      return <Folder {...props} className="text-coral-deep" />;
    case "audio":
      return <Mic {...props} className="text-ink-muted" />;
    case "image":
      return <ImageIcon {...props} className="text-ink-muted" />;
    case "pdf":
    case "md":
    default:
      return <FileText {...props} className="text-ink-muted" />;
  }
}

function ownerGradient(owner: AgentId | "mixed"): string {
  if (owner === "mixed") return "bg-paper-edge";
  return AGENTS[owner].avatarGradient;
}

function ownerLabel(owner: AgentId | "mixed"): string {
  if (owner === "mixed") return "Shared";
  return AGENTS[owner].name;
}

export function FileGrid({
  initialPath,
}: {
  initialPath?: string;
}) {
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [path, setPath] = useState<string | null>(initialPath ?? null);
  const [preview, setPreview] = useState<FileNode | null>(null);

  const entries = useMemo<FileNode[]>(() => {
    const base = path ? FOLDER_CONTENTS[path] ?? [] : ROOT_ENTRIES;
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter((e) => e.name.toLowerCase().includes(q));
  }, [path, query]);

  const handleItemClick = (item: FileNode) => {
    if (item.type === "folder" && item.slug) {
      setPath(item.slug);
      return;
    }
    setPreview(item);
  };

  return (
    <div className="space-y-5">
      {/* Top bar: search + new */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search files…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-paper-edge rounded-md pl-9 pr-3 py-2.5 text-[14px] text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-coral focus-visible:ring-2 focus-visible:ring-coral/20"
          />
        </div>
        <Button
          variant="ink"
          size="md"
          onClick={() => toast.info("New file/folder — coming soon.")}
        >
          <Plus size={14} strokeWidth={2} />
          <span>New</span>
        </Button>
      </div>

      {/* Breadcrumb + view toggle */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-1.5 text-[13px]">
          <button
            type="button"
            onClick={() => setPath(null)}
            className={cn(
              "transition-colors",
              path ? "text-ink-faint hover:text-ink" : "text-ink font-medium",
            )}
          >
            My files
          </button>
          {path && (
            <>
              <ChevronRight size={12} className="text-ink-faint" aria-hidden />
              <span className="text-ink font-medium">{path}</span>
            </>
          )}
        </nav>

        <div className="inline-flex border border-paper-edge rounded-sm overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={cn(
              "px-2.5 py-1.5 transition-colors",
              view === "grid"
                ? "bg-paper-hi text-ink"
                : "text-ink-faint hover:bg-paper-hi/60 hover:text-ink",
            )}
          >
            <LayoutGrid size={14} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-label="List view"
            className={cn(
              "px-2.5 py-1.5 transition-colors border-l border-paper-edge",
              view === "list"
                ? "bg-paper-hi text-ink"
                : "text-ink-faint hover:bg-paper-hi/60 hover:text-ink",
            )}
          >
            <ListIcon size={14} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center text-ink-faint text-[14px] py-10">
              No files match &ldquo;{query}&rdquo;.
            </div>
          </CardContent>
        </Card>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {entries.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className="group bg-white border border-paper-edge rounded-md p-4 text-left transition-all hover:bg-paper-hi/40 hover:shadow-[0_2px_8px_rgba(31,29,26,0.06)] hover:border-coral/30"
            >
              <div className="mb-3">{iconFor(item.type)}</div>
              <div className="text-[14px] font-medium text-ink truncate">{item.name}</div>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className={cn(
                    "size-4 rounded-full flex items-center justify-center shrink-0",
                    ownerGradient(item.owner),
                  )}
                  aria-hidden
                >
                  <span className="size-1.5 rounded-full bg-white/55" />
                </span>
                <span className="text-[11.5px] text-ink-faint truncate">
                  {ownerLabel(item.owner)} · {item.modified}
                </span>
              </div>
              {item.type === "folder" && item.itemCount !== undefined && (
                <div className="text-[11px] text-ink-faint/80 mt-1">
                  {item.itemCount} item{item.itemCount === 1 ? "" : "s"}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : view === "list" ? (
        <Card>
          <CardContent compact className="p-0">
            <div className="grid grid-cols-[1fr_120px_120px_100px] px-5 py-2.5 text-[10.5px] uppercase tracking-[0.12em] text-ink-faint font-medium border-b border-paper-edge bg-paper-hi/40">
              <span>Name</span>
              <span>Owner</span>
              <span>Modified</span>
              <span className="text-right">Size</span>
            </div>
            <ul>
              {entries.map((item, idx) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "grid grid-cols-[1fr_120px_120px_100px] items-center px-5 py-3 w-full text-left transition-colors hover:bg-paper-hi/40",
                      idx !== entries.length - 1 && "border-b border-paper-edge",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="shrink-0">
                        {item.type === "folder" ? (
                          <Folder size={18} strokeWidth={1.5} className="text-coral-deep" />
                        ) : item.type === "audio" ? (
                          <Mic size={18} strokeWidth={1.5} className="text-ink-muted" />
                        ) : item.type === "image" ? (
                          <ImageIcon size={18} strokeWidth={1.5} className="text-ink-muted" />
                        ) : (
                          <FileText size={18} strokeWidth={1.5} className="text-ink-muted" />
                        )}
                      </span>
                      <span className="text-[13.5px] text-ink truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className={cn(
                          "size-4 rounded-full flex items-center justify-center shrink-0",
                          ownerGradient(item.owner),
                        )}
                        aria-hidden
                      >
                        <span className="size-1.5 rounded-full bg-white/55" />
                      </span>
                      <span className="text-[12px] text-ink-faint truncate">
                        {ownerLabel(item.owner)}
                      </span>
                    </div>
                    <span className="text-[12px] text-ink-faint">{item.modified}</span>
                    <span className="text-[12px] text-ink-faint text-right tabular-nums">
                      {item.size ?? (item.itemCount !== undefined ? `${item.itemCount} items` : "—")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      <FilePreviewSheet file={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
