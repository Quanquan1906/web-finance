import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/pages/auth/login";
import { session } from "@/shared/auth/session";

export const Route = createFileRoute("/(auth)/_auth/login")({
  // No validateSearch — redirect param is read loosely by LoginForm via
  // useSearch({ strict: false }), so no schema constraint is needed here.
  // Defining validateSearch would force every nav({ to: "/login" }) to pass
  // a search object, which is unnecessarily strict.

  beforeLoad: ({ location }) => {
    // Use session directly — no hydration-timing race.
    if (session.isLoggedIn()) {
      const redirectTo =
        (location.search as Record<string, string | undefined>).redirect ??
        "/dashboard";
      throw redirect({ to: redirectTo, replace: true });
    }
  },

  component: LoginPage,
});
