import { NextRequest, NextResponse } from "next/server";
import { approveProposal, runWorkflow } from "@/src/workflows/queries";

export const runtime = "nodejs";

// Approve a proposal → promotes it to a workflow and immediately produces
// the first draft so the user has something to look at in the inbox.
// In dev the draft is synthesized from seeded events; in prod the Inngest
// scheduled run takes over from there.
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const workflowId = await approveProposal(id);
    const { runId, draftId } = await runWorkflow(workflowId);
    return NextResponse.json({ workflowId, runId, draftId });
  } catch (err) {
    return NextResponse.json(
      { error: "approve_failed", detail: String(err) },
      { status: 400 },
    );
  }
}
