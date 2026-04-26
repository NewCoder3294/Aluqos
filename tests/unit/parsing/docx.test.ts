import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parseDocx } from "@/src/parsing/docx";

describe("parseDocx", () => {
  it("extracts text from a docx buffer", async () => {
    const buf = readFileSync("tests/fixtures/hello.docx");
    const text = await parseDocx(buf);
    expect(text).toContain("Saathi");
  });

  it("returns empty string on garbage input", async () => {
    expect(await parseDocx(Buffer.from("not a docx"))).toBe("");
  });
});
