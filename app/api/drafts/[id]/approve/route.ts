import { NextRequest, NextResponse } from "next/server";
import { approveDraft } from "@/src/workflows/queries";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { send_at } = await approveDraft(id);
    return NextResponse.json({ ok: true, send_at });
  } catch (err) {
    return NextResponse.json(
      { error: "approve_failed", detail: String(err) },
      { status: 400 },
    );
  }
}
