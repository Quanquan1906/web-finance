import { create } from 'zustand';
import { authApi } from '../api/auth.api';
import { AuthUser, LoginPayload } from './types';
import { session } from '@/shared/auth/session';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  /** true once hydrate() has been called — useful for sidebar to avoid flicker */
  hydrated: boolean;

  hydrate: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,

  hydrate: () => {
    set({
      accessToken: session.getAccessToken(),
      refreshToken: session.getRefreshToken(),
      // AuthUser satisfies SessionUser (same shape), safe cast
      user: session.getUser() as AuthUser | null,
      hydrated: true
    });
  },

  setAccessToken: (token) => {
    session.setAccessToken(token);
    set({ accessToken: token });
  },

  login: async (payload) => {
    const res = await authApi.login(payload);

    session.setAccessToken(res.accessToken);
    session.setRefreshToken(res.refreshToken);
    session.setUser(res.user);

    set({
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      user: res.user
    });
  },

  logout: async () => {
    const refreshToken = get().refreshToken;

    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // Ignore — token may already be expired or server unreachable
    }

    session.clear();
    set({ accessToken: null, refreshToken: null, user: null });
  }
}));
