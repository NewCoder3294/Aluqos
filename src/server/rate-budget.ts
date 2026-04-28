import { MOCK_MODE, serverClient } from "@/src/db/client";
import type { SourceId } from "@/src/config/sources";

type BudgetConfig = { capacity: number; windowMs: number };

const BUDGETS: Record<SourceId, BudgetConfig> = {
  linear: { capacity: 100, windowMs: 60 * 60 * 1000 },
  github: { capacity: 5000, windowMs: 60 * 60 * 1000 },
  calendar: { capacity: 600, windowMs: 60 * 60 * 1000 },
  slack: { capacity: 20, windowMs: 60 * 1000 },
};

export class RateBudgetExceeded extends Error {
  constructor(public source: SourceId, public retryAfterMs: number) {
    super(`Rate budget exceeded for ${source}; retry after ${retryAfterMs}ms`);
    this.name = "RateBudgetExceeded";
  }
}

// Postgres-backed atomic rate budget. The previous in-process Map evaporated
// on serverless cold start — we now defer the window check + increment to a
// SECURITY DEFINER plpgsql function (rate_budget_take) which performs both
// inside a single transaction with row-level locking. The RPC returns null
// on success or the milliseconds-until-retry on rejection.
export async function takeRateBudget(source: SourceId, tenantId: string): Promise<void> {
  if (MOCK_MODE) return; // dev: no-op — fake events aren't subject to provider quotas
  const cfg = BUDGETS[source];
  const sb = serverClient();
  const { data, error } = await sb.rpc("rate_budget_take", {
    p_source: source,
    p_tenant_id: tenantId,
    p_capacity: cfg.capacity,
    p_window_ms: cfg.windowMs,
  });
  if (error) throw new Error(`takeRateBudget failed: ${error.message}`);
  if (data === null || data === undefined) return;
  const retryAfterMs = Number(data);
  if (Number.isFinite(retryAfterMs) && retryAfterMs > 0) {
    throw new RateBudgetExceeded(source, retryAfterMs);
  }
}
