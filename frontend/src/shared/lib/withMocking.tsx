import React, { useEffect, useState } from 'react';
export function withMocking<P extends object>(Component: React.ComponentType<P>) {
  return function WithMockingComponent(props: P) {
    const [isReady, setIsReady] = useState(!import.meta.env.DEV);
    useEffect(() => {
      if (!import.meta.env.DEV) return;
      async function setup() {
        try {
          const { worker } = await import('@/shared/mocks/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
            serviceWorker: {
              url: '/mockServiceWorker.js'
            }
          });
        } catch (error) {
          console.error('MSW failed to start:', error);
        } finally {
          setIsReady(true);
        }
      }
      setup();
    }, []);
    if (!isReady) {
      return <div>Initializing mock services...</div>;
    }
    return <Component {...props} />;
  };
}
