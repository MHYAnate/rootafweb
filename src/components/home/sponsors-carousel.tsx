// components/home/sponsors-carousel.tsx
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { sponsorsApi } from '@/lib/api/sponsors.api';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Heart,
  Handshake,
  Globe,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  Award,
  ExternalLink,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface Sponsor {
  id: string;
  organizationName: string;
  logoUrl: string | null;
  logoThumbnailUrl: string | null;
  type: 'PARTNER' | 'SPONSOR';
  category: string;
  description: string | null;
  shortDescription: string | null;
  website: string | null;
  sponsorshipLevel: string | null;
  areasOfSupport: string[];
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  partnershipSince: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CATEGORY_LABELS: Record<string, string> = {
  GOVERNMENT_AGENCY: 'Government',
  NON_GOVERNMENTAL_ORGANIZATION: 'NGO',
  CORPORATE_PRIVATE_SECTOR: 'Corporate',
  INTERNATIONAL_ORGANIZATION: 'International',
  ACADEMIC_INSTITUTION: 'Academic',
  COMMUNITY_BASED_ORGANIZATION: 'Community',
  FINANCIAL_INSTITUTION: 'Finance',
  MEDIA_ORGANIZATION: 'Media',
  RELIGIOUS_ORGANIZATION: 'Religious',
  INDIVIDUAL: 'Individual',
};

const LEVEL_CONFIG: Record<
  string,
  { gradient: string; glow: string; icon: string }
> = {
  Platinum: {
    gradient: 'from-slate-300 via-zinc-100 to-slate-300',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.3)]',
    icon: '💎',
  },
  Gold: {
    gradient: 'from-amber-400 via-yellow-300 to-amber-400',
    glow: 'shadow-[0_0_20px_rgba(251,191,36,0.3)]',
    icon: '🏆',
  },
  Silver: {
    gradient: 'from-gray-300 via-gray-100 to-gray-300',
    glow: 'shadow-[0_0_20px_rgba(156,163,175,0.3)]',
    icon: '🥈',
  },
  Bronze: {
    gradient: 'from-orange-400 via-amber-300 to-orange-400',
    glow: 'shadow-[0_0_20px_rgba(251,146,60,0.2)]',
    icon: '🥉',
  },
};

