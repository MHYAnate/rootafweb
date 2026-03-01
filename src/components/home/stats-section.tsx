// components/sections/stats-section.tsx

'use client';

import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Wrench,
  MapPin,
  Star,
  ArrowUpRight,
  Activity,
  Handshake,
  Shield,
  Tractor,
  Hammer,
  ShoppingBag,
  Eye,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { usePlatformStats } from '@/hooks/use-stats';
import { useCountUp } from '@/hooks/use-count-up';
import { cn } from '@/lib/utils';
import type { PlatformStats } from '@/lib/api/stats.api';

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface StatCardData {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  subtitle?: string;
  iconBg: string;
  ringColor: string;
  glowColor: string;
  decimals?: number;
}

interface BreakdownItem {
  label: string;
  value: number;
  color: string;
  icon: React.ElementType;
}

// ═══════════════════════════════════════════════════════════
// FALLBACK (when API unavailable)
// ═══════════════════════════════════════════════════════════

const FALLBACK: PlatformStats = {
  members: {
    total: 500, farmers: 280, artisans: 170, both: 50,
    newThisMonth: 45, growthPercentage: 12, verified: 480,
  },
  clients: {
    total: 350, verified: 320, newThisMonth: 30, growthPercentage: 8,
  },
  products: {
    total: 1200, active: 1050, agricultural: 720, artisan: 480,
    newThisMonth: 85, growthPercentage: 15,
  },
  services: {
    total: 300, active: 270, farming: 120, artisan: 180,
    newThisMonth: 22, growthPercentage: 10,
  },
  tools: {
    total: 150, active: 130, forSale: 80, forLease: 70,
    newThisMonth: 12, growthPercentage: 18,
  },
  transactions: {
    totalCount: 2800, totalAmount: 45000000,
    thisMonthCount: 210, thisMonthAmount: 3500000, growthPercentage: 22,
  },
  ratings: { totalCount: 850, averageRating: 4.6, thisMonthCount: 65 },
  coverage: {
    statesCount: 37, lgasCount: 150,
    topStates: [
      { name: 'Kaduna', memberCount: 350 },
      { name: 'Kano', memberCount: 45 },
      { name: 'Abuja', memberCount: 30 },
    ],
  },
  engagement: {
    totalProfileViews: 25000, totalProductViews: 48000,
    totalServiceViews: 18000, totalToolViews: 8500,
  },
};

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000) return `₦${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `₦${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `₦${(amount / 1_000).toFixed(0)}K`;
  return `₦${amount.toLocaleString()}`;
}

// ═══════════════════════════════════════════════════════════
// ANIMATED STAT CARD
// ═══════════════════════════════════════════════════════════

