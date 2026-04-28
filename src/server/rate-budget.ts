import type { SourceId } from "@/src/config/sources";

type BudgetConfig = { capacity: number; windowMs: number };

const BUDGETS: Record<SourceId, BudgetConfig> = {
  linear: { capacity: 100, windowMs: 60 * 60 * 1000 },
  github: { capacity: 5000, windowMs: 60 * 60 * 1000 },
  calendar: { capacity: 600, windowMs: 60 * 60 * 1000 },
  slack: { capacity: 20, windowMs: 60 * 1000 },
};

type BucketKey = `${SourceId}:${string}`;

const buckets = new Map<BucketKey, { count: number; windowStart: number }>();

export class RateBudgetExceeded extends Error {
  constructor(public source: SourceId, public retryAfterMs: number) {
    super(`Rate budget exceeded for ${source}; retry after ${retryAfterMs}ms`);
    this.name = "RateBudgetExceeded";
  }
}

export async function takeRateBudget(source: SourceId, tenantId: string): Promise<void> {
  const cfg = BUDGETS[source];
  const key: BucketKey = `${source}:${tenantId}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= cfg.windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return;
  }
  if (bucket.count >= cfg.capacity) {
    const retryAfterMs = cfg.windowMs - (now - bucket.windowStart);
    throw new RateBudgetExceeded(source, retryAfterMs);
  }
  bucket.count += 1;
}

export function resetRateBudget(): void {
  buckets.clear();
}
