// components/pwa/pwa-update-prompt.tsx

'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PWAUpdatePromptProps {
  isAvailable: boolean;
  onUpdate: () => void;
}

export function PWAUpdatePrompt({
  isAvailable,
  onUpdate,
}: PWAUpdatePromptProps) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (isAvailable) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [isAvailable]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
    }, 300);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-2rem)] max-w-md',
        exiting ? 'pwa-slide-out-top' : 'pwa-slide-in-top',
      )}
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/60 shadow-2xl">
        {/* Premium gradient bar */}
        <div
          className="h-0.5"
          style={{ background: 'var(--gradient-premium)' }}
        />

        <div className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">
              Update Available
            </p>
            <p className="text-xs text-muted-foreground">
              A new version of RootAF is ready
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onUpdate}
              className="btn-premium flex items-center gap-1.5 px-4 py-2 !rounded-xl text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              Update
            </button>
            <button
              onClick={handleDismiss}
              className="h-8 w-8 rounded-lg hover:bg-muted/60 flex items-center justify-center transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}