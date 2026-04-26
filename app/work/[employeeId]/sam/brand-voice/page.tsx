import { fetchWorkspaceState } from "@/src/server/run-prd";
import { fakeEmployee } from "@/src/db/client";
import { DashboardShell } from "../../_dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

type Trait = { name: string; pct: number };

const TRAITS: Trait[] = [
  { name: "Direct", pct: 92 },
  { name: "Punchy", pct: 87 },
  { name: "Warm", pct: 78 },
];

type Sample = { quote: string; source: string };

const SAMPLES: Sample[] = [
  { quote: "We don't ship a chatbot. We ship the teammate you wish you'd hired.", source: "from LinkedIn post" },
  { quote: "Sam wrote this email in 90 seconds. We left it untouched.", source: "from Email subject" },
  { quote: "Beacon Labs replaced four tools with Aluqos in a week. Here's how.", source: "from Customer story" },
  { quote: "Standups, status updates, and risk registers shouldn't take half your week.", source: "from Blog draft" },
];

// 8-week voice drift — y values 0–100. Renders as a hand-rolled SVG sparkline.
const DRIFT = [62, 58, 65, 71, 64, 73, 81, 78];

export default async function SamBrandVoicePage({
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

  const w = 560;
  const h = 120;
  const max = 100;
  const stepX = w / (DRIFT.length - 1);
  const points = DRIFT.map((v, i) => `${i * stepX},${h - (v / max) * h}`).join(" ");
  const lastX = (DRIFT.length - 1) * stepX;
  const lastY = h - (DRIFT[DRIFT.length - 1]! / max) * h;

  return (
    <DashboardShell employeeId={emp.id} employeeName={emp.name} activeNav="sam-brand-voice">
      <div className="space-y-6">
        <div>
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">Brand voice</h1>
          <p className="mt-1 text-[13px] text-ink-faint">How Sam reads, writes, and stays consistent across every channel.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Brand voice profile</CardTitle>
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">based on 412 published assets</span>
          </CardHeader>
          <CardContent className="space-y-5">
            {TRAITS.map((t) => (
              <div key={t.name} className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[14px] text-ink">{t.name}</span>
                  <span className="text-[13px] text-ink-faint tabular-nums">{t.pct}%</span>
                </div>
                <div className="h-2 bg-paper-hi rounded-full overflow-hidden">
                  <div className="h-full bg-coral rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
            <p className="text-[12px] text-ink-faint italic pt-2 border-t border-paper-edge leading-relaxed">
              Sam keeps copy short and confident. The warmth dial nudges up before customer moments and down before product
              announcements.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample sentences from your content</CardTitle>
          </CardHeader>
          <CardContent compact className="p-0">
            <ul>
              {SAMPLES.map((s, idx) => (
                <li
                  key={idx}
                  className={`px-6 py-5 ${idx !== SAMPLES.length - 1 ? "border-b border-paper-edge" : ""}`}
                >
                  <blockquote className="serif italic text-[18px] text-ink leading-snug">&ldquo;{s.quote}&rdquo;</blockquote>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mt-2">{s.source}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voice drift over time</CardTitle>
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-faint">last 8 weeks · consistency score</span>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-paper-hi/40 rounded-md p-4 border border-paper-edge">
              <svg
                viewBox={`0 0 ${w} ${h}`}
                className="w-full h-32"
                preserveAspectRatio="none"
                aria-label="Voice drift sparkline"
              >
                <polyline
                  points={points}
                  fill="none"
                  stroke="var(--color-coral)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx={lastX} cy={lastY} r={5} fill="var(--color-coral-deep)" />
                <circle cx={lastX} cy={lastY} r={9} fill="var(--color-coral)" opacity={0.2} />
              </svg>
              <div className="flex justify-between mt-2 text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                <span>8w ago</span>
                <span>This week</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-[12px] text-ink-muted">
                Trending <span className="text-coral-deep font-medium">+16 pts</span> over the last month — most gains on
                punchy headlines.
              </div>
              <div className="serif text-[20px] tabular-nums text-ink">{DRIFT[DRIFT.length - 1]}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
