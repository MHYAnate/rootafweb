'use client';

import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/lib/api/location.api';

export function useStates() {
  return useQuery({
    queryKey: ['states'],
    queryFn: locationApi.getStates,
    staleTime: 60 * 60 * 1000,
  });
}

export function useLgas(stateName: string) {
  return useQuery({
    queryKey: ['lgas', stateName],
    queryFn: () => locationApi.getLgasByName(stateName),
    enabled: !!stateName,
    staleTime: 60 * 60 * 1000,
  });
}