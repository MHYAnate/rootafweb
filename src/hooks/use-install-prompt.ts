'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  isSamsung: boolean;
  isOpera: boolean;
  isSafari: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPWACapable: boolean;
  browserName: string;
}

interface UseInstallPromptReturn {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  device: DeviceInfo;
  install: () => Promise<'accepted' | 'dismissed' | null>;
  dismissForSession: () => void;
  dismissedThisSession: boolean;
  showMiniPrompt: boolean;
  setShowMiniPrompt: (show: boolean) => void;
}

// Only dismiss for current session — prompt returns on next visit
const SESSION_DISMISS_KEY = 'rootaf-pwa-dismissed-session';
// Track how many times user has seen the prompt (for delay logic)
const VIEW_COUNT_KEY = 'rootaf-pwa-view-count';

function getDeviceInfo(): DeviceInfo {
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouch = navigator.maxTouchPoints || 0;

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (platform === 'MacIntel' && maxTouch > 1);

  const isAndroid = /Android/i.test(ua);

  const isChrome =
    /Chrome/i.test(ua) && !/Edge|Edg|OPR|Opera|Samsung/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isEdge = /Edg|Edge/i.test(ua);
  const isSamsung = /SamsungBrowser/i.test(ua);
  const isOpera = /OPR|Opera/i.test(ua);
  const isSafari =
    /Safari/i.test(ua) && !/Chrome|CriOS|Edg|OPR|Samsung/i.test(ua);

  const isMobile =
    /Mobi|Android|iPhone|iPod/i.test(ua) ||
    (isIOS && maxTouch > 0 && screen.width < 768);

  const isTablet =
    (/iPad/i.test(ua) ||
      (isAndroid && !/Mobi/i.test(ua)) ||
      (platform === 'MacIntel' && maxTouch > 1)) &&
    !isMobile;

  const isDesktop = !isMobile && !isTablet;

  // PWA install support varies by browser
  const isPWACapable =
    isChrome ||
    isEdge ||
    isSamsung ||
    isOpera ||
    (isFirefox && isAndroid) ||
    (isSafari && isIOS); // iOS Safari supports Add to Home Screen

  let browserName = 'Unknown';
  if (isChrome) browserName = 'Chrome';
  else if (isSafari) browserName = 'Safari';
  else if (isFirefox) browserName = 'Firefox';
  else if (isEdge) browserName = 'Edge';
  else if (isSamsung) browserName = 'Samsung Internet';
  else if (isOpera) browserName = 'Opera';

  return {
    isIOS,
    isAndroid,
    isChrome,
    isFirefox,
    isEdge,
    isSamsung,
    isOpera,
    isSafari,
    isMobile,
    isTablet,
    isDesktop,
    isPWACapable,
    browserName,
  };
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://') ||
    window.location.search.includes('source=pwa')
  );
}

export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  const [showMiniPrompt, setShowMiniPrompt] = useState(false);
  const [device, setDevice] = useState<DeviceInfo>({
    isIOS: false,
    isAndroid: false,
    isChrome: false,
    isFirefox: false,
    isEdge: false,
    isSamsung: false,
    isOpera: false,
    isSafari: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPWACapable: false,
    browserName: 'Unknown',
  });

  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detect device
    const info = getDeviceInfo();
    setDevice(info);

    // Check if already installed
    const installed = isStandalone();
    setIsInstalled(installed);

    // Check session dismiss (using sessionStorage — resets on tab close)
    try {
      const sessionDismissed = sessionStorage.getItem(SESSION_DISMISS_KEY);
      if (sessionDismissed === 'true') {
        setDismissedThisSession(true);
        // Show the mini prompt instead after session dismiss
        setShowMiniPrompt(true);
      }
    } catch {
      // sessionStorage unavailable
    }

    // Increment view count
    try {
      const count = parseInt(
        localStorage.getItem(VIEW_COUNT_KEY) || '0',
        10,
      );
      localStorage.setItem(VIEW_COUNT_KEY, String(count + 1));
    } catch {}

    // Listen for the native install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      promptRef.current = prompt;
      setDeferredPrompt(prompt);
      console.log('[PWA] Install prompt captured');
    };

    const handleAppInstalled = () => {
      console.log('[PWA] App installed successfully');
      setIsInstalled(true);
      setDeferredPrompt(null);
      promptRef.current = null;
      setShowMiniPrompt(false);

      // Clean up storage
      try {
        sessionStorage.removeItem(SESSION_DISMISS_KEY);
        localStorage.removeItem(VIEW_COUNT_KEY);
      } catch {}
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Re-check standalone on visibility change (user might install from browser menu)
    const handleVisibility = () => {
      if (!document.hidden && isStandalone()) {
        setIsInstalled(true);
        setShowMiniPrompt(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // Also listen for display-mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true);
        setShowMiniPrompt(false);
      }
    };
    mediaQuery.addEventListener('change', handleDisplayChange);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('visibilitychange', handleVisibility);
      mediaQuery.removeEventListener('change', handleDisplayChange);
    };
  }, []);

  const install = useCallback(async (): Promise<
    'accepted' | 'dismissed' | null
  > => {
    const prompt = promptRef.current;
    if (!prompt) return null;

    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log('[PWA] Install outcome:', outcome);

      if (outcome === 'accepted') {
        promptRef.current = null;
        setDeferredPrompt(null);
        setShowMiniPrompt(false);
      }
      return outcome;
    } catch (error) {
      console.error('[PWA] Install error:', error);
      return null;
    }
  }, []);

  const dismissForSession = useCallback(() => {
    setDismissedThisSession(true);
    // Show mini/floating prompt after full prompt is dismissed
    setShowMiniPrompt(true);

    try {
      sessionStorage.setItem(SESSION_DISMISS_KEY, 'true');
    } catch {}
  }, []);

  // Determine if we should show the full install prompt
  // Show if: device is capable AND not installed AND not dismissed this session
  const canShowIOSPrompt = device.isIOS && !isInstalled && !dismissedThisSession;
  const canShowNativePrompt =
    !!deferredPrompt && !isInstalled && !dismissedThisSession;
  const canInstall = canShowNativePrompt || canShowIOSPrompt;

  return {
    canInstall,
    isInstalled,
    isIOS: device.isIOS && !isInstalled,
    isAndroid: device.isAndroid && !isInstalled,
    device,
    install,
    dismissForSession,
    dismissedThisSession,
    showMiniPrompt: showMiniPrompt && !isInstalled,
    setShowMiniPrompt,
  };
}