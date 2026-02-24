'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontSize: '14px',
          borderRadius: '10px',
          border: '1px solid hsl(120 15% 90%)',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.06)',
        },
        classNames: {
          success: 'border-l-4 !border-l-[hsl(152,45%,42%)]',
          error: 'border-l-4 !border-l-[hsl(0,72%,51%)]',
          warning: 'border-l-4 !border-l-[hsl(42,85%,55%)]',
          info: 'border-l-4 !border-l-[hsl(205,65%,55%)]',
        },
      }}
    />
  );
}