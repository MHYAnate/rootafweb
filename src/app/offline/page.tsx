// app/offline/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { WifiOff, RefreshCw, Home } from 'lucide-react';

export const metadata = {
  title: 'Offline',
  description: 'You are currently offline.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'hsl(var(--gold) / 0.05)',
            animationDelay: '1s',
          }}
        />
        <div className="dot-pattern absolute inset-0 opacity-30" />
      </div>

      {/* Icon */}
      <div className="relative mb-8">
        <div
          className="h-28 w-28 rounded-3xl flex items-center justify-center shadow-xl border border-border/50"
          style={{ background: 'var(--gradient-glass)' }}
        >
          <WifiOff
            className="h-12 w-12 text-muted-foreground/50"
            strokeWidth={1.5}
          />
        </div>
        <div
          className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl flex items-center justify-center"
          style={{
            background: 'hsl(var(--gold-light))',
            border: '1px solid hsl(var(--gold) / 0.3)',
          }}
        >
          <span className="text-lg">📡</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-3 font-serif">
          You&apos;re Offline
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          It looks like you&apos;ve lost your internet connection. Don&apos;t
          worry — some content may still be available from your cache.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="btn-premium w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg bg-muted/60 text-foreground font-semibold text-sm border border-border/50 hover:bg-muted transition-all duration-200"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-12 w-full max-w-sm">
        <div className="card-premium p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/50 mb-3">
            While you wait
          </p>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
              Check your Wi-Fi or mobile data connection
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
              Try moving to a better signal area
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 shrink-0" />
              Previously viewed pages may load from cache
            </li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 flex items-center gap-2 opacity-40">
        <Image
          src="/images/rootaf.jpeg"
          alt="RootAF"
          width={20}
          height={20}
          className="rounded-md"
        />
        <span className="text-xs font-semibold">RootAF</span>
      </div>
    </div>
  );
}