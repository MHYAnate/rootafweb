// providers/pwa-provider.tsx

'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useServiceWorker } from '@/hooks/use-service-worker';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { useCacheRefresh } from '@/hooks/use-cache-refresh';
import { PWAInstallPrompt } from '@/components/pwa/pwa-install-prompt';
import { PWAMiniInstallBanner } from '@/components/pwa/pwa-mini-install-banner';
import { PWAUpdatePrompt } from '@/components/pwa/pwa-update-prompt';
import { PWAOfflineIndicator } from '@/components/pwa/pwa-offline-indicator';

interface PWAContextValue {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  isUpdateAvailable: boolean;
  install: () => Promise<'accepted' | 'dismissed' | null>;
  skipWaiting: () => void;
  clearCaches: () => Promise<boolean>;
  refreshAllData: () => Promise<void>;
  getVersion: () => Promise<string | null>;
}

const PWAContext = createContext<PWAContextValue>({
  isOnline: true,
  isInstalled: false,
  canInstall: false,
  isUpdateAvailable: false,
  install: async () => null,
  skipWaiting: () => {},
  clearCaches: async () => false,
  refreshAllData: async () => {},
  getVersion: async () => null,
});

export const usePWA = () => useContext(PWAContext);

export function PWAProvider({ children }: { children: ReactNode }) {
  const sw = useServiceWorker();
  const installPrompt = useInstallPrompt();
  const queryClient = useQueryClient();

  // ═══════════════════════════════════════════════
  // AUTO-REFRESH: clear SW caches + refetch React Query
  // on mount, focus, and reconnect
  // ═══════════════════════════════════════════════
  const { refreshAllData: triggerRefresh } = useCacheRefresh({
    refreshOnMount: true,
    refreshOnFocus: true,
    refreshOnReconnect: true,
    clearPersistedStores: false,
    preserveKeys: [
      'urafd-theme',
      'auth-storage',
      'admin-auth-storage',
    ],
    onRefreshComplete: () => {
      console.log('[PWA] All data refreshed — UI is up to date');
    },
  });

  // ── Refresh data when the app comes back from being backgrounded ──
  useEffect(() => {
    // On mobile, detect when user switches back to the app
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted && navigator.onLine) {
        console.log('[PWA] Page restored from bfcache — refreshing');
        triggerRefresh('page-restore');
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [triggerRefresh]);

  // ── Context value ──
  const contextValue: PWAContextValue = {
    isOnline: sw.isOnline,
    isInstalled: installPrompt.isInstalled,
    canInstall: installPrompt.canInstall,
    isUpdateAvailable: sw.isUpdateAvailable,
    install: installPrompt.install,
    skipWaiting: sw.skipWaiting,
    clearCaches: sw.clearCaches,
    refreshAllData: () => triggerRefresh('manual'),
    getVersion: sw.getVersion,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}

      <PWAOfflineIndicator isOnline={sw.isOnline} />
      <PWAUpdatePrompt
        isAvailable={sw.isUpdateAvailable}
        onUpdate={sw.skipWaiting}
      />
      <PWAInstallPrompt
        canInstall={installPrompt.canInstall}
        isIOS={installPrompt.isIOS}
        isAndroid={installPrompt.isAndroid}
        device={installPrompt.device}
        onInstall={installPrompt.install}
        onDismiss={installPrompt.dismissForSession}
      />
      <PWAMiniInstallBanner
        show={installPrompt.showMiniPrompt}
        isIOS={installPrompt.isIOS}
        onInstall={installPrompt.install}
        onExpand={() => {
          installPrompt.setShowMiniPrompt(false);
          try {
            sessionStorage.removeItem('rootaf-pwa-dismissed-session');
          } catch {}
          window.location.reload();
        }}
        onClose={() => installPrompt.setShowMiniPrompt(false)}
      />
    </PWAContext.Provider>
  );
}