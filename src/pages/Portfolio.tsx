import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type SkillItem = {
  id: bigint;
  name: string;
  category: string;
  proficiency: bigint;
};

// ── Default content ───────────────────────────────────────────────
const DEFAULT_INFO = {
  name: "Kapilan Velayutham G",
  designation: "Product Designer II",
  bio: "Seasoned 'Product Designer' with 7+ years of experience in solving business problems. I bridge user needs and business goals to craft intuitive, impactful digital experiences.",
  email: "kapilan.velu@gmail.com",
  phone: "+91 9500437977",
  location: "Chennai, India",
  linkedinUrl: "https://www.linkedin.com/in/kapilan-velayutham/",
  dribbbleUrl: "https://dribbble.com/kapilanvelayutham",
  githubUrl: "https://www.behance.net/kapilanvelu", // repurposed for Behance
  mediumUrl: "",
  resumeUrl: "/assets/resume.pdf",
  avatarBlobId: undefined as string | undefined,
};

const DEFAULT_PROJECTS = [
  {
    id: BigInt(13),
    title: "Command Center Redesign",
    description:
      "A comprehensive command center redesign focused on clarity and efficiency",
    tags: ["UX Design", "Dashboard", "Redesign"],
    category: "UX/UI Design",
    company: "Personal Project",
    period: "2024",
    coverImage: "",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(1),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
  },
  {
    id: BigInt(14),
    title: "Hotel Search Redesign",
    description:
      "A hotel search card redesign focused on intuitive filtering, visual hierarchy, and conversion-driven UX.",
    tags: ["UX Design", "Hotel Search", "Travel"],
    category: "UX Design · Travel",
    company: "Personal Project",
    period: "2024",
    coverImage: "/assets/h-cover-019e81c0-a343-76a6-867f-c7c83bce786e.png",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(2),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
  },
  {
    id: BigInt(12),
    title: "Engaging Forms",
    description:
      "A deep-dive into form UX — reducing friction, improving completion rates, and creating intuitive input experiences across digital products.",
    tags: ["UX Design", "Form Design", "Product Design"],
    category: "Case Study",
    company: "Personal Project",
    period: "2024",
    coverImage: "",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(3),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
  },
  {
    id: BigInt(8),
    title: "Mahindra Glyd Application",
    description: "India's first electric taxi service — NASSCOM award winner",
    tags: ["Mobile App", "EV Mobility", "Ride-Hailing", "UX Design"],
    category: "UX / Product Design",
    company: "Cartoon Mango Design Studio",
    period: "2018–2019",
    coverImage: "/assets/generated/glyd-case-study-hero.dim_1200x630.jpg",
    caseStudyUrl: "",
    liveUrl:
      "https://www.behance.net/gallery/87071983/Mahindra-Glyd-Application",
    order: BigInt(4),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
  },
  {
    id: BigInt(9),
    title: "Metro Cash & Carry",
    description:
      "Wholesale B2C enterprise digital transformation — website, Android app, and iOS app redesign.",
    tags: ["E-Commerce", "B2C", "Mobile App"],
    category: "Enterprise UX",
    company: "Metro C&C",
    period: "2019–2020",
    coverImage:
      "/assets/metro_cash_and_carry-019e63a3-8025-70c4-ad6e-b1e4751a5b56.png",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(5),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
  },
  {
    id: BigInt(10),
    title: "Betterplace",
    description:
      "A white-label fintech mobile application built for financial inclusion, enabling digital payments and banking services.",
    tags: ["Mobile App", "Fintech", "UX Design"],
    category: "Mobile App",
    company: "Novopay",
    period: "2019–2020",
    coverImage: "/assets/generated/project-1-mockup.dim_800x600.jpg",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(6),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
  },
];

