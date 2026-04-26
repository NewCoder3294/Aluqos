// Hand-rolled minimal PDFs for the demo fixture.
// No PDF engine (pdflatex/xelatex/wkhtmltopdf) is installed in this environment,
// so we fall back to the same approach as tests/fixtures/make-hello-pdf.mjs:
// emit a small valid PDF with a title line. The full roadmap/PRD content
// lives alongside in the .md sources; the PDFs exist so the demo seeder can
// exercise the application/pdf parsing path.

import { writeFileSync } from "node:fs";
import path from "node:path";

function escapePdf(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(lines) {
  // Build a single-page PDF with the given lines of text rendered top-down.
  const startY = 760;
  const lineHeight = 22;
  const fontSize = 14;
  let stream = "BT\n/F1 " + fontSize + " Tf\n";
  stream += "1 0 0 1 50 " + startY + " Tm\n";
  for (let i = 0; i < lines.length; i++) {
    if (i > 0) stream += "0 -" + lineHeight + " Td\n";
    stream += "(" + escapePdf(lines[i]) + ") Tj\n";
  }
  stream += "ET\n";

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];
  for (let i = 0; i < objects.length; i++) {
    offsets.push(header.length + body.length);
    body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefStart = header.length + body.length;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return header + body + xref + trailer;
}

const here = path.dirname(new URL(import.meta.url).pathname);

const roadmapLines = [
  "Q2 Roadmap - Saathi",
  "Target: YC Demo Day, ship 3 AI employees.",
  "",
  "April",
  "- AI Product Manager (Alex) - onboarding + PRD generation. Demo-ready.",
  "- Internal demo rehearsal: 30 reps minimum.",
  "",
  "May",
  "- AI Program Manager (Jordan).",
  "- AI Marketing Employee (Sam).",
  "- Sign 10 design partners.",
  "",
  "Voice",
  "Short sentences. Numbers in hooks. No hedge words.",
  "The product earns trust by doing, not by promising.",
];

const prdLines = [
  "Quick filters on the analytics dashboard",
  "",
  "Problem statement",
  "Analysts open the dashboard and immediately filter to last 30 days,",
  "top customers, and a single product line. Six clicks today.",
  "",
  "Goals",
  "- Cut filter setup from 6 clicks to 1.",
  "- Preserve last-used filter set across sessions.",
  "",
  "Scope",
  "- One-click filter chips at the top of the dashboard.",
  "- Persisted last-used set per user.",
  "",
  "Success metrics",
  "- 80% of analysts apply a saved filter within 2 weeks.",
  "- Median time to first filtered view drops from 18s to 4s.",
];

writeFileSync(path.join(here, "q2-roadmap.pdf"), buildPdf(roadmapLines), "binary");
writeFileSync(path.join(here, "sample-prd.pdf"), buildPdf(prdLines), "binary");
console.log("Wrote q2-roadmap.pdf and sample-prd.pdf");
