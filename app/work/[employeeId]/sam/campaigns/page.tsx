import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

type Stage = "Brief" | "Drafting" | "In review" | "Live" | "Wrapped";

type Campaign = {
  id: string;
  stage: Stage;
  title: string;
  channel: string;
  launch: string;
  reach: string;
  engagement: string;
  conversion: string;
};

const CAMPAIGNS: Campaign[] = [
  { id: "c1", stage: "Live", title: "Day-Day demo teaser", channel: "LinkedIn + X", launch: "Apr 22", reach: "12.4k", engagement: "6.1%", conversion: "112" },
  { id: "c2", stage: "Live", title: "Saved-views walkthrough", channel: "Email · 4.2k list", launch: "Apr 19", reach: "4.2k", engagement: "38% open", conversion: "47 clicks" },
  { id: "c3", stage: "In review", title: "Customer story — Beacon Labs", channel: "Blog + LinkedIn", launch: "May 1", reach: "—", engagement: "—", conversion: "—" },
  { id: "c4", stage: "Drafting", title: "Pricing announcement", channel: "Email + Website", launch: "May 6", reach: "—", engagement: "—", conversion: "—" },
  { id: "c5", stage: "Drafting", title: "AI-employee origin essay", channel: "Founder LinkedIn", launch: "May 9", reach: "—", engagement: "—", conversion: "—" },
  { id: "c6", stage: "Brief", title: "YC Day-Day live thread", channel: "X · live", launch: "Apr 28", reach: "—", engagement: "—", conversion: "—" },
  { id: "c7", stage: "Brief", title: "Comparison guide vs. Linear AI", channel: "SEO landing", launch: "May 20", reach: "—", engagement: "—", conversion: "—" },
  { id: "c8", stage: "Wrapped", title: "Launch week — bulk export", channel: "Multi-channel", launch: "Apr 8", reach: "28.7k", engagement: "5.4%", conversion: "204" },
  { id: "c9", stage: "Wrapped", title: "Onboarding redesign teaser", channel: "LinkedIn", launch: "Apr 1", reach: "9.1k", engagement: "4.8%", conversion: "63" },
];

const STAGE_VARIANT: Record<Stage, "coral" | "default" | "green" | "outline"> = {
  Brief: "outline",
  Drafting: "coral",
  "In review": "default",
  Live: "green",
  Wrapped: "outline",
};

export default async function SamCampaignsPage({
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
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="sam-campaigns">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Campaigns</h1>
          <p className="mt-1 text-[13px] text-ink-faint">{CAMPAIGNS.length} campaigns moving across brief, draft, review, and live.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAMPAIGNS.map((c) => (
            <Card key={c.id} className="hover:border-coral/40 transition-colors cursor-pointer">
              <CardHeader>
                <Badge variant={STAGE_VARIANT[c.stage]}>{c.stage}</Badge>
                <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">{c.launch}</span>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="serif text-[16px] tracking-[-0.01em] text-ink leading-snug">{c.title}</h3>
                  <p className="text-[12px] text-ink-faint mt-1">{c.channel}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-paper-edge">
                  <Metric label="Reach" value={c.reach} />
                  <Metric label="Engage" value={c.engagement} />
                  <Metric label="Convert" value={c.conversion} />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm">Open →</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.12em] text-ink-faint">{label}</div>
      <div className="text-[14px] text-ink tabular-nums mt-0.5">{value}</div>
    </div>
  );
}
