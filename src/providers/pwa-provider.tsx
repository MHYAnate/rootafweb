// providers/pwa-provider.tsx

'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useServiceWorker } from '@/hooks/use-service-worker';
import { useInstallPrompt } from '@/hooks/use-install-prompt';
import { PWAInstallPrompt } from '@/components/pwa/pwa-install-prompt';
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

      {/* PWA overlay UIs — rendered outside children flow */}
      <PWAOfflineIndicator isOnline={sw.isOnline} />
      <PWAUpdatePrompt
        isAvailable={sw.isUpdateAvailable}
        onUpdate={sw.skipWaiting}
      />
      <PWAInstallPrompt
        canInstall={installPrompt.canInstall}
        isIOS={installPrompt.isIOS}
        onInstall={installPrompt.install}
        onDismiss={installPrompt.dismiss}
      />
    </PWAContext.Provider>
  );
}