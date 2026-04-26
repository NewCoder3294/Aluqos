import { parsePdf } from "./pdf";
import { parseDocx } from "./docx";
import { parseMd } from "./md";

export async function parseUpload(
  buf: Buffer,
  mime: string,
  filename: string,
): Promise<string> {
  const lower = filename.toLowerCase();
  const ext = lower.slice(lower.lastIndexOf("."));
  if (mime === "application/pdf" || ext === ".pdf") return parsePdf(buf);
  if (mime.includes("word") || ext === ".docx") return parseDocx(buf);
  if (mime.startsWith("text/") || ext === ".md" || ext === ".txt") return parseMd(buf);
  return "";
}
