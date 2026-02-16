import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LoginCredentials } from './types';
import { User } from '@/entities/user';
import { authApi } from '../api/authApi';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await authApi.login(credentials);
          const { user, token } = data;
          localStorage.setItem('token', token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        await authApi.logout();
        localStorage.removeItem('token');
        set({ user: null, isLoading: false });
      },
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user }) }
  )
);