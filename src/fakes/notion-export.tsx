"use client";

import { toast } from "@/src/components/toast";
import { prdToMarkdown } from "@/src/lib/prd-to-md";
import type { GeneratedPrd } from "@/src/ai/prompts/generate-prd";

let nextSlug = 1248;

export function fakeNotionExport(prd: GeneratedPrd) {
  const md = prdToMarkdown(prd);
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(prd.title)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  const slug = `prd-${nextSlug++}`;
  toast.success("Exported to Notion", {
    description: `saathi.notion.site/${slug}`,
    icon: <NotionGlyph />,
  });
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "prd";
}

function NotionGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 7v10M8 7l8 10M16 7v10" />
    </svg>
  );
}
