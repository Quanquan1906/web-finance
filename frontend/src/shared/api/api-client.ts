import { session } from '@/shared/auth/session';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = session.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Không refresh lại nếu chính request refresh bị lỗi
    if (original?.url?.includes('/api/v1/auth/refresh')) {
      session.clear();
      window.dispatchEvent(new Event('auth:unauthorized'));
      return Promise.reject(error);
    }

    if (original?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = session.getRefreshToken();
    if (!refreshToken) {
      session.clear();
      window.dispatchEvent(new Event('auth:unauthorized'));
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        console.log('[refresh] start with token:', refreshToken);

        refreshPromise = refreshClient
          .post('/api/v1/auth/refresh', {
            refresh_token: refreshToken
          })
          .then((r) => {
            console.log('[refresh] success', r.data);
            const newAccessToken = r.data.access_token;
            const newRefreshToken = r.data.refresh_token;

            session.setAccessToken(newAccessToken);
            session.setRefreshToken(newRefreshToken);

            window.dispatchEvent(
              new CustomEvent('auth:token-refreshed', {
                detail: {
                  accessToken: newAccessToken,
                  refreshToken: newRefreshToken
                }
              })
            );

            return newAccessToken;
          })
          .catch((err) => {
            console.error('[refresh] failed', err?.response?.data || err);
            throw err;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      original.headers = original.headers ?? {};
      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(original);
    } catch (e) {
      console.error('[refresh] final catch', e);
      session.clear();
      window.dispatchEvent(new Event('auth:unauthorized'));
      return Promise.reject(e);
    }
  }
);
