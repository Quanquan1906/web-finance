/// <reference types="vite/client" />

import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './app/styles/index.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { QueryClient } from '@tanstack/react-query';
import { Provider } from './app/providers/root-provider';

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
        <Router />
      </Provider>
    </StrictMode>
  );
}
