import { describe, it, expect } from "vitest";
import { prdToMarkdown } from "@/src/lib/prd-to-md";

describe("prdToMarkdown", () => {
  it("renders title and section headings", () => {
    const md = prdToMarkdown({
      title: "Bulk export",
      sections: {
        problem: "p text",
        goals: "g text",
        user_stories: "us text",
        scope: "s text",
        out_of_scope: "oos text",
        success_metrics: "sm text",
      },
    });
    expect(md).toMatch(/^# Bulk export/);
    expect(md).toContain("## Problem statement");
    expect(md).toContain("## Goals");
    expect(md).toContain("## User stories");
    expect(md).toContain("## Scope");
    expect(md).toContain("## Out of scope");
    expect(md).toContain("## Success metrics");
    expect(md).toContain("p text");
  });

  it("skips empty sections", () => {
    const md = prdToMarkdown({
      title: "T",
      sections: { problem: "x", goals: "", user_stories: "", scope: "", out_of_scope: "", success_metrics: "" },
    });
    expect(md).toContain("## Problem statement");
    expect(md).not.toContain("## Goals");
  });
});
