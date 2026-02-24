import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-blue-50" />
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Decorative Circles */}
      <div className="absolute top-20 -left-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 -right-32 h-64 w-64 rounded-full bg-amber-400/5 blur-3xl" />

      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2.5 mb-10 relative z-10 group"
      >
        <div
          className="h-12 w-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ background: 'var(--gradient-premium)' }}
        >
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-2xl font-bold text-gradient-premium">
            RootAF
          </span>
          <p className="text-[10px] text-muted-foreground -mt-1">
            Artisan Farmers Foundation
          </p>
        </div>
      </Link>

      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}