import mammoth from "mammoth";

export async function parseDocx(buf: Buffer): Promise<string> {
  try {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    return (value ?? "").trim();
  } catch {
    return "";
  }
}
