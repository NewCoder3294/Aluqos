"use client";

import { Button } from "@/src/components/ui/button";
import { toast } from "@/src/components/toast";
import { Bell, ChevronRight, Search, Settings } from "lucide-react";

export function TopToolbar({
  employeeName,
  centerLabel,
}: {
  employeeName: string;
  centerLabel: string;
}) {
  return (
    <header className="h-14 shrink-0 px-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-[--color-paper-hi] border-b border-[--color-paper-edge]">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[12px] text-[--color-ink-faint] min-w-0 font-sans"
      >
        <span className="truncate">Saathi</span>
        <ChevronRight className="size-3 shrink-0 text-[--color-paper-edge]" />
        <span className="truncate text-[--color-ink-muted]">{employeeName}</span>
        <ChevronRight className="size-3 shrink-0 text-[--color-paper-edge]" />
        <span className="truncate text-[--color-ink]">{centerLabel}</span>
      </nav>

      {/* Command palette trigger */}
      <button
        type="button"
        onClick={() => toast.info("Coming soon")}
        className="group flex items-center gap-2 w-[420px] max-w-[44vw] h-8 px-3 bg-[--color-paper-hi] border border-[--color-paper-edge] rounded-md text-[12.5px] text-[--color-ink-faint] hover:border-[--color-coral]/50 hover:bg-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-coral]/40"
        aria-label="Search or run a command"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 text-left truncate">Search or run a command…</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white border border-[--color-paper-edge] text-[10px] text-[--color-ink-faint] font-sans tracking-normal">
          <span className="text-[11px] leading-none">⌘</span>
          <span>K</span>
        </kbd>
      </button>

      {/* Action icons */}
      <div className="flex items-center justify-end gap-0.5">
        <IconBtn label="Search" onClick={() => toast.info("Coming soon")}>
          <Search className="size-4" />
        </IconBtn>
        <IconBtn label="Notifications" onClick={() => toast.info("Coming soon")}>
          <Bell className="size-4" />
        </IconBtn>
        <IconBtn label="Settings" onClick={() => toast.info("Coming soon")}>
          <Settings className="size-4" />
        </IconBtn>
      </div>
    </header>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={onClick}
      className="size-8 rounded-md"
    >
      {children}
    </Button>
  );
}
