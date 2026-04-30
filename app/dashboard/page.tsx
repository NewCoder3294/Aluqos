import { AppShell } from "@/app/_chrome/app-shell";
import { AlexStatusCard } from "@/app/_chrome/alex-status-card";
import { AttentionPane } from "@/app/_chrome/attention-pane";
import { PipelineCard } from "@/app/_chrome/pipeline-card";
import { PeopleOrbit } from "@/app/_chrome/people-orbit";
import { WinsCard } from "@/app/_chrome/wins-card";
import { ProposalCards } from "@/app/_chrome/proposal-card";
import { OAuthGmailSection } from "./_oauth-section";
import { DEMO_EMPLOYEE_ID, DEMO_USER_ID, MOCK_MODE } from "@/src/db/client";
import { serverAuthClient } from "@/src/db/auth-client";
import { getDecryptedTokens } from "@/src/oauth/credentials";
import { getInboxStats } from "@/src/integrations/gmail/client";
import {
  listOpenProposals,
  listWorkflows,
  listAllDrafts,
  listPendingDrafts,
} from "@/src/workflows/queries";
import { listConnections } from "@/src/connections/queries";
import { queryActivityEvents } from "@/src/events/query";
import {
  deriveAlexStatus,
  deriveAttention,
  derivePeople,
  derivePipeline,
  deriveRecentWins,
} from "@/src/workflows/projections";
import type { DevActivityEvent } from "@/src/dev/store";

export const dynamic = "force-dynamic";

// The dashboard is a live ops console for your AI employee. From the moment
// the user lands here, every card answers a question they actually have:
//
//   "What's Alex doing right now?"            → AlexStatusCard (hero)
//   "What new ideas does Alex have?"          → ProposalCards
//   "What is Alex paying attention to?"       → AttentionPane
//   "When is the next thing happening?"       → PipelineCard
//   "Who has Alex figured out I work with?"   → PeopleOrbit
//   "What has Alex actually shipped?"         → WinsCard
//
// Composition is server-side; client components handle live countdowns and
// the proposal approve/dismiss flow. All projections are derived from the
// existing event/workflow/draft store — no new persistence layer.
export default async function DashboardPage() {
  // Detect a Google-authenticated viewer. If a Supabase session is present
  // AND we have a stored gmail credential, we're in the OAuth dashboard
  // variant; the existing widgets still render below for shared parity.
  const oauthViewer = await resolveOAuthViewer();
  const tenantId = oauthViewer?.userId ?? DEMO_USER_ID;

  const [proposals, workflows, allDrafts, pendingDrafts, connections, eventsRaw, gmailStats] =
    await Promise.all([
      listOpenProposals(tenantId),
      listWorkflows(tenantId),
      listAllDrafts(tenantId),
      listPendingDrafts(tenantId),
      listConnections(tenantId),
      queryActivityEvents({ tenant_id: tenantId, limit: 60 }),
      oauthViewer ? getInboxStats(oauthViewer.userId).catch(() => null) : Promise.resolve(null),
    ]);

  // queryActivityEvents returns objects matching DevActivityEvent shape in dev
  // and Supabase rows in prod; both have the same surface fields the
  // projections use.
  const events = eventsRaw as DevActivityEvent[];

  const recentWins = deriveRecentWins(allDrafts);
  const pipeline = derivePipeline(workflows);
  const attention = deriveAttention(events, workflows);
  const proposedStakeholders = proposals.map((p) => p.recipient).filter(Boolean) as string[];
  const people = derivePeople(events, workflows, proposedStakeholders);

  const status = deriveAlexStatus({
    pendingDrafts: pendingDrafts.filter((d) => d.status === "pending"),
    approvedDrafts: pendingDrafts.filter((d) => d.status === "approved"),
    recentSent: recentWins,
    hasConnection: connections.some((c) => c.consent_active),
    pipeline,
  });

  return (
    <AppShell
      employeeId={DEMO_EMPLOYEE_ID}
      activeNav="alex-dashboard"
      showDemoBadge={!oauthViewer}
    >
      <div className="space-y-6 pb-12">
        {oauthViewer && (
          <OAuthGmailSection
            fullName={oauthViewer.fullName}
            email={oauthViewer.email}
            stats={gmailStats}
          />
        )}

        <AlexStatusCard
          greetingName={oauthViewer?.fullName.split(" ")[0] ?? "there"}
          status={status}
        />

        {proposals.length > 0 && <ProposalCards proposals={proposals} />}

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
          <AttentionPane items={attention} />
          <PipelineCard items={pipeline} />
        </div>

        <PeopleOrbit people={people} />

        <WinsCard wins={recentWins} />
      </div>
    </AppShell>
  );
}

type OAuthViewer = {
  userId: string;
  fullName: string;
  email: string | null;
};

// Returns viewer info iff we have a Supabase Auth session AND a Gmail
// credential row for that user. Anything missing → render the demo dashboard.
async function resolveOAuthViewer(): Promise<OAuthViewer | null> {
  if (MOCK_MODE) return null;
  try {
    const supabase = await serverAuthClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const tokens = await getDecryptedTokens(data.user.id, "gmail");
    if (!tokens) return null;

    const meta = (data.user.user_metadata ?? {}) as {
      full_name?: string;
      name?: string;
    };
    const fullName = meta.full_name ?? meta.name ?? data.user.email ?? "there";
    return { userId: data.user.id, fullName, email: data.user.email ?? null };
  } catch {
    return null;
  }
}
