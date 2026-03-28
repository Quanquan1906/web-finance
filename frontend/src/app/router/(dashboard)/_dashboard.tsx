import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { AppShell } from '@/widgets/app-shell';
import { useAuthStore } from '@/features/auth';

export const Route = createFileRoute('/(dashboard)/_dashboard')({
  beforeLoad: ({ location }) => {
    const { accessToken } = useAuthStore.getState();
    const persistedToken = localStorage.getItem('accessToken');

    if (!accessToken && !persistedToken) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href
        }
      });
    }
  },
  component: DashboardLayout
});

function DashboardLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
