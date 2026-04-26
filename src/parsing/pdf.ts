export async function parsePdf(buf: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buf });
    const result = await parser.getText();
    return (result.text ?? "").trim();
  } catch {
    return "";
  }
}
