interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  full_name?: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

interface RefreshTokenRequest {
  refresh_token: string;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

interface LogoutResponse {
  message: string;
}

export { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest, RefreshTokenResponse, LogoutResponse };
