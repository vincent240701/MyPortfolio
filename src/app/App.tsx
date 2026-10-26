import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

type Page = "home" | "portfolio" | "about";

const ACCENT = "#ccff00";

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: "HOME", page: "home" },
  { label: "PORTFOLIO", page: "portfolio" },
  { label: "ABOUT & CONTACT", page: "about" },
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
};

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "Realtime Order Tracker",
    description:
      "Live operations dashboard with WebSocket order updates, map view, and alerting for delayed shipments. Built for a logistics startup handling 10k+ daily orders.",
    tags: ["React", "Node.js", "WebSocket", "Redis"],
    category: "web",
    year: "2024",
    hue: 80,
  },
  {
    num: "02",
    title: "Inventory API",
    description:
      "REST service handling role-based access, stock audit logs, and scheduled reporting for a retail client. Handles 500 concurrent requests with sub-50ms p99.",
    tags: ["Go", "PostgreSQL", "Docker"],
    category: "web",
    year: "2024",
    hue: 200,
  },
  {
    num: "03",
    title: "Habit Tracker App",
    description:
      "Cross-platform mobile app with offline-first sync and streak-based motivation nudges. Launched on both App Store and Google Play.",
    tags: ["Flutter", "SQLite", "Dart"],
    category: "mobile",
    year: "2023",
    hue: 290,
  },
  {
    num: "04",
    title: "CLI Deploy Tool",
    description:
      "Internal command-line tool that automates build, test, and deploy steps across environments. Reduced deployment time by 70% for a 5-person dev team.",
    tags: ["Python", "Docker", "GitHub Actions"],
    category: "tools",
    year: "2023",
    hue: 30,
  },
];

const SKILLS = [
  "TypeScript",
  "React",
  "Flutter",
  "Node.js",
  "Go",
  "PostgreSQL",
  "Docker",
  "AWS",
  "GitHub Actions",
  "Python",
  "Git",
  "Linux",
];

// ── Thumb ─────────────────────────────────────────────────────────────────────

function ProjectThumb({ project, size = "sm" }: { project: Project; size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-20 h-14" : "w-28 h-20";
  return (
    <div
      className={`${w} rounded flex-shrink-0 flex items-center justify-center overflow-hidden`}
      style={{ background: `hsla(${project.hue}, 70%, 12%, 1)`, border: `1px solid hsla(${project.hue}, 60%, 25%, 0.4)` }}
    >
      <span
        className="font-mono text-[9px] font-bold tracking-widest"
        style={{ color: `hsla(${project.hue}, 80%, 70%, 0.7)` }}
      >
        {project.num}
      </span>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav({ current, onNav }: { current: Page; onNav: (p: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
      style={{
        background: "rgba(12,12,12,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <button
        className="font-mono text-xs tracking-[0.2em] text-white/50 hover:text-white transition-colors"
        onClick={() => onNav("home")}
      >
        VINCENT
      </button>

      {/* Desktop links */}
      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, page }) => (
          <li key={page}>
            <button
              onClick={() => onNav(page)}
              className="relative font-mono text-[11px] tracking-widest uppercase transition-colors pb-px"
              style={{ color: current === page ? "#ffffff" : "rgba(255,255,255,0.38)" }}
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
          style={{ background: "#0c0c0c" }}
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
        className="inline-block"
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
              I build fast, dependable
              <br />
              products for teams that
              <br />
              {"can't afford downtime."}
            </p>
            <p className="font-mono text-[10px] tracking-widest text-white/20 uppercase mt-3">
              Singapore · 2025
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
            { val: "4+", label: "Projects shipped" },
            { val: "3rd", label: "Year at RP" },
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
            <motion.div
              key={p.num}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.3 }}
              className="flex items-center justify-between py-5 group cursor-pointer -mx-3 px-3 rounded transition-colors hover:bg-white/[0.025]"
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
            </motion.div>
          ))}
        </div>

        {/* Skills row */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="font-mono text-[10px] tracking-widest text-white/20 uppercase w-full mb-1">Stack</span>
          {SKILLS.map((s) => (
            <span key={s} className={TAG_STYLES}>{s}</span>
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
              style={{ color: filter === f ? "#ffffff" : "rgba(255,255,255,0.3)" }}
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
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i, duration: 0.3 }}
              className="flex items-start justify-between py-8 group cursor-pointer -mx-3 px-3 rounded transition-colors hover:bg-white/[0.025]"
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
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </motion.div>
  );
}

// ── ABOUT & CONTACT ───────────────────────────────────────────────────────────

function AboutPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

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
            className="w-32 h-40 sm:w-36 sm:h-44 rounded flex-shrink-0 flex items-end justify-center pb-3 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="font-mono text-[9px] text-white/15 tracking-widest">PHOTO</span>
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
              Information Technology student at Republic Polytechnic, Singapore.
              I build practical software — from web APIs to mobile apps — with
              a focus on clean architecture and real-world impact. Currently
              seeking internship opportunities where I can grow alongside a
              driven team.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <button
                className="w-fit px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full text-black hover:brightness-90 transition-all"
                style={{ background: ACCENT }}
              >
                DOWNLOAD RESUME
              </button>
              <a
                href="mailto:hello@vincent.dev"
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
            Skills &amp; Tools
          </p>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span key={s} className={TAG_STYLES}>{s}</span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-10">
          <p className="font-mono text-[11px] tracking-[0.25em] text-white/35 uppercase mb-4">
            Education
          </p>
          <div
            className="p-5 rounded"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="font-semibold text-white mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Diploma in Information Technology
                </p>
                <p className="font-mono text-[11px] text-white/40 tracking-wider">
                  Republic Polytechnic · Singapore
                </p>
              </div>
              <span className="font-mono text-[10px] text-white/25 tracking-widest flex-shrink-0">
                2022 – 2025
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

      {/* Contact */}
      <section className="px-6 md:px-10 py-14 flex-1">
        <p className="font-mono text-[11px] tracking-[0.28em] text-white/35 uppercase mb-4">
          Get in Touch
        </p>
        <a
          href="mailto:hello@vincent.dev"
          className="block text-[clamp(1.6rem,5vw,3rem)] font-bold mb-10 hover:opacity-80 transition-opacity"
          style={{ color: ACCENT, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          hello@vincent.dev
        </a>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-fit px-5 py-3 font-mono text-sm rounded"
            style={{ border: `1px solid ${ACCENT}`, color: ACCENT }}
          >
            Message sent — {"I'll"} be in touch soon.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
            <div className="flex flex-col sm:flex-row gap-4">
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
              ].map(({ key, label, type }) => (
                <div key={key} className="flex-1 flex flex-col gap-1.5">
                  <label className="font-mono text-[10px] tracking-widest text-white/25 uppercase">{label}</label>
                  <input
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
              <label className="font-mono text-[10px] tracking-widest text-white/25 uppercase">Message</label>
              <textarea
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
              className="w-fit px-5 py-2.5 font-mono text-[11px] font-bold tracking-widest uppercase rounded-full text-black hover:brightness-90 transition-all"
              style={{ background: ACCENT }}
            >
              SEND MESSAGE →
            </button>
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
        © 2025 Vincent · Republic Polytechnic
      </span>
      <div className="flex gap-5">
        {["GitHub", "LinkedIn", "hello@vincent.dev"].map((item) => (
          <a
            key={item}
            href="#"
            className="font-mono text-[10px] text-white/20 tracking-widest uppercase hover:text-white/50 transition-colors"
          >
            {item}
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
        background: "#0c0c0c",
        color: "#ffffff",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      <style>{`
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
        </AnimatePresence>
      </main>
    </div>
  );
}
