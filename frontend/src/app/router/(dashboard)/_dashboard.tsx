// Dashboard layout — PUBLIC. No auth gate here.
// Authentication is enforced per-action via requireAuth() in each widget/feature.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/widgets/app-shell";

export const Route = createFileRoute("/(dashboard)/_dashboard")({
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