function AnimatedStatCard({ stat, index }: { stat: StatCardData; index: number }) {
  const { count, ref } = useCountUp({
    end: stat.value,
    duration: 2200,
    delay: index * 120,
    decimals: stat.decimals ?? 0,
  });

  const isPositive = (stat.trend ?? 0) >= 0;

  return (
    <div
      ref={ref}
      className={cn(
        'group relative overflow-hidden rounded-2xl',
        'border border-border/40 bg-card/80 backdrop-blur-sm',
        'p-6 sm:p-7',
        'transition-all duration-500 ease-out',
        'hover:shadow-2xl hover:shadow-black/[0.06] dark:hover:shadow-black/30',
        'hover:border-border/80 hover:-translate-y-1.5',
        'animate-fade-up',
      )}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Gradient orb */}
      <div
        className={cn(
          'absolute -top-20 -right-20 h-44 w-44 rounded-full blur-2xl',
          'opacity-[0.05] transition-all duration-700',
          'group-hover:opacity-[0.09] group-hover:scale-125',
          stat.glowColor,
        )}
      />

      {/* Hover ring */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500',
          'group-hover:opacity-100 ring-1 ring-inset',
          stat.ringColor,
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-5">
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl',
              'bg-gradient-to-br shadow-lg shadow-black/10',
              'transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2',
              stat.iconBg,
            )}
          >
            <stat.icon className="h-5 w-5 text-white" strokeWidth={2.2} />
          </div>

          {stat.trend !== undefined && stat.trend !== 0 && (
            <div
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5',
                'text-[11px] font-bold leading-tight',
                isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? '+' : ''}{stat.trend}%
            </div>
          )}
        </div>

        <div className="mb-1.5">
          <span className="text-3xl sm:text-[2.1rem] font-extrabold tracking-tight text-foreground tabular-nums leading-none">
            {stat.prefix}
            {stat.decimals
              ? count.toLocaleString(undefined, {
                  minimumFractionDigits: stat.decimals,
                  maximumFractionDigits: stat.decimals,
                })
              : count.toLocaleString()}
          </span>
          {stat.suffix && (
            <span className="text-xl sm:text-2xl font-bold text-muted-foreground/50 ml-0.5">
              {stat.suffix}
            </span>
          )}
        </div>

        <p className="text-[13px] font-semibold text-muted-foreground tracking-wide">
          {stat.label}
        </p>

        {(stat.subtitle || stat.trendLabel) && (
          <p className="text-[11px] text-muted-foreground/60 mt-2 flex items-center gap-1 leading-snug">
            {stat.trendLabel ? (
              <>
                <ArrowUpRight className="h-3 w-3 text-emerald-500 shrink-0" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {stat.trendLabel}
                </span>
              </>
            ) : (
              <span>{stat.subtitle}</span>
            )}
          </p>
        )}
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className={cn(
            'h-full bg-gradient-to-r w-full',
            'scale-x-0 origin-left transition-transform duration-700',
            'group-hover:scale-x-100',
            stat.iconBg,
          )}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// BREAKDOWN BAR
// ═══════════════════════════════════════════════════════════

