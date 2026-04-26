import { streamText, generateText } from "ai";
import { claude } from "./client";

export type StreamArgs = {
  system: string;
  prompt: string;
  signal?: AbortSignal;
};

export async function streamClaude(args: StreamArgs) {
  const result = streamText({
    model: claude,
    system: args.system,
    prompt: args.prompt,
    abortSignal: args.signal,
  });
  return result;
}

export async function jsonClaude<T>(args: StreamArgs): Promise<T> {
  const { text } = await generateText({
    model: claude,
    system: args.system,
    prompt: args.prompt,
    abortSignal: args.signal,
  });
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("Claude response not JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}
