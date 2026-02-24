'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/categories.api';

export function useCategories(type?: string) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => categoriesApi.getAll(type),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategoriesByType(type: string) {
  return useQuery({
    queryKey: ['categories', 'type', type],
    queryFn: () => categoriesApi.getByType(type),
    staleTime: 5 * 60 * 1000,
    enabled: !!type,
  });
}