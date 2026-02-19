export type Role = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  roles: Role[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
}
