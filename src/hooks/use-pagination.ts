'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function usePagination(defaultLimit: number = 12) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || defaultLimit;

  const setPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', String(newPage));
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  return { page, limit, setPage };
}