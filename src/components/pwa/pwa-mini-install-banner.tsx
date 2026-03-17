// components/pwa/pwa-mini-install-banner.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, X, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PWAMiniInstallBannerProps {
  show: boolean;
  isIOS: boolean;
  onInstall: () => Promise<'accepted' | 'dismissed' | null>;
  onExpand: () => void;
  onClose: () => void;
}

export function PWAMiniInstallBanner({
  show,
  isIOS,
  onInstall,
  onExpand,
  onClose,
}: PWAMiniInstallBannerProps) {
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (show) {
      // Slight delay so it doesn't clash with the full prompt exit animation
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [show]);

  const handleInstall = async () => {
    if (isIOS) {
      onExpand();
      return;
    }
    setInstalling(true);
    const result = await onInstall();
    setInstalling(false);
    if (result === 'accepted') {
      setVisible(false);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] pwa-slide-in-bottom-sm">
      <div className="max-w-lg mx-auto">
        <div
          className={cn(
            'flex items-center gap-3 p-3 rounded-2xl',
            'bg-card/95 backdrop-blur-xl border border-border/60',
            'shadow-xl shadow-black/5 dark:shadow-black/20',
          )}
        >
          {/* App icon */}
          <div className="relative shrink-0">
            <Image
              src="/images/rootaf.jpeg"
              alt="RootAF"
              width={40}
              height={40}
              className="h-10 w-10 rounded-xl ring-1 ring-border shadow-sm object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary flex items-center justify-center ring-[1.5px] ring-card">
              <Leaf className="h-2 w-2 text-white" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">
              Install RootAF
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              {isIOS ? 'Add to home screen for quick access' : 'Quick access · Works offline'}
            </p>
          </div>

          {/* Install button */}
          <button
            onClick={handleInstall}
            disabled={installing}
            className={cn(
              'shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl',
              'text-xs font-bold',
              'bg-primary text-primary-foreground',
              'shadow-md shadow-primary/20',
              'hover:shadow-lg hover:-translate-y-0.5',
              'transition-all duration-200 active:scale-[0.97]',
              'disabled:opacity-60 disabled:pointer-events-none',
            )}
          >
            {installing ? (
              <div className="h-3.5 w-3.5 rounded-full border-[1.5px] border-white/30 border-t-white animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            {isIOS ? 'How' : 'Install'}
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="shrink-0 h-7 w-7 rounded-lg hover:bg-muted/60 flex items-center justify-center transition-colors"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground/60" />
          </button>
        </div>
      </div>
    </div>
  );
}