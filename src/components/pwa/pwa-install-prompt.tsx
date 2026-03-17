// components/pwa/pwa-install-prompt.tsx

'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PWAInstallPromptProps {
  canInstall: boolean;
  isIOS: boolean;
  onInstall: () => Promise<'accepted' | 'dismissed' | null>;
  onDismiss: () => void;
}

export function PWAInstallPrompt({
  canInstall,
  isIOS,
  onInstall,
  onDismiss,
}: PWAInstallPromptProps) {
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Delay appearance for better UX
  useEffect(() => {
    if (!canInstall && !isIOS) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => setVisible(true), 6000);
    return () => clearTimeout(timer);
  }, [canInstall, isIOS]);

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

  // ═════════════ iOS Safari Guide ═════════════
  if (isIOS) {
    return (
      <div
        className={cn(
          'fixed bottom-0 inset-x-0 z-[100] p-4',
          exiting
            ? 'pwa-slide-out-bottom'
            : 'pwa-slide-in-bottom',
        )}
      >
        <div className="relative max-w-lg mx-auto rounded-3xl overflow-hidden bg-card border border-border/60 shadow-2xl">
          {/* Top accent */}
          <div
            className="h-1"
            style={{ background: 'var(--gradient-premium)' }}
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
              <Image
                src="/images/rootaf.jpeg"
                alt="RootAF"
                width={48}
                height={48}
                className="h-12 w-12 rounded-2xl ring-1 ring-border shadow-md object-cover"
              />
              <div>
                <h3 className="text-base font-bold text-foreground font-serif">
                  Install RootAF
                </h3>
                <p className="text-xs text-muted-foreground">
                  Add to your home screen
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-5">
              <div
                className="flex items-center gap-3 p-3 rounded-2xl border border-border/50"
                style={{ background: 'hsl(var(--blue-50))' }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                  style={{ background: 'hsl(var(--blue-100))' }}
                >
                  <Share
                    className="h-4 w-4"
                    style={{ color: 'hsl(var(--blue-500))' }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Step 1
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap the{' '}
                    <strong className="text-foreground">Share</strong> button
                    in Safari
                  </p>
                </div>
              </div>

              <div
                className="flex items-center gap-3 p-3 rounded-2xl border border-border/50"
                style={{ background: 'hsl(var(--green-50))' }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                  style={{ background: 'hsl(var(--green-100))' }}
                >
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Step 2
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scroll down and tap{' '}
                    <strong className="text-foreground">
                      &quot;Add to Home Screen&quot;
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-xl"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════ Standard (Android / Desktop) ═════════════
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
                  <feature.icon className={cn('h-4 w-4', feature.color)} />
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
            {installing ? 'Installing...' : 'Install App'}
          </button>

          {/* Dismiss */}
          <button
            onClick={handleClose}
            className="w-full mt-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}