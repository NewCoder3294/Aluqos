import { inngest, events } from "@/src/inngest/client";
import { runLinearBackfill } from "./linear-backfill";
import { upsertBackfillRun } from "./progress";
import type { SourceId } from "@/src/config/sources";

export const startBackfill = inngest.createFunction(
  {
    id: "backfill-start",
    name: "Run backfill on connect",
    triggers: [{ event: events["backfill/start"] }],
  },
  async ({ event, step }) => {
    const { tenantId, source } = event.data as { tenantId: string; source: SourceId };

    await step.run("mark-running", async () => {
      await upsertBackfillRun({
        tenant_id: tenantId,
        source,
        status: "running",
        started_at: new Date(),
      });
    });

    try {
      const ingested = await step.run("run-backfill", async () => {
        if (source === "linear") {
          return await runLinearBackfill({ tenantId });
        }
        throw new Error(`backfill not implemented for source: ${source}`);
      });

      await step.run("mark-completed", async () => {
        await upsertBackfillRun({
          tenant_id: tenantId,
          source,
          status: "completed",
          events_ingested: ingested,
          completed_at: new Date(),
        });
      });

      return { ingested };
    } catch (err) {
      await step.run("mark-failed", async () => {
        await upsertBackfillRun({
          tenant_id: tenantId,
          source,
          status: "failed",
          error_message: String(err),
          completed_at: new Date(),
        });
      });
      throw err;
    }
  }
);
