import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// PDF.js type stubs — loaded from CDN at runtime
interface PdfPage {
  getViewport(opts: { scale: number }): { width: number; height: number };
  render(opts: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }): { promise: Promise<void> };
}
interface PdfDoc {
  numPages: number;
  getPage(n: number): Promise<PdfPage>;
}
interface PdfjsLib {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(opts: { data: Uint8Array }): { promise: Promise<PdfDoc> };
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

export default function BetterplaceCaseStudy() {
  const [pages, setPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderProgress, setRenderProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAndRenderPDF() {
      try {
        // Step 1: load PDF.js from CDN
        await loadScript(
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",
        );
        if (cancelled) return;

        const pdfjsLib = (window as unknown as { pdfjsLib: PdfjsLib }).pdfjsLib;
        if (!pdfjsLib)
          throw new Error("pdfjsLib not available after script load");

        // Step 2: use fake worker mode — runs in main thread, no CDN worker needed
        pdfjsLib.GlobalWorkerOptions.workerSrc = "";

        // Step 3: fetch the PDF as ArrayBuffer
        const resp = await fetch("/assets/betterplace-casestudy.pdf");
        if (!resp.ok) throw new Error(`PDF fetch failed: ${resp.status}`);
        const arrayBuffer = await resp.arrayBuffer();
        if (cancelled) return;

        // Step 4: load PDF document
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        const numPages = pdfDoc.numPages;
        setTotalPages(numPages);

        // Step 5: render each page to canvas → PNG data URL
        const dataUrls: string[] = [];
        for (let i = 1; i <= numPages; i++) {
          if (cancelled) return;
          const page = await pdfDoc.getPage(i);
          const scale = Math.max(2.0, (window.devicePixelRatio ?? 1) * 1.5);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          await page.render({ canvasContext: ctx, viewport }).promise;
          dataUrls.push(canvas.toDataURL("image/png"));
          setRenderProgress(i);
        }

        if (!cancelled) {
          setPages(dataUrls);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[BetterplaceCaseStudy] PDF load error:", err);
          setError(err instanceof Error ? err.message : String(err));
          setLoading(false);
        }
      }
    }

    loadAndRenderPDF();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            data-ocid="betterplace.back.link"
            className="text-white hover:text-white/70 transition-colors flex items-center gap-2"
          >
            <span className="text-sm">←</span>
            <span className="text-sm font-medium tracking-wide">Back</span>
          </Link>
          <Link to="/" className="text-lg font-bold tracking-wider">
            KAPILAN.
          </Link>
          <a
            href="https://www.behance.net/kapilanvelu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-all"
          >
            View on Behance ↗
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 flex-1">
        {loading && (
          <div
            data-ocid="betterplace.loading_state"
            className="flex flex-col items-center justify-center min-h-[80vh] gap-4"
          >
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/50 text-base">
              {totalPages > 0
                ? `Rendering page ${renderProgress} of ${totalPages}…`
                : "Loading case study…"}
            </p>
          </div>
        )}

        {error && (
          <div
            data-ocid="betterplace.error_state"
            className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-6 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Betterplace
            </h1>
            <p className="text-white/50 max-w-md text-base leading-relaxed">
              Mobile App · Fintech · UX Design
            </p>
            <Link
              to="/"
              data-ocid="betterplace.error.back.link"
              className="inline-flex items-center gap-2 bg-white text-black font-semibold px-8 py-4 hover:bg-white/90 transition-colors"
            >
              ← Back to Portfolio
            </Link>
          </div>
        )}

        {!loading && !error && pages.length > 0 && (
          <div className="w-full bg-[#0a0a0a]">
            {pages.map((dataUrl, index) => (
              <img
                // biome-ignore lint/suspicious/noArrayIndexKey: PDF pages are ordered and stable
                key={`page-${index}`}
                src={dataUrl}
                alt={`Betterplace — Page ${index + 1}`}
                style={{
                  display: "block",
                  width: "100%",
                  maxWidth: "100vw",
                  margin: 0,
                  padding: 0,
                  lineHeight: 0,
                  marginBottom: index < pages.length - 1 ? "3px" : 0,
                }}
                loading={index === 0 ? "eager" : "lazy"}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} Kapilan Velayutham G. All rights
            reserved.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="mailto:kapilan.velu@gmail.com"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              kapilan.velu@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/kapilan-velayutham/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://www.behance.net/kapilanvelu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              Behance
            </a>
            <a
              href="https://dribbble.com/kapilanvelayutham"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              Dribbble
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
