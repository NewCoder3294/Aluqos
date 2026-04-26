import { describe, it, expect } from "vitest";
import { parseUpload } from "@/src/parsing/parse-upload";

describe("parseUpload dispatcher", () => {
  it("routes .md by mime type", async () => {
    const buf = Buffer.from("# Title\n\nBody text.");
    expect(await parseUpload(buf, "text/markdown", "x.md")).toContain("Body text");
  });
  it("routes .txt by mime type", async () => {
    const buf = Buffer.from("plain content");
    expect(await parseUpload(buf, "text/plain", "x.txt")).toContain("plain content");
  });
  it("falls back to extension when mime is octet-stream", async () => {
    const buf = Buffer.from("# md content");
    expect(await parseUpload(buf, "application/octet-stream", "thing.md")).toContain("md content");
  });
  it("returns empty for unknown formats", async () => {
    expect(await parseUpload(Buffer.from("xx"), "image/png", "x.png")).toBe("");
  });
});
