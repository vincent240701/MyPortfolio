import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { asset, EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL, PHOTO_URL, CONTACT_ENDPOINT, STUDY_YEAR, EDUCATION_YEARS } from "./site.config";

type Page = "home" | "portfolio" | "about" | "contact";

// Brand palette (matches the design brief)
const ACCENT = "#D7FF3F";

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: "HOME", page: "home" },
  { label: "PORTFOLIO", page: "portfolio" },
  { label: "ABOUT", page: "about" },
  { label: "CONTACT", page: "contact" },
];

const TICKER_TEXT =
  "OPEN TO INTERNSHIPS · REPUBLIC POLYTECHNIC — SINGAPORE · INFORMATION TECHNOLOGY · ";

const TAG_STYLES =
  "px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-white/15 rounded-sm text-white/50";

type Project = {
  num: string;
  title: string;
  description: string;
  tags: string[];
  category: "web" | "mobile" | "tools";
  year: string;
  hue: number;
  href?: string; // optional link to the live project or repo
  image?: string; // screenshot in public/projects/
};

const GH = "https://github.com/vincent240701";

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "Pokémon Card Browser",
    description:
      "React Native app that groups Pokémon by type (Fire, Water, Lightning, Grass) in a sectioned list, with colour-coded headers, icons, and card art loaded from the web.",
    tags: ["React Native", "Expo", "JavaScript"],
    category: "mobile",
    year: "2026",
    hue: 0,
    href: `${GH}/L10pokemon`,
    image: asset("projects/pokemon.jpg"),
  },
  {
    num: "02",
    title: "Car Quiz",
    description:
      "Image-based quiz app: pick the car in each photo from a dropdown, then get scored with feedback. Built with a reusable question component and React state.",
    tags: ["React Native", "Expo", "Picker"],
    category: "mobile",
    year: "2026",
    hue: 30,
    href: `${GH}/L06Quiz`,
    image: asset("projects/car-quiz.jpg"),
  },
  {
    num: "03",
    title: "Boat Showroom",
    description:
      "Scrollable showroom of boats built from a reusable card component, restyled with a custom StyleSheet: header banner, rounded images, and icon badges.",
    tags: ["React Native", "Components", "StyleSheet"],
    category: "mobile",
    year: "2026",
    hue: 200,
    href: `${GH}/L08`,
    image: asset("projects/boat-showroom.jpg"),
  },
  {
    num: "04",
    title: "Grade Checking System",
    description:
      "35 parametrised pytest cases (100% coverage) for grade-average and pass/fail functions, run on every push via GitHub Actions. The tests caught two planted bugs: averages rounding down and a score of exactly 50 failing.",
    tags: ["Python", "pytest", "GitHub Actions"],
    category: "tools",
    year: "2026",
    hue: 80,
    href: `${GH}/grade-checks`,
    image: asset("projects/grade-checks.jpg"),
  },
  {
    num: "05",
    title: "This Portfolio",
    description:
      "The site you're on: a single-page React + TypeScript portfolio with Tailwind CSS styling and Motion page transitions, built with Vite.",
    tags: ["React", "TypeScript", "Tailwind", "Vite"],
    category: "web",
    year: "2026",
    hue: 290,
    href: `${GH}/MyPortfolio`,
    image: asset("projects/portfolio.jpg"),
  },
];

