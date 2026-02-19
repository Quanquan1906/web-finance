import { apiClient } from "@/shared/api/api-client";
import { AuthUser, LoginPayload, LoginResponse, RefreshResponse, RegisterPayload } from "../model/types";


export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post("/api/v1/auth/register", payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>("/api/v1/auth/login", payload).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient.post<RefreshResponse>("/api/v1/auth/refresh", { refreshToken }).then((r) => r.data),

  logout: (refreshToken: string) =>
    apiClient.post("/api/v1/auth/logout", { refreshToken }).then((r) => r.data),

  me: () =>
    apiClient.get<AuthUser>("/api/v1/auth/me").then((r) => r.data),
};
