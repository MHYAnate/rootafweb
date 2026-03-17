// components/pwa/pwa-offline-indicator.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PWAOfflineIndicatorProps {
  isOnline: boolean;
}

export function PWAOfflineIndicator({
  isOnline,
}: PWAOfflineIndicatorProps) {
  const [show, setShow] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!isOnline) {
      setShow(true);
      setWasOffline(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else if (wasOffline) {
      // Show reconnected state for 3 seconds
      setShow(true);
      timeoutRef.current = setTimeout(() => {
        setShow(false);
        setWasOffline(false);
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOnline, wasOffline]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pwa-slide-in-bottom-sm">
      <div
        className={cn(
          'flex items-center gap-2.5 px-4 py-2.5 rounded-2xl',
          'shadow-xl border backdrop-blur-xl',
          'transition-colors duration-500',
          isOnline
            ? 'border-primary/20'
            : 'border-destructive/20',
        )}
        style={{
          background: isOnline
            ? 'hsl(var(--green-50) / 0.9)'
            : 'hsl(var(--error) / 0.05)',
        }}
      >
        {/* Icon */}
        <div
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-lg',
            isOnline ? 'bg-primary/10' : 'bg-destructive/10',
          )}
        >
          {isOnline ? (
            <Wifi className="h-3.5 w-3.5 text-primary" />
          ) : (
            <WifiOff className="h-3.5 w-3.5 text-destructive animate-pulse" />
          )}
        </div>

        {/* Text */}
        <div>
          <p
            className={cn(
              'text-xs font-bold',
              isOnline ? 'text-primary' : 'text-destructive',
            )}
          >
            {isOnline ? 'Back Online' : "You're Offline"}
          </p>
          <p
            className={cn(
              'text-[10px]',
              isOnline ? 'text-primary/60' : 'text-destructive/60',
            )}
          >
            {isOnline
              ? 'Connection restored'
              : 'Some features may be limited'}
          </p>
        </div>

        {/* Dismiss (only when offline) */}
        {!isOnline && (
          <button
            onClick={() => setShow(false)}
            className="ml-1 h-6 w-6 rounded-md hover:bg-destructive/10 flex items-center justify-center transition-colors"
          >
            <X className="h-3 w-3 text-destructive/50" />
          </button>
        )}
      </div>
    </div>
  );
}