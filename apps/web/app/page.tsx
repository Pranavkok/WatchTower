"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const MOCK_SITES = [
  { name: "api.stripe.com", status: "up", ms: 42 },
  { name: "github.com", status: "up", ms: 87 },
  { name: "shopify.com", status: "up", ms: 134 },
  { name: "myapp.vercel.app", status: "down", ms: 0 },
  { name: "notion.so", status: "up", ms: 67 },
  { name: "linear.app", status: "up", ms: 95 },
];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatCard({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} style={statStyles.card} className="card-hover animate-fadeInUp opacity-0">
      <div style={statStyles.value}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={statStyles.label}>{label}</div>
    </div>
  );
}

function RadarWidget() {
  return (
    <div style={radarStyles.wrap}>
      {/* Rings */}
      {[80, 120, 160, 200].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `1px solid rgba(99,102,241,${0.15 - i * 0.03})`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }} />
      ))}
      {/* Sweep */}
      <div style={radarStyles.sweep} />
      {/* Center dot */}
      <div style={radarStyles.center} />
      {/* Blips */}
      {[
        { top: "28%", left: "62%", delay: "0s" },
        { top: "55%", left: "72%", delay: "0.5s" },
        { top: "70%", left: "40%", delay: "1s" },
        { top: "35%", left: "30%", delay: "1.5s" },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#22c55e",
          top: b.top,
          left: b.left,
          boxShadow: "0 0 6px #22c55e",
          animation: `pulse-dot 2s ease-in-out ${b.delay} infinite`,
        }} />
      ))}
    </div>
  );
}

