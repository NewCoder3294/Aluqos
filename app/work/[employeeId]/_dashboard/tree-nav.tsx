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
import { toast } from "@/src/components/toast";

export type ActiveNavKey =
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
  /** Soft-coming-soon: still navigates, but shows the "soon" tag in the nav. */
  comingSoonLabel?: boolean;
};

type NavSection = {
  id: "alex" | "jordan" | "sam";
  label: string;
  /** Tailwind background class for the section dot indicator. */
  dotClass: string;
  defaultOpen?: boolean;
  items: NavItem[];
};

const ICON_PROPS = { size: 14, strokeWidth: 1.75 };

function buildSections(employeeId: string): NavSection[] {
  return [
    {
      id: "alex",
      label: "Alex (PM)",
      dotClass: "bg-coral",
      defaultOpen: true,
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
        { key: "jordan-standups", label: "Standups", icon: <MessageSquare {...ICON_PROPS} />, href: `/work/${employeeId}/jordan/standups`, comingSoonLabel: true },
        { key: "jordan-status", label: "Status updates", icon: <BellRing {...ICON_PROPS} />, href: `/work/${employeeId}/jordan/status`, comingSoonLabel: true },
        { key: "jordan-risks", label: "Risks", icon: <AlertTriangle {...ICON_PROPS} />, href: `/work/${employeeId}/jordan/risks`, comingSoonLabel: true },
      ],
    },
    {
      id: "sam",
      label: "Sam (Marketing)",
      dotClass: "bg-[#7a8b5c]",
      items: [
        { key: "sam-dashboard", label: "Dashboard", icon: <LayoutDashboard {...ICON_PROPS} />, href: `/work/${employeeId}/sam` },
        { key: "sam-campaigns", label: "Campaigns", icon: <Megaphone {...ICON_PROPS} />, href: `/work/${employeeId}/sam/campaigns`, comingSoonLabel: true },
        { key: "sam-brand-voice", label: "Brand voice", icon: <Mic {...ICON_PROPS} />, href: `/work/${employeeId}/sam/brand-voice`, comingSoonLabel: true },
        { key: "sam-performance", label: "Performance", icon: <BarChart {...ICON_PROPS} />, href: `/work/${employeeId}/sam/performance`, comingSoonLabel: true },
      ],
    },
  ];
}

/** Map an active nav key to its owning section so we can auto-expand it. */
function sectionForActive(activeNav: ActiveNavKey): NavSection["id"] {
  if (activeNav.startsWith("jordan-")) return "jordan";
  if (activeNav.startsWith("sam-")) return "sam";
  return "alex";
}

export function TreeNav({
  employeeId,
  activeNav = "alex-dashboard",
}: {
  employeeId: string;
  activeNav?: ActiveNavKey;
}) {
  const sections = buildSections(employeeId);
  const activeSection = sectionForActive(activeNav);
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      sections.map((s) => [s.id, s.defaultOpen || s.id === activeSection]),
    ),
  );

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
                <span className={cn("size-1.5 rounded-full shrink-0", section.dotClass)} />
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
                            {item.comingSoonLabel && !isActive && (
                              <span className="ml-auto text-[9px] uppercase tracking-[0.1em] text-ink-faint/60">
                                soon
                              </span>
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
