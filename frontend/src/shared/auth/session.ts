export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  roles: string[];
  is_active: boolean;
  created_at?: string | null;
}

const KEY_ACCESS = "auth.access_token";
const KEY_REFRESH = "auth.refresh_token";
const KEY_USER = "auth.user";

const storage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },
};

export const session = {
  getAccessToken: (): string | null => storage.getItem(KEY_ACCESS),

  setAccessToken: (token: string | null): void => {
    if (!token) {
      storage.removeItem(KEY_ACCESS);
      return;
    }
    storage.setItem(KEY_ACCESS, token);
  },

  getRefreshToken: (): string | null => storage.getItem(KEY_REFRESH),

  setRefreshToken: (token: string | null): void => {
    if (!token) {
      storage.removeItem(KEY_REFRESH);
      return;
    }
    storage.setItem(KEY_REFRESH, token);
  },

  getUser: (): SessionUser | null => {
    try {
      const raw = storage.getItem(KEY_USER);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: SessionUser | null): void => {
    if (!user) {
      storage.removeItem(KEY_USER);
      return;
    }
    storage.setItem(KEY_USER, JSON.stringify(user));
  },

  isLoggedIn: (): boolean => Boolean(storage.getItem(KEY_ACCESS)),

  clear: (): void => {
    storage.removeItem(KEY_ACCESS);
    storage.removeItem(KEY_REFRESH);
    storage.removeItem(KEY_USER);
  },
} as const;