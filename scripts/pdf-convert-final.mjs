import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);

// Try to load sharp from multiple locations
let sharp;
try {
  sharp = (await import('/home/ubuntu/workspace/node_modules/sharp/lib/index.js')).default;
} catch (e) {
  try {
    sharp = (await import('/home/ubuntu/workspace/app/node_modules/sharp/lib/index.js')).default;
  } catch (e2) {
    throw new Error('sharp not found: ' + e2.message);
  }
}

// Load pdfjs
const pdfjsPath = '/home/ubuntu/workspace/app/src/frontend/node_modules/pdfjs-dist/legacy/build/pdf.mjs';
const pdfjsLib = await import(pdfjsPath);
const pdfjs = pdfjsLib.default ?? pdfjsLib;

// Disable worker
pdfjs.GlobalWorkerOptions.workerSrc = '';

const PDF_PATH = '/home/ubuntu/workspace/app/src/frontend/public/assets/mahindra-glyd-casestudy.pdf';
const OUT_DIR = '/home/ubuntu/workspace/app/src/frontend/public/assets/';
const SCALE = 2.0;

function makeCanvasContext(buf, width, height) {
  // Fill buffer with white
  buf.fill(255);

  const ctx = {
    _buf: buf,
    _width: width,
    _height: height,
    canvas: { width, height },
    // Drawing stubs
    save() {},
    restore() {},
    scale() {},
    rotate() {},
    translate() {},
    transform() {},
    setTransform() {},
    resetTransform() {},
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    bezierCurveTo() {},
    quadraticCurveTo() {},
    arc() {},
    rect() {},
    clip() {},
    fill() {},
    stroke() {},
    clearRect() {},
    strokeRect() {},
    drawImage() {},
    createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
    putImageData(imgData, dx, dy) {
      const srcW = imgData.width;
      const srcH = imgData.height;
      for (let y = 0; y < srcH; y++) {
        for (let x = 0; x < srcW; x++) {
          const px = dx + x;
          const py = dy + y;
          if (px < 0 || px >= width || py < 0 || py >= height) continue;
          const srcIdx = (y * srcW + x) * 4;
          const dstIdx = (py * width + px) * 4;
          buf[dstIdx]     = imgData.data[srcIdx];
          buf[dstIdx + 1] = imgData.data[srcIdx + 1];
          buf[dstIdx + 2] = imgData.data[srcIdx + 2];
          buf[dstIdx + 3] = imgData.data[srcIdx + 3];
        }
      }
    },
    getImageData(sx, sy, sw, sh) {
      const data = new Uint8ClampedArray(sw * sh * 4);
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const srcIdx = ((sy + y) * width + (sx + x)) * 4;
          const dstIdx = (y * sw + x) * 4;
          if (srcIdx + 3 < buf.length) {
            data[dstIdx]     = buf[srcIdx];
            data[dstIdx + 1] = buf[srcIdx + 1];
            data[dstIdx + 2] = buf[srcIdx + 2];
            data[dstIdx + 3] = buf[srcIdx + 3];
          }
        }
      }
      return { data, width: sw, height: sh };
    },
    fillRect(x, y, w, h) {
      // Try to fill with current fillStyle if it's parseable
    },
    measureText(text) { return { width: text.length * 10 }; },
    fillText() {},
    strokeText() {},
    createLinearGradient() { return { addColorStop() {} }; },
    createRadialGradient() { return { addColorStop() {} }; },
    createPattern() { return {}; },
    setLineDash() {},
    getLineDash() { return []; },
    isPointInPath() { return false; },
    isPointInStroke() { return false; },
  };
  // Add property descriptors for common style properties
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 10;
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.imageSmoothingEnabled = true;
  return ctx;
}

async function main() {
  const data = readFileSync(PDF_PATH);
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(data) });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  console.log(`PDF loaded, ${numPages} pages`);

  let successCount = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: SCALE });
      const width = Math.floor(viewport.width);
      const height = Math.floor(viewport.height);

      const buf = Buffer.alloc(width * height * 4, 255);
      const canvasContext = makeCanvasContext(buf, width, height);

      const renderTask = page.render({
        canvasContext,
        viewport,
        intent: 'print',
      });

      try {
        await renderTask.promise;
      } catch (renderErr) {
        console.warn(`Page ${pageNum} render error (continuing): ${renderErr.message}`);
      }

      const outPath = path.join(OUT_DIR, `glyd-page-${pageNum}.png`);
      await sharp(buf, { raw: { width, height, channels: 4 } })
        .png({ compressionLevel: 6 })
        .toFile(outPath);

      console.log(`Saved: ${outPath} (${width}x${height})`);
      successCount++;
    } catch (pageErr) {
      console.error(`Page ${pageNum} failed: ${pageErr.message}`);
    }
  }

  const jsonPath = path.join(OUT_DIR, 'glyd-pages.json');
  writeFileSync(jsonPath, JSON.stringify({ count: successCount, total: numPages }));
  console.log(`Done: ${successCount}/${numPages} pages converted`);
  console.log(`JSON: ${jsonPath}`);
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
