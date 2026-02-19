import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/store'; // import thẳng store cho chắc

const _fallbackClient = new QueryClient();

export function getContext(queryClient: QueryClient) {
  return { queryClient };
}

interface ProviderProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export function Provider({ children, queryClient }: ProviderProps) {
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient ?? _fallbackClient}>{children}</QueryClientProvider>
  );
}
