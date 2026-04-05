"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "../lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(username, password);
      router.push("/signin?registered=1");
    } catch {
      setError("Username already taken. Try a different one.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid-bg" style={styles.main}>
      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Floating stat cards */}
      <div className="animate-float" style={{ ...styles.floatingCard, top: "12%", left: "7%" }}>
        <span style={styles.floatEmoji}>⚡</span>
        <div>
          <div style={styles.floatTitle}>Checks every</div>
          <div style={styles.floatValue}>3 minutes</div>
        </div>
      </div>
      <div className="animate-float" style={{ ...styles.floatingCard, top: "72%", left: "4%", animationDelay: "1.2s" }}>
        <span style={styles.floatEmoji}>📬</span>
        <div>
          <div style={styles.floatTitle}>Instant alerts via</div>
          <div style={styles.floatValue}>Email & WhatsApp</div>
        </div>
      </div>
      <div className="animate-float" style={{ ...styles.floatingCard, top: "20%", right: "5%", animationDelay: "0.6s" }}>
        <span style={styles.floatEmoji}>🌍</span>
        <div>
          <div style={styles.floatTitle}>Multi-region</div>
          <div style={styles.floatValue}>Workers</div>
        </div>
      </div>
      <div className="animate-float" style={{ ...styles.floatingCard, top: "68%", right: "4%", animationDelay: "1.8s" }}>
        <span style={styles.floatEmoji}>🔒</span>
        <div>
          <div style={styles.floatTitle}>Self-hosted</div>
          <div style={styles.floatValue}>Your data</div>
        </div>
      </div>

      {/* Card */}
      <div
        style={styles.card}
        className={`animate-glow ${mounted ? "animate-fadeInUp" : "opacity-0"}`}
      >
        <div style={styles.cardGlowLine} />

        <Link href="/" style={styles.logo}>
          Watch<span style={styles.accent}>Tower</span>
        </Link>

        <div style={styles.cardHeader}>
          <div style={styles.iconWrap}>🚀</div>
          <h1 style={styles.heading}>Start monitoring</h1>
          <p style={styles.sub}>Free forever. No credit card required.</p>
        </div>

        {/* Perks */}
        <div style={styles.perksRow}>
          {["✓ Instant alerts", "✓ Multi-region", "✓ Open source"].map((perk) => (
            <span key={perk} style={styles.perk}>{perk}</span>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              className="glow-input"
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              required
              autoFocus
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              className="glow-input"
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={styles.error}>
              <span>⚠</span> {error}
            </div>
          )}

          <button
            className={loading ? "" : "btn-primary"}
            style={loading ? styles.btnDisabled : styles.btn}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span style={styles.spinner} />
                Creating account…
              </span>
            ) : "Create Account — Free →"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>already have an account?</span>
          <span style={styles.dividerLine} />
        </div>

        <p style={styles.footer}>
          <Link href="/signin" style={styles.signinLink}>
            Sign in instead →
          </Link>
        </p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    position: "relative",
    overflow: "hidden",
  },
  orb1: {
    position: "fixed",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, #8b5cf618 0%, transparent 70%)",
    top: -150,
    left: -150,
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, #6366f118 0%, transparent 70%)",
    bottom: -100,
    right: -100,
    pointerEvents: "none",
  },
  floatingCard: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    background: "#0a0a14",
    border: "1px solid #1e1e3a",
    borderRadius: 10,
    zIndex: 1,
    pointerEvents: "none",
  },
  floatEmoji: { fontSize: 20 },
  floatTitle: { fontSize: 10, color: "#444", marginBottom: 2 },
  floatValue: { fontSize: 13, fontWeight: 700, color: "#888" },
  card: {
    background: "#08080f",
    border: "1px solid #1e1e3a",
    borderRadius: 18,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    position: "relative",
    zIndex: 10,
    animationFillMode: "forwards",
  },
  cardGlowLine: {
    position: "absolute",
    top: 0,
    left: "20%",
    right: "20%",
    height: 1,
    background: "linear-gradient(90deg, transparent, #6366f180, transparent)",
  },
  logo: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    textAlign: "center",
  },
  accent: { color: "#6366f1" },
  cardHeader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    textAlign: "center",
  },
  iconWrap: { fontSize: 28, marginBottom: 4 },
  heading: { fontSize: 22, fontWeight: 700 },
  sub: { fontSize: 13, color: "#555" },
  perksRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  perk: {
    fontSize: 11,
    fontWeight: 600,
    color: "#22c55e",
    background: "#22c55e08",
    border: "1px solid #22c55e20",
    borderRadius: 999,
    padding: "3px 10px",
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: "#555",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  input: {
    background: "#0d0d1a",
    border: "1px solid #1e1e3a",
    borderRadius: 10,
    padding: "11px 14px",
    color: "#f0f0f0",
    fontSize: 15,
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  error: {
    fontSize: 13,
    color: "#ef4444",
    background: "#ef444408",
    border: "1px solid #ef444425",
    borderRadius: 8,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  btn: {
    marginTop: 4,
    padding: "12px",
    borderRadius: 10,
    color: "#fff",
    border: "none",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  btnDisabled: {
    marginTop: 4,
    padding: "12px",
    background: "#1e1e3a",
    color: "#444",
    border: "none",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 15,
    cursor: "not-allowed",
  },
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid #ffffff40",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin-slow 0.7s linear infinite",
    display: "inline-block",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  dividerLine: { flex: 1, height: 1, background: "#1e1e3a" },
  dividerText: { fontSize: 11, color: "#333", whiteSpace: "nowrap" as const },
  footer: { textAlign: "center" },
  signinLink: { color: "#6366f1", fontWeight: 600, fontSize: 14 },
};
