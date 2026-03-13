/**
 * Null-rendering component mounted at the router root (inside TanStack Router
 * context, so useNavigate() is available).
 * Listens for the global "auth:unauthorized" event dispatched by api-client
 * when a refresh attempt fails, then clears session and sends user to /login.
 *
 * Placed in __root.tsx so it covers ALL routes, not just the dashboard group.
 */
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth";

export function AuthEventListener() {
  const nav = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const handler = async () => {
      await logout(); // clears session + in-memory store
      nav({ to: "/login", search: {}, replace: true });
    };

    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, [logout, nav]);

  // Also sync in-memory store when the interceptor silently refreshes the token
  useEffect(() => {
    const handler = (e: Event) => {
      const newToken = (e as CustomEvent<string>).detail;
      useAuthStore.getState().setAccessToken(newToken);
    };

    window.addEventListener("auth:token-refreshed", handler);
    return () => window.removeEventListener("auth:token-refreshed", handler);
  }, []);

  return null;
}
