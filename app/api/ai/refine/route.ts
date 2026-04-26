import { NextRequest } from "next/server";
import { streamClaude } from "@/src/ai/stream";
import { withFallback, loadCanned } from "@/src/ai/fallback";
import {
  buildRefinePrdPrompt,
  RefineInput,
  RefineOutput,
} from "@/src/ai/prompts/refine-prd";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const input = (await req.json()) as RefineInput;
  const { system, user } = buildRefinePrdPrompt(input);

  const live = async () => {
    const result = await streamClaude({ system, prompt: user });
    return result.toTextStreamResponse();
  };

  const canned = async () => {
    const data = await loadCanned<RefineOutput>("refine-add-api-spec");
    const text = JSON.stringify(data);
    return new Response(simulateStream(text), {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  };

  try {
    return await withFallback({ ttfbMs: 10000, live, canned });
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
        await new Promise((r) => setTimeout(r, 6));
      }
      controller.close();
    },
  });
}
