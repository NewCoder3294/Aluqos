import { NextResponse } from "next/server";
import { DEMO_USER_ID } from "@/src/db/client";
import { listPendingDrafts, settlePendingSends } from "@/src/workflows/queries";

export const runtime = "nodejs";

// Inbox poll endpoint. Settles any approved drafts whose 60s cancel window
// has expired (flips them to "sent" with a sent_at timestamp), then returns
// the current pending+approved set.
export async function GET() {
  await settlePendingSends(DEMO_USER_ID);
  const drafts = await listPendingDrafts(DEMO_USER_ID);
  return NextResponse.json({ drafts });
}