function LiveFeed() {
  const [sites, setSites] = useState(MOCK_SITES);
  const [checking, setChecking] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChecking((prev) => (prev + 1) % MOCK_SITES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={feedStyles.wrap} className="animate-glow">
      <div style={feedStyles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={feedStyles.liveDot} />
          <span style={feedStyles.liveText}>LIVE MONITORING</span>
        </div>
        <span style={feedStyles.count}>{sites.length} sites</span>
      </div>
      <div style={feedStyles.list}>
        {sites.map((site, i) => (
          <div key={site.name} style={{
            ...feedStyles.row,
            background: checking === i ? "#6366f108" : "transparent",
            borderColor: checking === i ? "#6366f130" : "transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {site.status === "up"
                ? <div className="status-dot-up" />
                : <div className="status-dot-down" />
              }
              <span style={feedStyles.siteName}>{site.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {checking === i && (
                <span style={feedStyles.checking}>checking…</span>
              )}
              {site.status === "up" && site.ms > 0 && (
                <span style={feedStyles.ms}>{site.ms}ms</span>
              )}
              <span style={{
                ...feedStyles.badge,
                background: site.status === "up" ? "#22c55e15" : "#ef444415",
                color: site.status === "up" ? "#22c55e" : "#ef4444",
                border: `1px solid ${site.status === "up" ? "#22c55e30" : "#ef444430"}`,
              }}>
                {site.status === "up" ? "UP" : "DOWN"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="grid-bg" style={styles.main}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Nav */}
      <nav style={styles.nav} className={mounted ? "animate-fadeIn" : "opacity-0"}>
        <span style={styles.logo}>Watch<span style={styles.accent}>Tower</span></span>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/signin" style={styles.navLink}>Sign In</Link>
          <Link href="/signup" style={styles.navBtn} className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroLeft}>
          <div className={`animate-fadeInUp opacity-0 ${mounted ? "" : ""}`}
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            <div style={styles.badge}>
              <div style={styles.badgeDot} />
              Real-time uptime monitoring
            </div>
          </div>

          <h1 style={styles.title}
            className="animate-fadeInUp opacity-0"
            // @ts-ignore
            style2={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <span style={{ display: "block", ...styles.titleLine1 }}>
              Know when your
            </span>
            <span style={{ display: "block" }} className="gradient-text">
              sites go down.
            </span>
          </h1>

          <p style={styles.subtitle} className="animate-fadeInUp opacity-0 delay-300">
            WatchTower silently watches your websites 24/7.
            The moment something breaks — you know first.
            Before your users. Before anyone.
          </p>

          <div style={styles.actions} className="animate-fadeInUp opacity-0 delay-400">
            <Link href="/signup" style={styles.primaryBtn} className="btn-primary">
              Start Monitoring Free
              <span style={{ marginLeft: 8 }}>→</span>
            </Link>
            <Link href="/signin" style={styles.ghostBtn}>
              Sign In
            </Link>
          </div>

          <div style={styles.trustRow} className="animate-fadeInUp opacity-0 delay-500">
            <div style={styles.trustDot} />
            <span style={styles.trustText}>No credit card required &nbsp;·&nbsp; Deploy in 5 minutes</span>
          </div>
        </div>

        <div style={styles.heroRight} className="animate-fadeIn opacity-0 delay-400">
          <div className="animate-float">
            <LiveFeed />
          </div>
          <div style={styles.radarWrap}>
            <RadarWidget />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <StatCard value={99} label="Uptime SLA" suffix="%" />
        <StatCard value={3} label="Check Interval (mins)" />
        <StatCard value={1200} label="Checks Per Day" suffix="+" />
        <StatCard value={100} label="Response Time (ms avg)" />
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader} className="animate-fadeInUp opacity-0">
          <span style={styles.sectionBadge}>Why WatchTower</span>
          <h2 style={styles.sectionTitle}>Built for reliability</h2>
          <p style={styles.sectionSub}>Everything you need to stay ahead of downtime.</p>
        </div>

        <div style={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={styles.featureCard}
              className={`card-hover animate-fadeInUp opacity-0 delay-${(i + 1) * 100}`}>
              <div style={styles.featureIconWrap}>
                <span style={styles.featureIcon}>{f.icon}</span>
              </div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureText}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howSection}>
        <div style={styles.sectionHeader}>
          <span style={styles.sectionBadge}>How it works</span>
          <h2 style={styles.sectionTitle}>Simple. Powerful. Instant.</h2>
        </div>
        <div style={styles.stepsRow}>
          {STEPS.map((step, i) => (
            <div key={step.title} style={styles.step} className="animate-fadeInUp opacity-0">
              <div style={styles.stepNum}>{i + 1}</div>
              <div style={styles.stepLine} />
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepText}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection} className="animate-glow">
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle} className="gradient-text">
            Stop finding out from users.<br />Start knowing first.
          </h2>
          <p style={styles.ctaSub}>
            Set up monitoring in under 2 minutes. Free forever.
          </p>
          <Link href="/signup" style={styles.ctaBtn} className="btn-primary">
            Get Started — It&apos;s Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.logo}>Watch<span style={styles.accent}>Tower</span></span>
        <span style={{ color: "#444", fontSize: 13 }}>© 2026 · Open Source · MIT License</span>
        <a href="https://github.com/Pranavkok/WatchTower" style={{ color: "#555", fontSize: 13 }}>
          GitHub →
        </a>
      </footer>
    </main>
  );
}

const FEATURES = [
  {
    icon: "⚡",
    title: "Checks Every 3 Minutes",
    desc: "Continuous polling means outages are detected fast — not discovered hours later by angry users.",
  },
  {
    icon: "📬",
    title: "Instant Alerts",
    desc: "Get notified via Email and WhatsApp the moment a site goes down. No delays, no noise.",
  },
  {
    icon: "🌍",
    title: "Multi-Region Workers",
    desc: "Distributed checking eliminates false positives caused by local network issues.",
  },
  {
    icon: "📊",
    title: "Response Time Tracking",
    desc: "Track latency over time and catch performance regressions before they become outages.",
  },
  {
    icon: "🔒",
    title: "Self-Hosted",
    desc: "Your data stays on your server. No third-party SaaS. Full control over your monitoring.",
  },
  {
    icon: "🚀",
    title: "One Command Deploy",
    desc: "docker compose up and you're live. The entire stack runs in containers, no setup hell.",
  },
];

const STEPS = [
  { title: "Add a website", desc: "Paste any URL. WatchTower immediately starts watching it." },
  { title: "We monitor 24/7", desc: "Workers check your sites every 3 minutes around the clock." },
  { title: "Get alerted instantly", desc: "Email or WhatsApp notification the second something breaks." },
];

const radarStyles: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    width: 220,
    height: 220,
    borderRadius: "50%",
    border: "1px solid #6366f120",
    background: "radial-gradient(circle, #6366f108 0%, transparent 70%)",
    overflow: "hidden",
  },
  sweep: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "50%",
    height: 1,
    background: "linear-gradient(90deg, rgba(99,102,241,0.8), transparent)",
    transformOrigin: "left center",
    animation: "radar-sweep 3s linear infinite",
  },
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#6366f1",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 0 12px #6366f1",
  },
};