const DEFAULT_SKILLS = [
  {
    id: BigInt(1),
    name: "Figma",
    category: "Design Tools",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(2),
    name: "Adobe XD",
    category: "Design Tools",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(3),
    name: "Sketch",
    category: "Design Tools",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(4),
    name: "Adobe Illustrator",
    category: "Design Tools",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(5),
    name: "Adobe Photoshop",
    category: "Design Tools",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(6),
    name: "Clarity",
    category: "Design Tools",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(13),
    name: "Hotjar",
    category: "Design Tools",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(14),
    name: "Notion",
    category: "Design Tools",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(15),
    name: "Jira",
    category: "Design Tools",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(16),
    name: "Confluence",
    category: "Design Tools",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(17),
    name: "ChatGPT",
    category: "Design Tools",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(18),
    name: "Claude",
    category: "Design Tools",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(19),
    name: "Gemini",
    category: "Design Tools",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(7),
    name: "User Research",
    category: "Design Methods",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(9),
    name: "Prototyping",
    category: "Design Methods",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(10),
    name: "Design Systems",
    category: "Design Methods",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(11),
    name: "Usability Testing",
    category: "Design Methods",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(12),
    name: "Information Architecture",
    category: "Design Methods",
    proficiency: BigInt(4),
  },
  {
    id: BigInt(13),
    name: "Product Thinking",
    category: "Soft Skills",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(14),
    name: "Stakeholder Communication",
    category: "Soft Skills",
    proficiency: BigInt(5),
  },
  {
    id: BigInt(15),
    name: "Cross-functional Collaboration",
    category: "Soft Skills",
    proficiency: BigInt(5),
  },
];

const TIMELINE = [
  { period: "APR 2024–PRESENT", role: "Product Designer II", company: "Xeni" },
  {
    period: "DEC 2022–FEB 2024",
    role: "Co-Founder",
    company: "Beow.in — Career Exploration",
  },
  { period: "SEP 2021–NOV 2022", role: "UX Designer", company: "Adapt.io" },
  {
    period: "SEP 2020–AUG 2021",
    role: "Associate Product Designer",
    company: "Engagedly",
  },
  { period: "NOV 2019–SEP 2020", role: "Designer", company: "Novopay" },
  {
    period: "DEC 2018–OCT 2019",
    role: "Jr Product Designer",
    company: "Cartoon Mango Design Studio",
  },
  {
    period: "AUG 2018–OCT 2018",
    role: "UX UI Intern",
    company: "Full Creative",
  },
  {
    period: "JAN 2018–MAY 2018",
    role: "Freelance Graphic Designer",
    company: "Epic Software",
  },
];

const EDUCATION = [
  { period: "2018", role: "UX UI Course", company: "Web D School" },
  { period: "2017", role: "Graphic Designing", company: "Web D School" },
  {
    period: "AUG 2010–MAY 2014",
    role: "BE — Electronics & Communication Engineering",
    company: "Mepco Schlenk Engineering College",
  },
];

