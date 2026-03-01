'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const carouselImages = [
  // Nigerian/African Farmers
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?w=1600&h=900&fit=crop&q=80',
    alt: 'African farmer in lush green farmland',
    category: 'farmer',
    title: 'Sustainable Farming',
    subtitle: 'Cultivating Nigeria\'s rich agricultural heritage',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&h=900&fit=crop&q=80',
    alt: 'Fresh African vegetables and produce at market',
    category: 'farmer',
    title: 'Farm Fresh Produce',
    subtitle: 'From Nigerian farms to your table',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1623227413711-25ee4388dae3?w=1600&h=900&fit=crop&q=80',
    alt: 'Cassava and yam farming in Nigeria',
    category: 'farmer',
    title: 'Root Crop Excellence',
    subtitle: 'Yam, cassava, and more from local farmers',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1600&h=900&fit=crop&q=80',
    alt: 'Modern African agricultural practices',
    category: 'farmer',
    title: 'Modern Agriculture',
    subtitle: 'Blending tradition with innovation',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=1600&h=900&fit=crop&q=80',
    alt: 'Colorful Nigerian market vegetables',
    category: 'farmer',
    title: 'Market Day Bounty',
    subtitle: 'The vibrant colors of Nigerian agriculture',
  },
  // Nigerian/African Artisans
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1600&h=900&fit=crop&q=80',
    alt: 'African textile weaver at work',
    category: 'artisan',
    title: 'Master Weavers',
    subtitle: 'Traditional Aso-Oke and Adire craftsmanship',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1600&h=900&fit=crop&q=80',
    alt: 'Skilled carpenter crafting furniture',
    category: 'artisan',
    title: 'Woodwork Mastery',
    subtitle: 'Handcrafted furniture by skilled hands',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop&q=80',
    alt: 'Blacksmith forging iron and steel',
    category: 'artisan',
    title: 'Iron & Steel Craft',
    subtitle: 'Traditional blacksmithing meets modern design',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&h=900&fit=crop&q=80',
    alt: 'Nigerian tailor sewing traditional attire',
    category: 'artisan',
    title: 'Fashion Artistry',
    subtitle: 'Bespoke tailoring for every occasion',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=1600&h=900&fit=crop&q=80',
    alt: 'Potter creating traditional African ceramics',
    category: 'artisan',
    title: 'Ceramic Heritage',
    subtitle: 'Clay artistry passed through generations',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&h=900&fit=crop&q=80',
    alt: 'Metal fabricator and welder at work',
    category: 'artisan',
    title: 'Metal Fabrication',
    subtitle: 'Gates, railings, and custom metalwork',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1600&h=900&fit=crop&q=80',
    alt: 'Leather craftsman making traditional sandals',
    category: 'artisan',
    title: 'Leather Craft',
    subtitle: 'Quality leather goods made by hand',
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
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`absolute inset-0 ${index === current ? 'animate-ken-burns' : ''}`}>
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
        {/* Primary: Deep green (Nigerian flag inspired) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              rgba(0, 102, 51, 0.92) 0%,
              rgba(0, 77, 38, 0.85) 25%,
              rgba(5, 46, 22, 0.75) 50%,
              rgba(20, 83, 45, 0.60) 75%,
              rgba(0, 0, 0, 0.50) 100%
            )`,
          }}
        />

        {/* Secondary gradient for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 77, 38, 0.4) 0%, transparent 30%, transparent 70%, rgba(0, 51, 25, 0.6) 100%)',
          }}
        />

        {/* Golden hour warm overlay */}
        <div 
          className="absolute inset-0 mix-blend-overlay opacity-20"
          style={{
            background: 'linear-gradient(45deg, rgba(234, 179, 8, 0.3) 0%, transparent 50%, rgba(251, 191, 36, 0.2) 100%)',
          }}
        />

        {/* Vignette - African earth tones */}
        <div 
          className="absolute inset-0"
          style={{
            boxShadow: 'inset 0 0 200px rgba(0, 51, 25, 0.6), inset 0 0 100px rgba(0, 0, 0, 0.3)',
          }}
        />

        {/* Gold Accent Glow - Bottom right (Prosperity) */}
        <div 
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.20) 0%, rgba(234, 179, 8, 0.10) 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Gold Accent Glow - Top left */}
        <div 
          className="absolute -top-24 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, rgba(234, 179, 8, 0.08) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Emerald Green Glow - Center left (Growth) */}
        <div 
          className="absolute top-1/2 -left-20 -translate-y-1/2 w-[350px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.08) 50%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        {/* Sky Blue Accent - Top right (Trust/Sky) */}
        <div 
          className="absolute -top-10 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(56, 189, 248, 0.06) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Terracotta/Earth Accent - Bottom left (African soil) */}
        <div 
          className="absolute -bottom-20 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(180, 83, 9, 0.10) 0%, rgba(146, 64, 14, 0.05) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Content Overlay - Title and Subtitle */}
        <div className="absolute inset-0 flex items-center justify-start">
          <div className="container-custom">
            <div className="max-w-2xl space-y-4 animate-fade-up">
              {/* Category Tag */}
              <div 
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md border transition-all duration-700 ${
                  isFarmer
                    ? 'bg-green-500/20 text-green-100 border-green-400/30'
                    : 'bg-amber-500/20 text-amber-100 border-amber-400/30'
                }`}
              >
                <span className="text-base">{isFarmer ? '🌾' : '🔨'}</span>
                <span>{isFarmer ? 'Farmer' : 'Artisan'}</span>
              </div>

              {/* Dynamic Title */}
              <h2 
                key={`title-${current}`}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight animate-slide-up"
                style={{
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                {currentImage.title}
              </h2>

              {/* Dynamic Subtitle */}
              <p 
                key={`subtitle-${current}`}
                className="text-lg md:text-xl text-white/80 font-medium animate-slide-up-delayed"
                style={{
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
                }}
              >
                {currentImage.subtitle}
              </p>

              {/* Decorative line */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500" />
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500" />
                <div className="h-1 w-4 rounded-full bg-sky-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => { prevSlide(); setIsAutoPlaying(false); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={() => { nextSlide(); setIsAutoPlaying(false); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Progress bar background */}
          <div className="h-1 bg-white/10">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-amber-400 to-green-500 transition-all duration-300"
              style={{ width: `${((current + 1) / carouselImages.length) * 100}%` }}
            />
          </div>
          
          {/* Navigation info bar */}
          <div className="bg-gradient-to-r from-green-950/90 via-green-900/80 to-green-950/90 backdrop-blur-md border-t border-white/10">
            <div className="container-custom py-4">
              <div className="flex items-center justify-between">
                {/* Left: Counter and category */}
                <div className="flex items-center gap-4">
                  <span className="text-white/60 text-sm font-medium">
                    <span className="text-white font-bold">{String(current + 1).padStart(2, '0')}</span>
                    <span className="mx-1">/</span>
                    <span>{String(carouselImages.length).padStart(2, '0')}</span>
                  </span>
                  <div className="hidden sm:block h-4 w-px bg-white/20" />
                  <span className="hidden sm:flex items-center gap-2 text-sm text-white/70">
                    <span>{isFarmer ? '🌾' : '🔨'}</span>
                    {currentImage.alt}
                  </span>
                </div>

                {/* Center: Dot Navigation */}
                <div className="flex items-center gap-1.5">
                  {carouselImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => { setCurrent(index); setIsAutoPlaying(false); }}
                      className={`transition-all duration-300 rounded-full ${
                        index === current
                          ? image.category === 'farmer'
                            ? 'w-6 h-2 bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/40'
                            : 'w-6 h-2 bg-gradient-to-r from-amber-400 to-yellow-500 shadow-lg shadow-amber-500/40'
                          : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}: ${image.title}`}
                    />
                  ))}
                </div>

                {/* Right: ROOTAF Branding */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center gap-2 text-sm">
                    <span className="text-green-400">🌱</span>
                    <span className="text-white/70">Powered by</span>
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-amber-400">
                      ROOTAF
                    </span>
                  </div>
                  
                  {/* Auto-play indicator */}
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className={`p-1.5 rounded-full transition-all duration-300 ${
                      isAutoPlaying 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-white/10 text-white/50'
                    }`}
                    aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isAutoPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements - African Pattern Inspired */}
        <div className="absolute top-8 right-8 w-32 h-32 opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-400">
            <pattern id="african-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
              <path d="M0 0L20 20M20 0L0 20" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#african-pattern)" />
          </svg>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.08);
          }
        }
        
        .animate-ken-burns {
          animation: ken-burns 8s ease-out forwards;
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .transition-duration-1500 {
          transition-duration: 1500ms;
        }
      `}</style>
    </div>
  );
}