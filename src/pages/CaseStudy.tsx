import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import BetterplaceCaseStudy from "./BetterplaceCaseStudy";
import CommandCenterCaseStudy from "./CommandCenterCaseStudy";
import EngagingFormsCaseStudy from "./EngagingFormsCaseStudy";
import GlydCaseStudy from "./GlydCaseStudy";
import HotelSearchCaseStudy from "./HotelSearchCaseStudy";
import MetroCaseStudy from "./MetroCaseStudy";

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
    mockup1: "",
    mockup2: "",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(1),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
    problem: "",
    process: "",
    solution: "",
    outcome: "",
  },
  {
    id: BigInt(14),
    title: "Hotel Search Redesign",
    description:
      "A hotel search card redesign focused on intuitive filtering, visual hierarchy, and conversion-driven UX.",
    tags: ["UX Design", "Travel", "Redesign"],
    category: "UX/UI Design",
    company: "Personal Project",
    period: "2024",
    coverImage: "",
    mockup1: "",
    mockup2: "",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(2),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
    problem: "",
    process: "",
    solution: "",
    outcome: "",
  },
  {
    id: BigInt(12),
    title: "Engaging Forms",
    description:
      "UX case study exploring better form design patterns to improve user engagement and reduce drop-off rates.",
    tags: ["UX Design", "Form Design", "User Research"],
    category: "UX Design · Forms",
    company: "Personal Project",
    period: "2024",
    coverImage: "/assets/generated/project-1-mockup.dim_800x600.jpg",
    mockup1: "",
    mockup2: "",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(2),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
    problem: "",
    process: "",
    solution: "",
    outcome: "",
  },
  {
    id: BigInt(8),
    title: "Mahindra Glyd Application",
    description:
      "UX & Product Design — India's first electric taxi service app",
    tags: ["Mobile App", "EV Mobility", "Ride-Hailing"],
    category: "UX / Product Design",
    company: "Cartoon Mango Design Studio",
    period: "2018–2019",
    coverImage: "/images/glyd-cover.jpg",
    mockup1: "",
    mockup2: "",
    caseStudyUrl: "",
    liveUrl:
      "https://www.behance.net/gallery/87071983/Mahindra-Glyd-Application",
    order: BigInt(3),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
    problem:
      "Urban commuters in Mumbai needed a clean, sustainable, and premium alternative to fossil-fuel-based ride-hailing services like Ola and Uber. The primary challenge was designing an intuitive, user-friendly mobile platform that aligned with Mahindra's vision for eco-friendly mobility — while also delivering a seamless booking and in-cab experience that met the highest standards of safety and comfort.",
    process:
      "Conducted extensive user research and usability testing to understand commuter needs and pain points. Adopted a mobile-first, user-centric design approach for end-to-end user flows: onboarding, cab search & booking, real-time ride tracking, and in-app payments. Focused on the in-cab connected experience — wide-screen media tabs, productivity and entertainment suites, privacy screens, air purifiers, and ergonomic seating. Iterated on UI for clarity, simplicity, and accessibility for daily office commuters. Collaborated closely with Mahindra & Mahindra's engineering and brand teams.",
    solution:
      "A clean, premium mobile app (iOS & Android) enabling on-demand electric cab bookings in Mumbai's BKC and Lower Parel districts. Seamless booking flow: search, book, track, and pay — all within the app. In-cab connected experience powered by WiFi (Vodafone-Idea), wide-screen media entertainment, curated content, and zero-strain lighting. The product won the 'Best Ergonomic Product Design' award by NASSCOM and successfully launched India's first electric taxi service, setting a new benchmark for eco-friendly urban mobility.",
    outcome:
      "India's first electric taxi service — NASSCOM 'Best Ergonomic Product Design' award winner",
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
    coverImage: "/assets/generated/project-4-mockup.dim_800x600.jpg",
    mockup1: "/assets/generated/project-2-mockup.dim_800x600.jpg",
    mockup2: "/assets/generated/project-3-mockup.dim_800x600.jpg",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(4),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
    problem:
      "Metro Cash & Carry needed a full digital transformation across web, Android, and iOS to serve wholesale B2C customers more effectively and compete in the digital retail space.",
    process:
      "Conducted stakeholder workshops, competitive analysis, and user research with Metro's B2C customers. Mapped the end-to-end digital journey across web and mobile touchpoints.",
    solution:
      "Redesigned the website, Android app, and iOS app with a unified design language, improved navigation, and streamlined purchase flows for wholesale buyers.",
    outcome:
      "Delivered a cohesive digital experience across three platforms · Improved discoverability and checkout efficiency for B2C wholesale customers.",
  },
  {
    id: BigInt(10),
    title: "Betterplace",
    description:
      "Mobile fintech white-label product case study built at Novopay, covering UX research, competitor analysis, wireframing, and UI design.",
    tags: ["Mobile App", "Fintech", "UX Design"],
    category: "Mobile App · Fintech",
    company: "Novopay",
    period: "2021",
    coverImage: "/assets/generated/project-1-mockup.dim_800x600.jpg",
    mockup1: "/assets/generated/project-2-mockup.dim_800x600.jpg",
    mockup2: "/assets/generated/project-3-mockup.dim_800x600.jpg",
    caseStudyUrl: "",
    liveUrl: "",
    order: BigInt(5),
    createdAt: BigInt(0),
    coverImageBlobId: undefined as string | undefined,
    problem: "",
    process: "",
    solution: "",
    outcome: "",
  },
];

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