// LinkedIn Learning certificates, newest first. `id` is the Certificate ID on each PDF.
const CERTS: { title: string; date: string; skills: string[]; id: string }[] = [
  { title: "Playwright Python and Pytest for Web Automation Testing", date: "Nov 2026", skills: ["pytest", "Python", "Web Testing"], id: "db571a81b21d56da559c3830eef03009d27971eda8a6e9e11d9824919c4eabe1" },
  { title: "Learning Photoshop (2023)", date: "Aug 2026", skills: ["Adobe Photoshop"], id: "0e19ee379ab6eda0e2b3a4d15ca4e7247f29fa34fa285e7752262eea2d5adbbb" },
  { title: "Illustrator 2023 Quick Start", date: "Aug 2026", skills: ["Adobe Illustrator"], id: "d5d98445cf36fb65877b8ac2d32bad744444a0a676cfb5a110f37abe0aa6dbec" },
  { title: "Building a Website with Node.js and Express.js", date: "Aug 2026", skills: ["Express.js", "Node.js"], id: "152046310d441664e36e880d78eab7c91fb2a8d975c0689c5202b614cf12f54f" },
  { title: "Programming Foundations: APIs and Web Services", date: "Aug 2026", skills: ["API Development", "Web Services"], id: "a1f265038766ce664858ad2722669bcf9caa4c821fb18e175ac52416031c8ece" },
  { title: "JavaScript: Web Form Programming", date: "Jul 2026", skills: ["JavaScript", "Form Design"], id: "f83bee13d96b27a875161b7dd881f89855cb1a59a52471a35c2cfbc49d8b9f87" },
  { title: "JavaScript: Enhancing the DOM", date: "Jun 2026", skills: ["JavaScript", "DOM"], id: "b3faac3cf08d7382f0951b85399d694e89e865cbe070bec9a31a9750fc762b05" },
  { title: "Create a Quick, Clean, and Cheap Website with Bootstrap Templates", date: "Jun 2026", skills: ["Bootstrap", "Web Development"], id: "de1a4859ede2d7e8f834f0155b93268888a87c9c26b407025860704db8a31a45" },
  { title: "Introduction to AI Ethics and Safety", date: "Jun 2026", skills: ["Responsible AI", "Data Ethics"], id: "898a09144fb8561f06709d3c8234df1ff487203e132ebf736974ab68a6ca0f10" },
  { title: "Unit Testing and Test Driven Development in Python", date: "Feb 2026", skills: ["TDD", "Python"], id: "609884a61c54597b9b6e7356430ac939cb4eeb91782160333cc5815bfd48193b" },
  { title: "Software Testing Foundations: Test Planning", date: "Jan 2026", skills: ["Software Testing", "Test Planning"], id: "682afb362deb720934ae15c737f030b3e878f2eb95df0c00fbc180319cfe2199" },
  { title: "Python for Data Visualization", date: "Jan 2026", skills: ["Data Visualization", "Python"], id: "b98727e4b530d3b030739e7760e04d4196ef37c0a2adfe627b93de8549d1adae" },
  { title: "Python Object-Oriented Programming", date: "Jan 2026", skills: ["Python", "OOP"], id: "79bd234dbc91af06ce35add4f065d99af389c5a51767c9279c9d627adf8f5a16" },
  { title: "Python Essential Training", date: "Jan 2026", skills: ["Python"], id: "fc8d5fe66614a808a3a948f03694787ee4e902e868c6850970a7627275a89dd7" },
  { title: "What Is Scrum?", date: "Nov 2025", skills: ["Scrum"], id: "5428c4df0179a99eb895386965e97536ee69df4578aabb928259fb661d1875ad" },
  { title: "Agile Foundations", date: "Nov 2025", skills: ["Agile", "Project Management"], id: "1d715305a86209f0746041db795523c469d8bc5e4de0f2028ef10df746964865" },
  { title: "Project Management Foundations: Requirements", date: "Nov 2025", skills: ["Requirements", "Project Management"], id: "f5687dc378ead90395139ea4bd34c9b2aec32bf1a16afe41753b9934c1505eea" },
  { title: "Certified Entry-Level Python Programmer (PCEP-30-02) Cert Prep", date: "Jul 2025", skills: ["Python"], id: "df5d0b6361b934ea91273863d98aa1dc6ce11b44e0fb83ae4cf8f645924d932c" },
];

// Skills, not tools (per the C390 brief). Tools are listed as supporting detail.
const SKILLS: { skill: string; tools: string }[] = [
  { skill: "Mobile app development", tools: "React Native · Expo" },
  { skill: "Web development", tools: "React · TypeScript · Node.js · Express · HTML/CSS" },
  { skill: "Software testing & QA", tools: "pytest · Playwright · TDD · GitHub Actions" },
  { skill: "Programming", tools: "Python · JavaScript" },
  { skill: "Image editing & illustration", tools: "Photoshop · Illustrator" },
  { skill: "Agile project work", tools: "Scrum · requirements gathering" },
  { skill: "Communication & presenting", tools: "Sales pitches · coaching" },
  { skill: "Leadership & teamwork", tools: "Led a sales team of 5" },
];

