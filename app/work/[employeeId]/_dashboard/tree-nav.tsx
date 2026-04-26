"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  LayoutDashboard,
  FileText,
  ListTodo,
  Calendar,
  Target,
  MessageSquare,
  BellRing,
  AlertTriangle,
  Megaphone,
  Mic,
  BarChart,
  FolderOpen,
  Activity,
} from "lucide-react";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";

export type ActiveNavKey =
  | "all-dashboard"
  | "all-files"
  | "all-activity"
  | "alex-dashboard"
  | "alex-prds"
  | "alex-backlog"
  | "alex-calendar"
  | "alex-goals"
  | "jordan-dashboard"
  | "jordan-standups"
  | "jordan-status"
  | "jordan-risks"
  | "sam-dashboard"
  | "sam-campaigns"
  | "sam-brand-voice"
  | "sam-performance";

type NavItem = {
  key: ActiveNavKey;
  label: string;
  icon: React.ReactNode;
  href: string;
};

type SectionId = "all" | "alex" | "jordan" | "sam";

type NavSection = {
  id: SectionId;
  label: string;
  /** Tailwind background class for the section dot indicator. Optional for global sections. */
  dotClass?: string;
  items: NavItem[];
};

const ICON_PROPS = { size: 14, strokeWidth: 1.75 };

function buildSections(employeeId: string): NavSection[] {
  return [
    {
      id: "all",
      label: "All · Overview",
      items: [
        { key: "all-dashboard", label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, href: `/work/${employeeId}/overview` },
        { key: "all-files", label: "Files", icon: <FolderOpen {...ICON_PROPS} />, href: `/work/${employeeId}/files` },
        { key: "all-activity", label: "Activity", icon: <Activity {...ICON_PROPS} />, href: `/work/${employeeId}/activity` },
      ],
    },
    {
      id: "alex",
      label: "Alex (PM)",
      dotClass: "bg-coral",
      items: [
        { key: "alex-dashboard", label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, href: `/work/${employeeId}` },
        { key: "alex-prds", label: "PRDs", icon: <FileText {...ICON_PROPS} />, href: `/work/${employeeId}/prds` },
        { key: "alex-backlog", label: "Backlog", icon: <ListTodo {...ICON_PROPS} />, href: `/work/${employeeId}/backlog` },
        { key: "alex-calendar", label: "Calendar", icon: <Calendar {...ICON_PROPS} />, href: `/work/${employeeId}/calendar` },
        { key: "alex-goals", label: "Goals", icon: <Target {...ICON_PROPS} />, href: `/work/${employeeId}/goals` },
      ],
    },
    {
      id: "jordan",
      label: "Jordan (PGM)",
      dotClass: "bg-[#5a4f3d]",
      items: [
        { key: "jordan-dashboard", label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, href: `/work/${employeeId}/jordan` },
        { key: "jordan-standups", label: "Standups", icon: <MessageSquare {...ICON_PROPS} />, href: `/work/${employeeId}/jordan/standups` },
        { key: "jordan-status", label: "Status updates", icon: <BellRing {...ICON_PROPS} />, href: `/work/${employeeId}/jordan/status` },
        { key: "jordan-risks", label: "Risks", icon: <AlertTriangle {...ICON_PROPS} />, href: `/work/${employeeId}/jordan/risks` },
      ],
    },
    {
      id: "sam",
      label: "Sam (Marketing)",
      dotClass: "bg-[#7a8b5c]",
      items: [
        { key: "sam-dashboard", label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, href: `/work/${employeeId}/sam` },
        { key: "sam-campaigns", label: "Campaigns", icon: <Megaphone {...ICON_PROPS} />, href: `/work/${employeeId}/sam/campaigns` },
        { key: "sam-brand-voice", label: "Brand voice", icon: <Mic {...ICON_PROPS} />, href: `/work/${employeeId}/sam/brand-voice` },
        { key: "sam-performance", label: "Performance", icon: <BarChart {...ICON_PROPS} />, href: `/work/${employeeId}/sam/performance` },
      ],
    },
  ];
}

export function TreeNav({
  employeeId,
  activeNav = "alex-dashboard",
}: {
  employeeId: string;
  activeNav?: ActiveNavKey;
}) {
  const sections = buildSections(employeeId);
  // Persistent expanded state — all sections start expanded and stay expanded
  // independent of which nav item is active. Chevron toggles only that section.
  const [open, setOpen] = useState<Record<SectionId, boolean>>(() => ({
    all: true,
    alex: true,
    jordan: true,
    sam: true,
  }));

  return (
    <aside className="w-[220px] shrink-0 bg-paper border-r border-paper-edge flex flex-col h-screen sticky top-0">
      <div className="px-5 pt-5 pb-4 shrink-0">
        <Link href={`/work/${employeeId}`} className="serif text-[18px] tracking-[-0.01em] text-ink hover:text-coral-deep">
          Aluqos
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2 min-h-0">
        {sections.map((section) => {
          const isOpen = open[section.id];
          return (
            <div key={section.id} className="mb-1.5">
              <button
                type="button"
                onClick={() => setOpen((s) => ({ ...s, [section.id]: !s[section.id] }))}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-sm hover:bg-paper-edge/40 transition-colors"
              >
                <ChevronRight
                  size={11}
                  strokeWidth={2}
                  className={cn(
                    "text-ink-faint transition-transform",
                    isOpen && "rotate-90",
                  )}
                />
                {section.dotClass ? (
                  <span className={cn("size-1.5 rounded-full shrink-0", section.dotClass)} />
                ) : (
                  <span className="size-1.5 shrink-0" aria-hidden />
                )}
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
                  {section.label}
                </span>
              </button>

              {isOpen && (
                <ul className="mt-0.5 ml-1.5 border-l border-paper-edge">
                  {section.items.map((item) => {
                    const isActive = item.key === activeNav;
                    return (
                      <li key={item.key}>
                        <Link href={item.href}>
                          <span
                            className={cn(
                              "flex items-center gap-2 px-2.5 py-1.5 ml-1 rounded-sm text-[13px] transition-colors",
                              isActive
                                ? "bg-coral/10 text-coral-deep"
                                : "text-ink-muted hover:bg-paper-edge/40 hover:text-ink",
                            )}
                          >
                            <span className={cn("shrink-0", isActive ? "text-coral-deep" : "text-ink-faint")}>
                              {item.icon}
                            </span>
                            <span className="truncate">{item.label}</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-paper-edge px-3 py-3 shrink-0 mt-auto">
        <button
          type="button"
          onClick={() => toast.info("Demo mode — sign out coming soon.")}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded-sm text-[13px] text-ink-faint hover:text-ink hover:bg-paper-edge/40 transition-colors"
        >
          <span>Sign out</span>
          <span className="text-ink-faint/70">↗</span>
        </button>
      </div>
    </aside>
  );
}
