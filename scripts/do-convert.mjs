import { readFileSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const pdfPath = '/home/ubuntu/workspace/app/src/frontend/public/assets/mahindra-glyd-casestudy.pdf';
const outputDir = '/home/ubuntu/workspace/app/src/frontend/public/assets';

try {
  // sharp is in workspace root node_modules
  const sharp = require('/home/ubuntu/workspace/app/node_modules/sharp');
  console.log('sharp loaded ok');
  
  const pdfData = readFileSync(pdfPath);
  console.log('PDF size:', pdfData.length, 'bytes');
  
  // Try loading pdfjs
  let pdfjs;
  try {
    pdfjs = await import('/home/ubuntu/workspace/app/src/frontend/node_modules/pdfjs-dist/legacy/build/pdf.mjs');
    console.log('pdfjs-dist legacy loaded');
  } catch(e) {
    try {
      pdfjs = await import('/home/ubuntu/workspace/app/src/frontend/node_modules/pdfjs-dist/build/pdf.mjs');
      console.log('pdfjs-dist standard loaded');
    } catch(e2) {
      console.error('pdfjs load failed:', e2.message);
      process.exit(1);
    }
  }
  
  pdfjs.GlobalWorkerOptions.workerSrc = '/home/ubuntu/workspace/app/node_modules/.pnpm/pdfjs-dist@5.7.284/node_modules/pdfjs-dist/build/pdf.worker.mjs';
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(pdfData), useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  console.log('Pages:', numPages);
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);
    
    // Create raw RGBA buffer for rendering
    const buffer = Buffer.alloc(width * height * 4);
    // Fill white background
    buffer.fill(255);
    
    const canvasCtx = {
      _buffer: buffer,
      _width: width,
      _height: height,
      canvas: { width, height },
      drawImage: () => {},
      save: () => {},
      restore: () => {},
      transform: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      clip: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      bezierCurveTo: () => {},
      quadraticCurveTo: () => {},
      arc: () => {},
      rect: () => {},
      fill: () => {},
      stroke: () => {},
      fillText: () => {},
      strokeText: () => {},
      measureText: (t) => ({ width: t.length * 6 }),
      setTransform: () => {},
      resetTransform: () => {},
      createImageData: (w, h) => ({ data: Buffer.alloc(w * h * 4), width: w, height: h }),
      getImageData: (x, y, w, h) => {
        const dst = Buffer.alloc(w * h * 4);
        for (let row = 0; row < h; row++) {
          buffer.copy(dst, row * w * 4, (y + row) * width * 4 + x * 4, (y + row) * width * 4 + (x + w) * 4);
        }
        return { data: dst, width: w, height: h };
      },
      putImageData: (imageData, x, y) => {
        const src = imageData.data;
        for (let row = 0; row < imageData.height; row++) {
          const srcOffset = row * imageData.width * 4;
          const dstOffset = (y + row) * width * 4 + x * 4;
          src.copy(buffer, dstOffset, srcOffset, srcOffset + imageData.width * 4);
        }
      },
      fillRect: () => {},
      clearRect: (x, y, w, h) => {
        for (let row = y; row < Math.min(y + h, height); row++) {
          buffer.fill(255, row * width * 4 + x * 4, row * width * 4 + (x + w) * 4);
        }
      },
      strokeRect: () => {},
      isPointInPath: () => false,
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      createPattern: () => null,
      fillStyle: '#ffffff',
      strokeStyle: '#000000',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      globalAlpha: 1,
      font: '10px sans-serif',
      textAlign: 'left',
      textBaseline: 'alphabetic',
      globalCompositeOperation: 'source-over',
      shadowColor: 'transparent',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
    };
    
    const renderContext = {
      canvasContext: canvasCtx,
      viewport,
    };
    
    await page.render(renderContext).promise;
    
    const outPath = path.join(outputDir, `glyd-page-${i}.png`);
    await sharp(buffer, { raw: { width, height, channels: 4 } })
      .png()
      .toFile(outPath);
    console.log(`Saved page ${i}: ${outPath}`);
  }
  console.log('ALL DONE', numPages);
} catch(err) {
  console.error('ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
}
