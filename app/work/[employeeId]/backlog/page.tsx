import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { MessageCircle, Code2, Mail, Phone } from "lucide-react";
import { DashboardShell } from "../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";

type Source = "slack" | "github" | "email" | "call";

type Request = {
  id: string;
  source: Source;
  title: string;
  author: string;
  age: string;
  mentions: number;
};

const REQUESTS: Request[] = [
  { id: "r1", source: "slack", title: "CSV export should preserve column order", author: "@marie", age: "3 days ago", mentions: 2 },
  { id: "r2", source: "github", title: "Allow API tokens to be scoped per workspace", author: "@dev-relations", age: "5 days ago", mentions: 4 },
  { id: "r3", source: "call", title: "Bulk archive needs an undo window", author: "Acme · Discovery call", age: "yesterday", mentions: 1 },
  { id: "r4", source: "slack", title: "Saved views should follow Slack threads", author: "@priya", age: "2 hours ago", mentions: 3 },
  { id: "r5", source: "email", title: "PDF export from weekly summaries", author: "ops@northwave.io", age: "1 day ago", mentions: 1 },
  { id: "r6", source: "github", title: "Webhook retry policy is opaque", author: "issue #122", age: "4 days ago", mentions: 2 },
  { id: "r7", source: "slack", title: "Mobile detail view stalls on slow networks", author: "@kareem", age: "6 hours ago", mentions: 1 },
  { id: "r8", source: "call", title: "Onboarding skip-link for returning admins", author: "Beacon Labs · Demo", age: "2 days ago", mentions: 1 },
];

const SOURCE_ICON: Record<Source, React.ReactNode> = {
  slack: <MessageCircle size={14} strokeWidth={1.75} />,
  github: <Code2 size={14} strokeWidth={1.75} />,
  email: <Mail size={14} strokeWidth={1.75} />,
  call: <Phone size={14} strokeWidth={1.75} />,
};

const SOURCE_LABEL: Record<Source, string> = {
  slack: "Slack",
  github: "GitHub",
  email: "Email",
  call: "Customer call",
};

const HEATMAP = [
  { source: "Slack", count: 12 },
  { source: "GitHub", count: 4 },
  { source: "Customer calls", count: 2 },
  { source: "Email", count: 1 },
];

export default async function BacklogPage({
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

  const max = Math.max(...HEATMAP.map((h) => h.count));

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="alex-backlog">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Backlog</h1>
          <p className="mt-1 text-[13px] text-ink-faint">Open requests Alex is watching across every inbound channel.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Open requests · {REQUESTS.length}</CardTitle>
              <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">last 7 days</span>
            </CardHeader>
            <CardContent compact className="p-0">
              <ul>
                {REQUESTS.map((req, idx) => (
                  <li
                    key={req.id}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-hi/40 cursor-pointer",
                      idx !== REQUESTS.length - 1 && "border-b border-paper-edge",
                    )}
                  >
                    <span className="shrink-0 size-7 rounded-full bg-paper-hi border border-paper-edge text-ink-muted flex items-center justify-center">
                      {SOURCE_ICON[req.source]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] text-ink truncate">{req.title}</div>
                      <div className="text-[12px] text-ink-faint mt-0.5">
                        {SOURCE_LABEL[req.source]} · from {req.author} · {req.age} · {req.mentions} {req.mentions === 1 ? "mention" : "mentions"}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0">Draft PRD</Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top sources this week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {HEATMAP.map((h) => (
                <div key={h.source} className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] text-ink">{h.source}</span>
                    <span className="serif text-[16px] tabular-nums text-ink">{h.count}</span>
                  </div>
                  <div className="h-1.5 bg-paper-hi rounded-full overflow-hidden">
                    <div
                      className="h-full bg-coral/70 rounded-full"
                      style={{ width: `${Math.round((h.count / max) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-paper-edge">
                <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mb-1">Signal</div>
                <p className="text-[13px] text-ink-muted leading-relaxed">
                  Slack volume up 38% week-over-week — mostly export and saved-view requests.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
