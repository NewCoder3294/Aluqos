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
} from "lucide-react";
import { cn } from "@/src/lib/cn";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href?: string;
  comingSoon?: boolean;
};

type NavSection = {
  id: string;
  label: string;
  badge?: string;
  defaultOpen?: boolean;
  comingSoon?: boolean;
  items: NavItem[];
};

const ICON_PROPS = { size: 14, strokeWidth: 1.75 };

function buildSections(employeeId: string): NavSection[] {
  return [
    {
      id: "alex",
      label: "Alex (PM)",
      defaultOpen: true,
      items: [
        { label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, href: `/work/${employeeId}` },
        { label: "PRDs", icon: <FileText {...ICON_PROPS} /> },
        { label: "Backlog", icon: <ListTodo {...ICON_PROPS} /> },
        { label: "Calendar", icon: <Calendar {...ICON_PROPS} /> },
        { label: "Goals", icon: <Target {...ICON_PROPS} /> },
      ],
    },
    {
      id: "jordan",
      label: "Jordan (PGM)",
      comingSoon: true,
      items: [
        { label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, comingSoon: true },
        { label: "Standups", icon: <MessageSquare {...ICON_PROPS} />, comingSoon: true },
        { label: "Status updates", icon: <BellRing {...ICON_PROPS} />, comingSoon: true },
        { label: "Risks", icon: <AlertTriangle {...ICON_PROPS} />, comingSoon: true },
      ],
    },
    {
      id: "sam",
      label: "Sam (Marketing)",
      comingSoon: true,
      items: [
        { label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, comingSoon: true },
        { label: "Campaigns", icon: <Megaphone {...ICON_PROPS} />, comingSoon: true },
        { label: "Brand voice", icon: <Mic {...ICON_PROPS} />, comingSoon: true },
        { label: "Performance", icon: <BarChart {...ICON_PROPS} />, comingSoon: true },
      ],
    },
  ];
}

export function TreeNav({
  employeeId,
  activeKey = "Dashboard",
  activeSectionId = "alex",
}: {
  employeeId: string;
  activeKey?: string;
  activeSectionId?: string;
}) {
  const sections = buildSections(employeeId);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sections.map((s) => [s.id, s.defaultOpen ?? false])),
  );

  return (
    <aside className="w-[220px] shrink-0 h-full bg-paper border-r border-paper-edge flex flex-col">
      <div className="px-5 pt-5 pb-4">
        <Link href={`/work/${employeeId}`} className="serif text-[18px] tracking-[-0.01em] text-ink hover:text-coral-deep">
          Aluqos
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
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
                <span className="text-[10px] uppercase tracking-[0.14em] text-ink-faint font-medium">
                  {section.label}
                </span>
                {section.comingSoon && (
                  <span className="ml-auto text-[9px] uppercase tracking-[0.1em] text-ink-faint/70 italic">
                    soon
                  </span>
                )}
              </button>

              {isOpen && (
                <ul className="mt-0.5 ml-1.5 border-l border-paper-edge">
                  {section.items.map((item) => {
                    const isActive =
                      section.id === activeSectionId && item.label === activeKey && !item.comingSoon;
                    const inner = (
                      <span
                        className={cn(
                          "flex items-center gap-2 px-2.5 py-1.5 ml-1 rounded-sm text-[13px] transition-colors",
                          item.comingSoon
                            ? "text-ink-faint/60 cursor-not-allowed"
                            : isActive
                              ? "bg-coral/10 text-coral-deep"
                              : "text-ink-muted hover:bg-paper-edge/40 hover:text-ink",
                        )}
                      >
                        <span className={cn("shrink-0", isActive ? "text-coral-deep" : "text-ink-faint")}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                        {item.comingSoon && (
                          <span className="ml-auto text-[9px] uppercase tracking-[0.1em] text-ink-faint/60">
                            soon
                          </span>
                        )}
                      </span>
                    );
                    return (
                      <li key={item.label}>
                        {item.href && !item.comingSoon ? (
                          <Link href={item.href}>{inner}</Link>
                        ) : (
                          <span aria-disabled={item.comingSoon}>{inner}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-paper-edge px-3 py-3">
        <button
          type="button"
          className="w-full flex items-center justify-between px-2 py-1.5 rounded-sm text-[13px] text-ink-faint hover:text-ink hover:bg-paper-edge/40 transition-colors"
        >
          <span>Sign out</span>
          <span className="text-ink-faint/70">↗</span>
        </button>
      </div>
    </aside>
  );
}
