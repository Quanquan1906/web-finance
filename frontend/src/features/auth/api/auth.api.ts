import { apiClient } from "@/shared/api/api-client";
import type { User } from "@/entities/user";
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from "../model/types";

export const authApi = {
  register: (payload: RegisterRequest) =>
    apiClient
      .post<AuthResponse>("/auth/register", payload)
      .then((r) => r.data),

  login: (payload: LoginRequest) =>
    apiClient
      .post<AuthResponse>("/auth/login", payload)
      .then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<RefreshTokenResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      })
      .then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient
      .post<void>("/auth/logout", {
        refresh_token: refreshToken,
      })
      .then(() => undefined),

  me: () =>
    apiClient.get<User>("/users/me").then((r) => r.data),
};