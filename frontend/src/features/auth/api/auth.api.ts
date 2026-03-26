import { apiClient } from "@/shared/api/api-client";
import type { User } from "@/entities/user";
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenResponse,
  RegisterRequest,
  LogoutResponse,
} from "../model/types";

export const authApi = {
  register: (payload: RegisterRequest) =>
    apiClient
      .post<AuthResponse>("/api/v1/auth/register", payload)
      .then((r) => r.data),

  login: (payload: LoginRequest) =>
    apiClient
      .post<AuthResponse>("/api/v1/auth/login", payload)
      .then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<RefreshTokenResponse>("/api/v1/auth/refresh", {
        refresh_token: refreshToken,
      })
      .then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient
      .post<LogoutResponse>("/api/v1/auth/logout", {
        refresh_token: refreshToken,
      })
      .then((r) => r.data),

  me: () =>
    apiClient.get<User>("/api/v1/auth/me").then((r) => r.data),
};