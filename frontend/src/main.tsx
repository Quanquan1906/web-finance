/// <reference types="vite/client" />

import { StrictMode, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './app/styles/index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';
import { Provider } from './app/providers/root-provider';
import { useAuthStore } from './features/auth';

export const router = createRouter({
  routeTree,
  context: { data: '' },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function Router() {
  return <RouterProvider router={router} context={{}} />;
}

function AuthSyncListener() {
  useEffect(() => {
    const handleTokenRefreshed = () => {
      useAuthStore.getState().syncFromSession();
    };

    window.addEventListener('auth:token-refreshed', handleTokenRefreshed);

    return () => {
      window.removeEventListener('auth:token-refreshed', handleTokenRefreshed);
    };
  }, []);

  return null;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000
    }
  }
});
const rootElement = document.getElementById('app');
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider queryClient={queryClient}>
        <AuthSyncListener />
        <Router />
      </Provider>
    </StrictMode>
  );
}