const TYPE_CONFIG = {
  PARTNER: {
    label: 'Partner',
    icon: Handshake,
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
  },
  SPONSOR: {
    label: 'Sponsor',
    icon: Heart,
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPONSOR LOGO COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SponsorLogo({
  sponsor,
  size = 'md',
}: {
  sponsor: Sponsor;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'h-10 w-10 rounded-lg text-sm',
    md: 'h-14 w-14 rounded-xl text-lg',
    lg: 'h-20 w-20 rounded-2xl text-2xl',
  };

  const typeConfig = TYPE_CONFIG[sponsor.type];

  if (sponsor.logoThumbnailUrl || sponsor.logoUrl) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          'overflow-hidden shrink-0 border border-border/30',
          'bg-white dark:bg-white/5',
        )}
      >
        <img
          src={sponsor.logoThumbnailUrl || sponsor.logoUrl || ''}
          alt={sponsor.organizationName}
          className="w-full h-full object-contain p-1.5"
        />
      </div>
    );
  }

  // Generate deterministic color from name
  const colors = [
    'from-emerald-500/80 to-teal-600/80',
    'from-blue-500/80 to-indigo-600/80',
    'from-violet-500/80 to-purple-600/80',
    'from-amber-500/80 to-orange-600/80',
    'from-rose-500/80 to-pink-600/80',
    'from-cyan-500/80 to-blue-600/80',
  ];
  const colorIndex =
    sponsor.organizationName.charCodeAt(0) % colors.length;

  return (
    <div
      className={cn(
        sizeClasses[size],
        'shrink-0 flex items-center justify-center',
        'bg-gradient-to-br',
        colors[colorIndex],
        'text-white font-bold shadow-inner',
      )}
    >
      {sponsor.organizationName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// INFINITE MARQUEE ROW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MarqueeRow({
  sponsors,
  direction = 'left',
  speed = 30,
  pauseOnHover = true,
}: {
  sponsors: Sponsor[];
  direction?: 'left' | 'right';
  speed?: number;
  pauseOnHover?: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate array for seamless loop
  const items = [...sponsors, ...sponsors, ...sponsors];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

      <div
        className={cn(
          'flex gap-5 w-max',
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right',
          isPaused && '[animation-play-state:paused]',
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((sponsor, i) => (
          <MarqueeCard key={`${sponsor.id}-${i}`} sponsor={sponsor} />
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MARQUEE CARD (Compact)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MarqueeCard({ sponsor }: { sponsor: Sponsor }) {
  const typeConfig = TYPE_CONFIG[sponsor.type];
  const levelConfig = sponsor.sponsorshipLevel
    ? LEVEL_CONFIG[sponsor.sponsorshipLevel]
    : null;

  return (
    <div className="group relative shrink-0">
      {/* Hover glow */}
      <div
        className={cn(
          'absolute -inset-px rounded-2xl opacity-0 blur-sm transition-all duration-500',
          'group-hover:opacity-40',
          `bg-gradient-to-r ${typeConfig.gradient}`,
        )}
      />

      <div
        className={cn(
          'relative flex items-center gap-4 px-5 py-4 rounded-2xl',
          'border border-border/40 bg-card/50 backdrop-blur-xl',
          'transition-all duration-500 cursor-default',
          'hover:border-border/70 hover:bg-card/80',
          'hover:shadow-xl hover:-translate-y-0.5',
          'min-w-[280px] max-w-[340px]',
        )}
      >
        <SponsorLogo sponsor={sponsor} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm truncate leading-tight">
              {sponsor.organizationName}
            </h4>
            {sponsor.isFeatured && (
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <Badge
              variant="secondary"
              className={cn(
                'text-[9px] px-1.5 py-0 h-4 rounded-md font-semibold',
                typeConfig.bg,
                typeConfig.text,
                'border-0',
              )}
            >
              {typeConfig.label}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {CATEGORY_LABELS[sponsor.category] || sponsor.category}
            </span>
            {levelConfig && (
              <span className="text-[10px]">{levelConfig.icon}</span>
            )}
          </div>

          {sponsor.areasOfSupport?.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 overflow-hidden">
              {sponsor.areasOfSupport.slice(0, 2).map((area) => (
                <span
                  key={area}
                  className={cn(
                    'text-[9px] px-1.5 py-0.5 rounded-full',
                    'bg-muted/40 text-muted-foreground',
                    'truncate max-w-[80px]',
                  )}
                >
                  {area}
                </span>
              ))}
              {sponsor.areasOfSupport.length > 2 && (
                <span className="text-[9px] text-muted-foreground/60">
                  +{sponsor.areasOfSupport.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {sponsor.website && (
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'shrink-0 h-8 w-8 rounded-lg flex items-center justify-center',
              'text-muted-foreground/30 hover:text-primary',
              'hover:bg-primary/5 transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FEATURED SPONSOR CARD (Larger, for spotlight)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FeaturedSponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const typeConfig = TYPE_CONFIG[sponsor.type];
  const levelConfig = sponsor.sponsorshipLevel
    ? LEVEL_CONFIG[sponsor.sponsorshipLevel]
    : null;

  const partnerYear = new Date(sponsor.partnershipSince).getFullYear();

  return (
    <div className="group relative">
      {/* Outer glow */}
      <div
        className={cn(
          'absolute -inset-1 rounded-3xl opacity-0 blur-lg transition-all duration-700',
          'group-hover:opacity-30',
          `bg-gradient-to-r ${typeConfig.gradient}`,
        )}
      />

      <div
        className={cn(
          'relative overflow-hidden rounded-3xl',
          'border border-border/30 bg-card/40 backdrop-blur-xl',
          'transition-all duration-700',
          'hover:border-border/60 hover:bg-card/70',
          'hover:shadow-2xl hover:-translate-y-1',
          'p-6 md:p-8',
        )}
      >
        {/* Top shine line */}
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-px',
            'bg-gradient-to-r from-transparent',
            typeConfig.gradient.replace('from-', 'via-').replace('to-', 'to-transparent'),
          )}
        />

        {/* Featured star badge */}
        {sponsor.isFeatured && (
          <div className="absolute top-4 right-4">
            <div
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
                'border border-amber-500/20',
                'text-amber-600 dark:text-amber-400',
              )}
            >
              <Star className="h-3 w-3 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Featured
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Logo */}
          <div className="relative">
            <div
              className={cn(
                'absolute -inset-2 rounded-2xl opacity-20 blur-md',
                `bg-gradient-to-br ${typeConfig.gradient}`,
              )}
            />
            <SponsorLogo sponsor={sponsor} size="lg" />
            {levelConfig && (
              <div className="absolute -bottom-2 -right-2 text-lg">
                {levelConfig.icon}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 flex-wrap">
              <h3 className="text-lg md:text-xl font-bold leading-tight">
                {sponsor.organizationName}
              </h3>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge
                className={cn(
                  'rounded-lg text-[10px] px-2.5 py-0.5 font-bold',
                  typeConfig.bg,
                  typeConfig.text,
                  'border',
                  typeConfig.border,
                )}
              >
                <typeConfig.icon className="h-3 w-3 mr-1" />
                {typeConfig.label}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-lg text-[10px] px-2 py-0.5 border-border/40"
              >
                {CATEGORY_LABELS[sponsor.category] || sponsor.category}
              </Badge>
              {sponsor.sponsorshipLevel && (
                <Badge
                  variant="outline"
                  className={cn(
                    'rounded-lg text-[10px] px-2 py-0.5 font-semibold',
                    'border-amber-500/30 text-amber-600 dark:text-amber-400',
                    'bg-amber-500/5',
                  )}
                >
                  {sponsor.sponsorshipLevel}
                </Badge>
              )}
              <span className="text-[10px] text-muted-foreground/50">
                Since {partnerYear}
              </span>
            </div>

            {(sponsor.description || sponsor.shortDescription) && (
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed line-clamp-2">
                {sponsor.shortDescription || sponsor.description}
              </p>
            )}

            {sponsor.areasOfSupport?.length > 0 && (
              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                {sponsor.areasOfSupport.map((area) => (
                  <span
                    key={area}
                    className={cn(
                      'text-[10px] px-2.5 py-1 rounded-full font-medium',
                      'bg-muted/30 text-muted-foreground/80',
                      'border border-border/20',
                    )}
                  >
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action */}
          {sponsor.website && (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl',
                'text-xs font-semibold',
                'border border-border/40',
                'text-muted-foreground hover:text-foreground',
                'hover:bg-muted/30 hover:border-border',
                'transition-all duration-200',
                'group-hover:opacity-100',
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              Visit
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOGO-ONLY TICKER (Simple brand logo strip)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function LogoTicker({
  sponsors,
  speed = 25,
}: {
  sponsors: Sponsor[];
  speed?: number;
}) {
  const [isPaused, setIsPaused] = useState(false);
  const items = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

  return (
    <div
      className="relative overflow-hidden py-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className={cn(
          'flex items-center gap-10 md:gap-16 w-max animate-marquee-left',
          isPaused && '[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((sponsor, i) => (
          <div
            key={`${sponsor.id}-logo-${i}`}
            className={cn(
              'flex items-center gap-3 shrink-0',
              'opacity-40 hover:opacity-80 transition-opacity duration-300',
              'cursor-default',
            )}
            title={sponsor.organizationName}
          >
            {sponsor.logoUrl || sponsor.logoThumbnailUrl ? (
              <img
                src={sponsor.logoThumbnailUrl || sponsor.logoUrl || ''}
                alt={sponsor.organizationName}
                className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center',
                    'bg-muted/30 text-muted-foreground/40',
                    'text-xs font-bold',
                  )}
                >
                  {sponsor.organizationName
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')}
                </div>
                <span className="text-sm font-medium text-muted-foreground/40 hidden md:block max-w-[140px] truncate">
                  {sponsor.organizationName}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SKELETON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CarouselSkeleton() {
  return (
    <div className="space-y-8">
      {/* Featured skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/20 bg-card/20 p-8 animate-pulse"
          >
            <div className="flex gap-6">
              <div className="h-20 w-20 rounded-2xl bg-muted/20 shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded-lg bg-muted/20" />
                <div className="h-3 w-1/3 rounded-lg bg-muted/15" />
                <div className="h-3 w-3/4 rounded-lg bg-muted/15" />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Marquee skeleton */}
      <div className="flex gap-5 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="shrink-0 w-[300px] h-[80px] rounded-2xl bg-muted/10 animate-pulse border border-border/10"
          />
        ))}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN EXPORT: SPONSORS CAROUSEL SECTION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function SponsorsCarousel({ className }: { className?: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['sponsors-public'],
    queryFn: () => sponsorsApi.getAll(),
    staleTime: 1000 * 60 * 10,
  });

  const allSponsors: Sponsor[] = (data?.data || []).filter(
    (s: Sponsor) => s.isActive,
  );

  const featured = allSponsors.filter((s) => s.isFeatured);
  const sponsors = allSponsors.filter((s) => s.type === 'SPONSOR');
  const partners = allSponsors.filter((s) => s.type === 'PARTNER');

  if (isLoading) {
    return (
      <section className={cn('relative py-16 md:py-24 overflow-hidden', className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CarouselSkeleton />
        </div>
      </section>
    );
  }

  if (allSponsors.length === 0) return null;

  return (
    <section className={cn('relative py-16 md:py-24 overflow-hidden', className)}>
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div
          className={cn(
            'absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 -translate-x-1/2 rounded-full',
            'bg-gradient-to-r from-amber-500/[0.03] to-orange-500/[0.02]',
            'blur-3xl',
          )}
        />
        <div
          className={cn(
            'absolute top-1/3 right-0 w-[400px] h-[400px] translate-x-1/2 rounded-full',
            'bg-gradient-to-l from-blue-500/[0.03] to-indigo-500/[0.02]',
            'blur-3xl',
          )}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ────────────────────────────────────────────── */}
        <div className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                'bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.04] to-amber-500/[0.08]',
                'border border-amber-500/[0.15] backdrop-blur-sm',
              )}
            >
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Trusted Partners
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              Our Sponsors &{' '}
            </span>
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Partners
            </span>
          </h2>

          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            We are proud to work alongside these organizations dedicated to
            empowering farmers and artisans across Nigeria.
          </p>

          {/* Stats strip */}
          <div className="flex items-center justify-center gap-6 md:gap-10 mt-8">
            {[
              { label: 'Partners', count: partners.length, icon: Handshake },
              { label: 'Sponsors', count: sponsors.length, icon: Heart },
              {
                label: 'Years Together',
                // count: new Date().getFullYear() - (featured[0]?.partnershipSince ? new Date(featured[0].partnershipSince).getFullYear() : 0),
                icon: Building2,
              },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={cn(
                    'h-8 w-8 rounded-lg flex items-center justify-center',
                    'bg-muted/30 border border-border/30',
                  )}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-left">
                  {/* <p className="text-lg font-bold leading-none">{count}</p> */}
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Featured Spotlight ─────────────────────────────────────────── */}
        {featured.length > 0 && (
          <div className="mb-12">
            <div
              className={cn(
                'grid gap-5',
                featured.length === 1
                  ? 'grid-cols-1 max-w-2xl mx-auto'
                  : 'grid-cols-1 md:grid-cols-2',
              )}
            >
              {featured.map((sponsor) => (
                <FeaturedSponsorCard key={sponsor.id} sponsor={sponsor} />
              ))}
            </div>
          </div>
        )}

        {/* ── Marquee Carousel ──────────────────────────────────────────── */}
        {allSponsors.length > 2 && (
          <div className="space-y-4">
            <MarqueeRow
              sponsors={
                sponsors.length >= partners.length
                  ? sponsors.length > 0
                    ? sponsors
                    : allSponsors
                  : partners.length > 0
                    ? partners
                    : allSponsors
              }
              direction="left"
              speed={sponsors.length > 4 ? 40 : 25}
            />
            {sponsors.length > 0 && partners.length > 0 && (
              <MarqueeRow
                sponsors={
                  sponsors.length >= partners.length ? partners : sponsors
                }
                direction="right"
                speed={partners.length > 4 ? 35 : 22}
              />
            )}
          </div>
        )}

        {/* ── If only a few items, no marquee – simple grid ─────────────── */}
        {allSponsors.length <= 2 && featured.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {allSponsors.map((sponsor) => (
              <FeaturedSponsorCard key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        )}

        {/* ── Logo Strip (Minimal / Trusted-by style) ────────────────────── */}
        {allSponsors.length > 3 && (
          <div className="mt-12 pt-10 border-t border-border/20">
            <p className="text-center text-xs text-muted-foreground/40 uppercase tracking-[0.2em] font-semibold mb-6">
              Trusted by leading organizations
            </p>
            <LogoTicker sponsors={allSponsors} speed={allSponsors.length > 6 ? 35 : 20} />
          </div>
        )}

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <div className="flex justify-center mt-12">
          <Link href="/about#partners">
            <Button
              variant="outline"
              className={cn(
                'rounded-full px-8 h-12 gap-2.5 text-sm font-semibold',
                'border-border/40 bg-card/30 backdrop-blur-sm',
                'hover:bg-card/60 hover:border-border/70',
                'hover:shadow-lg hover:-translate-y-0.5',
                'transition-all duration-300',
              )}
            >
              <Handshake className="h-4 w-4" />
              View All Partners
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── CSS Keyframes ─────────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @keyframes marquee-right {
          0% {
            transform: translateX(-33.333%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
      `}</style>
    </section>
  );
}

export default SponsorsCarousel;