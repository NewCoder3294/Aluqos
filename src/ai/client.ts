// Provider-agnostic model export. Currently OpenAI gpt-4o for quality at
// reasonable cost. Swap the import + factory call to switch providers;
// the rest of the codebase only consumes the typed `claude` symbol.
import { openai } from "@ai-sdk/openai";
export const MODEL_ID = "gpt-4o";
export const claude = openai(MODEL_ID);
export const ANTHROPIC_KEY_PRESENT =
  !!process.env.OPENAI_API_KEY || !!process.env.ANTHROPIC_API_KEY;
