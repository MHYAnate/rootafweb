// hooks/use-stats.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { statsApi, type PlatformStats } from '@/lib/api/stats.api';

export function usePlatformStats() {
  return useQuery<PlatformStats>({
    queryKey: ['platform-stats'],
    queryFn: statsApi.getPublicStats,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
}