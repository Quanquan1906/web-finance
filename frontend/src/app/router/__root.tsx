import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NotFound } from '@/pages/not-found';
import { AppShell } from '@/widgets/app-shell';

interface RootRouteContext {
  data: string;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <AppShell>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </AppShell>
  ),
  notFoundComponent: () => <NotFound />
});
