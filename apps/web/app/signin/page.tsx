"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signin } from "../lib/api";
import { Suspense } from "react";

function SigninForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
      router.push("/dashboard");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <Link href="/" style={styles.logo}>
          Watch<span style={styles.accent}>Tower</span>
        </Link>
        <h1 style={styles.heading}>Welcome back</h1>

        {notice && <p style={styles.notice}>{notice}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
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
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button style={loading ? styles.btnDisabled : styles.btn} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" style={styles.link}>
            Sign up
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
    padding: "24px",
  },
  card: {
    background: "#1a1a1a",
    border: "1px solid #2e2e2e",
    borderRadius: "14px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    textAlign: "center" as const,
  },
  accent: {
    color: "#6366f1",
  },
  heading: {
    fontSize: "22px",
    fontWeight: 700,
    textAlign: "center" as const,
  },
  notice: {
    fontSize: "13px",
    color: "#22c55e",
    background: "#22c55e15",
    border: "1px solid #22c55e30",
    borderRadius: "6px",
    padding: "8px 12px",
    textAlign: "center" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#aaa",
  },
  input: {
    background: "#0f0f0f",
    border: "1px solid #2e2e2e",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f0f0f0",
    fontSize: "15px",
    outline: "none",
    width: "100%",
  },
  error: {
    fontSize: "13px",
    color: "#ef4444",
    background: "#ef444415",
    border: "1px solid #ef444430",
    borderRadius: "6px",
    padding: "8px 12px",
  },
  btn: {
    marginTop: "4px",
    padding: "11px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "15px",
  },
  btnDisabled: {
    marginTop: "4px",
    padding: "11px",
    background: "#3f41a0",
    color: "#aaa",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "not-allowed",
  },
  footer: {
    fontSize: "13px",
    color: "#888",
    textAlign: "center" as const,
  },
  link: {
    color: "#6366f1",
    fontWeight: 500,
  },
};
