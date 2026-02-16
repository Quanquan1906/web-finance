import { apiClient } from '@/shared/api';
import { LoginCredentials, LoginResponse } from '../model/types';

export const authApi = {
  login: (credentials: LoginCredentials) => apiClient.post<LoginResponse>('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
};