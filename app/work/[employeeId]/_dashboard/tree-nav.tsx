"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  LayoutDashboard,
  FileText,
  ListTodo,
  Calendar,
  Target,
  FolderOpen,
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "@/src/lib/cn";
import { toast } from "@/src/components/toast";

const STORAGE_KEY = "aluqos-sidebar-collapsed";

export type ActiveNavKey =
  | "all-dashboard"
  | "all-files"
  | "all-activity"
  | "alex-dashboard"
  | "alex-prds"
  | "alex-backlog"
  | "alex-calendar"
  | "alex-goals"
  | "alex-settings"
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

type SectionId = "all" | "alex" | "jordan" | "sam"; // jordan/sam kept for type compat with existing routes; not rendered.

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
        { key: "alex-settings", label: "Settings", icon: <Settings {...ICON_PROPS} />, href: `/work/${employeeId}/settings` },
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
  const [open, setOpen] = useState<Record<SectionId, boolean>>(() => ({
    all: true,
    alex: true,
    jordan: false,
    sam: false,
  }));

  // Collapsed state — persisted across navigations via localStorage.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "shrink-0 bg-[#ebe2d0] border-r border-[#d9c9a8] flex flex-col h-screen sticky top-0",
        "shadow-[inset_-1px_0_0_rgba(0,0,0,0.02)]",
        "transition-[width] duration-200 ease-out",
        collapsed ? "w-[60px]" : "w-[220px]",
      )}
    >
      {/* Brand row + collapse toggle */}
      <div
        className={cn(
          "shrink-0 flex items-center pt-4 pb-3",
          collapsed ? "px-3 justify-center" : "px-5 justify-between",
        )}
      >
        {!collapsed && (
          <Link
            href={`/work/${employeeId}`}
            className="serif text-[18px] tracking-[-0.01em] text-ink hover:text-coral-deep"
          >
            Aluqos
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1 rounded-sm text-ink-faint hover:text-ink hover:bg-paper-edge/50 transition-colors"
        >
          {collapsed ? (
            <PanelLeftOpen size={15} strokeWidth={1.75} />
          ) : (
            <PanelLeftClose size={15} strokeWidth={1.75} />
          )}
        </button>
      </div>

      <nav
        className={cn(
          "flex-1 overflow-y-auto pb-2 min-h-0",
          collapsed ? "px-1.5" : "px-2",
        )}
      >
        {sections.map((section) => {
          const isOpen = open[section.id];
          return (
            <div key={section.id} className={cn(collapsed ? "mb-3" : "mb-1.5")}>
              {collapsed ? (
                // Collapsed: thin divider above each section (skip for first)
                section.id !== "all" && (
                  <div className="my-2 mx-2 h-px bg-[#d9c9a8]/60" aria-hidden />
                )
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setOpen((s) => ({ ...s, [section.id]: !s[section.id] }))
                  }
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
                    <span
                      className={cn(
                        "size-1.5 rounded-full shrink-0",
                        section.dotClass,
                      )}
                    />
                  ) : (
                    <span className="size-1.5 shrink-0" aria-hidden />
                  )}
                  <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
                    {section.label}
                  </span>
                </button>
              )}

              {(collapsed || isOpen) && (
                <ul
                  className={cn(
                    collapsed
                      ? "flex flex-col items-stretch gap-0.5"
                      : "mt-0.5 ml-1.5 border-l border-paper-edge",
                  )}
                >
                  {section.items.map((item) => {
                    const isActive = item.key === activeNav;
                    return (
                      <li key={item.key}>
                        <Link href={item.href}>
                          <span
                            title={collapsed ? item.label : undefined}
                            className={cn(
                              "flex items-center rounded-sm transition-colors",
                              collapsed
                                ? "justify-center py-2 mx-1"
                                : "gap-2 px-2.5 py-1.5 ml-1 text-[13px]",
                              isActive
                                ? "bg-coral/10 text-coral-deep"
                                : "text-ink-muted hover:bg-paper-edge/40 hover:text-ink",
                            )}
                          >
                            <span
                              className={cn(
                                "shrink-0",
                                isActive ? "text-coral-deep" : "text-ink-faint",
                              )}
                            >
                              {item.icon}
                            </span>
                            {!collapsed && (
                              <span className="truncate">{item.label}</span>
                            )}
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

      <div
        className={cn(
          "border-t border-paper-edge shrink-0 mt-auto",
          collapsed ? "px-1.5 py-2" : "px-3 py-3",
        )}
      >
        <button
          type="button"
          onClick={() => toast.info("Demo mode — sign out coming soon.")}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "w-full flex items-center rounded-sm text-ink-faint hover:text-ink hover:bg-paper-edge/40 transition-colors",
            collapsed
              ? "justify-center py-2"
              : "justify-between px-2 py-1.5 text-[13px]",
          )}
        >
          {collapsed ? (
            <LogOut size={15} strokeWidth={1.75} />
          ) : (
            <>
              <span>Sign out</span>
              <span className="text-ink-faint/70">↗</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