const feedStyles: Record<string, React.CSSProperties> = {
  wrap: {
    background: "#0a0a14",
    border: "1px solid #1e1e3a",
    borderRadius: 14,
    overflow: "hidden",
    width: 340,
    fontFamily: "var(--font-geist-mono), monospace",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #1e1e3a",
    background: "#0d0d1e",
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
    background: "#22c55e",
    animation: "pulse-dot 1s ease-in-out infinite",
    boxShadow: "0 0 6px #22c55e",
  },
  liveText: {
    fontSize: 10,
    fontWeight: 700,
    color: "#22c55e",
    letterSpacing: "0.1em",
  },
  count: { fontSize: 11, color: "#444" },
  list: { padding: "8px 0" },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 16px",
    border: "1px solid transparent",
    transition: "background 0.3s, border-color 0.3s",
    borderRadius: 6,
    margin: "0 4px",
  },
  siteName: { fontSize: 12, color: "#aaa" },
  ms: { fontSize: 11, color: "#555" },
  checking: {
    fontSize: 10,
    color: "#6366f1",
    animation: "pulse-dot 0.8s ease-in-out infinite",
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 999,
    letterSpacing: "0.05em",
  },
};

const statStyles: Record<string, React.CSSProperties> = {
  card: {
    background: "#0a0a14",
    border: "1px solid #1e1e3a",
    borderRadius: 12,
    padding: "24px 32px",
    textAlign: "center",
    flex: 1,
    minWidth: 140,
    animationFillMode: "forwards",
  },
  value: {
    fontSize: 36,
    fontWeight: 800,
    background: "linear-gradient(135deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.03em",
  },
  label: { fontSize: 13, color: "#555", marginTop: 4 },
};

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    gap: 0,
  },
  blob1: {
    position: "fixed",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, #6366f115 0%, transparent 70%)",
    top: -200,
    right: -200,
    pointerEvents: "none",
    zIndex: 0,
    animation: "blob 8s ease-in-out infinite",
  },
  blob2: {
    position: "fixed",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, #8b5cf615 0%, transparent 70%)",
    bottom: -100,
    left: -150,
    pointerEvents: "none",
    zIndex: 0,
    animation: "blob 10s ease-in-out 2s infinite",
  },
  nav: {
    width: "100%",
    maxWidth: 1100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 32px",
    position: "relative",
    zIndex: 10,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  accent: { color: "#6366f1" },
  navLink: {
    padding: "8px 16px",
    color: "#888",
    fontSize: 14,
    fontWeight: 500,
    transition: "color 0.2s",
  },
  navBtn: {
    padding: "8px 20px",
    borderRadius: 8,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
  },
  hero: {
    width: "100%",
    maxWidth: 1100,
    padding: "60px 32px 80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 48,
    position: "relative",
    zIndex: 5,
    flexWrap: "wrap",
  },
  heroLeft: {
    flex: 1,
    minWidth: 300,
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  heroRight: {
    flex: 1,
    minWidth: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 24,
    animationFillMode: "forwards",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 14px",
    borderRadius: 999,
    border: "1px solid #6366f130",
    background: "#6366f108",
    color: "#a5b4fc",
    fontSize: 12,
    fontWeight: 500,
    width: "fit-content",
    letterSpacing: "0.03em",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 6px #22c55e",
    animation: "pulse-dot 1.5s ease-in-out infinite",
  },
  title: {
    fontSize: "clamp(40px, 6vw, 72px)",
    fontWeight: 800,
    lineHeight: 1.08,
    letterSpacing: "-0.04em",
    animationFillMode: "forwards",
  },
  titleLine1: {
    color: "#e0e0e0",
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 1.75,
    color: "#666",
    maxWidth: 460,
    animationFillMode: "forwards",
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    animationFillMode: "forwards",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "13px 28px",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 600,
    fontSize: 15,
  },
  ghostBtn: {
    padding: "13px 28px",
    borderRadius: 10,
    border: "1px solid #1e1e3a",
    background: "transparent",
    color: "#888",
    fontWeight: 600,
    fontSize: 15,
    transition: "border-color 0.2s, color 0.2s",
  },
  trustRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    animationFillMode: "forwards",
  },
  trustDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22c55e",
  },
  trustText: { fontSize: 13, color: "#444" },
  radarWrap: {
    opacity: 0.6,
  },
  statsSection: {
    width: "100%",
    maxWidth: 1100,
    padding: "0 32px 80px",
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    position: "relative",
    zIndex: 5,
  },
  featuresSection: {
    width: "100%",
    maxWidth: 1100,
    padding: "80px 32px",
    position: "relative",
    zIndex: 5,
    borderTop: "1px solid #1e1e3a",
  },
  sectionHeader: {
    textAlign: "center",
    marginBottom: 48,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: 600,
    color: "#6366f1",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },
  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 40px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  sectionSub: {
    fontSize: 16,
    color: "#555",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },
  featureCard: {
    background: "#0a0a14",
    border: "1px solid #1e1e3a",
    borderRadius: 14,
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    animationFillMode: "forwards",
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#6366f110",
    border: "1px solid #6366f120",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureIcon: { fontSize: 20 },
  featureTitle: { fontSize: 15, fontWeight: 700 },
  featureText: { fontSize: 14, lineHeight: 1.65, color: "#555" },
  howSection: {
    width: "100%",
    maxWidth: 1100,
    padding: "80px 32px",
    position: "relative",
    zIndex: 5,
    borderTop: "1px solid #1e1e3a",
  },
  stepsRow: {
    display: "flex",
    gap: 0,
    flexWrap: "wrap",
    marginTop: 48,
    position: "relative",
  },
  step: {
    flex: 1,
    minWidth: 220,
    padding: "0 32px",
    borderLeft: "1px solid #1e1e3a",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    animationFillMode: "forwards",
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#6366f120",
    border: "1px solid #6366f140",
    color: "#6366f1",
    fontWeight: 800,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLine: {
    width: 40,
    height: 1,
    background: "linear-gradient(90deg, #6366f160, transparent)",
    marginTop: -4,
  },
  stepTitle: { fontSize: 16, fontWeight: 700 },
  stepText: { fontSize: 14, color: "#555", lineHeight: 1.65 },
  ctaSection: {
    width: "100%",
    margin: "80px 0 0",
    borderTop: "1px solid #1e1e3a",
    borderBottom: "1px solid #1e1e3a",
    background: "#0a0a14",
    position: "relative",
    zIndex: 5,
  },
  ctaInner: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "80px 32px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
  },
  ctaTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    lineHeight: 1.2,
  },
  ctaSub: {
    fontSize: 16,
    color: "#555",
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "14px 32px",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    marginTop: 8,
  },
  footer: {
    width: "100%",
    maxWidth: 1100,
    padding: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #1e1e3a",
    position: "relative",
    zIndex: 5,
    flexWrap: "wrap",
    gap: 12,
  },
};
