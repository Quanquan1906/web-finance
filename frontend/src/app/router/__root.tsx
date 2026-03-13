import { NotFound } from "@/pages/not-found";
import { AuthEventListener } from "@/app/providers/AuthEventListener";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { Provider } from "@/app/providers/root-provider";

interface RootRouteContext {
  queryClient: import("@tanstack/react-query").QueryClient;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <Provider>
      {/*
        AuthEventListener is a null-rendering component mounted here so that:
        1. It is INSIDE the TanStack Router context (useNavigate works).
        2. It is OUTSIDE any layout group → covers ALL routes globally.
        3. Dashboard routes are NOT blocked; only token expiry triggers redirect.
      */}
      <AuthEventListener />
      <Outlet />
      <ReactQueryDevtools initialIsOpen={false} />
    </Provider>
  ),
  notFoundComponent: () => <NotFound />,
});
