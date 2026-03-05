import Link from "next/link";

export default function Home() {
  return (
    <main style={styles.main}>
      <div style={styles.hero}>
        <div style={styles.badge}>Website Uptime Monitoring</div>
        <h1 style={styles.title}>
          Watch<span style={styles.accent}>Tower</span>
        </h1>
        <p style={styles.subtitle}>
          Know the moment your websites go down.
          <br />
          Real-time monitoring across multiple regions.
        </p>
        <div style={styles.actions}>
          <Link href="/signup" style={styles.primaryBtn}>
            Get Started
          </Link>
          <Link href="/signin" style={styles.secondaryBtn}>
            Sign In
          </Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.featureCard}>
          <span style={styles.featureIcon}>⚡</span>
          <h3 style={styles.featureTitle}>Every 3 Minutes</h3>
          <p style={styles.featureText}>
            Websites are checked on a continuous schedule so you never miss an outage.
          </p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.featureIcon}>🌍</span>
          <h3 style={styles.featureTitle}>Multi-Region</h3>
          <p style={styles.featureText}>
            Distributed workers across regions ensure accurate, reliable status checks.
          </p>
        </div>
        <div style={styles.featureCard}>
          <span style={styles.featureIcon}>📊</span>
          <h3 style={styles.featureTitle}>Response Time</h3>
          <p style={styles.featureText}>
            Track response times alongside uptime to catch performance regressions early.
          </p>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
    gap: "80px",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "20px",
    maxWidth: "640px",
  },
  badge: {
    padding: "6px 14px",
    borderRadius: "999px",
    border: "1px solid #6366f133",
    background: "#6366f110",
    color: "#a5b4fc",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.03em",
  },
  title: {
    fontSize: "clamp(48px, 8vw, 80px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
  },
  accent: {
    color: "#6366f1",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: 1.7,
    color: "#888",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  primaryBtn: {
    padding: "12px 28px",
    borderRadius: "8px",
    background: "#6366f1",
    color: "#fff",
    fontWeight: 600,
    fontSize: "15px",
    transition: "background 0.15s",
  },
  secondaryBtn: {
    padding: "12px 28px",
    borderRadius: "8px",
    border: "1px solid #2e2e2e",
    background: "transparent",
    color: "#f0f0f0",
    fontWeight: 600,
    fontSize: "15px",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    width: "100%",
    maxWidth: "800px",
  },
  featureCard: {
    background: "#1a1a1a",
    border: "1px solid #2e2e2e",
    borderRadius: "12px",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  featureIcon: {
    fontSize: "24px",
  },
  featureTitle: {
    fontSize: "15px",
    fontWeight: 600,
  },
  featureText: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#888",
  },
};
