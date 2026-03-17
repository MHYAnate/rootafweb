import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
         		<Image
					src="/images/rootaf.jpeg"
					alt="RootAF"
					width={40}
					height={40}
					className={cn(
						"h-9 w-9 rounded-xl object-cover",
						"ring-1 ring-black/[0.08] dark:ring-white/[0.12]",
						"transition-all duration-500 ease-out",
						"group-hover:ring-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10",
						"group-hover:scale-105"
					)}
					priority
				/>
        </div>
        <div>
          <span 	className={cn(
							"text-[1.15rem] font-extrabold tracking-tight leading-none",
							"bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
							"dark:from-white dark:via-gray-100 dark:to-gray-300",
							"bg-clip-text text-transparent",
							"transition-all duration-300",
							"group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary/70"
						)}
					>
            RootAF
          </span>
          <p  className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/50 leading-none mt-0.5">
            Artisan Farmers Foundation
          </p>
        </div>
      </Link>

      <div className="w-full max-w-md relative z-10">{children}</div>
    </div>
  );
}