function BreakdownBar({ items }: { items: BreakdownItem[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/40">
        {items.map((item) => {
          const pct = (item.value / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={item.label}
              className={cn(
                'h-full transition-all duration-1000 ease-out first:rounded-l-full last:rounded-r-full',
                item.color,
              )}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {items.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : '0';
          return (
            <div key={item.label} className="flex items-center gap-1.5 text-sm">
              <div className={cn('h-2 w-2 rounded-full', item.color)} />
              <item.icon className="h-3.5 w-3.5 text-muted-foreground/60" />
              <span className="text-muted-foreground text-xs">{item.label}</span>
              <span className="font-bold text-foreground text-xs tabular-nums">
                {item.value.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground/50">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MINI STAT PILL
// ═══════════════════════════════════════════════════════════

function MiniStatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/30 border border-border/40 px-4 py-3 transition-colors hover:bg-muted/50">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground truncate">{label}</p>
        <p className="text-sm font-bold text-foreground tabular-nums">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════

function StatsSkeleton() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-custom">
        <div className="text-center mb-16 space-y-3">
          <div className="h-7 w-40 rounded-full bg-muted/40 mx-auto animate-pulse" />
          <div className="h-10 w-96 max-w-full rounded-lg bg-muted/40 mx-auto animate-pulse" />
          <div className="h-5 w-72 max-w-full rounded-lg bg-muted/30 mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/30 bg-card/50 p-6 sm:p-7 space-y-4 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex justify-between">
                <div className="h-11 w-11 rounded-xl bg-muted/50" />
                <div className="h-5 w-12 rounded-full bg-muted/30" />
              </div>
              <div className="h-9 w-20 rounded-lg bg-muted/40" />
              <div className="h-4 w-28 rounded bg-muted/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════

export function StatsSection() {
  const { data: apiStats, isLoading, isError, isFetching } = usePlatformStats();

  const stats = apiStats || FALLBACK;
  const isLive = !!apiStats && !isError;

  const primaryStats: StatCardData[] = useMemo(
    () => [
      {
        label: 'Registered Members',
        value: stats.members.total,
        suffix: '+',
        icon: Users,
        trend: stats.members.growthPercentage,
        trendLabel: `${stats.members.newThisMonth} new this month`,
        iconBg: 'from-emerald-500 to-teal-600',
        ringColor: 'ring-emerald-500/10',
        glowColor: 'bg-emerald-400',
      },
      {
        label: 'Products Listed',
        value: stats.products.total,
        suffix: '+',
        icon: Package,
        trend: stats.products.growthPercentage,
        trendLabel: `${stats.products.active.toLocaleString()} active`,
        iconBg: 'from-blue-500 to-indigo-600',
        ringColor: 'ring-blue-500/10',
        glowColor: 'bg-blue-400',
      },
      {
        label: 'Services Available',
        value: stats.services.total,
        suffix: '+',
        icon: Wrench,
        trend: stats.services.growthPercentage,
        trendLabel: `${stats.services.active} active`,
        iconBg: 'from-amber-500 to-orange-600',
        ringColor: 'ring-amber-500/10',
        glowColor: 'bg-amber-400',
      },
      {
        label: 'Tools Marketplace',
        value: stats.tools.total,
        suffix: '+',
        icon: Hammer,
        trend: stats.tools.growthPercentage,
        subtitle: `${stats.tools.forSale} sale · ${stats.tools.forLease} lease`,
        iconBg: 'from-violet-500 to-purple-600',
        ringColor: 'ring-violet-500/10',
        glowColor: 'bg-violet-400',
      },
      {
        label: 'Verified Clients',
        value: stats.clients.verified,
        suffix: '+',
        icon: Shield,
        trend: stats.clients.growthPercentage,
        trendLabel: `${stats.clients.newThisMonth} new this month`,
        iconBg: 'from-cyan-500 to-sky-600',
        ringColor: 'ring-cyan-500/10',
        glowColor: 'bg-cyan-400',
      },
      {
        label: 'Transactions',
        value: stats.transactions.totalCount,
        suffix: '+',
        icon: Handshake,
        trend: stats.transactions.growthPercentage,
        trendLabel: `${formatCurrency(stats.transactions.totalAmount)} total value`,
        iconBg: 'from-rose-500 to-pink-600',
        ringColor: 'ring-rose-500/10',
        glowColor: 'bg-rose-400',
      },
      {
        label: 'Average Rating',
        value: stats.ratings.averageRating,
        decimals: 1,
        suffix: '/5',
        icon: Star,
        trendLabel: `${stats.ratings.totalCount.toLocaleString()} reviews`,
        iconBg: 'from-yellow-500 to-amber-600',
        ringColor: 'ring-yellow-500/10',
        glowColor: 'bg-yellow-400',
      },
      {
        label: 'States Covered',
        value: stats.coverage.statesCount,
        icon: MapPin,
        subtitle: `${stats.coverage.lgasCount}+ LGAs reached`,
        iconBg: 'from-teal-500 to-emerald-600',
        ringColor: 'ring-teal-500/10',
        glowColor: 'bg-teal-400',
      },
    ],
    [stats],
  );

  const memberBreakdown: BreakdownItem[] = useMemo(
    () => [
      { label: 'Farmers', value: stats.members.farmers, color: 'bg-emerald-500', icon: Tractor },
      { label: 'Artisans', value: stats.members.artisans, color: 'bg-blue-500', icon: Hammer },
      { label: 'Both', value: stats.members.both, color: 'bg-violet-500', icon: Users },
    ],
    [stats.members],
  );

  const productBreakdown: BreakdownItem[] = useMemo(
    () => [
      { label: 'Agricultural', value: stats.products.agricultural, color: 'bg-green-500', icon: Tractor },
      { label: 'Artisan', value: stats.products.artisan, color: 'bg-indigo-500', icon: Hammer },
    ],
    [stats.products],
  );

  if (isLoading) return <StatsSkeleton />;

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/[0.02] via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.012] dark:opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23888' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-5">
            <BarChart3 className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">
              Platform Statistics
            </span>
            {isLive && (
              <span className="relative flex h-2 w-2 ml-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
            )}
            {isFetching && !isLoading && (
              <span className="relative flex h-2 w-2 ml-1">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-tight">
            Making a Real Difference{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Across Nigeria
              </span>
              <Sparkles className="absolute -top-3 -right-6 h-5 w-5 text-amber-400 animate-pulse hidden sm:block" />
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Our growing community of farmers and artisans continues to expand,
            creating opportunities and transforming livelihoods every day.
          </p>
        </div>

        {/* Primary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {primaryStats.map((stat, idx) => (
            <AnimatedStatCard key={stat.label} stat={stat} index={idx} />
          ))}
        </div>

        {/* Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          <div
            className={cn(
              'rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-6 sm:p-7',
              'transition-all duration-500 hover:shadow-xl hover:shadow-black/[0.04]',
              'animate-fade-up',
            )}
            style={{ animationDelay: '0.7s' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground">Member Composition</h3>
                <p className="text-[11px] text-muted-foreground">By specialization type</p>
              </div>
              <span className="text-xl font-extrabold text-foreground tabular-nums">
                {stats.members.total.toLocaleString()}
              </span>
            </div>
            <BreakdownBar items={memberBreakdown} />
          </div>

          <div
            className={cn(
              'rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-6 sm:p-7',
              'transition-all duration-500 hover:shadow-xl hover:shadow-black/[0.04]',
              'animate-fade-up',
            )}
            style={{ animationDelay: '0.8s' }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <Package className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground">Product Distribution</h3>
                <p className="text-[11px] text-muted-foreground">Agricultural vs Artisan</p>
              </div>
              <span className="text-xl font-extrabold text-foreground tabular-nums">
                {stats.products.total.toLocaleString()}
              </span>
            </div>
            <BreakdownBar items={productBreakdown} />
          </div>
        </div>

        {/* Engagement */}
        <div
          className={cn(
            'rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-6 sm:p-7',
            'animate-fade-up',
          )}
          style={{ animationDelay: '0.9s' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 shadow-md">
              <Eye className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Platform Engagement</h3>
              <p className="text-[11px] text-muted-foreground">Total views across all listings</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MiniStatPill icon={Users} label="Profile Views" value={stats.engagement.totalProfileViews} />
            <MiniStatPill icon={Package} label="Product Views" value={stats.engagement.totalProductViews} />
            <MiniStatPill icon={Wrench} label="Service Views" value={stats.engagement.totalServiceViews} />
            <MiniStatPill icon={Hammer} label="Tool Views" value={stats.engagement.totalToolViews} />
          </div>

          {stats.coverage.topStates?.length > 0 && (
            <div className="mt-6 pt-5 border-t border-border/40">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Top States by Members
              </p>
              <div className="flex flex-wrap gap-2">
                {stats.coverage.topStates.map((state, idx) => (
                  <div
                    key={state.name}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1.5 bg-muted/40 border border-border/40 text-sm hover:bg-muted/60 transition-colors"
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="font-semibold text-foreground text-xs">{state.name}</span>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {state.memberCount.toLocaleString()}
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-400 px-1.5 py-0.5 rounded-full leading-none">
                        #1
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-14 animate-fade-up" style={{ animationDelay: '1s' }}>
          <p className="text-sm text-muted-foreground mb-5">
            Join our growing community of verified farmers and artisans
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="/register"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
                'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground',
                'font-semibold text-sm shadow-lg shadow-primary/20',
                'hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5',
                'transition-all duration-300 active:scale-[0.98]',
              )}
            >
              <Users className="h-4 w-4" />
              Register as Member
            </a>
            <a
              href="/explore"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
                'bg-card border border-border text-foreground',
                'font-semibold text-sm',
                'hover:bg-muted hover:-translate-y-0.5',
                'transition-all duration-300 active:scale-[0.98]',
              )}
            >
              <ShoppingBag className="h-4 w-4" />
              Explore Marketplace
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}