import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { parsePdf } from "@/src/parsing/pdf";

describe("parsePdf", () => {
  it("extracts text from a simple PDF buffer", async () => {
    const buf = readFileSync("tests/fixtures/hello.pdf");
    const text = await parsePdf(buf);
    expect(text).toContain("Hello");
  });

  it("returns empty string on a corrupt PDF without throwing", async () => {
    const text = await parsePdf(Buffer.from("not a pdf"));
    expect(text).toBe("");
  });
});
