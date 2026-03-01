'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const carouselImages = [
  // Nigerian/African Farmers
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?w=1600&h=900&fit=crop&q=80',
    alt: 'African farmer in lush green farmland',
    category: 'farmer',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&h=900&fit=crop&q=80',
    alt: 'Fresh African vegetables and produce at market',
    category: 'farmer',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&h=900&fit=crop&q=80',
    alt: 'Colorful vegetables and farm produce',
    category: 'farmer',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1600&h=900&fit=crop&q=80',
    alt: 'Modern African agricultural practices',
    category: 'farmer',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=1600&h=900&fit=crop&q=80',
    alt: 'Colorful Nigerian market vegetables',
    category: 'farmer',
  },
  // Nigerian/African Artisans
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&h=900&fit=crop&q=80',
    alt: 'African textile weaver at work',
    category: 'artisan',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1600&h=900&fit=crop&q=80',
    alt: 'Skilled carpenter crafting furniture',
    category: 'artisan',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop&q=80',
    alt: 'Blacksmith forging iron and steel',
    category: 'artisan',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&h=900&fit=crop&q=80',
    alt: 'Nigerian tailor sewing traditional attire',
    category: 'artisan',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1600&h=900&fit=crop&q=80',
    alt: 'Potter creating traditional African ceramics',
    category: 'artisan',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&h=900&fit=crop&q=80',
    alt: 'Metal fabricator and welder at work',
    category: 'artisan',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1600&h=900&fit=crop&q=80',
    alt: 'Leather craftsman making traditional goods',
    category: 'artisan',
  },
];

export function PremiumHeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % carouselImages.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentImage = carouselImages[current];
  const isFarmer = currentImage.category === 'farmer';

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Images with Ken Burns effect */}
        {carouselImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="absolute inset-0"
              style={{
                animation: index === current ? 'ken-burns 8s ease-out forwards' : 'none',
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          </div>
        ))}

        {/* Nigerian-Inspired Premium Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(0, 102, 51, 0.92) 0%,
              rgba(0, 77, 38, 0.85) 25%,
              rgba(5, 46, 22, 0.75) 50%,
              rgba(20, 83, 45, 0.55) 75%,
              rgba(0, 0, 0, 0.45) 100%
            )`,
          }}
        />

        {/* Secondary gradient for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 77, 38, 0.3) 0%, transparent 40%, transparent 60%, rgba(0, 51, 25, 0.5) 100%)',
          }}
        />

        {/* Golden hour warm overlay */}
        <div 
          className="absolute inset-0 mix-blend-soft-light opacity-30"
          style={{
            background: 'linear-gradient(45deg, rgba(234, 179, 8, 0.4) 0%, transparent 60%, rgba(251, 191, 36, 0.3) 100%)',
          }}
        />

        {/* Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 200px rgba(0, 51, 25, 0.5), inset 0 0 100px rgba(0, 0, 0, 0.2)',
          }}
        />

        {/* Gold Accent Glow - Bottom right */}
        <div 
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.18) 0%, rgba(234, 179, 8, 0.08) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Gold Accent Glow - Top left */}
        <div 
          className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.12) 0%, rgba(234, 179, 8, 0.06) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Emerald Green Glow - Center left */}
        <div 
          className="absolute top-1/2 -left-20 -translate-y-1/2 w-[350px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 50%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        {/* Sky Blue Accent - Top right */}
        <div 
          className="absolute -top-10 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.10) 0%, rgba(56, 189, 248, 0.05) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Terracotta/Earth Accent - Bottom left */}
        <div 
          className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(180, 83, 9, 0.08) 0%, rgba(146, 64, 14, 0.04) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Navigation Arrows - Positioned to not overlap content */}
        <button
          onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300 group hidden lg:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300 group hidden lg:flex"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Progress bar */}
          <div className="h-0.5 bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-green-500 transition-all duration-500"
              style={{ width: `${((current + 1) / carouselImages.length) * 100}%` }}
            />
          </div>
          
          {/* Navigation info bar */}
          <div className="bg-gradient-to-r from-green-950/95 via-green-900/90 to-green-950/95 backdrop-blur-md border-t border-white/5">
            <div className="container-custom py-3">
              <div className="flex items-center justify-between">
                {/* Left: Counter */}
                <div className="flex items-center gap-3">
                  <span className="text-white/50 text-xs font-medium tracking-wide">
                    <span className="text-white/90 font-bold">{String(current + 1).padStart(2, '0')}</span>
                    <span className="mx-1 text-white/30">/</span>
                    <span>{String(carouselImages.length).padStart(2, '0')}</span>
                  </span>
                  <div className="hidden sm:block h-3 w-px bg-white/10" />
                  <span 
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors duration-500 ${
                      isFarmer
                        ? 'bg-green-500/15 text-green-300 border border-green-500/20'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                    }`}
                  >
                    <span>{isFarmer ? '🌾' : '🔨'}</span>
                    {isFarmer ? 'Farmer' : 'Artisan'}
                  </span>
                </div>

                {/* Center: Dot Navigation */}
                <div className="flex items-center gap-1">
                  {carouselImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => { setCurrent(index); setIsAutoPlaying(false); }}
                      className={`transition-all duration-300 rounded-full ${
                        index === current
                          ? image.category === 'farmer'
                            ? 'w-5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500'
                            : 'w-5 h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500'
                          : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/40'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-2">
                  <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] text-white/40">
                    <span className="text-green-400/70">🌱</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400/80 to-amber-400/80">
                      ROOTAF
                    </span>
                  </span>
                  
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`p-1.5 rounded-full transition-all duration-300 ${
                      isAutoPlaying 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-white/10 text-white/40 hover:text-white/60'
                    }`}
                    aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isAutoPlaying ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}