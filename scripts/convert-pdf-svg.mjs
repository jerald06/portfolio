#!/usr/bin/env node
// Convert PDF pages to SVG using pdfjs-dist's SVG backend (no canvas needed)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PDF_PATH = path.resolve(__dirname, '../public/assets/mahindra-glyd-casestudy.pdf');
const OUT_DIR = path.resolve(__dirname, '../public/assets/glyd-pages');

if (!existsSync(PDF_PATH)) {
  console.error('PDF not found at:', PDF_PATH);
  process.exit(1);
}

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

console.log('Loading pdfjs-dist...');

// pdfjs-dist v5 — import the legacy build for Node.js (no canvas)
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs').catch(
  () => import('pdfjs-dist')
);

// Disable worker in Node context
pdfjsLib.GlobalWorkerOptions = pdfjsLib.GlobalWorkerOptions || {};
pdfjsLib.GlobalWorkerOptions.workerSrc = '';

const data = new Uint8Array(readFileSync(PDF_PATH));

console.log('Opening PDF...');
const loadingTask = pdfjsLib.getDocument({
  data,
  disableWorker: true,
  useSystemFonts: true,
  verbosity: 0,
});

const pdf = await loadingTask.promise;
console.log(`PDF loaded: ${pdf.numPages} pages`);

const { SVGGraphics } = await import('pdfjs-dist/legacy/build/pdf.mjs').catch(
  () => ({ SVGGraphics: null })
);

for (let i = 1; i <= pdf.numPages; i++) {
  const page = await pdf.getPage(i);
  const viewport = page.getViewport({ scale: 1.5 });

  // Try SVG rendering path
  try {
    const opList = await page.getOperatorList();
    const svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
    const svg = await svgGfx.getSVG(opList, viewport);
    const serializer = { serializeToString: (el) => el.toString() };
    // Use the DOM-like SVG serialization
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="${viewport.width}" height="${viewport.height}" 
      viewBox="0 0 ${viewport.width} ${viewport.height}">
      ${svg.innerHTML || ''}
    </svg>`;
    const outPath = path.join(OUT_DIR, `page-${i}.svg`);
    writeFileSync(outPath, svgStr);
    console.log(`  Page ${i} → page-${i}.svg (SVG)`);
  } catch (svgErr) {
    console.log(`  Page ${i}: SVG failed (${svgErr.message}), skipping`);
  }
  page.cleanup();
}

console.log('Done!');
