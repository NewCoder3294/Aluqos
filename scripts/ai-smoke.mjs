import "dotenv/config";
import { streamClaude } from "../src/ai/stream.ts";
const r = await streamClaude({
  system: "You are a friendly haiku writer.",
  prompt: "Write a haiku about onboarding.",
});
for await (const chunk of r.textStream) process.stdout.write(chunk);
process.stdout.write("\n");
