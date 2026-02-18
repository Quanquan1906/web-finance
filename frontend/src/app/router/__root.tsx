import { NotFound } from '@/pages/not-found';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { AuthGate } from '../providers/AuthGate';

interface RootRouteContext {
  data: string;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <AuthGate>
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </AuthGate>
  ),
  notFoundComponent: () => <NotFound />
});
