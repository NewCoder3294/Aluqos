import { readFile } from "node:fs/promises";
import path from "node:path";

const CANNED_DIR = path.resolve(process.cwd(), "fixtures/demo/canned-responses");

export type CannedKey = "understand" | "plan" | "prd-issue-47" | "refine-add-api-spec";

export async function loadCanned<T = unknown>(key: CannedKey): Promise<T> {
  const file = path.join(CANNED_DIR, `${key}.json`);
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as T;
}

export type WithFallbackArgs<T> = {
  ttfbMs: number;
  live: () => Promise<T>;
  canned: () => Promise<T>;
};

export async function withFallback<T>({ ttfbMs, live, canned }: WithFallbackArgs<T>): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const livePromise = (async () => live())();
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error("ttfb exceeded")), ttfbMs);
  });
  try {
    const result = await Promise.race([livePromise, timeout]);
    if (timer) clearTimeout(timer);
    return result;
  } catch {
    if (timer) clearTimeout(timer);
    return canned();
  }
}
