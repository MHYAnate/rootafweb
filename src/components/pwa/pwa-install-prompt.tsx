'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  X,
  Download,
  Share,
  Plus,
  Zap,
  Bell,
  WifiOff,
  Leaf,
  MoreVertical,
  ArrowUp,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface PWAInstallPromptProps {
  canInstall: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  device: DeviceInfo;
  onInstall: () => Promise<'accepted' | 'dismissed' | null>;
  onDismiss: () => void;
}

export function PWAInstallPrompt({
  canInstall,
  isIOS,
  isAndroid,
  device,
  onInstall,
  onDismiss,
}: PWAInstallPromptProps) {
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [exiting, setExiting] = useState(false);
  const hasShown = useRef(false);

  // Show after a short delay for better UX
  useEffect(() => {
    if (!canInstall) {
      setVisible(false);
      hasShown.current = false;
      return;
    }

    // Don't re-animate if already shown
    if (hasShown.current) {
      setVisible(true);
      return;
    }

    // First-time visitors: show after 3s, returning: show after 1.5s
    let viewCount = 1;
    try {
      viewCount = parseInt(
        localStorage.getItem('rootaf-pwa-view-count') || '1',
        10,
      );
    } catch {}

    const delay = viewCount <= 1 ? 3000 : 1500;
    const timer = setTimeout(() => {
      setVisible(true);
      hasShown.current = true;
    }, delay);

    return () => clearTimeout(timer);
  }, [canInstall]);

  const handleInstall = async () => {
    setInstalling(true);
    const result = await onInstall();
    setInstalling(false);
    if (result === 'accepted') {
      handleClose();
    }
  };

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      onDismiss();
    }, 350);
  };

  if (!visible) return null;

  // ═══════════════════════════════════════════════
  // iOS Safari Guide
  // ═══════════════════════════════════════════════
  if (isIOS) {
    return (
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-[100] p-4',
          exiting ? 'pwa-slide-out-bottom' : 'pwa-slide-in-bottom',
        )}
      >
        <div className="relative max-w-lg mx-auto rounded-3xl overflow-hidden bg-card border border-border/60 shadow-2xl">
          <div
            className="h-1"
            style={{ background: 'var(--gradient-premium)' }}
          />

          <div className="p-5">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4 pr-8">
              <div className="relative">
                <Image
                  src="/images/rootaf.jpeg"
                  alt="RootAF"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-2xl ring-1 ring-border shadow-md object-cover"
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
                  <Leaf className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-serif">
                  Install RootAF
                </h3>
                <p className="text-xs text-muted-foreground">
                  Get instant access from your home screen
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { icon: Zap, label: 'Instant Launch' },
                { icon: WifiOff, label: 'Works Offline' },
                { icon: Bell, label: 'Notifications' },
              ].map((f) => (
                <div
                  key={f.label}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-[11px] font-semibold text-primary"
                >
                  <f.icon className="h-3 w-3" />
                  {f.label}
                </div>
              ))}
            </div>

            {/* iOS Steps */}
            <div className="space-y-2.5 mb-5">
              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/50"
                style={{ background: 'hsl(var(--blue-50))' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-[hsl(var(--blue-100))]">
                  <span className="text-lg font-bold text-[hsl(var(--blue-500))]">
                    1
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Tap the Share button
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Look for{' '}
                    <Share className="inline h-3 w-3 -mt-0.5 text-[hsl(var(--blue-500))]" />{' '}
                    at the bottom of Safari
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/50"
                style={{ background: 'hsl(var(--green-50))' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-[hsl(var(--green-100))]">
                  <span className="text-lg font-bold text-primary">2</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Add to Home Screen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scroll down and tap{' '}
                    <strong>&quot;Add to Home Screen&quot;</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/50 bg-muted/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-muted/50">
                  <span className="text-lg font-bold text-muted-foreground">
                    3
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Tap &quot;Add&quot;
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Confirm to add RootAF to your home screen
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow indicator pointing down */}
            <div className="flex justify-center mb-3">
              <div className="flex items-center gap-1.5 text-muted-foreground/50 animate-bounce">
                <ArrowUp className="h-4 w-4 rotate-180" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Share button is below
                </span>
                <ArrowUp className="h-4 w-4 rotate-180" />
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-xl"
            >
              I&apos;ll do it later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // Android with specific browser instructions
  // ═══════════════════════════════════════════════
  if (isAndroid && !device.isChrome && device.isPWACapable) {
    return (
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-[100] p-4',
          exiting ? 'pwa-slide-out-bottom' : 'pwa-slide-in-bottom',
        )}
      >
        <div className="relative max-w-lg mx-auto rounded-3xl overflow-hidden bg-card border border-border/60 shadow-2xl">
          <div
            className="h-1 animate-shimmer"
            style={{
              background: 'var(--gradient-premium)',
              backgroundSize: '200% 100%',
            }}
          />

          <div className="p-5">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5 mb-4 pr-8">
              <div className="relative">
                <Image
                  src="/images/rootaf.jpeg"
                  alt="RootAF"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-2xl ring-1 ring-border shadow-md object-cover"
                />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
                  <Leaf className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground font-serif">
                  Install RootAF
                </h3>
                <p className="text-xs text-muted-foreground">
                  Using {device.browserName}
                </p>
              </div>
            </div>

            {/* Browser-specific instructions */}
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/50 bg-muted/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-primary/10">
                  <MoreVertical className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    Open browser menu
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap{' '}
                    <MoreVertical className="inline h-3 w-3 -mt-0.5" />{' '}
                    {device.isSamsung
                      ? 'at the bottom'
                      : 'at the top right'}
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/50"
                style={{ background: 'hsl(var(--green-50))' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0 bg-[hsl(var(--green-100))]">
                  <Download className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">
                    {device.isSamsung
                      ? 'Add page to → Home screen'
                      : device.isFirefox
                        ? 'Install'
                        : 'Add to Home screen'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Find it in the menu options
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-xl"
            >
              I&apos;ll do it later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // Standard prompt (Chrome/Edge/Opera on Android & Desktop)
  // ═══════════════════════════════════════════════
  return (
    <div
      className={cn(
        'fixed bottom-0 inset-x-0 z-[100] p-4',
        exiting ? 'pwa-slide-out-bottom' : 'pwa-slide-in-bottom',
      )}
    >
      <div className="relative max-w-lg mx-auto rounded-3xl overflow-hidden bg-card border border-border/60 shadow-2xl">
        {/* Shimmer bar */}
        <div
          className="h-1 animate-shimmer"
          style={{
            background: 'var(--gradient-premium)',
            backgroundSize: '200% 100%',
          }}
        />

        <div className="p-5">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5 pr-8">
            <div className="relative">
              <Image
                src="/images/rootaf.jpeg"
                alt="RootAF"
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded-2xl ring-1 ring-border shadow-lg object-cover"
              />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-card">
                <Leaf className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground font-serif leading-tight">
                Install RootAF
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Get the full app experience
              </p>
            </div>
          </div>

          {/* Device indicator */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-[10px] font-semibold text-muted-foreground">
              {device.isMobile ? (
                <Smartphone className="h-3 w-3" />
              ) : device.isTablet ? (
                <Tablet className="h-3 w-3" />
              ) : (
                <Monitor className="h-3 w-3" />
              )}
              {device.browserName}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
              <Globe className="h-3 w-3" />
              FREE
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              {
                icon: Zap,
                label: 'Instant',
                desc: 'Fast access',
                bg: 'bg-primary/10',
                color: 'text-primary',
              },
              {
                icon: Bell,
                label: 'Alerts',
                desc: 'Push notifications',
                bg: 'bg-[hsl(var(--gold)/0.1)]',
                color: 'text-[hsl(var(--gold-dark))]',
              },
              {
                icon: WifiOff,
                label: 'Offline',
                desc: 'Works offline',
                bg: 'bg-[hsl(var(--blue-100))]',
                color: 'text-[hsl(var(--blue-500))]',
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-muted/40 border border-border/30"
              >
                <div
                  className={cn(
                    'h-8 w-8 rounded-xl flex items-center justify-center',
                    feature.bg,
                  )}
                >
                  <feature.icon
                    className={cn('h-4 w-4', feature.color)}
                  />
                </div>
                <span className="text-[11px] font-bold text-foreground">
                  {feature.label}
                </span>
                <span className="text-[9px] text-muted-foreground leading-tight text-center">
                  {feature.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Install button */}
          <button
            onClick={handleInstall}
            disabled={installing}
            className={cn(
              'btn-premium w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm',
              'disabled:opacity-60 disabled:pointer-events-none',
            )}
          >
            {installing ? (
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {installing ? 'Installing...' : 'Install App — Free'}
          </button>

          {/* Dismiss */}
          <button
            onClick={handleClose}
            className="w-full mt-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Not Now
          </button>

          {/* Trust signal */}
          <p className="text-center text-[10px] text-muted-foreground/50 mt-2">
            No app store needed · Installs in seconds · Uses minimal storage
          </p>
        </div>
      </div>
    </div>
  );
}