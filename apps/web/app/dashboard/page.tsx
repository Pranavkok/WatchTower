"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addWebsite, getWebsites, getWebsiteStatus } from "../lib/api";

type SavedWebsite = {
  id: string;
  url: string;
};

type WebsiteStatus = {
  id: string;
  url: string;
  user_id: string;
  status: string;
  loading: boolean;
  error: boolean;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("wt_token");
}

export default function DashboardPage() {
  const router = useRouter();
  const [websites, setWebsites] = useState<WebsiteStatus[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyPhone, setNotifyPhone] = useState("");
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatuses = useCallback(async (saved: SavedWebsite[], token: string) => {
    const results = await Promise.all(
      saved.map(async (w) => {
        try {
          const data = await getWebsiteStatus(w.id, token);
          return { ...data, loading: false, error: false };
        } catch {
          return { id: w.id, url: w.url, user_id: "", status: "Unknown", loading: false, error: true };
        }
      })
    );
    setWebsites(results);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/signin");
      return;
    }
    getWebsites(token).then((saved) => {
      if (saved.length === 0) {
        setWebsites([]);
        return;
      }
      setWebsites(saved.map((w) => ({ id: w.id, url: w.url, user_id: "", status: "Unknown", loading: true, error: false })));
      fetchStatuses(saved, token);
    }).catch(() => setWebsites([]));
  }, [router, fetchStatuses]);

  async function handleRefresh() {
    const token = getToken();
    if (!token) return;
    setRefreshing(true);
    const saved = await getWebsites(token).catch(() => [] as SavedWebsite[]);
    setWebsites(saved.map((w) => ({ id: w.id, url: w.url, user_id: "", status: "Unknown", loading: true, error: false })));
    await fetchStatuses(saved, token);
    setRefreshing(false);
  }

  async function handleAddWebsite(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    const token = getToken();
    if (!token) {
      router.push("/signin");
      return;
    }
    let url = newUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    setAdding(true);
    try {
      const data = await addWebsite(url, token, notifyEmail || undefined, notifyPhone || undefined);
      setNewUrl("");
      setNotifyEmail("");
      setNotifyPhone("");
      // Add optimistic entry then fetch its status
      setWebsites((prev) => [
        ...prev,
        { id: data.id, url, user_id: "", status: "Unknown", loading: true, error: false },
      ]);
      const status = await getWebsiteStatus(data.id, token);
      setWebsites((prev) =>
        prev.map((w) => (w.id === data.id ? { ...status, loading: false, error: false } : w))
      );
    } catch {
      setAddError("Failed to add website. Check the URL and try again.");
    } finally {
      setAdding(false);
    }
  }

  function handleRemove(id: string) {
    setWebsites((prev) => prev.filter((w) => w.id !== id));
  }

  function handleSignout() {
    localStorage.removeItem("wt_token");
    localStorage.removeItem("wt_websites");
    router.push("/signin");
  }

  return (
    <div style={styles.root}>
      {/* Header */}
      <header style={styles.header}>
        <Link href="/" style={styles.logo}>
          Watch<span style={styles.accent}>Tower</span>
        </Link>
        <button onClick={handleSignout} style={styles.signoutBtn}>
          Sign out
        </button>
      </header>

      <main style={styles.main}>
        {/* Add Website */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Add a Website</h2>
          <form onSubmit={handleAddWebsite} style={styles.addForm}>
            <input
              style={styles.urlInput}
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://yoursite.com"
              required
            />
            <input
              style={styles.urlInput}
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="Alert email (optional)"
            />
            <input
              style={styles.urlInput}
              type="tel"
              value={notifyPhone}
              onChange={(e) => setNotifyPhone(e.target.value)}
              placeholder="WhatsApp number e.g. +1234567890 (optional)"
            />
            <button style={adding ? styles.addBtnDisabled : styles.addBtn} disabled={adding}>
              {adding ? "Adding…" : "+ Add"}
            </button>
          </form>
          {addError && <p style={styles.error}>{addError}</p>}
        </section>

        {/* Website List */}
        <section style={styles.section}>
          <div style={styles.listHeader}>
            <h2 style={styles.sectionTitle}>
              Monitored Websites
              <span style={styles.count}>{websites.length}</span>
            </h2>
            {websites.length > 0 && (
              <button onClick={handleRefresh} style={styles.refreshBtn} disabled={refreshing}>
                {refreshing ? "Refreshing…" : "↻ Refresh"}
              </button>
            )}
          </div>

          {websites.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyIcon}>📡</p>
              <p style={styles.emptyText}>No websites added yet.</p>
              <p style={styles.emptySubtext}>Add a URL above to start monitoring.</p>
            </div>
          ) : (
            <div style={styles.list}>
              {websites.map((w) => (
                <WebsiteCard key={w.id} website={w} onRemove={handleRemove} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function WebsiteCard({
  website,
  onRemove,
}: {
  website: WebsiteStatus;
  onRemove: (id: string) => void;
}) {
  const displayUrl = website.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div style={cardStyles.card}>
      <div style={cardStyles.left}>
        <div style={cardStyles.urlRow}>
          {website.loading ? (
            <span style={cardStyles.statusDot("loading")} />
          ) : website.error ? (
            <span style={cardStyles.statusDot("error")} title="Could not fetch status" />
          ) : website.status === "Up" ? (
            <span style={cardStyles.statusDot("ok")} title="Up" />
          ) : (
            <span style={cardStyles.statusDot("error")} title={website.status} />
          )}
          <span style={cardStyles.url}>{displayUrl}</span>
        </div>
        <span style={cardStyles.id}>ID: {website.id}</span>
      </div>
      <div style={cardStyles.right}>
        {website.loading ? (
          <span style={cardStyles.badge("loading")}>Checking…</span>
        ) : website.error ? (
          <span style={cardStyles.badge("error")}>Error</span>
        ) : website.status === "Up" ? (
          <span style={cardStyles.badge("ok")}>Up</span>
        ) : website.status === "Down" ? (
          <span style={cardStyles.badge("error")}>Down</span>
        ) : (
          <span style={cardStyles.badge("loading")}>Pending</span>
        )}
        <button
          onClick={() => onRemove(website.id)}
          style={cardStyles.removeBtn}
          title="Remove from dashboard"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

const cardStyles = {
  card: {
    background: "#1a1a1a",
    border: "1px solid #2e2e2e",
    borderRadius: "10px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  } satisfies React.CSSProperties,
  left: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
    flex: 1,
  } satisfies React.CSSProperties,
  urlRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  } satisfies React.CSSProperties,
  url: {
    fontSize: "15px",
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  id: {
    fontSize: "11px",
    color: "#555",
    fontFamily: "var(--font-geist-mono), monospace",
  } satisfies React.CSSProperties,
  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  } satisfies React.CSSProperties,
  statusDot: (state: "ok" | "error" | "loading"): React.CSSProperties => ({
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
    background: state === "ok" ? "#22c55e" : state === "error" ? "#ef4444" : "#555",
  }),
  badge: (state: "ok" | "error" | "loading"): React.CSSProperties => ({
    fontSize: "12px",
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: "999px",
    background:
      state === "ok" ? "#22c55e20" : state === "error" ? "#ef444420" : "#55555520",
    color: state === "ok" ? "#22c55e" : state === "error" ? "#ef4444" : "#888",
    border: `1px solid ${state === "ok" ? "#22c55e40" : state === "error" ? "#ef444440" : "#55555540"}`,
  }),
  removeBtn: {
    background: "transparent",
    border: "none",
    color: "#555",
    fontSize: "13px",
    padding: "4px 6px",
    borderRadius: "4px",
    cursor: "pointer",
  } satisfies React.CSSProperties,
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 32px",
    borderBottom: "1px solid #2e2e2e",
    background: "#0f0f0f",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  accent: {
    color: "#6366f1",
  },
  signoutBtn: {
    background: "transparent",
    border: "1px solid #2e2e2e",
    color: "#888",
    borderRadius: "7px",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: 500,
  },
  main: {
    flex: 1,
    maxWidth: "780px",
    width: "100%",
    margin: "0 auto",
    padding: "40px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "48px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  sectionTitle: {
    fontSize: "17px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  count: {
    background: "#242424",
    border: "1px solid #2e2e2e",
    borderRadius: "999px",
    padding: "1px 8px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#888",
  },
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addForm: {
    display: "flex",
    gap: "10px",
  },
  urlInput: {
    flex: 1,
    background: "#1a1a1a",
    border: "1px solid #2e2e2e",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#f0f0f0",
    fontSize: "15px",
    outline: "none",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    flexShrink: 0,
  },
  addBtnDisabled: {
    padding: "10px 20px",
    background: "#3f41a0",
    color: "#aaa",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "14px",
    flexShrink: 0,
    cursor: "not-allowed",
  },
  error: {
    fontSize: "13px",
    color: "#ef4444",
    background: "#ef444415",
    border: "1px solid #ef444430",
    borderRadius: "6px",
    padding: "8px 12px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  refreshBtn: {
    background: "transparent",
    border: "1px solid #2e2e2e",
    color: "#888",
    borderRadius: "7px",
    padding: "5px 12px",
    fontSize: "13px",
    fontWeight: 500,
  },
  empty: {
    border: "1px dashed #2e2e2e",
    borderRadius: "12px",
    padding: "48px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: "32px",
  },
  emptyText: {
    fontSize: "15px",
    fontWeight: 600,
  },
  emptySubtext: {
    fontSize: "13px",
    color: "#888",
  },
};
