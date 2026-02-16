import { apiClient } from '@/shared/api';
import type { User } from '../model/types';

export const userApi = {
  getUser: (id: string) => apiClient.get<User>(`/users/${id}`),
  getUsers: () => apiClient.get<User[]>('/users'),
};