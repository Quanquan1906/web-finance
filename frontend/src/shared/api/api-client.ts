/**
 * Axios instance — shared layer.
 * MUST NOT import from features/* (FSD rule: shared has no upper-layer deps).
 * Token I/O is delegated entirely to session.ts.
 */
import { session } from "@/shared/auth/session";
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

export const apiClient: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach access token ────────────────────────────────
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = session.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: silent token refresh + 401 broadcast ─────────────
let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401) return Promise.reject(error);
    if (original?._retry) return Promise.reject(error);

    const refreshToken = session.getRefreshToken();
    if (!refreshToken) {
      session.clear();
      window.dispatchEvent(new Event("auth:unauthorized"));
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = apiClient
          .post<{ accessToken: string }>("/api/v1/auth/refresh", {
            refreshToken,
          })
          .then((r) => {
            const newToken = r.data.accessToken;
            // Persist to localStorage
            session.setAccessToken(newToken);
            // Let the store sync its in-memory state (handled by AuthEventListener)
            window.dispatchEvent(
              new CustomEvent<string>("auth:token-refreshed", {
                detail: newToken,
              }),
            );
            return newToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccess = await refreshPromise;
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newAccess}`;
      return apiClient(original);
    } catch (e) {
      session.clear();
      window.dispatchEvent(new Event("auth:unauthorized"));
      return Promise.reject(e);
    }
  },
);
