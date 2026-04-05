"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signin } from "../lib/api";

function SigninForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (params.get("registered")) {
      setNotice("Account created! Sign in to continue.");
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signin(username, password);
      localStorage.setItem("wt_token", data.jwt);
      localStorage.removeItem("wt_websites");
      router.push("/dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid-bg" style={styles.main}>
      {/* Background orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Floating status cards */}
      <div className="animate-float" style={{ ...styles.floatingCard, top: "15%", left: "8%", animationDelay: "0s" }}>
        <div className="status-dot-up" />
        <span style={styles.floatText}>api.stripe.com</span>
        <span style={styles.floatBadge}>42ms</span>
      </div>
      <div className="animate-float" style={{ ...styles.floatingCard, top: "70%", left: "5%", animationDelay: "1.5s" }}>
        <div className="status-dot-up" />
        <span style={styles.floatText}>github.com</span>
        <span style={styles.floatBadge}>87ms</span>
      </div>
      <div className="animate-float" style={{ ...styles.floatingCard, top: "25%", right: "6%", animationDelay: "0.8s" }}>
        <div className="status-dot-down" />
        <span style={styles.floatText}>myapp.io</span>
        <span style={{ ...styles.floatBadge, color: "#ef4444" }}>DOWN</span>
      </div>
      <div className="animate-float" style={{ ...styles.floatingCard, top: "65%", right: "5%", animationDelay: "2s" }}>
        <div className="status-dot-up" />
        <span style={styles.floatText}>notion.so</span>
        <span style={styles.floatBadge}>67ms</span>
      </div>

      {/* Card */}
      <div style={styles.card}
        className={`animate-glow ${mounted ? "animate-fadeInUp" : "opacity-0"}`}>

        {/* Glow border top */}
        <div style={styles.cardGlowLine} />

        <Link href="/" style={styles.logo}>
          Watch<span style={styles.accent}>Tower</span>
        </Link>

        <div style={styles.cardHeader}>
          <div style={styles.iconWrap}>🔐</div>
          <h1 style={styles.heading}>Welcome back</h1>
          <p style={styles.sub}>Sign in to your monitoring dashboard</p>
        </div>

        {notice && (
          <div style={styles.notice}>
            <span style={{ color: "#22c55e" }}>✓</span> {notice}
          </div>
        )}

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
            className="btn-primary"
            style={loading ? styles.btnDisabled : styles.btn}
            disabled={loading}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <span style={styles.spinner} />
                Signing in…
              </span>
            ) : "Sign In →"}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>new here?</span>
          <span style={styles.dividerLine} />
        </div>

        <p style={styles.footer}>
          <Link href="/signup" style={styles.signupLink}>
            Create a free account →
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SigninPage() {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
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
    background: "radial-gradient(circle, #6366f118 0%, transparent 70%)",
    top: -150,
    right: -150,
    pointerEvents: "none",
  },
  orb2: {
    position: "fixed",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, #8b5cf618 0%, transparent 70%)",
    bottom: -100,
    left: -100,
    pointerEvents: "none",
  },
  floatingCard: {
    position: "fixed",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    background: "#0a0a14",
    border: "1px solid #1e1e3a",
    borderRadius: 8,
    fontSize: 12,
    fontFamily: "var(--font-geist-mono), monospace",
    zIndex: 1,
    pointerEvents: "none",
  },
  floatText: { color: "#555" },
  floatBadge: { color: "#22c55e", fontWeight: 600, fontSize: 11 },
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
    borderRadius: "0 0 4px 4px",
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
  iconWrap: {
    fontSize: 28,
    marginBottom: 4,
  },
  heading: { fontSize: 22, fontWeight: 700 },
  sub: { fontSize: 13, color: "#555" },
  notice: {
    fontSize: 13,
    color: "#22c55e",
    background: "#22c55e08",
    border: "1px solid #22c55e20",
    borderRadius: 8,
    padding: "10px 14px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  form: { display: "flex", flexDirection: "column", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 12, fontWeight: 600, color: "#555", letterSpacing: "0.05em", textTransform: "uppercase" as const },
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
  dividerLine: {
    flex: 1,
    height: 1,
    background: "#1e1e3a",
  },
  dividerText: {
    fontSize: 12,
    color: "#333",
    whiteSpace: "nowrap" as const,
  },
  footer: { textAlign: "center" },
  signupLink: {
    color: "#6366f1",
    fontWeight: 600,
    fontSize: 14,
    transition: "color 0.2s",
  },
};
