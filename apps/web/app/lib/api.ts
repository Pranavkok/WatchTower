const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function signup(username: string, password: string): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/user/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function signin(username: string, password: string): Promise<{ jwt: string }> {
  const res = await fetch(`${API_URL}/user/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

export async function addWebsite(
  url: string,
  token: string,
  notify_email?: string,
  notify_phone?: string
): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/website`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ url, notify_email, notify_phone }),
  });
  if (!res.ok) throw new Error("Failed to add website");
  return res.json();
}

export async function getWebsites(token: string): Promise<{ id: string; url: string }[]> {
  const res = await fetch(`${API_URL}/websites`, {
    headers: { Authorization: token },
  });
  if (!res.ok) throw new Error("Failed to fetch websites");
  const data = await res.json();
  return data.websites;
}

export async function getWebsiteStatus(
  websiteId: string,
  token: string
): Promise<{ url: string; id: string; user_id: string; status: string }> {
  const res = await fetch(`${API_URL}/status/${websiteId}`, {
    headers: { Authorization: token },
  });
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}
