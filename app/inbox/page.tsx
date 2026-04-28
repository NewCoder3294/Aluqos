import { AppShell } from "@/app/_chrome/app-shell";
import { InboxList } from "./inbox-list";
import { DEMO_EMPLOYEE_ID, DEMO_USER_ID } from "@/src/db/client";
import {
  listPendingDrafts,
  listWorkflows,
  settlePendingSends,
} from "@/src/workflows/queries";
import { derivePipeline } from "@/src/workflows/projections";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  // Settle any approved-past-window drafts before rendering so SSR matches
  // the next client poll. Then load pending+approved drafts and the next
  // scheduled run for the empty-state hint.
  await settlePendingSends(DEMO_USER_ID);
  const [drafts, workflows] = await Promise.all([
    listPendingDrafts(DEMO_USER_ID),
    listWorkflows(DEMO_USER_ID),
  ]);

  const pipeline = derivePipeline(workflows);
  const nextRunHint =
    pipeline.length > 0
      ? `Next: I'll ${pipeline[0].next_action} ${pipeline[0].countdown_label}.`
      : null;

  return (
    <AppShell employeeId={DEMO_EMPLOYEE_ID} activeNav="alex-inbox">
      <div className="space-y-6 pb-12">
        <div className="alex-fade-up">
          <h1 className="serif text-[28px] tracking-[-0.02em] text-ink leading-tight">
            Drafts waiting on you
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-muted leading-relaxed max-w-2xl">
            I made these. One tap to send. Sixty seconds to take it back.
            Open &ldquo;Why I drafted this&rdquo; on any draft to see what I included
            and what I left out.
          </p>
        </div>

        <InboxList initialDrafts={drafts} nextRunHint={nextRunHint} />
      </div>
    </AppShell>
  );
}
