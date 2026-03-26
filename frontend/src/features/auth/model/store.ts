import { create } from "zustand";

import type { User } from "@/entities/user";
import { session } from "@/shared/auth/session";
import { authApi } from "../api/auth.api";
import type { LoginRequest, RegisterRequest } from "./types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;

  hydrate: () => void;
  syncFromSession: () => void;

  register: (payload: RegisterRequest) => Promise<void>;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;

  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
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
      user: session.getUser() as User | null,
      hydrated: true,
    });
  },

  syncFromSession: () => {
    set({
      accessToken: session.getAccessToken(),
      refreshToken: session.getRefreshToken(),
      user: session.getUser() as User | null,
    });
  },

  setAccessToken: (token) => {
    session.setAccessToken(token);
    set({ accessToken: token });
  },

  register: async (payload) => {
    const res = await authApi.register(payload);

    session.setAccessToken(res.access_token);
    session.setRefreshToken(res.refresh_token);
    session.setUser(res.user);

    set({
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      user: res.user,
    });
  },

  login: async (payload) => {
    const res = await authApi.login(payload);

    session.setAccessToken(res.access_token);
    session.setRefreshToken(res.refresh_token);
    session.setUser(res.user);

    set({
      accessToken: res.access_token,
      refreshToken: res.refresh_token,
      user: res.user,
    });
  },

  logout: async () => {
    const refreshToken = get().refreshToken ?? session.getRefreshToken();

    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // token có thể đã hết hạn / bị revoke / server lỗi
    }

    session.clear();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },

  clearAuth: () => {
    session.clear();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },
}));