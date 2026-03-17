// providers/query-provider.tsx

'use client';

import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { useState, useEffect, ReactNode } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is stale immediately so refetch happens on mount/focus
            staleTime: 0,
            // Keep cached data for 5 min as offline fallback
            gcTime: 5 * 60 * 1000,
            retry: 2,
            // Refetch when window regains focus
            refetchOnWindowFocus: true,
            // Refetch when component mounts if data is stale
            refetchOnMount: true,
            // Refetch when network reconnects
            refetchOnReconnect: true,
            // Show previous data while refetching (no loading flicker)
            placeholderData: (previousData: unknown) => previousData,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  // Sync browser online state with React Query
  useEffect(() => {
    const handleOnline = () => onlineManager.setOnline(true);
    const handleOffline = () => onlineManager.setOnline(false);

    onlineManager.setOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}