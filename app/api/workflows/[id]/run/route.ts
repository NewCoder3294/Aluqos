import { NextRequest, NextResponse } from "next/server";
import { runWorkflow } from "@/src/workflows/queries";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { runId, draftId } = await runWorkflow(id);
    return NextResponse.json({ runId, draftId });
  } catch (err) {
    return NextResponse.json(
      { error: "run_failed", detail: String(err) },
      { status: 400 },
    );
  }
}
