/**
 * Pure localStorage I/O — zero React, zero Zustand, zero feature imports.
 * Shared layer: may be imported by any upper layer (features, widgets, app).
 * Upper layers must NOT be imported here (FSD unidirectional rule).
 */

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  roles: string[];
}

const KEY_ACCESS = 'accessToken';
const KEY_REFRESH = 'refreshToken';
const KEY_USER = 'authUser';

export const session = {
  // ── access token ──────────────────────────────────────────────────────────
  getAccessToken: (): string | null => localStorage.getItem(KEY_ACCESS),

  setAccessToken: (token: string | null): void => {
    if (!token) {
      localStorage.removeItem(KEY_ACCESS);
      return;
    }
    localStorage.setItem(KEY_ACCESS, token);
  },

  // ── refresh token ─────────────────────────────────────────────────────────
  getRefreshToken: (): string | null => localStorage.getItem(KEY_REFRESH),

  setRefreshToken: (token: string | null): void => {
    if (!token) {
      localStorage.removeItem(KEY_REFRESH);
      return;
    }
    localStorage.setItem(KEY_REFRESH, token);
  },

  // ── user ──────────────────────────────────────────────────────────────────
  getUser: (): SessionUser | null => {
    try {
      const raw = localStorage.getItem(KEY_USER);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: SessionUser): void => localStorage.setItem(KEY_USER, JSON.stringify(user)),

  // ── helpers ───────────────────────────────────────────────────────────────
  isLoggedIn: (): boolean => Boolean(localStorage.getItem(KEY_ACCESS)),

  clear: (): void => {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
    localStorage.removeItem(KEY_USER);
  }
} as const;