const EXPERIENCE = [
  { role: "Swim Coach", org: "", years: "2025 – 2026", text: "Coached children of varying skill levels, building water confidence, safety awareness and swimming ability." },
  { role: "Salesman", org: "Optima", years: "2024 – 2025", text: "Led a field sales team of 5 and delivered product demos and on-site pitches, reaching a 40% closing rate." },
];

const EDUCATION = [
  { course: "Diploma in Information Technology", school: "Republic Polytechnic", years: EDUCATION_YEARS },
  { course: "Integrated Mechanical & Electrical Design", school: "ITE College Central", years: "2020 – 2022" },
  { course: "Aerospace Avionics", school: "ITE College Central", years: "2018 – 2019" },
];

// Project row: becomes a real link only when the project has an href.
function Row({ href, className = "", ...rest }: any) {
  const Tag: any = href ? motion.a : motion.div;
  const link = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};
  return <Tag {...link} className={className + (href ? " cursor-pointer hover:bg-white/[0.025]" : "")} {...rest} />;
}

// ── Thumb ─────────────────────────────────────────────────────────────────────

function ProjectThumb({ project, size = "sm" }: { project: Project; size?: "sm" | "md" }) {
  const [open, setOpen] = useState(false);
  const w = size === "sm" ? "w-24 h-16" : "w-32 h-24 md:w-48 md:h-32";

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const box = (
    <div
      className={`${w} rounded flex-shrink-0 flex items-center justify-center overflow-hidden relative`}
      style={{ background: `hsla(${project.hue}, 70%, 12%, 1)`, border: `1px solid hsla(${project.hue}, 60%, 25%, 0.4)` }}
    >
      {project.image ? (
        <>
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity font-mono text-[9px] tracking-widest text-white">
            VIEW ⤢
          </span>
        </>
      ) : (
        <span
          className="font-mono text-[9px] font-bold tracking-widest"
          style={{ color: `hsla(${project.hue}, 80%, 70%, 0.7)` }}
        >
          {project.num}
        </span>
      )}
    </div>
  );

  if (!project.image) return box;

  return (
    <>
      <span
        role="button"
        tabIndex={0}
        aria-label={`View full screenshot of ${project.title}`}
        className="cursor-zoom-in"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); setOpen(true); } }}
      >
        {box}
      </span>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 overflow-y-auto cursor-zoom-out"
              style={{ background: "rgba(0,0,0,0.9)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { e.stopPropagation(); setOpen(false); }}
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} screenshot`}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 font-mono text-[11px] tracking-widest uppercase" style={{ background: "rgba(0,0,0,0.85)" }}>
                <span className="text-white">{project.title}</span>
                <div className="flex gap-6" onClick={(e) => e.stopPropagation()}>
                  {project.href && (
                    <a href={project.href} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>
                      View on GitHub ↗
                    </a>
                  )}
                  <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white uppercase tracking-widest">
                    Close ✕
                  </button>
                </div>
              </div>
              <img
                src={project.image}
                alt={`${project.title} full screenshot`}
                className="block mx-auto my-6 rounded max-w-[min(92vw,1000px)] h-auto cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────
// "VT" monogram: the V's right arm runs straight into the T's crossbar. Same art as public/logo.svg.

function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="flex-shrink-0">
      <rect width="40" height="40" rx="8" fill={ACCENT} />
      <path d="M8 11 L14.5 29 L21 11 H33 M27 11 V29" fill="none" stroke="#0A0A0A" strokeWidth="4.5" strokeLinejoin="miter" strokeLinecap="square" />
    </svg>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav({ current, onNav }: { current: Page; onNav: (p: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
      style={{
        background: "rgba(10,10,10,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        className="flex items-center gap-2.5 font-mono text-xs tracking-[0.2em] text-white/60 hover:text-white transition-colors"
        onClick={() => onNav("home")}
        aria-label="Vincent Then, go to home"
      >
        <Logo size={28} />
        VINCENT THEN
      </button>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, page }) => (
          <li key={page}>
            <button
              onClick={() => onNav(page)}
              aria-current={current === page ? "page" : undefined}
              className="relative font-mono text-[11px] tracking-widest uppercase transition-colors pb-px"
              style={{ color: current === page ? "#F5F5F0" : "rgba(255,255,255,0.38)" }}
            >
              {label}
              {current === page && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-[1px] left-0 right-0 h-px"
                  style={{ background: ACCENT }}
                />
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Status pill */}
      <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
        <span className="font-mono text-[9px] tracking-widest text-white/40 uppercase">Available</span>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-1"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className="block w-5 h-px bg-white transition-all duration-200"
          style={{ transform: menuOpen ? "rotate(45deg) translate(0, 4px)" : undefined }}
        />
        <span
          className="block w-5 h-px bg-white transition-all duration-200"
          style={{ opacity: menuOpen ? 0 : 1 }}
        />
        <span
          className="block w-5 h-px bg-white transition-all duration-200"
          style={{ transform: menuOpen ? "rotate(-45deg) translate(0, -4px)" : undefined }}
        />
      </button>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-14 left-0 right-0 border-b border-white/8 py-5 flex flex-col gap-5 px-6"
          style={{ background: "#0A0A0A" }}
        >
          {NAV_LINKS.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => { onNav(page); setMenuOpen(false); }}
              className="font-mono text-sm tracking-widest text-left uppercase"
              style={{ color: current === page ? ACCENT : "rgba(255,255,255,0.5)" }}
            >
              {label}
            </button>
          ))}
        </motion.div>
      )}
    </nav>
  );
}

// ── Ticker ────────────────────────────────────────────────────────────────────

function Ticker() {
  const repeated = TICKER_TEXT.repeat(6);
  return (
    <div className="overflow-hidden whitespace-nowrap py-2.5 select-none" style={{ background: ACCENT }}>
      <div
        className="inline-block ticker"
        style={{
          animation: "ticker 28s linear infinite",
          willChange: "transform",
        }}
      >
        <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-black uppercase">
          {repeated}
        </span>
      </div>
    </div>
  );
}

// ── Certifications ────────────────────────────────────────────────────────────

const certImg = (id: string) => asset(`certs/${id.slice(0, 12)}.jpg`);
const certUrl = (id: string) => `https://www.linkedin.com/learning/certificates/${id}`;

function Certifications() {
  const [open, setOpen] = useState<(typeof CERTS)[number] | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="mt-10">
      <p className="font-mono text-[11px] tracking-[0.25em] text-white/35 uppercase mb-4">
        Certifications · LinkedIn Learning ({CERTS.length})
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c) => (
          <div
            key={c.id}
            className="rounded overflow-hidden flex flex-col"
            style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              onClick={() => setOpen(c)}
              className="block overflow-hidden aspect-[1100/850] bg-white/5 cursor-zoom-in"
              aria-label={`View certificate: ${c.title}`}
            >
              <img
                src={certImg(c.id)}
                alt={`${c.title} certificate`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </button>
            <div className="p-4 flex flex-col gap-2 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-white leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {c.title}
                </p>
                <span className="font-mono text-[10px] text-white/25 tracking-widest flex-shrink-0 mt-0.5">{c.date}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {c.skills.map((s) => (
                  <span key={s} className={TAG_STYLES}>{s}</span>
                ))}
                <a
                  href={certUrl(c.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto font-mono text-[10px] tracking-widest text-white/25 hover:text-[#D7FF3F] transition-colors self-center"
                >
                  VERIFY ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            style={{ background: "rgba(0,0,0,0.85)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            role="dialog"
            aria-modal="true"
            aria-label={open.title}
          >
            <motion.div
              className="flex flex-col items-center gap-4 max-w-5xl w-full"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <img src={certImg(open.id)} alt={`${open.title} certificate`} className="w-full h-auto max-h-[80vh] object-contain rounded" />
              <div className="flex gap-6 font-mono text-[11px] tracking-widest uppercase" onClick={(e) => e.stopPropagation()}>
                <a href={certUrl(open.id)} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>
                  Verify on LinkedIn ↗
                </a>
                <button onClick={() => setOpen(null)} className="text-white/60 hover:text-white uppercase tracking-widest">
                  Close ✕
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────

function HomePage({ onNav }: { onNav: (p: Page) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen flex flex-col"
    >
      {/* Hero */}
      <section className="flex-1 flex flex-col justify-center px-6 md:px-10 pt-28 pb-0">
        <p className="font-mono text-[11px] tracking-[0.28em] text-white/35 mb-5 uppercase">
          IT Student · Republic Polytechnic, Singapore
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h1
            className="text-[clamp(4.5rem,15vw,11rem)] font-bold leading-[0.9] uppercase tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            VIN
            <br />
            CENT
            <span style={{ color: ACCENT }}>.</span>
          </h1>
          <div className="mb-2 md:text-right max-w-xs">
            <p className="text-base text-white/45 leading-relaxed">
              I build mobile and web apps
              <br />
              with React, React Native
              <br />
              and Python, and test them properly.
            </p>
            <p className="font-mono text-[10px] tracking-widest text-white/20 uppercase mt-3">
              Singapore · {new Date().getFullYear()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-10 mb-10">
          <button
            onClick={() => onNav("portfolio")}
            className="px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full text-black hover:brightness-90 transition-all"
            style={{ background: ACCENT }}
          >
            VIEW WORK →
          </button>
          <button
            onClick={() => onNav("about")}
            className="px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full border text-white hover:border-white/50 transition-all"
            style={{ borderColor: "rgba(255,255,255,0.18)" }}
          >
            ABOUT ME
          </button>
        </div>

        {/* Stat row */}
        <div className="flex flex-wrap gap-8 mb-10">
          {[
            { val: `${PROJECTS.length}`, label: "Projects on GitHub" },
            { val: STUDY_YEAR, label: "Year at RP" },
            { val: "Now", label: "Open to intern" },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span
                className="text-2xl font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: ACCENT }}
              >
                {val}
              </span>
              <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* Selected work */}
      <section className="px-6 md:px-10 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-mono text-[11px] tracking-[0.25em] text-white/35 uppercase">
            Selected Work
          </h2>
          <button
            onClick={() => onNav("portfolio")}
            className="font-mono text-[11px] tracking-widest text-white/25 uppercase hover:text-white/60 transition-colors"
          >
            All work →
          </button>
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {PROJECTS.slice(0, 3).map((p, i) => (
            <Row
              href={p.href}
              key={p.num}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.3 }}
              className="flex items-center justify-between py-5 group -mx-3 px-3 rounded transition-colors"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-[10px] text-white/20 w-6 flex-shrink-0">{p.num}</span>
                <div>
                  <span
                    className="text-base md:text-lg font-semibold text-white block"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {p.title}
                  </span>
                  <span className="font-mono text-[10px] text-white/25 tracking-widest">{p.year}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex gap-1.5">
                  {p.tags.slice(0, 2).map((t) => (
                    <span key={t} className={TAG_STYLES}>{t}</span>
                  ))}
                </div>
                <ProjectThumb project={p} size="sm" />
              </div>
            </Row>
          ))}
        </div>

        {/* Skills row */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase w-full mb-1">Skills</span>
          {SKILLS.map((s) => (
            <span key={s.skill} className={TAG_STYLES}>{s.skill}</span>
          ))}
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}

// ── PORTFOLIO ─────────────────────────────────────────────────────────────────

type Filter = "ALL" | "WEB" | "MOBILE" | "TOOLS";

function PortfolioPage() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const filtered = PROJECTS.filter((p) =>
    filter === "ALL" ? true : p.category.toUpperCase() === filter
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen flex flex-col"
    >
      <section className="px-6 md:px-10 pt-24 pb-10">
        <p className="font-mono text-[11px] tracking-[0.28em] text-white/35 uppercase mb-4">
          Full Case List
        </p>
        <h1
          className="text-[clamp(3.5rem,12vw,8rem)] font-bold leading-[0.9] uppercase tracking-tight mb-12"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ALL
          <br />
          WORK<span style={{ color: ACCENT }}>.</span>
        </h1>

        {/* Filter tabs */}
        <div
          className="flex gap-6 pb-0 mb-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          {(["ALL", "WEB", "MOBILE", "TOOLS"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="relative font-mono text-[11px] tracking-widest uppercase pb-3 transition-colors"
              style={{ color: filter === f ? "#F5F5F0" : "rgba(255,255,255,0.3)" }}
            >
              {f}
              {filter === f && (
                <motion.span
                  layoutId="filter-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: ACCENT }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {filtered.map((p, i) => (
            <Row
              href={p.href}
              key={p.num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.3 }}
              className="flex items-start justify-between py-8 group -mx-3 px-3 rounded transition-colors"
            >
              <div className="flex gap-5 md:gap-8 flex-1 mr-4">
                <span className="font-mono text-[10px] text-white/20 mt-1 w-5 flex-shrink-0 pt-px">{p.num}</span>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-base md:text-lg font-semibold text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {p.title}
                    </span>
                    <span className="font-mono text-[10px] text-white/20 tracking-widest">{p.year}</span>
                  </div>
                  <p className="text-sm text-white/38 leading-relaxed max-w-md">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {p.tags.map((t) => (
                      <span key={t} className={TAG_STYLES}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 mt-1">
                <ProjectThumb project={p} size="md" />
              </div>
            </Row>
          ))}
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}

// ── ABOUT ───────────────────────────────────────────────────────────

function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen flex flex-col"
    >
      {/* About */}
      <section className="px-6 md:px-10 pt-24 pb-14">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          {/* Profile placeholder */}
          <div
            className={`w-32 h-40 sm:w-36 sm:h-44 rounded flex-shrink-0 flex items-end justify-center overflow-hidden ${PHOTO_URL ? "" : "pb-3"}`}
            style={{
              background: "#1A1A1A",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {PHOTO_URL ? (
              <img src={PHOTO_URL} alt="Vincent Then" className="w-full h-full object-cover object-top" />
            ) : (
              <span className="font-mono text-[9px] text-white/15 tracking-widest">PHOTO</span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-[11px] tracking-[0.28em] text-white/35 uppercase">About</p>
            <h1
              className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.9] uppercase tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {"HI, I'M"}
              <br />
              VINCENT<span style={{ color: ACCENT }}>.</span>
            </h1>
            <p className="text-sm text-white/45 max-w-sm leading-relaxed mt-1">
              {"I'm Vincent Then, a Diploma in Information Technology student at Republic Polytechnic, Singapore, looking for an internship."}
              {" I build mobile apps with React Native and web apps with React and Node.js, and I like writing tests that catch bugs before users do."}
              {" Before IT, I studied engineering at ITE and worked as a swim coach and in field sales, which taught me to communicate clearly, lead a team and stay calm under pressure."}
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a
                href={RESUME_URL}
                download
                className="w-fit px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full text-black hover:brightness-90 transition-all"
                style={{ background: ACCENT }}
              >
                DOWNLOAD RESUME
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="w-fit px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full border text-white hover:border-white/50 transition-all"
                style={{ borderColor: "rgba(255,255,255,0.18)" }}
              >
                EMAIL ME
              </a>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-12 pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <p className="font-mono text-[11px] tracking-[0.25em] text-white/35 uppercase mb-4">
            Skills
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {SKILLS.map((s) => (
              <div
                key={s.skill}
                className="px-4 py-3 rounded"
                style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.skill}</p>
                <p className="font-mono text-[10px] text-white/35 tracking-wider mt-1">{s.tools}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="mt-10">
          <p className="font-mono text-[11px] tracking-[0.25em] text-white/35 uppercase mb-4">Experience</p>
          <div className="flex flex-col gap-2">
            {EXPERIENCE.map((x) => (
              <div key={x.role} className="p-5 rounded" style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {x.role}{x.org && <span className="text-white/40 font-normal"> · {x.org}</span>}
                  </p>
                  <span className="font-mono text-[10px] text-white/25 tracking-widest flex-shrink-0">{x.years}</span>
                </div>
                <p className="text-sm text-white/45 leading-relaxed mt-2">{x.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-10">
          <p className="font-mono text-[11px] tracking-[0.25em] text-white/35 uppercase mb-4">Education</p>
          <div className="flex flex-col gap-2">
            {EDUCATION.map((e) => (
              <div key={e.course} className="p-5 rounded" style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{e.course}</p>
                    <p className="font-mono text-[11px] text-white/40 tracking-wider">{e.school} · Singapore</p>
                  </div>
                  <span className="font-mono text-[10px] text-white/25 tracking-widest flex-shrink-0">{e.years}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <Certifications />
      </section>

      <Footer />
    </motion.div>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!CONTACT_ENDPOINT) {
      // No form service configured: hand the message to the visitor's email app.
      const body = `${form.message}\n\n— ${form.name} (${form.email})`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Portfolio message from " + form.name)}&body=${encodeURIComponent(body)}`;
      setNote("Your email app should now be open. Press send there to deliver your message.");
      setStatus("sent");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(String(res.status));
      setNote("Message sent — I'll be in touch soon.");
      setStatus("sent");
    } catch {
      setNote("Couldn't send your message. Check your connection and try again, or email me directly.");
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="min-h-screen flex flex-col"
    >
      {/* Contact */}
      <section className="px-6 md:px-10 pt-24 pb-14 flex-1">
        <p className="font-mono text-[11px] tracking-[0.28em] text-white/35 uppercase mb-4">
          Contact
        </p>
        <h1
          className="text-[clamp(3rem,10vw,7rem)] font-bold leading-[0.9] uppercase tracking-tight mb-8"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {"LET'S"}
          <br />
          TALK<span style={{ color: ACCENT }}>.</span>
        </h1>
        <a
          href={`mailto:${EMAIL}`}
          className="block text-[clamp(1.6rem,5vw,3rem)] font-bold mb-10 hover:opacity-80 transition-opacity"
          style={{ color: ACCENT, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {EMAIL}
        </a>
        <div className="flex flex-wrap gap-3 -mt-6 mb-10">
          {[
            { label: "LinkedIn ↗", href: LINKEDIN_URL },
            { label: "GitHub ↗", href: GITHUB_URL },
            { label: "Resume ↓", href: RESUME_URL },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full border text-white hover:border-white/50 transition-all"
              style={{ borderColor: "rgba(255,255,255,0.18)" }}
            >
              {label}
            </a>
          ))}
        </div>

        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-fit px-5 py-3 font-mono text-sm rounded"
            style={{ border: `1px solid ${ACCENT}`, color: ACCENT }}
          >
            {note}
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
              ].map(({ key, label, type }) => (
                <div key={key} className="flex-1 flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] tracking-widest text-white/25 uppercase" htmlFor={`contact-${key}`}>{label}</label>
                  <input
                    id={`contact-${key}`}
                    type={type}
                    required
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="bg-white/[0.04] border rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.28)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] tracking-widest text-white/25 uppercase" htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="bg-white/[0.04] border rounded px-3 py-2.5 text-sm text-white focus:outline-none transition-colors resize-none"
                style={{ borderColor: "rgba(255,255,255,0.1)" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.28)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-fit px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full text-black hover:brightness-90 transition-all"
              style={{ background: ACCENT }}
            >
              {status === "sending" ? "SENDING…" : "SEND MESSAGE →"}
            </button>
            {status === "error" && (
              <p role="alert" className="font-mono text-[11px]" style={{ color: "#ff6b6b" }}>{note}</p>
            )}
          </form>
        )}
      </section>

      <Footer />
    </motion.div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="px-6 md:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
        © {new Date().getFullYear()} Vincent · Republic Polytechnic
      </span>
      <div className="flex gap-5">
        {[
          { label: "GitHub", href: GITHUB_URL },
          { label: "LinkedIn", href: LINKEDIN_URL },
          { label: EMAIL, href: `mailto:${EMAIL}` },
        ]
          .filter((l) => l.href)
          .map(({ label, href }) => (
            <a
              key={label}
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-mono text-[10px] text-white/20 tracking-widest uppercase hover:text-white/50 transition-colors"
            >
              {label}
            </a>
          ))}
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");

  const handleNav = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#0A0A0A",
        color: "#F5F5F0",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce) { .ticker { animation-duration: 60s !important; } }
        :focus-visible { outline: 2px solid #D7FF3F; outline-offset: 3px; }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <Nav current={page} onNav={handleNav} />

      <main>
        <AnimatePresence mode="wait">
          {page === "home" && <HomePage key="home" onNav={handleNav} />}
          {page === "portfolio" && <PortfolioPage key="portfolio" />}
          {page === "about" && <AboutPage key="about" />}
          {page === "contact" && <ContactPage key="contact" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
