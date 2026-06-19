"use client";

const STORAGE_KEY_TOKEN = 'ADMIN_TOKEN';
const STORAGE_KEY_TS = 'ADMIN_TOKEN_TS';
const SESSION_MS = 10 * 60 * 1000; // 10 minutes

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY_TOKEN);
}

export function setAdminSession(token: string) {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_TS, String(now));
}

export function refreshAdminSession() {
  if (typeof window === 'undefined') return;
  const token = getAdminToken();
  if (!token) return;
  localStorage.setItem(STORAGE_KEY_TS, String(Date.now()));
}

export function getAdminSession(): { token: string; expiresAt: number; remainingMs: number } | null {
  if (typeof window === 'undefined') return null;
  const token = getAdminToken();
  const tsStr = localStorage.getItem(STORAGE_KEY_TS);
  if (!token || !tsStr) return null;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return null;
  const expiresAt = ts + SESSION_MS;
  const remainingMs = expiresAt - Date.now();
  if (remainingMs <= 0) return null;
  return { token, expiresAt, remainingMs };
}

export function isAdminAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function logoutAdmin() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_TS);
}

export async function adminFetch<T = any>(path: string, init?: RequestInit): Promise<T> {
  const session = getAdminSession();
  const headers = new Headers(init?.headers || {});
  headers.set('content-type', 'application/json');
  if (session?.token) headers.set('x-admin-token', session.token);

  const res = await fetch(path, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Admin API error ${res.status}: ${text}`);
  }
  refreshAdminSession();
  return res.json();
}
