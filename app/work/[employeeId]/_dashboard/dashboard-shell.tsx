// Re-export of the canonical AppShell for legacy per-employee pages
// (PRDs / Calendar / Goals / Backlog / Settings / Sam / Jordan / Files /
// Activity / Overview) that imported from this path. The actual chrome
// lives in app/_chrome/app-shell.tsx — keeping this thin re-export means
// we don't have to touch ~20 page files in the same change.

import { AppShell, type ActiveNavKey } from "@/app/_chrome/app-shell";

export type { ActiveNavKey };

export function DashboardShell({
  employeeId,
  activeNav = "alex-dashboard",
  children,
}: {
  employeeId: string;
  /** No longer used — kept in the type for backwards compatibility. */
  employeeName?: string;
  activeNav?: ActiveNavKey;
  /** No longer used — children-only composition now. */
  data?: unknown;
  /** No longer used — proposals live on /dashboard. */
  proposals?: unknown;
  children?: React.ReactNode;
}) {
  return (
    <AppShell employeeId={employeeId} activeNav={activeNav}>
      {children}
    </AppShell>
  );
}
