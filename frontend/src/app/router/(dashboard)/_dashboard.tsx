import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/widgets/app-shell";
import { useAuthStore } from "@/features/auth";
import { session } from "@/shared/auth/session";

export const Route = createFileRoute("/(dashboard)/_dashboard")({
  beforeLoad: ({ location }) => {
    const store = useAuthStore.getState();

    if (!store.hydrated) {
      store.hydrate();
    }

    const accessToken = store.accessToken ?? session.getAccessToken();

    if (!accessToken) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}