// ── Helpers ───────────────────────────────────────────────────────
function ProjectCover({ fallback }: { fallback?: string }) {
  if (!fallback) return <div className="w-full h-full card-media-bg" />;
  return (
    <img
      src={fallback}
      alt="Project"
      className="w-full h-full object-cover card-thumb"
    />
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

// ── Nav ───────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "WORK", href: "work" },
  { label: "ABOUT", href: "about" },
  { label: "CONTACT", href: "contact" },
];

export default function Portfolio() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const info = DEFAULT_INFO;
  const projects = DEFAULT_PROJECTS;
  const skills = DEFAULT_SKILLS;

  const skillsByCategory = skills.reduce(
    (acc: Record<string, SkillItem[]>, skill: SkillItem) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, SkillItem[]>,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background font-inter">
      {/* ── HEADER ──────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          scrolled
            ? "shadow-[0_1px_0_0_oklch(0.9_0_0)]"
            : "border-b border-border"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-ocid="nav.brand.link"
            className="text-[15px] font-black tracking-tight text-foreground hover:opacity-70 transition-opacity"
          >
            KAPILAN.
          </button>

          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                data-ocid={`nav.${link.label.toLowerCase()}.link`}
                onClick={() => scrollTo(link.href)}
                className="text-[12px] font-semibold tracking-[0.1em] text-foreground hover:opacity-60 transition-opacity"
              >
                {link.label}
              </button>
            ))}
            <a
              href={info.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="nav.resume.link"
              className="text-[12px] font-semibold tracking-[0.1em] text-foreground hover:opacity-60 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                window.open(info.resumeUrl, "_blank", "noopener,noreferrer");
              }}
            >
              RESUME
            </a>
            
          </nav>

          <button
            type="button"
            className="md:hidden text-foreground p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.hamburger.button"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-px bg-current mb-1.5" />
            <div className="w-5 h-px bg-current mb-1.5" />
            <div className="w-5 h-px bg-current" />
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-border px-6 py-5 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="text-[12px] font-semibold tracking-[0.1em] text-foreground text-left"
              >
                {link.label}
              </button>
            ))}
            <a
              href={info.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-semibold tracking-[0.1em] text-foreground text-left"
              onClick={(e) => {
                e.preventDefault();
                window.open(info.resumeUrl, "_blank", "noopener,noreferrer");
              }}
            >
              RESUME
            </a>
            
          </div>
        )}
      </header>

      {/* ── HERO (dark) ──────────────────────────────────────── */}
      <section className="section-dark pt-14 min-h-screen flex flex-col justify-center relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 w-full py-24">
          <motion.p
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="text-[13px] font-semibold tracking-[0.15em] text-muted-on-dark uppercase mb-4"
          >
            HI. I'M
          </motion.p>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="text-display-xl text-white mb-6"
            style={{ lineHeight: 0.92 }}
          >
            KAPILAN.
          </motion.h1>

          <motion.div
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-display-md text-white uppercase mb-4"
            style={{ lineHeight: 1.05 }}
          >
            <span className="block">A DIGITAL PRODUCT DESIGNER /</span>
            <span className="block">CRAFTING INTUITIVE &amp;</span>
            <span className="block">IMPACTFUL EXPERIENCES.</span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="text-[12px] font-semibold tracking-[0.12em] text-muted-on-dark uppercase mb-10"
          >
            (PRODUCT DESIGNER II · 7+ YEARS · CHENNAI, INDIA)
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
            <button
              type="button"
              onClick={() => scrollTo("work")}
              data-ocid="hero.view_work.button"
              className="h-11 px-7 bg-white text-foreground text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-white/90 transition-colors"
            >
              VIEW WORK
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              data-ocid="hero.contact.button"
              className="h-11 px-7 border border-white text-white text-[12px] font-bold tracking-[0.1em] uppercase hover:bg-white/10 transition-colors"
            >
              CONTACT
            </button>
            <a
              href={info.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="hero.resume.link"
              className="h-11 px-7 flex items-center border border-white/40 text-white/70 text-[12px] font-bold tracking-[0.1em] uppercase hover:border-white hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.open(info.resumeUrl, "_blank", "noopener,noreferrer");
              }}
            >
              RÉSUMÉ
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-on-dark">
          <span className="text-[10px] tracking-[0.15em] uppercase">
            Scroll
          </span>
          <ArrowDown size={16} className="bounce-arrow" />
        </div>
      </section>

      {/* ── SELECTED WORKS (light) ───────────────────────────── */}
      <section id="work" className="section-light py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-display-sm uppercase tracking-tight">
              SELECTED WORKS
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, i) => {
              const isDefault = true;
              const dp = project as (typeof DEFAULT_PROJECTS)[0];
              const fallback = isDefault ? dp.coverImage : undefined;
              const category = isDefault
                ? dp.category
                : (project.tags[0] ?? "Design");
              const companyLabel = isDefault ? dp.company : undefined;
              const periodLabel = isDefault ? dp.period : undefined;
              const projectId = String(project.id);
              const isGlyd = project.id === BigInt(8);
              const isMetro = project.id === BigInt(9);
              const isBetterplace = project.id === BigInt(10);

              const isEngagingForms = project.id === BigInt(12);
              const isCommandCenter = project.id === BigInt(13);
              const isHotelSearch = project.id === BigInt(14);

              if (isCommandCenter) {
                return (
                  <motion.div
                    key={projectId}
                    data-ocid={`works.item.${i + 1}`}
                    variants={fadeUp}
                    custom={i * 0.5}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="project-card group"
                    style={{
                      background: "#0a0a0a",
                      borderTop: "4px solid #ffffff",
                      transition: "box-shadow 0.25s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate({
                        to: "/works/$projectId",
                        params: { projectId },
                      })
                    }
                    whileHover={{
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Command Center Visual */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #141414 100%)",
                        aspectRatio: "16/9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 8,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.08,
                        }}
                        width="100%"
                        height="100%"
                      >
                        <defs>
                          <pattern
                            id="cc-grid"
                            width="32"
                            height="32"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 32 0 L 0 0 0 32"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#cc-grid)" />
                      </svg>
                      <div
                        style={{
                          position: "absolute",
                          width: 200,
                          height: 200,
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                        }}
                      />
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          fontWeight: 900,
                          color: "#fff",
                          letterSpacing: -1,
                          zIndex: 1,
                        }}
                      >
                        CC
                      </div>
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: 18,
                          fontWeight: 900,
                          letterSpacing: 6,
                          lineHeight: 1,
                          zIndex: 1,
                          textShadow: "0 0 32px rgba(255,255,255,0.2)",
                          textAlign: "center",
                        }}
                      >
                        COMMAND CENTER
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 9,
                          letterSpacing: 4,
                          textTransform: "uppercase",
                          zIndex: 1,
                        }}
                      >
                        UX Design · Dashboard
                      </div>
                    </div>

                    <div style={{ padding: "16px 20px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          UX/UI Design
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          2024
                        </p>
                      </div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.02em",
                          color: "white",
                          marginBottom: 16,
                        }}
                      >
                        Command Center Redesign
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.55)",
                          lineHeight: 1.6,
                          marginBottom: 16,
                        }}
                      >
                        A comprehensive command center redesign focused on
                        clarity and efficiency
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 16,
                        }}
                      >
                        {["UX Design", "Dashboard", "Redesign"].map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "rgba(255,255,255,0.6)",
                              padding: "2px 8px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to="/works/$projectId"
                          params={{ projectId }}
                          data-ocid="command_center.view_case_study.link"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "white",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "white";
                          }}
                        >
                          View Case Study →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (isHotelSearch) {
                return (
                  <motion.div
                    key={projectId}
                    data-ocid={`works.item.${i + 1}`}
                    variants={fadeUp}
                    custom={i * 0.5}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="project-card group"
                    style={{
                      background: "#0a0a0a",
                      borderTop: "4px solid #ffffff",
                      transition: "box-shadow 0.25s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate({
                        to: "/works/$projectId",
                        params: { projectId },
                      })
                    }
                    whileHover={{
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Hotel Search Visual */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #141414 100%)",
                        aspectRatio: "16/9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 8,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <svg
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.08,
                        }}
                        width="100%"
                        height="100%"
                      >
                        <defs>
                          <pattern
                            id="hs-grid"
                            width="32"
                            height="32"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 32 0 L 0 0 0 32"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hs-grid)" />
                      </svg>
                      <div
                        style={{
                          position: "absolute",
                          width: 200,
                          height: 200,
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                        }}
                      />
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          fontWeight: 900,
                          color: "#fff",
                          letterSpacing: -1,
                          zIndex: 1,
                        }}
                      >
                        HS
                      </div>
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: 18,
                          fontWeight: 900,
                          letterSpacing: 6,
                          lineHeight: 1,
                          zIndex: 1,
                          textShadow: "0 0 32px rgba(255,255,255,0.2)",
                          textAlign: "center",
                        }}
                      >
                        HOTEL SEARCH
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 9,
                          letterSpacing: 4,
                          textTransform: "uppercase",
                          zIndex: 1,
                        }}
                      >
                        UX Design · Travel
                      </div>
                    </div>

                    <div style={{ padding: "16px 20px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          UX Design · Travel
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          2024
                        </p>
                      </div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.02em",
                          color: "white",
                          marginBottom: 16,
                        }}
                      >
                        Hotel Search Redesign
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.55)",
                          lineHeight: 1.6,
                          marginBottom: 16,
                        }}
                      >
                        A hotel search card redesign focused on intuitive
                        filtering, visual hierarchy, and conversion-driven UX.
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 16,
                        }}
                      >
                        {["UX Design", "Hotel Search", "Travel"].map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "rgba(255,255,255,0.6)",
                              padding: "2px 8px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to="/works/$projectId"
                          params={{ projectId }}
                          data-ocid="hotel_search.view_case_study.link"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "white",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "white";
                          }}
                        >
                          View Case Study →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (isEngagingForms) {
                return (
                  <motion.div
                    key={projectId}
                    data-ocid={`works.item.${i + 1}`}
                    variants={fadeUp}
                    custom={i * 0.5}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="project-card group"
                    style={{
                      background: "#0a0a0a",
                      borderTop: "4px solid #ffffff",
                      transition: "box-shadow 0.25s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate({
                        to: "/works/$projectId",
                        params: { projectId },
                      })
                    }
                    whileHover={{
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Engaging Forms Visual */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #141414 100%)",
                        aspectRatio: "16/9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 8,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {/* Decorative grid lines */}
                      <svg
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.08,
                        }}
                        width="100%"
                        height="100%"
                      >
                        <defs>
                          <pattern
                            id="ef-grid"
                            width="32"
                            height="32"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 32 0 L 0 0 0 32"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#ef-grid)" />
                      </svg>
                      {/* Purple glow orb */}
                      <div
                        style={{
                          position: "absolute",
                          width: 200,
                          height: 200,
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                        }}
                      />
                      {/* EF icon */}
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 20,
                          fontWeight: 900,
                          color: "#fff",
                          letterSpacing: -1,
                          zIndex: 1,
                        }}
                      >
                        EF
                      </div>
                      {/* Title wordmark */}
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: 18,
                          fontWeight: 900,
                          letterSpacing: 6,
                          lineHeight: 1,
                          zIndex: 1,
                          textShadow: "0 0 32px rgba(255,255,255,0.2)",
                          textAlign: "center",
                        }}
                      >
                        ENGAGING FORMS
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 9,
                          letterSpacing: 4,
                          textTransform: "uppercase",
                          zIndex: 1,
                        }}
                      >
                        UX Design · Form Design
                      </div>
                    </div>

                    {/* Card Info */}
                    <div style={{ padding: "16px 20px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          UX Design
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          2024
                        </p>
                      </div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.02em",
                          color: "white",
                          marginBottom: 16,
                        }}
                      >
                        Engaging Forms
                      </h3>
                      <p
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.55)",
                          lineHeight: 1.6,
                          marginBottom: 16,
                        }}
                      >
                        Designing Forms That Users Actually Complete
                      </p>

                      {/* Tags */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 16,
                        }}
                      >
                        {["UX Design", "Form Design", "Product Design"].map(
                          (tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "rgba(255,255,255,0.6)",
                                padding: "2px 8px",
                              }}
                            >
                              {tag}
                            </span>
                          ),
                        )}
                      </div>

                      {/* Action link */}
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to="/works/$projectId"
                          params={{ projectId }}
                          data-ocid="engaging_forms.view_case_study.link"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "white",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "white";
                          }}
                        >
                          View Case Study →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (isBetterplace) {
                return (
                  <motion.div
                    key={projectId}
                    data-ocid={`works.item.${i + 1}`}
                    variants={fadeUp}
                    custom={i * 0.5}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="project-card group"
                    style={{
                      background: "#0a0a0a",
                      borderTop: "4px solid #ffffff",
                      transition: "box-shadow 0.25s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate({
                        to: "/works/$projectId",
                        params: { projectId },
                      })
                    }
                    whileHover={{
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Betterplace Visual */}
                    <div
                      style={{
                        background:
                          "linear-gradient(135deg, #0a0a0a 0%, #111111 60%, #141414 100%)",
                        aspectRatio: "16/9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        gap: 8,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {/* Decorative grid lines */}
                      <svg
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          inset: 0,
                          opacity: 0.08,
                        }}
                        width="100%"
                        height="100%"
                      >
                        <defs>
                          <pattern
                            id="betterplace-grid"
                            width="32"
                            height="32"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 32 0 L 0 0 0 32"
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect
                          width="100%"
                          height="100%"
                          fill="url(#betterplace-grid)"
                        />
                      </svg>
                      {/* Indigo glow orb */}
                      <div
                        style={{
                          position: "absolute",
                          width: 200,
                          height: 200,
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%,-50%)",
                        }}
                      />
                      {/* B icon */}
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 24,
                          fontWeight: 900,
                          color: "#fff",
                          letterSpacing: -1,
                          zIndex: 1,
                        }}
                      >
                        B
                      </div>
                      {/* BETTERPLACE wordmark */}
                      <div
                        style={{
                          color: "#ffffff",
                          fontSize: 22,
                          fontWeight: 900,
                          letterSpacing: 8,
                          lineHeight: 1,
                          zIndex: 1,
                          textShadow: "0 0 32px rgba(255,255,255,0.2)",
                        }}
                      >
                        BETTERPLACE
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 9,
                          letterSpacing: 4,
                          textTransform: "uppercase",
                          zIndex: 1,
                        }}
                      >
                        Fintech · Mobile
                      </div>
                    </div>

                    {/* Card Info */}
                    <div style={{ padding: "16px 20px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          Mobile App
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                          }}
                        >
                          Novopay
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          2019–2020
                        </p>
                      </div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.02em",
                          color: "white",
                          marginBottom: 16,
                        }}
                      >
                        Betterplace
                      </h3>

                      {/* Tags */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 16,
                        }}
                      >
                        {["Mobile App", "Fintech", "UX Design"].map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "rgba(255,255,255,0.6)",
                              padding: "2px 8px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action link */}
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to="/works/$projectId"
                          params={{ projectId }}
                          data-ocid="betterplace.view_case_study.link"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "white",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "white";
                          }}
                        >
                          View Case Study →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (isMetro) {
                return (
                  <motion.div
                    key={projectId}
                    data-ocid={`works.item.${i + 1}`}
                    variants={fadeUp}
                    custom={i * 0.5}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="project-card group"
                    style={{
                      background: "#0a0a0a",
                      borderTop: "4px solid #ffffff",
                      transition: "box-shadow 0.25s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate({
                        to: "/works/$projectId",
                        params: { projectId },
                      })
                    }
                    whileHover={{
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Metro Cover Image */}
                    <div
                      style={{
                        aspectRatio: "16/9",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src="/assets/metro_cash_and_carry-019e63a3-8025-70c4-ad6e-b1e4751a5b56.png"
                        alt="Metro Cash & Carry"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    {/* Card Info */}
                    <div style={{ padding: "16px 20px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          Enterprise UX
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                          }}
                        >
                          Metro C&amp;C
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          2019–2020
                        </p>
                      </div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.02em",
                          color: "white",
                          marginBottom: 16,
                        }}
                      >
                        Metro Cash &amp; Carry
                      </h3>

                      {/* Tags */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 16,
                        }}
                      >
                        {["E-Commerce", "B2C", "Mobile App"].map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "rgba(255,255,255,0.6)",
                              padding: "2px 8px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action link */}
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to="/works/$projectId"
                          params={{ projectId }}
                          data-ocid="metro.view_case_study.link"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "white",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "white";
                          }}
                        >
                          View Case Study →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (isGlyd) {
                return (
                  <motion.div
                    key={projectId}
                    data-ocid={`works.item.${i + 1}`}
                    variants={fadeUp}
                    custom={i * 0.5}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="project-card group"
                    style={{
                      background: "#0a0a0a",
                      borderTop: "4px solid #ffffff",
                      transition: "box-shadow 0.25s ease",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      navigate({
                        to: "/works/$projectId",
                        params: { projectId },
                      })
                    }
                    whileHover={{
                      boxShadow:
                        "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Mahindra Glyd Cover Image */}
                    <div
                      style={{
                        aspectRatio: "16/9",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <img
                        src="/assets/mahindra_glyd-019e6413-07ea-77ef-9df5-e137adc8529a.png"
                        alt="Mahindra Glyd Application"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    {/* Card Info */}
                    <div style={{ padding: "16px 20px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.5)",
                            textTransform: "uppercase",
                          }}
                        >
                          UX / Product Design
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.4)",
                            textTransform: "uppercase",
                          }}
                        >
                          Cartoon Mango
                        </p>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          ·
                        </span>
                        <p
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          2018–2019
                        </p>
                      </div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 900,
                          textTransform: "uppercase",
                          letterSpacing: "-0.02em",
                          color: "white",
                          marginBottom: 16,
                        }}
                      >
                        Mahindra Glyd Application
                      </h3>

                      {/* Tags */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          marginBottom: 16,
                        }}
                      >
                        {[
                          "Mobile App",
                          "EV Mobility",
                          "Ride-Hailing",
                          "UX Design",
                        ].map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              border: "1px solid rgba(255,255,255,0.2)",
                              color: "rgba(255,255,255,0.6)",
                              padding: "2px 8px",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Action links */}
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <Link
                          to="/works/$projectId"
                          params={{ projectId }}
                          data-ocid="glyd.view_case_study.link"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "white",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.color = "#ffffff";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.color = "white";
                          }}
                        >
                          View Case Study →
                        </Link>
                        <a
                          href="https://www.behance.net/gallery/87071983/Mahindra-Glyd-Application"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-ocid="glyd.behance.link"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "rgba(255,255,255,0.6)",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            transition: "opacity 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            (e.target as HTMLElement).style.opacity = "0.7";
                          }}
                          onMouseLeave={(e) => {
                            (e.target as HTMLElement).style.opacity = "1";
                          }}
                        >
                          View on Behance ↗
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={projectId}
                  data-ocid={`works.item.${i + 1}`}
                  variants={fadeUp}
                  custom={i * 0.5}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="project-card bg-white"
                >
                  <Link to="/works/$projectId" params={{ projectId }}>
                    <div className="aspect-[16/9] overflow-hidden card-media-bg">
                      <ProjectCover fallback={fallback} />
                    </div>
                    <div className="p-5 pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-on-light uppercase">
                          {category}
                        </p>
                        {companyLabel && (
                          <>
                            <span className="text-muted-on-light text-[11px]">
                              ·
                            </span>
                            <p className="text-[11px] font-semibold tracking-[0.1em] text-muted-on-light uppercase">
                              {companyLabel}
                            </p>
                          </>
                        )}
                        {periodLabel && (
                          <>
                            <span className="text-muted-on-light text-[11px]">
                              ·
                            </span>
                            <p className="text-[11px] tracking-[0.08em] text-muted-on-light">
                              {periodLabel}
                            </p>
                          </>
                        )}
                      </div>
                      <h3 className="text-[15px] font-black uppercase tracking-tight text-foreground">
                        {project.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {projects.length === 0 && (
            <div
              data-ocid="works.empty_state"
              className="py-20 text-center text-muted-foreground text-sm"
            >
              No projects yet.
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT & TIMELINE (light) ─────────────────────────── */}
      <section
        id="about"
        className="section-light py-24 border-t border-border"
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-display-sm uppercase tracking-tight mb-14"
          >
            ABOUT &amp; TIMELINE
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
            {/* Left — Bio + Experience + Education */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-on-light mb-4">
                ABOUT ME
              </p>
              <p className="text-[15px] leading-relaxed text-foreground mb-10">
                {info.bio}
              </p>

              {/* Work Experience */}
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-on-light mb-5">
                EXPERIENCE
              </p>
              <div className="space-y-5 mb-12">
                {TIMELINE.map((item) => (
                  <div
                    key={item.period + item.company}
                    className="flex gap-5 border-b border-border pb-5 last:border-0"
                  >
                    <span className="text-[10px] font-mono font-bold tracking-tight text-muted-on-light w-36 shrink-0 pt-0.5">
                      [{item.period}]
                    </span>
                    <div>
                      <p className="text-[13px] font-bold uppercase tracking-tight">
                        {item.role}
                      </p>
                      <p className="text-[12px] text-muted-on-light">
                        {item.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Education */}
              <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-on-light mb-5">
                EDUCATION
              </p>
              <div className="space-y-5">
                {EDUCATION.map((item) => (
                  <div
                    key={item.period + item.company}
                    className="flex gap-5 border-b border-border pb-5 last:border-0"
                  >
                    <span className="text-[10px] font-mono font-bold tracking-tight text-muted-on-light w-36 shrink-0 pt-0.5">
                      [{item.period}]
                    </span>
                    <div>
                      <p className="text-[13px] font-bold uppercase tracking-tight">
                        {item.role}
                      </p>
                      <p className="text-[12px] text-muted-on-light">
                        {item.company}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Skills */}
            <motion.div
              variants={fadeUp}
              custom={0.5}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {(
                Object.entries(skillsByCategory) as [string, SkillItem[]][]
              ).map(([cat, catSkills]) => (
                <div key={cat} className="mb-8">
                  <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted-on-light mb-4">
                    {cat}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <span
                        key={String(skill.id)}
                        className="skill-tag text-foreground"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONTACT (dark) ───────────────────────────────────── */}
      <section id="contact" className="section-dark py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-[11px] font-semibold tracking-[0.15em] text-muted-on-dark uppercase mb-5"
          >
            CONTACT
          </motion.p>

          <motion.h2
            variants={fadeUp}
            custom={0.5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-display-lg text-white uppercase mb-8"
            style={{ lineHeight: 0.95 }}
          >
            LET'S WORK
            <br />
            TOGETHER.
          </motion.h2>

          <motion.a
            variants={fadeUp}
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            href={`mailto:${info.email}`}
            data-ocid="contact.email.link"
            className="block text-display-md text-white font-black hover:opacity-70 transition-opacity mb-4"
            style={{ lineHeight: 1 }}
          >
            {info.email}
          </motion.a>

          <motion.a
            variants={fadeUp}
            custom={1.2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            href={`tel:${info.phone}`}
            data-ocid="contact.phone.link"
            className="block text-[20px] font-bold text-muted-on-dark uppercase tracking-widest hover:text-white transition-colors mb-12"
          >
            {info.phone}
          </motion.a>

          <motion.div
            variants={fadeUp}
            custom={1.5}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-1 text-[12px] font-semibold tracking-[0.1em] text-muted-on-dark uppercase"
          >
            {info.linkedinUrl && (
              <>
                <a
                  href={info.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.linkedin.link"
                  className="hover:text-white transition-colors"
                >
                  LINKEDIN
                </a>
                <span className="mx-2">·</span>
              </>
            )}
            {info.dribbbleUrl && (
              <>
                <a
                  href={info.dribbbleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="contact.dribbble.link"
                  className="hover:text-white transition-colors"
                >
                  DRIBBBLE
                </a>
                <span className="mx-2">·</span>
              </>
            )}
            {info.githubUrl && (
              <a
                href={info.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="contact.behance.link"
                className="hover:text-white transition-colors"
              >
                BEHANCE
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER (light) ───────────────────────────────────── */}
      <footer className="section-light border-t border-border py-5">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-muted-on-light">
            © {new Date().getFullYear()} KAPILAN VELAYUTHAM G
          </p>
          <p className="text-[11px] tracking-[0.05em] text-muted-on-light">
            Built with ♥ using{" "}
          </p>
        </div>
      </footer>
    </div>
  );
}
