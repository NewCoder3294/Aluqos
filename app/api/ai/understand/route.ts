import { NextRequest } from "next/server";
import { streamClaude } from "@/src/ai/stream";
import { withFallback, loadCanned } from "@/src/ai/fallback";
import { rateLimitResponse, getClientIp } from "@/src/server/ratelimit";
import {
  buildUnderstandPrompt,
  UnderstandInput,
  UnderstoodContext,
} from "@/src/ai/prompts/understand-context";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip = await getClientIp();
  const limited = await rateLimitResponse(`ai:${ip}`, 10, 60_000);
  if (limited) return limited;

  const input = (await req.json()) as UnderstandInput;
  const { system, user } = buildUnderstandPrompt(input);

  const live = async () => {
    const result = await streamClaude({ system, prompt: user });
    return result.toTextStreamResponse();
  };

  const canned = async () => {
    const data = await loadCanned<UnderstoodContext>("understand");
    const text = JSON.stringify(data);
    return new Response(simulateStream(text), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  };

  if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) return canned();

  try {
    return await withFallback({ ttfbMs: 30000, live, canned });
  } catch {
    return canned();
  }
}

function simulateStream(text: string) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      const chars = [...text];
      for (const c of chars) {
        controller.enqueue(encoder.encode(c));
        await new Promise((r) => setTimeout(r, 12));
      }
      controller.close();
    },
  });
}
