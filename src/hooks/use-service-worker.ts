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

interface UseServiceWorkerReturn extends ServiceWorkerState {
  update: () => Promise<void>;
  skipWaiting: () => void;
  clearCaches: () => Promise<boolean>;
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

  // ── Register service worker ──
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

        // Listen for new worker waiting
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

    // Reload on controller change (new SW took over)
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

  // ── Online / Offline tracking ──
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

  // ── Methods ──
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
    if (!navigator.serviceWorker.controller) return false;

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data?.cleared ?? false);
      };
      navigator.serviceWorker.controller!.postMessage(
        { type: 'CLEAR_CACHES' },
        [channel.port2],
      );
    });
  }, []);

  const getVersion = useCallback(async (): Promise<string | null> => {
    if (!navigator.serviceWorker.controller) return null;

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data?.version ?? null);
      };
      navigator.serviceWorker.controller!.postMessage(
        { type: 'GET_VERSION' },
        [channel.port2],
      );
    });
  }, []);

  return {
    ...state,
    update,
    skipWaiting,
    clearCaches,
    getVersion,
  };
}