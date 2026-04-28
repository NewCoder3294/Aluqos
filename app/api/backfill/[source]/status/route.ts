import { NextRequest, NextResponse } from "next/server";
import { getBackfillStatus } from "@/src/backfill/progress";
import { DEMO_USER_ID } from "@/src/db/client";
import { rateLimitResponse, getClientIp } from "@/src/server/ratelimit";
import type { SourceId } from "@/src/config/sources";

export const runtime = "nodejs";

const VALID_SOURCES: SourceId[] = ["linear", "github", "calendar", "slack"];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ source: string }> }
) {
  const ip = await getClientIp();
  const limited = await rateLimitResponse(`backfill-status:${ip}`, 60, 60_000);
  if (limited) return limited;

  const { source } = await params;
  if (!VALID_SOURCES.includes(source as SourceId)) {
    return NextResponse.json({ error: "invalid_source" }, { status: 400 });
  }

  const status = await getBackfillStatus(DEMO_USER_ID, source as SourceId);
  return NextResponse.json(status ?? { status: "none" });
}
