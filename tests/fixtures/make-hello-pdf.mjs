import { writeFileSync } from "node:fs";

const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
  null, // stream object placed below
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
];

const stream = "BT /F1 18 Tf 30 100 Td (Hello world) Tj ET\n";
const streamObj = `<< /Length ${stream.length} >>\nstream\n${stream}endstream`;
objects[3] = streamObj;

const header = "%PDF-1.4\n";
let body = "";
const offsets = [0];
for (let i = 0; i < objects.length; i++) {
  offsets.push(header.length + body.length);
  body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
}

const xrefStart = header.length + body.length;
let xref = `xref\n0 ${objects.length + 1}\n`;
xref += "0000000000 65535 f \n";
for (let i = 1; i <= objects.length; i++) {
  xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
}

const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

const pdf = header + body + xref + trailer;
writeFileSync("tests/fixtures/hello.pdf", pdf, "binary");
console.log("Wrote tests/fixtures/hello.pdf, bytes:", pdf.length);
