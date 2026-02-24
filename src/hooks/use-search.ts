'use client';

import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@/lib/api/search.api';
import { useDebounce } from './use-debounce';

export function useSearch(query: string, type?: string, page?: number) {
  const debouncedQuery = useDebounce(query, 400);

  return useQuery({
    queryKey: ['search', debouncedQuery, type, page],
    queryFn: () => searchApi.search(debouncedQuery, type, page),
    enabled: debouncedQuery.length >= 2,
  });
}