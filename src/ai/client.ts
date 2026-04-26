import { anthropic } from "@ai-sdk/anthropic";
export const MODEL_ID = "claude-sonnet-4-6";
export const claude = anthropic(MODEL_ID);
export const ANTHROPIC_KEY_PRESENT = !!process.env.ANTHROPIC_API_KEY;
