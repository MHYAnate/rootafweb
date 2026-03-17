// hooks/use-service-worker.ts

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
  error: Error | null;
}

interface CacheStatus {
  static: number;
  dynamic: number;
  images: number;
  api: number;
  version: string;
}

interface UseServiceWorkerReturn extends ServiceWorkerState {
  update: () => Promise<void>;
  skipWaiting: () => void;
  clearCaches: () => Promise<boolean>;
  refreshApiCache: () => Promise<boolean>;
  refreshDynamicCache: () => Promise<boolean>;
  refreshAllData: () => Promise<boolean>;
  getCacheStatus: () => Promise<CacheStatus | null>;
  getVersion: () => Promise<string | null>;
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    isUpdateAvailable: false,
    registration: null,
    error: null,
  });

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const isSupported = 'serviceWorker' in navigator;

    setState((prev) => ({
      ...prev,
      isSupported,
      isOnline: navigator.onLine,
    }));

    if (!isSupported) return;

    let updateInterval: ReturnType<typeof setInterval>;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          '/sw.js',
          {
            scope: '/',
            updateViaCache: 'none',
          },
        );

        registrationRef.current = registration;

        setState((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
        }));

        console.log('[PWA] Service worker registered:', registration.scope);

        // Check for updates every 60 minutes
        updateInterval = setInterval(
          () => {
            registration.update();
          },
          60 * 60 * 1000,
        );

        // Detect waiting service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log('[PWA] New version available');
              setState((prev) => ({ ...prev, isUpdateAvailable: true }));
            }
          });
        });

        // Check if there's already a waiting worker
        if (registration.waiting && navigator.serviceWorker.controller) {
          setState((prev) => ({ ...prev, isUpdateAvailable: true }));
        }
      } catch (error) {
        console.error('[PWA] Registration failed:', error);
        setState((prev) => ({
          ...prev,
          error:
            error instanceof Error ? error : new Error(String(error)),
        }));
      }
    };

    registerSW();

    const onControllerChange = () => {
      console.log('[PWA] Controller changed — reloading');
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      onControllerChange,
    );

    return () => {
      if (updateInterval) clearInterval(updateInterval);
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      );
    };
  }, []);

  // Online / offline
  useEffect(() => {
    const handleOnline = () =>
      setState((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () =>
      setState((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ── Helper to send messages to SW ──
  const sendMessage = useCallback(
    (type: string, timeout = 5000): Promise<any> => {
      if (!navigator.serviceWorker.controller) {
        return Promise.resolve(null);
      }

      return new Promise((resolve) => {
        const channel = new MessageChannel();

        const timer = setTimeout(() => {
          resolve(null);
        }, timeout);

        channel.port1.onmessage = (event) => {
          clearTimeout(timer);
          resolve(event.data);
        };

        navigator.serviceWorker.controller!.postMessage({ type }, [
          channel.port2,
        ]);
      });
    },
    [],
  );

  const update = useCallback(async () => {
    if (registrationRef.current) {
      await registrationRef.current.update();
    }
  }, []);

  const skipWaiting = useCallback(() => {
    const waiting = registrationRef.current?.waiting;
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }, []);

  const clearCaches = useCallback(async (): Promise<boolean> => {
    const result = await sendMessage('CLEAR_CACHES');
    return result?.cleared ?? false;
  }, [sendMessage]);

  const refreshApiCache = useCallback(async (): Promise<boolean> => {
    const result = await sendMessage('REFRESH_API_CACHE');
    return result?.refreshed ?? false;
  }, [sendMessage]);

  const refreshDynamicCache = useCallback(async (): Promise<boolean> => {
    const result = await sendMessage('REFRESH_DYNAMIC_CACHE');
    return result?.refreshed ?? false;
  }, [sendMessage]);

  const refreshAllData = useCallback(async (): Promise<boolean> => {
    const result = await sendMessage('REFRESH_ALL_DATA');
    return result?.refreshed ?? false;
  }, [sendMessage]);

  const getCacheStatus = useCallback(async (): Promise<CacheStatus | null> => {
    return sendMessage('GET_CACHE_STATUS');
  }, [sendMessage]);

  const getVersion = useCallback(async (): Promise<string | null> => {
    const result = await sendMessage('GET_VERSION');
    return result?.version ?? null;
  }, [sendMessage]);

  return {
    ...state,
    update,
    skipWaiting,
    clearCaches,
    refreshApiCache,
    refreshDynamicCache,
    refreshAllData,
    getCacheStatus,
    getVersion,
  };
}