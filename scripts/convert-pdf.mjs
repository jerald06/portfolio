#!/usr/bin/env node
/**
 * Build-time PDF to PNG converter for Mahindra Glyd case study.
 * Runs BEFORE vite build. Outputs glyd-page-N.png + glyd-pages.json to public/assets/.
 * Skips if images already exist AND first image is confirmed on disk.
 * Exits cleanly (code 0) if canvas unavailable.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '../public/assets');
const manifestPath = join(outputDir, 'glyd-pages.json');

// Step 0: Copy PDF from attachments to public/assets if not already there
const attachmentPdf = '/home/ubuntu/workspace/app/.platform/attachments/mahindra_-_glyd-compressed-019e4b3f-2847-7454-a659-6b5b6936c050.pdf';
const attachmentPdfAlt = join(__dirname, '../../../../.platform/attachments/mahindra_-_glyd-compressed-019e4b3f-2847-7454-a659-6b5b6936c050.pdf');
const publicPdf = join(outputDir, 'mahindra-glyd-casestudy.pdf');

if (!existsSync(publicPdf)) {
  const srcPdf = existsSync(attachmentPdf) ? attachmentPdf : (existsSync(attachmentPdfAlt) ? attachmentPdfAlt : null);
  if (srcPdf) {
    try {
      copyFileSync(srcPdf, publicPdf);
      console.log('[convert-pdf] Copied PDF to public/assets/mahindra-glyd-casestudy.pdf');
    } catch (e) {
      console.warn('[convert-pdf] Could not copy PDF:', e.message);
    }
  }
}

// Check if conversion already done — only skip if pages exist AND first image file is confirmed on disk
if (existsSync(manifestPath)) {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  if (manifest.pages && manifest.pages.length > 0) {
    const firstPage = join(outputDir, manifest.pages[0]);
    if (existsSync(firstPage)) {
      console.log('[convert-pdf] Images already exist, skipping conversion.');
      process.exit(0);
    }
    // else: manifest has pages listed but files are missing — fall through to reconvert
    console.log('[convert-pdf] Manifest has pages but image files are missing, reconverting...');
  } else {
    // manifest exists but pages array is empty — fall through to convert
    console.log('[convert-pdf] Manifest found with empty pages array, proceeding with conversion...');
  }
}

// Find PDF file — check public/assets first (copied above), then direct attachment paths
const pdfPaths = [
  join(outputDir, 'mahindra-glyd-casestudy.pdf'),
  '/home/ubuntu/workspace/app/.platform/attachments/mahindra_-_glyd-compressed-019e4b3f-2847-7454-a659-6b5b6936c050.pdf',
  join(__dirname, '../../../../.platform/attachments/mahindra_-_glyd-compressed-019e4b3f-2847-7454-a659-6b5b6936c050.pdf'),
  join(__dirname, '../../../.platform/attachments/mahindra_-_glyd-compressed-019e4b3f-2847-7454-a659-6b5b6936c050.pdf'),
];

let pdfPath = null;
for (const p of pdfPaths) {
  if (existsSync(p)) {
    pdfPath = p;
    break;
  }
}

if (!pdfPath) {
  console.warn('[convert-pdf] PDF file not found. Creating empty manifest.');
  writeFileSync(manifestPath, JSON.stringify({ pages: [] }));
  process.exit(0);
}

console.log('[convert-pdf] Converting PDF:', pdfPath);

let createCanvas;
try {
  const canvasModule = await import('canvas');
  createCanvas = canvasModule.createCanvas;
} catch (e) {
  console.warn('[convert-pdf] canvas package not available:', e.message);
  console.warn('[convert-pdf] Creating empty manifest, fallback to Behance link will show.');
  writeFileSync(manifestPath, JSON.stringify({ pages: [] }));
  process.exit(0);
}

let pdfjsLib;
try {
  pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
} catch (e) {
  try {
    pdfjsLib = await import('pdfjs-dist');
  } catch (e2) {
    console.warn('[convert-pdf] pdfjs-dist not available:', e2.message);
    writeFileSync(manifestPath, JSON.stringify({ pages: [] }));
    process.exit(0);
  }
}

try {
  // Disable worker for Node.js
  if (pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';
  }

  const data = readFileSync(pdfPath);
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(data),
    disableWorker: true,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  console.log(`[convert-pdf] PDF has ${pdf.numPages} pages`);

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const scale = 2.5; // high-res for retina
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(Math.floor(viewport.width), Math.floor(viewport.height));
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    const filename = `glyd-page-${i}.png`;
    const outPath = join(outputDir, filename);
    writeFileSync(outPath, canvas.toBuffer('image/png'));
    pages.push(filename);
    console.log(`[convert-pdf] Page ${i}/${pdf.numPages} -> ${filename}`);
  }

  writeFileSync(manifestPath, JSON.stringify({ pages }, null, 2));
  console.log('[convert-pdf] Done! Generated', pages.length, 'pages.');
} catch (err) {
  console.error('[convert-pdf] Conversion failed:', err.message);
  console.warn('[convert-pdf] Creating empty manifest, fallback will show.');
  writeFileSync(manifestPath, JSON.stringify({ pages: [] }));
  process.exit(0);
}
