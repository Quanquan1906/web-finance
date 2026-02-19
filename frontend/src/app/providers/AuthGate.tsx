import { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth';
export function AuthGate({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();

  const { hydrated, accessToken, logout } = useAuthStore((s) => ({
    hydrated: s.hydrated,
    accessToken: s.accessToken,
    logout: s.logout
  }));

  useEffect(() => {
    if (!hydrated) return;
    if (!accessToken) {
      nav({
        to: '/login',
        search: { redirect: loc.href } as any,
        replace: true
      });
    }
  }, [hydrated, accessToken, nav, loc.href]);

  // 401 (server báo token hết hạn)
  useEffect(() => {
    const handler = async () => {
      await logout(); // clear access/refresh/user trong store + localStorage
      nav({
        to: '/login',
        search: { redirect: window.location.href } as any,
        replace: true
      });
    };

    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [logout, nav]);

  if (!hydrated) return null; // tránh flicker
  if (!accessToken) return null; // đang redirect

  return <>{children}</>;
}
