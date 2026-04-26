import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { TrendingUp, TrendingDown, Briefcase, Mail, AtSign } from "lucide-react";
import { DashboardShell } from "../../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { cn } from "@/src/lib/cn";

type Kpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
};

const KPIS: Kpi[] = [
  { label: "Total reach", value: "38.2k", delta: "+12% wk", trend: "up" },
  { label: "Engagement rate", value: "4.7%", delta: "+0.4 pts", trend: "up" },
  { label: "CTR", value: "2.3%", delta: "−0.1 pts", trend: "down" },
  { label: "New followers", value: "+847", delta: "+18% wk", trend: "up" },
];

type Post = {
  title: string;
  channel: string;
  reach: string;
  engagement: string;
};

const TOP_POSTS: Post[] = [
  { title: "Why we built three AI employees instead of one assistant", channel: "LinkedIn", reach: "9.4k", engagement: "7.1%" },
  { title: "Saved views, finally — a 60-second walkthrough", channel: "LinkedIn", reach: "6.8k", engagement: "5.9%" },
  { title: "Aluqos changelog · week of Apr 22", channel: "Email", reach: "4.2k", engagement: "38% open" },
  { title: "The status update Jordan wrote at 9:32 AM", channel: "X", reach: "3.1k", engagement: "4.4%" },
  { title: "How Beacon Labs replaced four tools in a week", channel: "LinkedIn", reach: "2.7k", engagement: "5.2%" },
];

type Channel = {
  name: string;
  pct: number;
  icon: React.ReactNode;
};

const CHANNELS: Channel[] = [
  { name: "LinkedIn", pct: 64, icon: <Briefcase size={14} strokeWidth={1.75} /> },
  { name: "Email", pct: 22, icon: <Mail size={14} strokeWidth={1.75} /> },
  { name: "Twitter", pct: 14, icon: <AtSign size={14} strokeWidth={1.75} /> },
];

type Activity = { time: string; text: string };

const ACTIVITY: Activity[] = [
  { time: "12 min ago", text: "Published 'Why we built three AI employees' to LinkedIn" },
  { time: "2h ago", text: "Sent weekly changelog to 4,213 subscribers" },
  { time: "Yesterday", text: "Drafted X thread for Day-Day demo teaser" },
  { time: "Yesterday", text: "Scheduled customer-story post for May 1" },
  { time: "2 days ago", text: "Refreshed pricing page hero copy" },
];

export default async function SamPerformancePage({
  params,
}: {
  params: Promise<{ employeeId: string }>;
}) {
  const { employeeId } = await params;
  let state;
  try {
    state = await fetchWorkspaceState(employeeId);
  } catch {
    state = { emp: { ...fakeEmployee(), id: employeeId }, session: null, uploads: [], prds: [] };
  }
  const emp = state.emp ?? { ...fakeEmployee(), id: employeeId };

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="sam-performance">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Performance</h1>
          <p className="mt-1 text-[13px] text-ink-faint">How Sam's content is landing this week.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPIS.map((k) => (
            <Card key={k.label}>
              <CardContent className="p-5">
                <div className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">{k.label}</div>
                <div className="serif text-[28px] tracking-[-0.02em] text-ink mt-1.5 tabular-nums">{k.value}</div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-[12px] mt-1.5 tabular-nums",
                    k.trend === "up" ? "text-[#5d6948]" : "text-coral-deep",
                  )}
                >
                  {k.trend === "up" ? (
                    <TrendingUp size={12} strokeWidth={2} />
                  ) : (
                    <TrendingDown size={12} strokeWidth={2} />
                  )}
                  <span>{k.delta}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Top posts this week</CardTitle>
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">by reach</span>
            </CardHeader>
            <CardContent compact className="p-0">
              <ul>
                {TOP_POSTS.map((p, idx) => (
                  <li
                    key={idx}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-paper-hi/40 cursor-pointer",
                      idx !== TOP_POSTS.length - 1 && "border-b border-paper-edge",
                    )}
                  >
                    <span className="serif italic text-[14px] text-ink-faint w-5 shrink-0 tabular-nums">{idx + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-ink truncate">{p.title}</div>
                      <div className="text-[11px] uppercase tracking-[0.1em] text-ink-faint mt-0.5">{p.channel}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[13px] text-ink tabular-nums">{p.reach}</div>
                      <div className="text-[11px] text-ink-faint tabular-nums">{p.engagement}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Channel breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {CHANNELS.map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-ink-muted">{c.icon}</span>
                    <span className="text-[13px] text-ink">{c.name}</span>
                    <span className="ml-auto text-[13px] text-ink-faint tabular-nums">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-paper-hi rounded-full overflow-hidden">
                    <div className="h-full bg-coral rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-[12px] text-ink-faint pt-3 border-t border-paper-edge leading-relaxed">
                LinkedIn keeps doing the heavy lifting. Sam is testing two long-form X threads next week.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent compact className="p-0">
            <ul>
              {ACTIVITY.map((a, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "flex items-baseline gap-4 px-5 py-3",
                    idx !== ACTIVITY.length - 1 && "border-b border-paper-edge",
                  )}
                >
                  <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint w-[110px] shrink-0">{a.time}</span>
                  <span className="text-[13px] text-ink-muted">{a.text}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
