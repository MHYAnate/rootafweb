'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Users,
  ShoppingBag,
  Wrench,
  Sparkles,
  Leaf,
  ChevronRight,
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 dot-pattern opacity-[0.04]" />

      {/* Gold Accent Shapes */}
      <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-[100px]" />
      <div className="absolute bottom-10 left-20 h-48 w-48 rounded-full bg-blue-400/10 blur-[80px]" />

      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 animate-float opacity-20">
        <Leaf className="h-20 w-20 text-green-300" />
      </div>
      <div
        className="absolute bottom-1/3 right-1/3 animate-float opacity-15"
        style={{ animationDelay: '2s' }}
      >
        <Sparkles className="h-16 w-16 text-amber-300" />
      </div>

      <div className="container-custom relative py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span className="text-sm text-green-100 font-medium">
              Empowering Nigerian Artisan Farmers
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-white animate-fade-up stagger-1">
            Empowering{' '}
            <span
              className="relative inline-block"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #fbbf24, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Artisan Farmers
            </span>{' '}
            Across Nigeria
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mt-6 text-green-100/80 max-w-2xl leading-relaxed animate-fade-up stagger-2">
            Connecting skilled farmers and artisans with customers seeking
            quality products, services, and tools. Join our growing community
            and unlock new opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-10 animate-fade-up stagger-3">
            <Link href="/register/member">
              <Button
                size="lg"
                className="h-13 px-8 rounded-xl bg-white text-green-800 hover:bg-green-50 font-semibold shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5"
              >
                Join as Member
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/members">
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 rounded-xl text-white border-white/30 hover:bg-white/10 backdrop-blur-sm font-medium"
              >
                Browse Members
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-md animate-fade-up stagger-4">
            {[
              {
                icon: Users,
                label: 'Verified Members',
                value: '500+',
              },
              {
                icon: ShoppingBag,
                label: 'Products',
                value: '1,200+',
              },
              {
                icon: Wrench,
                label: 'Services',
                value: '300+',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <stat.icon className="h-5 w-5 mx-auto mb-2 text-amber-300" />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-[11px] text-green-200/70 mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 60V30C240 0 480 0 720 15C960 30 1200 30 1440 15V60H0Z"
            fill="hsl(120 20% 99%)"
          />
        </svg>
      </div>
    </section>
  );
}