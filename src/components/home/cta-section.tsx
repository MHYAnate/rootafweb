import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Leaf } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'var(--gradient-hero)' }}
      />
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      {/* Decorative */}
      <div className="absolute top-10 right-20 animate-float opacity-20">
        <Leaf className="h-24 w-24 text-green-300" />
      </div>
      <div
        className="absolute bottom-10 left-10 animate-float opacity-15"
        style={{ animationDelay: '3s' }}
      >
        <Sparkles className="h-20 w-20 text-amber-300" />
      </div>

      <div className="container-custom relative text-center">
        {/* Gold Accent */}
        <div className="gold-divider max-w-xs mx-auto mb-10 opacity-40" />

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Ready to Join{' '}
          <span
            style={{
              backgroundImage:
                'linear-gradient(135deg, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Our Community
          </span>
          ?
        </h2>
        <p className="text-lg mt-5 text-green-100/70 max-w-2xl mx-auto">
          Whether you're a farmer, artisan, or looking for quality products
          and services, we have a place for you.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link href="/register/member">
            <Button
              size="lg"
              className="h-13 px-8 rounded-xl bg-white text-green-800 hover:bg-green-50 font-semibold shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5"
            >
              Register as Member
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/register/client">
            <Button
              size="lg"
              variant="outline"
                   className="bg-gradient-to-r from-amber-500 to-emerald-600 h-14 px-8 rounded-xl text-white border-white/20 hover:bg-white/10 backdrop-blur-sm font-medium hover:border-white/30 transition-all"
            >
              Register as Client
            </Button>
          </Link>
        </div>

        <div className="gold-divider max-w-xs mx-auto mt-10 opacity-40" />
      </div>
    </section>
  );
}