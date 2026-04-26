"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { storeAndParseUpload } from "./uploads";
import { updateOnboarding } from "@/src/db/queries";
import { MOCK_MODE } from "@/src/db/client";

const FILES = [
  { name: "saathi-mvp-README.md", type: "text/markdown", path: "saathi-mvp/README.md" },
  { name: "saathi-mvp-architecture.md", type: "text/markdown", path: "saathi-mvp/docs/architecture.md" },
  { name: "q2-roadmap.pdf", type: "application/pdf", path: "q2-roadmap.pdf" },
  { name: "issue-47.json", type: "text/plain", path: "issue-47.json" },
];

export async function seedDemoFixture(employeeId: string) {
  const root = path.resolve(process.cwd(), "fixtures/demo");
  if (MOCK_MODE) {
    // Skip storage/DB writes; the listUploads() mock surface already has demo filenames.
    // Still touch the files to validate they exist (lets parse errors surface in dev).
    try {
      for (const f of FILES) {
        await readFile(path.join(root, f.path));
      }
    } catch {}
    return;
  }
  try {
    for (const f of FILES) {
      const buf = await readFile(path.join(root, f.path));
      await storeAndParseUpload(employeeId, {
        name: f.name,
        type: f.type,
        data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
      });
    }
    await updateOnboarding(employeeId, {
      brief: {
        project: "Saathi — AI employees that learn how you work",
        role: "Founder / head of product",
        priorities: ["Ship YC demo", "Close 10 design partners", "Hit $10K MRR in 90 days"],
        time_sink: "Drafting PRDs from scratch every week",
        team: "3 engineers + 1 designer",
        tools: ["Notion", "Slack", "GitHub", "Linear"],
      },
      phase: 2,
    });
  } catch {}
}
