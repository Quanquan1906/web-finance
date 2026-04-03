import { useEffect } from 'react';
import { useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/features/auth';
export function AuthGate({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  const loc = useLocation();

  const { hydrated, accessToken } = useAuthStore((s) => ({
    hydrated: s.hydrated,
    accessToken: s.accessToken,
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

  // auth:unauthorized is handled globally by AuthEventListener (mounted at
  // the router root). AuthGate only needs to react to the store becoming empty,
  // which happens as a side-effect of logout() clearing the store.

  if (!hydrated) return null; // tránh flicker
  if (!accessToken) return null; // đang redirect

  return <>{children}</>;
}
