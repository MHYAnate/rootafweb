'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useServiceWorker } from '@/hooks/use-service-worker';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
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
  getVersion: async () => null,
});

export const usePWA = () => useContext(PWAContext);

export function PWAProvider({ children }: { children: ReactNode }) {
  const sw = useServiceWorker();
  const installPrompt = useInstallPrompt();

  const contextValue: PWAContextValue = {
    isOnline: sw.isOnline,
    isInstalled: installPrompt.isInstalled,
    canInstall: installPrompt.canInstall,
    isUpdateAvailable: sw.isUpdateAvailable,
    install: installPrompt.install,
    skipWaiting: sw.skipWaiting,
    clearCaches: sw.clearCaches,
    getVersion: sw.getVersion,
  };

  return (
    <PWAContext.Provider value={contextValue}>
      {children}

      {/* Connectivity indicator */}
      <PWAOfflineIndicator isOnline={sw.isOnline} />

      {/* Update banner */}
      <PWAUpdatePrompt
        isAvailable={sw.isUpdateAvailable}
        onUpdate={sw.skipWaiting}
      />

      {/* Full install prompt — shows when not dismissed */}
      <PWAInstallPrompt
        canInstall={installPrompt.canInstall}
        isIOS={installPrompt.isIOS}
        isAndroid={installPrompt.isAndroid}
        device={installPrompt.device}
        onInstall={installPrompt.install}
        onDismiss={installPrompt.dismissForSession}
      />

      {/* Mini floating banner — shows after user dismisses the full prompt */}
      <PWAMiniInstallBanner
        show={installPrompt.showMiniPrompt}
        isIOS={installPrompt.isIOS}
        onInstall={installPrompt.install}
        onExpand={() => {
          // Re-show the full prompt
          installPrompt.setShowMiniPrompt(false);
          // Remove session dismiss so full prompt shows again
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