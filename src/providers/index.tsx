'use client';

import { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { ToastProvider } from './toast-provider';
import { ThemeProvider } from './theme-provider';
import { PWAProvider } from './pwa-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <PWAProvider>
            <ToastProvider />
            {children}
          </PWAProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}