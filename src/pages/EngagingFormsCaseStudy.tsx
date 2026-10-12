import { Link } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useState } from "react";

const EngagingFormsCaseStudy: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [inlineStyles, setInlineStyles] = useState<string>("");
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/assets/engaging-forms-casestudy.html")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((raw) => {
        if (cancelled) return;
        // Detect base64-encoded content (attachments are stored as base64)
        let html = raw.trim();
        const isBase64 =
          /^[A-Za-z0-9+/=\s]+$/.test(html.slice(0, 100)) &&
          !html.startsWith("<");
        if (isBase64) {
          try {
            html = atob(html.replace(/\s/g, ""));
          } catch {
            // not actually base64, use as-is
          }
        }

        // Extract all <style> blocks
        const styleMatches =
          html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) ?? [];
        const combinedStyles = styleMatches
          .map((s) => s.replace(/<\/?style[^>]*>/gi, ""))
          .join("\n");

        // Extract <body> content; fall back to full HTML if no <body> tag
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;

        setInlineStyles(combinedStyles);
        setHtmlContent(bodyContent);
        setStatus("success");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "#000",
          borderBottom: "1px solid #1a1a1a",
          padding: "1.5rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "80px",
          boxSizing: "border-box" as const,
        }}
      >
        <Link
          to="/"
          style={{
            color: "#999",
            textDecoration: "none",
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
            fontFamily: "sans-serif",
          }}
          data-ocid="engaging-forms.back_link"
        >
          ← Back to Works
        </Link>
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.1rem",
            letterSpacing: "0.1em",
            fontFamily: "sans-serif",
          }}
        >
          KAPILAN.
        </span>
        <a
          href="https://www.figma.com/design/5T7mmHXnwaCynUnv4fhtLz/Untitled?node-id=0-1&t=gyU5mTRLjtCwQVwE-1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "0.875rem",
            letterSpacing: "0.05em",
            fontFamily: "sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.5rem 1rem",
            border: "1px solid #333",
            borderRadius: "4px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "#000";
            e.currentTarget.style.borderColor = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = "#333";
          }}
          data-ocid="engaging-forms.figma_link"
        >
          View on Figma ↗
        </a>
      </header>

      {/* Main Content */}
      <main
        style={{
          background: "#fff",
          paddingTop: 0,
          marginTop: 0,
          overflow: "hidden",
        }}
      >
        {status === "loading" && (
          <div
            data-ocid="engaging-forms.loading_state"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 80px)",
              color: "#fff",
              fontFamily: "sans-serif",
              fontSize: "1rem",
              background: "#000",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #333",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 1rem",
                }}
              />
              <p style={{ color: "#666", letterSpacing: "0.05em" }}>
                Loading case study…
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div
            data-ocid="engaging-forms.error_state"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "calc(100vh - 80px)",
              background: "#000",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#ff4444",
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem",
                }}
              >
                Unable to load the case study.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1.5rem",
                  background: "#fff",
                  color: "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontFamily: "sans-serif",
                }}
                data-ocid="engaging-forms.retry_button"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {status === "success" && htmlContent !== null && (
          <div
            data-ocid="engaging-forms.content"
            style={{
              overflow: "hidden",
              display: "flow-root",
              marginTop: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginBottom: 0,
            }}
          >
            {/* Inject the HTML file's own styles scoped to this container, with margin resets — no overflow:hidden on html/body to keep scroll intact */}
            <style>{`html,body{margin:0;padding:0;}@keyframes spin { to { transform: rotate(360deg); } }${inlineStyles}`}</style>
            {/* Render body content directly — looks like a designed page */}
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: intentional — rendering user-uploaded case study HTML
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{
                width: "100%",
                marginBottom: 0,
                paddingBottom: 0,
                display: "block",
                overflow: "hidden",
              }}
            />
          </div>
        )}

        {status === "loading" && (
          <style>
            {"@keyframes spin { to { transform: rotate(360deg); } }"}
          </style>
        )}
      </main>

      {/* Footer — same as GlydCaseStudy.tsx */}
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
};

export default EngagingFormsCaseStudy;
