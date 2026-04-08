// hooks/use-pagination.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function usePagination(defaultPage = 1) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL search params
  const urlPage = searchParams.get('page');
  const [page, setPageState] = useState(
    urlPage ? Math.max(1, parseInt(urlPage, 10)) : defaultPage
  );

  // Sync state when URL changes externally (browser back/forward)
  useEffect(() => {
    const urlPage = searchParams.get('page');
    const parsed = urlPage ? Math.max(1, parseInt(urlPage, 10)) : defaultPage;
    setPageState(parsed);
  }, [searchParams, defaultPage]);

  // Update both state AND URL when page changes
  const setPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, newPage);
      setPageState(validPage);

      // Build new search params preserving existing ones
      const params = new URLSearchParams(searchParams.toString());
      if (validPage === 1) {
        params.delete('page');
      } else {
        params.set('page', validPage.toString());
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      // Update URL without full page reload
      router.push(url, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return { page, setPage };
}