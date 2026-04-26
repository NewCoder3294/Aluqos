import { PDFParse } from "pdf-parse";

export async function parsePdf(buf: Buffer): Promise<string> {
  try {
    const parser = new PDFParse({ data: buf });
    const result = await parser.getText();
    return (result.text ?? "").trim();
  } catch {
    return "";
  }
}