function CoverImage({ fallback }: { fallback?: string }) {
  if (!fallback) return <div className="w-full h-full card-media-bg" />;
  return <img src={fallback} alt="" className="w-full h-full object-cover" />;
}

export default function CaseStudy() {
  const { projectId } = useParams({ from: "/works/$projectId" });

  const project =
    DEFAULT_PROJECTS.find((p) => String(p.id) === projectId) ??
    DEFAULT_PROJECTS[0];

  const currentIndex = DEFAULT_PROJECTS.findIndex(
    (p) => String(p.id) === projectId,
  );
  const prevProject =
    currentIndex > 0 ? DEFAULT_PROJECTS[currentIndex - 1] : null;
  const nextProject =
    currentIndex < DEFAULT_PROJECTS.length - 1
      ? DEFAULT_PROJECTS[currentIndex + 1]
      : null;

  // Render dedicated Glyd case study for project id 8
  if (
    project.id === BigInt(8) ||
    (project.id !== BigInt(9) && project.title.toLowerCase().includes("glyd"))
  ) {
    return <GlydCaseStudy />;
  }

  // Render dedicated Metro Cash & Carry case study for project id 9
  if (project.id === BigInt(9)) {
    return <MetroCaseStudy />;
  }

  // Render dedicated Betterplace case study for project id 10
  if (project.id === BigInt(10)) {
    return <BetterplaceCaseStudy />;
  }

  // Render dedicated Engaging Forms case study for project id 12
  if (project.id === BigInt(12)) {
    return <EngagingFormsCaseStudy />;
  }

  // Render dedicated Hotel Search Redesign case study for project id 14
  if (project.id === BigInt(14)) {
    return <HotelSearchCaseStudy />;
  }

  // Render dedicated Command Center Redesign case study for project id 13
  if (project.id === BigInt(13)) {
    return <CommandCenterCaseStudy />;
  }

  return (
    <div className="min-h-screen bg-white font-inter">
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <Link
            to="/"
            data-ocid="casestudy.back.link"
            className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            BACK
          </Link>
          <span className="text-[14px] font-black tracking-tight text-foreground">
            KAPILAN.
          </span>
          <div className="w-16" />
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────── */}
      <div className="pt-14">
        <div className="section-dark px-6 lg:px-8 py-20">
          <div className="max-w-[1200px] mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-4"
            >
              <p className="text-[11px] font-semibold tracking-[0.15em] text-muted-on-dark uppercase">
                {project.category}
              </p>
              {project.company && (
                <>
                  <span className="text-muted-on-dark text-[11px]">·</span>
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-muted-on-dark uppercase">
                    {project.company}
                  </p>
                </>
              )}
              {project.period && (
                <>
                  <span className="text-muted-on-dark text-[11px]">·</span>
                  <p className="text-[11px] text-muted-on-dark">
                    {project.period}
                  </p>
                </>
              )}
            </motion.div>
            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="text-display-lg text-white uppercase mb-6"
              style={{ lineHeight: 0.95 }}
            >
              {project.title}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="text-[15px] text-muted-on-dark max-w-2xl leading-relaxed"
            >
              {project.description}
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mt-6"
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold tracking-[0.1em] uppercase border border-white/30 text-white/70 px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Hero cover image */}
        <div className="w-full aspect-[21/9] overflow-hidden card-media-bg">
          <CoverImage fallback={project.coverImage} />
        </div>
      </div>

      {/* ── CASE STUDY CONTENT ─────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20">
        {/* Problem */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 grid md:grid-cols-[200px_1fr] gap-8 lg:gap-16"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-on-light mb-1">
              01
            </p>
            <h2 className="text-[22px] font-black uppercase tracking-tight">
              PROBLEM
            </h2>
          </div>
          <div>
            <p className="text-[16px] leading-relaxed text-foreground">
              {project.problem}
            </p>
          </div>
        </motion.section>

        <div className="border-t border-border mb-20" />

        {/* Process */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 grid md:grid-cols-[200px_1fr] gap-8 lg:gap-16"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-on-light mb-1">
              02
            </p>
            <h2 className="text-[22px] font-black uppercase tracking-tight">
              PROCESS
            </h2>
          </div>
          <div>
            <p className="text-[16px] leading-relaxed text-foreground mb-8">
              {project.process}
            </p>
            <div className="aspect-[16/9] overflow-hidden rounded-sm card-media-bg">
              <img
                src={project.mockup1}
                alt="Process mockup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.section>

        <div className="border-t border-border mb-20" />

        {/* Solution */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 grid md:grid-cols-[200px_1fr] gap-8 lg:gap-16"
        >
          <div>
            <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-on-light mb-1">
              03
            </p>
            <h2 className="text-[22px] font-black uppercase tracking-tight">
              SOLUTION
            </h2>
          </div>
          <div>
            <p className="text-[16px] leading-relaxed text-foreground mb-8">
              {project.solution}
            </p>
            <div className="aspect-[16/9] overflow-hidden rounded-sm card-media-bg">
              <img
                src={project.mockup2}
                alt="Solution mockup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.section>

        <div className="border-t border-border mb-20" />

        {/* Outcome */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-on-light mb-4">
            OUTCOME
          </p>
          <p
            className="text-display-md font-black uppercase text-foreground"
            style={{ lineHeight: 1.1 }}
          >
            {project.outcome}
          </p>
        </motion.section>
      </div>

      {/* ── NEXT / PREV PROJECT ────────────────────────────── */}
      <div className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between">
            {prevProject ? (
              <Link
                to="/works/$projectId"
                params={{ projectId: String(prevProject.id) }}
                data-ocid="casestudy.prev.link"
                className="flex items-center gap-3 py-8 group text-left"
              >
                <ArrowLeft
                  size={16}
                  className="text-muted-on-light group-hover:text-foreground transition-colors"
                />
                <div>
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-on-light mb-1">
                    PREVIOUS
                  </p>
                  <p className="text-[13px] font-black uppercase tracking-tight group-hover:opacity-70 transition-opacity">
                    {prevProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextProject ? (
              <Link
                to="/works/$projectId"
                params={{ projectId: String(nextProject.id) }}
                data-ocid="casestudy.next.link"
                className="flex items-center gap-3 py-8 group text-right ml-auto"
              >
                <div>
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted-on-light mb-1">
                    NEXT
                  </p>
                  <p className="text-[13px] font-black uppercase tracking-tight group-hover:opacity-70 transition-opacity">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-muted-on-light group-hover:text-foreground transition-colors"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "3rem 1.5rem",
          marginTop: "auto",
          background: "#0a0a0a",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <a
                href="mailto:kapilan.velu@gmail.com"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ✉ kapilan.velu@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/kapilan-velayutham/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                LinkedIn
              </a>
              <a
                href="https://www.behance.net/kapilanvelu"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                Behance
              </a>
              <a
                href="https://dribbble.com/kapilanvelayutham"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                }}
              >
                Dribbble
              </a>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.75rem",
                textAlign: "center",
              }}
            >
              © {new Date().getFullYear()} Kapilan Velayutham G. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
