import { NextRequest, NextResponse } from "next/server";
import { cancelDraft } from "@/src/workflows/queries";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await cancelDraft(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "cancel_failed", detail: String(err) },
      { status: 400 },
    );
  }
}
