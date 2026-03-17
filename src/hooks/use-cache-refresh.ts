// hooks/use-cache-refresh.ts

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheRefreshOptions {
  /** Refresh on initial mount */
  refreshOnMount?: boolean;
  /** Refresh when tab becomes visible again */
  refreshOnFocus?: boolean;
  /** Refresh when network reconnects */
  refreshOnReconnect?: boolean;
  /** Also clear Zustand persisted stores from localStorage */
  clearPersistedStores?: boolean;
  /** Specific localStorage keys to preserve (never clear these) */
  preserveKeys?: string[];
  /** Callback after refresh completes */
  onRefreshComplete?: () => void;
}

// Keys that should NEVER be cleared (auth, theme, preferences)
const PROTECTED_KEYS = [
  'urafd-theme',
  'rootaf-pwa-dismissed-session',
  'rootaf-pwa-view-count',
  'rootaf-pwa-install-dismissed',
];

// Keys that contain cached/stale data and SHOULD be refreshed
const STALE_DATA_PATTERNS = [
  'rootaf-',
  'tanstack',
  'react-query',
  'cache-',
  'cached-',
  '-cache',
  '-cached',
  'offline-',
  'stale-',
];

export function useCacheRefresh(options: CacheRefreshOptions = {}) {
  const {
    refreshOnMount = true,
    refreshOnFocus = true,
    refreshOnReconnect = true,
    clearPersistedStores = false,
    preserveKeys = [],
    onRefreshComplete,
  } = options;

  const queryClient = useQueryClient();
  const lastRefreshRef = useRef<number>(0);
  const isRefreshingRef = useRef(false);

  // Minimum interval between refreshes (prevent rapid-fire)
  const MIN_REFRESH_INTERVAL = 5000; // 5 seconds

  // ── Core refresh function ──
  const refreshAllData = useCallback(
    async (reason: string = 'manual') => {
      const now = Date.now();

      // Debounce: skip if refreshed recently
      if (now - lastRefreshRef.current < MIN_REFRESH_INTERVAL) {
        console.log('[CacheRefresh] Skipped — refreshed recently');
        return;
      }

      // Prevent concurrent refreshes
      if (isRefreshingRef.current) {
        console.log('[CacheRefresh] Skipped — already refreshing');
        return;
      }

      isRefreshingRef.current = true;
      lastRefreshRef.current = now;

      console.log(`[CacheRefresh] Starting refresh (reason: ${reason})`);

      try {
        // 1. Clear service worker API + dynamic caches
        await refreshServiceWorkerCaches();

        // 2. Invalidate all React Query caches (triggers refetch)
        await queryClient.invalidateQueries();

        // 3. Optionally clear stale localStorage data
        if (clearPersistedStores) {
          clearStaleLocalStorage([...PROTECTED_KEYS, ...preserveKeys]);
        }

        // 4. Refetch all active queries
        await queryClient.refetchQueries({
          type: 'active',
          stale: true,
        });

        console.log('[CacheRefresh] Refresh complete');
        onRefreshComplete?.();
      } catch (error) {
        console.error('[CacheRefresh] Refresh failed:', error);
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [queryClient, clearPersistedStores, preserveKeys, onRefreshComplete],
  );

  // ── Refresh on mount (app load / page refresh) ──
  useEffect(() => {
    if (!refreshOnMount) return;

    // Small delay to let the app hydrate first
    const timer = setTimeout(() => {
      if (navigator.onLine) {
        refreshAllData('mount');
      }
    }, 1000);

    return () => clearTimeout(timer);
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Refresh when tab becomes visible ──
  useEffect(() => {
    if (!refreshOnFocus) return;

    const handleVisibility = () => {
      if (!document.hidden && navigator.onLine) {
        refreshAllData('focus');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
  }, [refreshOnFocus, refreshAllData]);

  // ── Refresh when network reconnects ──
  useEffect(() => {
    if (!refreshOnReconnect) return;

    const handleOnline = () => {
      // Delay slightly to ensure connection is stable
      setTimeout(() => {
        if (navigator.onLine) {
          refreshAllData('reconnect');
        }
      }, 1500);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [refreshOnReconnect, refreshAllData]);

  // ── Listen for SW-triggered refresh signals ──
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'CACHES_REFRESHED') {
        console.log('[CacheRefresh] SW signaled caches refreshed');
        queryClient.invalidateQueries();
        queryClient.refetchQueries({ type: 'active' });
      }

      if (event.data?.type === 'BACKGROUND_SYNC') {
        console.log('[CacheRefresh] Background sync triggered');
        refreshAllData('background-sync');
      }
    };

    navigator.serviceWorker.addEventListener('message', handleMessage);
    return () =>
      navigator.serviceWorker.removeEventListener('message', handleMessage);
  }, [queryClient, refreshAllData]);

  return {
    refreshAllData,
    isRefreshing: isRefreshingRef.current,
  };
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

/** Tell the service worker to clear API & dynamic caches */
async function refreshServiceWorkerCaches(): Promise<boolean> {
  if (
    !('serviceWorker' in navigator) ||
    !navigator.serviceWorker.controller
  ) {
    return false;
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel();

    // Timeout after 5 seconds
    const timeout = setTimeout(() => {
      console.warn('[CacheRefresh] SW cache refresh timed out');
      resolve(false);
    }, 5000);

    channel.port1.onmessage = (event) => {
      clearTimeout(timeout);
      resolve(event.data?.refreshed ?? false);
    };

    navigator.serviceWorker.controller!.postMessage(
      { type: 'REFRESH_ALL_DATA' },
      [channel.port2],
    );
  });
}

/** Clear stale data from localStorage while preserving protected keys */
function clearStaleLocalStorage(protectedKeys: string[]) {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Skip protected keys
      if (protectedKeys.some((pk) => key === pk || key.startsWith(pk))) {
        continue;
      }

      // Check if this key matches stale data patterns
      const isStale = STALE_DATA_PATTERNS.some((pattern) =>
        key.toLowerCase().includes(pattern.toLowerCase()),
      );

      if (isStale) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`[CacheRefresh] Cleared localStorage: ${key}`);
    });
  } catch (error) {
    console.warn('[CacheRefresh] localStorage cleanup failed:', error);
  }
}