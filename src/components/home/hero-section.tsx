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
  Star,
} from 'lucide-react';
import { PremiumHeroCarousel } from './premium-hero-carousel';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col overflow-hidden">
      {/* Premium Carousel Background */}
      <PremiumHeroCarousel />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 dot-pattern opacity-[0.015] pointer-events-none" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 right-[15%] animate-float opacity-15 pointer-events-none hidden lg:block">
        <Leaf className="h-24 w-24 text-green-300/50" />
      </div>
      <div
        className="absolute bottom-1/3 right-1/3 animate-float opacity-10 pointer-events-none hidden lg:block"
        style={{ animationDelay: '2s' }}
      >
        <Sparkles className="h-20 w-20 text-amber-300/50" />
      </div>

      {/* Main Content */}
      <div className="container-custom relative z-10 flex-1 flex items-center py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-sm text-green-50 font-medium">
              Empowering Nigerian Farmers & Artisans
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-white animate-fade-up stagger-1">
            Connecting{' '}
            <span className="relative inline-block">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #4ade80, #22c55e)',
                }}
              >
                Farmers
              </span>
            </span>
            {' '}&{' '}
            <span className="relative inline-block">
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                }}
              >
                Artisans
              </span>
            </span>{' '}
            <span className="block mt-2 text-white/90">Across Nigeria</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl mt-6 text-green-100/80 max-w-2xl leading-relaxed animate-fade-up stagger-2">
            Join Nigeria's premier platform connecting skilled farmers and artisans 
            with customers seeking quality products, services, and tools. 
            <span className="text-amber-300/90 font-medium"> Rooted to Rise</span> — 
            from the root, we rise; no matter the soil, we grow. 🌱
          </p>

          {/* Trust Indicators */}
          {/* <div className="flex items-center gap-4 mt-6 animate-fade-up stagger-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-white/60">Trusted by 500+ members</span>
          </div> */}

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-10 animate-fade-up stagger-3">
            <Link href="/register/member">
              <Button
                size="lg"
                className="h-14 px-8 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-green-900/30 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-green-900/40 border border-green-400/20"
              >
                <span className="mr-2">🌱</span>
                Join as Member
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/members">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-xl text-white border-white/20 hover:bg-white/10 backdrop-blur-sm font-medium hover:border-white/30 transition-all"
              >
                Browse Members
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          {/* <div className="grid grid-cols-3 gap-4 mt-14 max-w-lg animate-fade-up stagger-4">
            {[
              {
                icon: Users,
                label: 'Verified Members',
                value: '500+',
                color: 'text-green-400',
                bg: 'bg-green-500/10',
                border: 'border-green-500/20',
              },
              {
                icon: ShoppingBag,
                label: 'Products',
                value: '1,200+',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
              },
              {
                icon: Wrench,
                label: 'Services',
                value: '300+',
                color: 'text-sky-400',
                bg: 'bg-sky-500/10',
                border: 'border-sky-500/20',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`text-center p-4 rounded-2xl ${stat.bg} backdrop-blur-sm border ${stat.border} transition-all hover:scale-105`}
              >
                <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] text-white/60 mt-0.5 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Bottom Curve/Wave */}
      <div className="relative z-20 -mb-px">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 80V40C120 53 240 60 360 55C480 50 600 35 720 30C840 25 960 30 1080 38C1200 46 1320 55 1380 60L1440 65V80H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}