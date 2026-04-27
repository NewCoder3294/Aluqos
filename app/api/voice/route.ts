import { NextRequest } from "next/server";
import OpenAI from "openai";
import { rateLimitResponse, getClientIp } from "@/src/server/ratelimit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = await getClientIp();
  const limited = await rateLimitResponse(`voice:${ip}`, 5, 60_000);
  if (limited) return limited;

  const form = await req.formData();
  const file = form.get("audio") as File | null;
  if (!file) return new Response("missing audio", { status: 400 });
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ text: "" }), { status: 200 });
  const oa = new OpenAI({ apiKey });
  const transcription = await oa.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });
  return new Response(JSON.stringify({ text: transcription.text }), {
    headers: { "content-type": "application/json" },
  });
}
