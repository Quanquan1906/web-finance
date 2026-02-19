/**
 * Imperative auth guard — call inside action handlers (onClick, onSubmit, …).
 * Returns true if authenticated; otherwise shows a toast and redirects.
 *
 * Dependencies: only shared/* (FSD compliant).
 *
 * Usage inside a React component:
 *
 *   const navigate = useNavigate();
 *   const { pathname } = useLocation();
 *
 *   function handleAddTransaction() {
 *     if (!requireAuth({ navigate, from: pathname })) return;
 *     // user is logged in — open modal / proceed
 *   }
 */

import { session } from "@/shared/auth/session";
import { toast } from "@/shared/lib/toast";

/**
 * Minimal navigate signature — compatible with TanStack Router's useNavigate()
 * as well as any other router that accepts { to, search, replace }.
 */
type NavigateFn = (opts: {
  to: string;
  search?: Record<string, string>;
  replace?: boolean;
}) => unknown;

export interface RequireAuthOptions {
  /** Navigate function from useNavigate(). */
  navigate: NavigateFn;
  /** Current route pathname used as the ?redirect= value after login. */
  from?: string;
  /** Override the default toast message. */
  message?: string;
}

/**
 * Returns true if the user is authenticated.
 * If not, fires a warning toast and navigates to /login?redirect=<from>.
 */
export function requireAuth({
  navigate,
  from,
  message = "Bạn cần đăng nhập để thực hiện thao tác này.",
}: RequireAuthOptions): boolean {
  if (session.isLoggedIn()) return true;

  toast.warning(message);

  navigate({
    to: "/login",
    search: { redirect: from ?? window.location.pathname },
    replace: false,
  });

  return false;
}
