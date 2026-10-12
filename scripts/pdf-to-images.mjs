#!/usr/bin/env node
/**
 * pdf-to-images.mjs
 * Converts mahindra-glyd-casestudy.pdf to PNG images using pdfjs-dist legacy + canvas.
 * Run from the src/frontend/ directory:
 *   node scripts/pdf-to-images.mjs
 */
import { createCanvas } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, "../public/assets");
const PDF_PATH = path.join(ASSETS_DIR, "mahindra-glyd-casestudy.pdf");
const SCALE = 2.0;

// Use pdfjs-dist legacy Node build
const { getDocument, GlobalWorkerOptions } = await import(
  "pdfjs-dist/legacy/build/pdf.mjs"
);
GlobalWorkerOptions.workerSrc = "";

async function main() {
  if (!fs.existsSync(PDF_PATH)) {
    console.error(`PDF not found: ${PDF_PATH}`);
    process.exit(1);
  }

  console.log(`Loading PDF: ${PDF_PATH}`);
  const data = new Uint8Array(fs.readFileSync(PDF_PATH));
  const pdf = await getDocument({ data, disableWorker: true }).promise;
  const numPages = pdf.numPages;
  console.log(`Total pages: ${numPages}`);

  const manifest = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: SCALE });

    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);

    // Create a canvas using the 'canvas' npm package
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fill white background for PDF pages that are transparent
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const outFile = `glyd-page-${pageNum}.png`;
    const outPath = path.join(ASSETS_DIR, outFile);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(outPath, buffer);
    manifest.push(`/assets/${outFile}`);
    console.log(`  ✓ Page ${pageNum}/${numPages} → ${outFile}`);
  }

  const manifestPath = path.join(ASSETS_DIR, "glyd-pages.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written: ${manifestPath}`);
  console.log(`Done — ${numPages} pages converted.`);
}

main().catch((err) => {
  console.error("Error converting PDF:", err);
  process.exit(1);
});
