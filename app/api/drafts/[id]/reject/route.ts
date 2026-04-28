import { NextRequest, NextResponse } from "next/server";
import { rejectDraft } from "@/src/workflows/queries";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await rejectDraft(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "reject_failed", detail: String(err) },
      { status: 400 },
    );
  }
}
