'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useTools } from '@/hooks/use-tools';
import { useServices } from '@/hooks/use-services';
import { useProducts } from '@/hooks/use-products';
import { useMembers } from '@/hooks/use-members';
import { useCategories } from '@/hooks/use-categories';
import { ToolCard } from '@/components/tools/tool-card';
import { ToolFilters, ToolFilterValues } from '@/components/tools/tool-filter';
import { PriceDisplay } from '@/components/shared/price-display';
import { RatingStars } from '@/components/shared/rating-stars';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVIDER_TYPE_MAP, NIGERIAN_STATES } from '@/lib/constants';
import {
  LayoutGrid,
  List,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Search,
  TrendingUp,
  Shield,
  Clock,
  Star,
  ArrowUpRight,
  X,
  Filter,
  Package,
  Zap,
  Users,
  MapPin,
  Briefcase,
  Store,
  Crown,
  Globe,
  Heart,
  ArrowRight,
  Eye,
  Layers,
  BadgeCheck,
  Gem,
  Rocket,
  ShoppingBag,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type MarketTab = 'tools' | 'products' | 'services' | 'members';

const ALL_CATEGORIES = 'all-categories';
const ALL_PRICING = 'all-pricing';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANIMATED COUNTER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AnimatedCounter({
  value,
  suffix = '',
}: {
  value: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (value === 0) return;
    const duration = 1400;
    const steps = 50;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FLOATING ORB BACKGROUND
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div
        className={cn(
          'absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full',
          'bg-gradient-to-br from-emerald-500/[0.07] via-teal-500/[0.05] to-transparent',
          'blur-3xl animate-[pulse_8s_ease-in-out_infinite]',
        )}
      />
      <div
        className={cn(
          'absolute top-20 right-0 w-[400px] h-[400px] rounded-full',
          'bg-gradient-to-br from-blue-500/[0.06] via-indigo-500/[0.04] to-transparent',
          'blur-3xl animate-[pulse_10s_ease-in-out_infinite_1s]',
        )}
      />
      <div
        className={cn(
          'absolute -bottom-20 left-1/3 w-[600px] h-[300px] rounded-full',
          'bg-gradient-to-t from-amber-500/[0.04] via-orange-500/[0.03] to-transparent',
          'blur-3xl animate-[pulse_12s_ease-in-out_infinite_2s]',
        )}
      />
      <div
        className={cn(
          'absolute top-1/2 right-1/4 w-[350px] h-[350px] rounded-full',
          'bg-gradient-to-br from-violet-500/[0.05] via-purple-500/[0.03] to-transparent',
          'blur-3xl animate-[pulse_9s_ease-in-out_infinite_3s]',
        )}
      />
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(var(--background))_70%)]" />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PREMIUM STAT CARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function PremiumStatCard({
  icon: Icon,
  label,
  value,
  suffix,
  gradient,
  delay = 0,
}: {
  icon: any;
  label: string;
  value: number;
  suffix?: string;
  gradient: string;
  delay?: number;
}) {
  return (
    <div
      className="group relative animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          'absolute -inset-px rounded-2xl opacity-0 blur-sm transition-all duration-700',
          'group-hover:opacity-50 group-hover:blur-md',
          gradient,
        )}
      />
      <div
        className={cn(
          'relative flex items-center gap-4 rounded-2xl',
          'border border-white/[0.08] dark:border-white/[0.06]',
          'bg-white/[0.03] dark:bg-white/[0.02] backdrop-blur-xl',
          'p-5 transition-all duration-500',
          'hover:border-white/[0.15] hover:bg-white/[0.06]',
          'hover:shadow-2xl hover:-translate-y-1',
          'shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
        )}
      >
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
            'shadow-lg transition-transform duration-500 group-hover:scale-110',
            gradient,
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight leading-none">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
          <p className="text-xs text-muted-foreground font-medium mt-1 tracking-wide uppercase">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACTIVE FILTER PILL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ActiveFilterPill({
  label,
  value,
  onClear,
}: {
  label: string;
  value: string;
  onClear: () => void;
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-xs font-medium',
        'bg-primary/5 text-primary border border-primary/10',
        'hover:bg-primary/10 transition-all duration-200 cursor-default',
        'animate-in fade-in zoom-in-95 duration-200',
      )}
    >
      <span className="text-muted-foreground">{label}:</span>
      <span className="capitalize">
        {value.toLowerCase().replace(/_/g, ' ')}
      </span>
      <button
        onClick={onClear}
        className={cn(
          'ml-0.5 h-4 w-4 rounded-full flex items-center justify-center',
          'hover:bg-primary/20 transition-colors',
        )}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SKELETON LOADERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function CardSkeleton({ variant = 'grid' }: { variant?: 'grid' | 'list' }) {
  if (variant === 'list') {
    return (
      <div className="flex gap-5 rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm p-5 animate-pulse">
        <div className="h-28 w-36 rounded-xl bg-muted/30 shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="h-4 w-2/3 rounded-lg bg-muted/30" />
          <div className="h-3 w-1/3 rounded-lg bg-muted/20" />
          <div className="h-3 w-1/2 rounded-lg bg-muted/20" />
        </div>
        <div className="space-y-3 py-1">
          <div className="h-6 w-20 rounded-lg bg-muted/30" />
          <div className="h-9 w-24 rounded-lg bg-muted/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted/20" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-1/3 rounded-lg bg-muted/20" />
        <div className="h-4 w-3/4 rounded-lg bg-muted/30" />
        <div className="h-3 w-1/2 rounded-lg bg-muted/20" />
        <div className="flex justify-between items-center pt-3">
          <div className="h-5 w-24 rounded-lg bg-muted/30" />
          <div className="h-9 w-20 rounded-lg bg-muted/20" />
        </div>
      </div>
    </div>
  );
}

function MemberSkeleton() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm overflow-hidden animate-pulse p-6 text-center">
      <div className="h-20 w-20 rounded-2xl bg-muted/30 mx-auto" />
      <div className="h-4 w-2/3 rounded-lg bg-muted/30 mx-auto mt-4" />
      <div className="h-3 w-1/2 rounded-lg bg-muted/20 mx-auto mt-2" />
      <div className="h-3 w-1/3 rounded-lg bg-muted/20 mx-auto mt-2" />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB CONFIG
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const TAB_CONFIG: Record<
  MarketTab,
  {
    label: string;
    icon: any;
    gradient: string;
    glowColor: string;
    description: string;
  }
> = {
  tools: {
    label: 'Tools',
    icon: Wrench,
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'emerald',
    description: 'Farm equipment & machinery for sale or lease',
  },
  products: {
    label: 'Products',
    icon: Package,
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'blue',
    description: 'Quality agricultural & artisan products',
  },
  services: {
    label: 'Services',
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-600',
    glowColor: 'amber',
    description: 'Professional services from skilled members',
  },
  members: {
    label: 'Members',
    icon: Users,
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'violet',
    description: 'Verified farmers & artisans across Nigeria',
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN MARKETPLACE PAGE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function MarketplacePage() {
  // ── Global State ──────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<MarketTab>('tools');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ── Tools State ───────────────────────────────────────────────────────────
  const [toolsPage, setToolsPage] = useState(1);
  const [toolFilters, setToolFilters] = useState<ToolFilterValues>({
    search: '',
    categoryId: '',
    condition: '',
    listingPurpose: '',
    state: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // ── Products State ────────────────────────────────────────────────────────
  const [productsPage, setProductsPage] = useState(1);
  const [productCategory, setProductCategory] = useState('');
  const [productPricing, setProductPricing] = useState('');

  // ── Services State ────────────────────────────────────────────────────────
  const [servicesPage, setServicesPage] = useState(1);

  // ── Members State ─────────────────────────────────────────────────────────
  const [membersPage, setMembersPage] = useState(1);
  const [memberProviderType, setMemberProviderType] = useState('_all');
  const [memberState, setMemberState] = useState('_all');

  // ── Debounced Search ──────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(globalSearch, 400);

  // ── Data Fetching ─────────────────────────────────────────────────────────
  const toolsQueryParams = useMemo(
    () => ({
      page: toolsPage,
      limit: 12,
      search: debouncedSearch || toolFilters.search || undefined,
      categoryId:
        toolFilters.categoryId && toolFilters.categoryId !== 'all'
          ? toolFilters.categoryId
          : undefined,
      condition:
        toolFilters.condition && toolFilters.condition !== 'all'
          ? toolFilters.condition
          : undefined,
      listingPurpose:
        toolFilters.listingPurpose && toolFilters.listingPurpose !== 'all'
          ? toolFilters.listingPurpose
          : undefined,
      state:
        toolFilters.state && toolFilters.state !== 'all'
          ? toolFilters.state
          : undefined,
      sortBy: toolFilters.sortBy || undefined,
      sortOrder: toolFilters.sortOrder || undefined,
    }),
    [toolsPage, debouncedSearch, toolFilters],
  );

  const { data: toolsData, isLoading: toolsLoading } =
    useTools(toolsQueryParams);
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: productsPage,
    limit: 12,
    search: debouncedSearch || undefined,
    categoryId: productCategory || undefined,
    pricingType: productPricing || undefined,
  });
  const { data: servicesData, isLoading: servicesLoading } = useServices({
    page: servicesPage,
    limit: 12,
    search: debouncedSearch || undefined,
  });
  const { data: membersData, isLoading: membersLoading } = useMembers({
    page: membersPage,
    limit: 12,
    search: debouncedSearch || undefined,
    providerType:
      memberProviderType === '_all' ? undefined : memberProviderType,
    state: memberState === '_all' ? undefined : memberState,
  });
  const { data: categoriesData } = useCategories('PRODUCT_AGRICULTURAL');

  // ── Derived ───────────────────────────────────────────────────────────────
  const tools = toolsData?.data || [];
  const toolsMeta = toolsData?.meta;
  const products = productsData?.data || [];
  const productsMeta = productsData?.meta;
  const services = servicesData?.data || [];
  const servicesMeta = servicesData?.meta;
  const members = membersData?.data || [];
  const membersMeta = membersData?.meta;

  const totalListings =
    (toolsMeta?.total || 0) +
    (productsMeta?.total || 0) +
    (servicesMeta?.total || 0) +
    (membersMeta?.total || 0);

  const currentLoading =
    activeTab === 'tools'
      ? toolsLoading
      : activeTab === 'products'
        ? productsLoading
        : activeTab === 'services'
          ? servicesLoading
          : membersLoading;

  const currentMeta =
    activeTab === 'tools'
      ? toolsMeta
      : activeTab === 'products'
        ? productsMeta
        : activeTab === 'services'
          ? servicesMeta
          : membersMeta;

  const currentPage =
    activeTab === 'tools'
      ? toolsPage
      : activeTab === 'products'
        ? productsPage
        : activeTab === 'services'
          ? servicesPage
          : membersPage;

  const setCurrentPage = useCallback(
    (p: number | ((prev: number) => number)) => {
      const setter =
        activeTab === 'tools'
          ? setToolsPage
          : activeTab === 'products'
            ? setProductsPage
            : activeTab === 'services'
              ? setServicesPage
              : setMembersPage;
      setter(p as any);
    },
    [activeTab],
  );

  // ── Tool filter handlers ──────────────────────────────────────────────────
  const handleToolFiltersChange = useCallback(
    (newFilters: ToolFilterValues) => {
      setToolFilters(newFilters);
      setToolsPage(1);
    },
    [],
  );

  const clearToolFilter = useCallback(
    (key: keyof ToolFilterValues) => {
      const defaults: Record<string, string> = {
        search: '',
        categoryId: '',
        condition: '',
        listingPurpose: '',
        state: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      handleToolFiltersChange({
        ...toolFilters,
        [key]: defaults[key] || '',
      });
    },
    [toolFilters, handleToolFiltersChange],
  );

  const clearAllToolFilters = useCallback(() => {
    handleToolFiltersChange({
      search: '',
      categoryId: '',
      condition: '',
      listingPurpose: '',
      state: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [handleToolFiltersChange]);

  const toolFilterCount = useMemo(() => {
    let count = 0;
    if (toolFilters.search) count++;
    if (toolFilters.categoryId && toolFilters.categoryId !== 'all') count++;
    if (toolFilters.condition && toolFilters.condition !== 'all') count++;
    if (toolFilters.listingPurpose && toolFilters.listingPurpose !== 'all')
      count++;
    if (toolFilters.state && toolFilters.state !== 'all') count++;
    return count;
  }, [toolFilters]);

  const activeFilterCount = useMemo(() => {
    if (activeTab === 'tools') return toolFilterCount;
    if (activeTab === 'products')
      return (productCategory ? 1 : 0) + (productPricing ? 1 : 0);
    if (activeTab === 'members')
      return (
        (memberProviderType !== '_all' ? 1 : 0) +
        (memberState !== '_all' ? 1 : 0)
      );
    return 0;
  }, [
    activeTab,
    toolFilterCount,
    productCategory,
    productPricing,
    memberProviderType,
    memberState,
  ]);

  const clearAllFilters = useCallback(() => {
    setGlobalSearch('');
    if (activeTab === 'tools') clearAllToolFilters();
    if (activeTab === 'products') {
      setProductCategory('');
      setProductPricing('');
    }
    if (activeTab === 'members') {
      setMemberProviderType('_all');
      setMemberState('_all');
    }
  }, [activeTab, clearAllToolFilters]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const tabConfig = TAB_CONFIG[activeTab];

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen relative">
      {/* ══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <FloatingOrbs />

        {/* Noise texture overlay */}
        <div className="absolute inset-0 -z-[5] opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-20 md:pb-12">
          {/* Premium floating badge */}
          <div className="flex justify-center mb-8">
            <div
              className={cn(
                'inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full',
                'bg-gradient-to-r from-primary/[0.08] via-primary/[0.04] to-primary/[0.08]',
                'border border-primary/[0.15] backdrop-blur-xl',
                'shadow-[0_0_20px_rgba(var(--primary-rgb),0.08),inset_0_1px_0_rgba(255,255,255,0.1)]',
                'animate-in fade-in zoom-in-95 duration-700',
              )}
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-wide">
                Live Marketplace
              </span>
              <div className="h-3.5 w-px bg-border/60" />
              <span className="text-xs text-muted-foreground font-medium">
                <AnimatedCounter value={totalListings} /> listings
              </span>
              <Sparkles className="h-3.5 w-3.5 text-amber-500/70" />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
              <span className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
                The Premier
              </span>
              <br />
              <span
                className={cn(
                  'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent',
                  'bg-[length:200%_auto] animate-[gradient-x_6s_ease_infinite]',
                )}
              >
                Marketplace
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Discover premium tools, products, and services from{' '}
              <span className="text-foreground font-medium">
                verified members
              </span>{' '}
              across Nigeria. Your trusted platform for excellence.
            </p>
          </div>

          {/* ── Grand Search Bar ──────────────────────────────────────────── */}
          <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
            <div className="relative group">
              <div
                className={cn(
                  'absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-all duration-700',
                  'bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-emerald-500/20',
                  'group-focus-within:opacity-100',
                )}
              />
              <div
                className={cn(
                  'relative flex items-center',
                  'bg-card/60 backdrop-blur-xl',
                  'border border-border/50 rounded-2xl',
                  'shadow-[0_8px_40px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.06)_inset]',
                  'group-focus-within:border-primary/25',
                  'group-focus-within:shadow-[0_8px_40px_rgba(var(--primary-rgb),0.08),0_1px_0_rgba(255,255,255,0.06)_inset]',
                  'transition-all duration-500',
                )}
              >
                <div className="flex items-center justify-center pl-6 pr-3">
                  <Search className="h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary/70 transition-colors duration-500" />
                </div>
                <input
                  type="text"
                  placeholder={`Search ${tabConfig.label.toLowerCase()}...`}
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={cn(
                    'flex-1 bg-transparent border-0 outline-none',
                    'py-5 md:py-6 pr-4 text-base md:text-lg',
                    'placeholder:text-muted-foreground/35',
                    'focus:ring-0 focus:outline-none',
                  )}
                />
                {globalSearch && (
                  <button
                    onClick={() => setGlobalSearch('')}
                    className={cn(
                      'mr-2 p-2 rounded-xl',
                      'text-muted-foreground/30 hover:text-foreground',
                      'hover:bg-muted/40 transition-all duration-200',
                    )}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="pr-3">
                  <Button
                    size="lg"
                    className={cn(
                      'rounded-xl px-6 h-11 gap-2 font-semibold text-sm',
                      'bg-gradient-to-r from-emerald-600 to-teal-600',
                      'hover:from-emerald-500 hover:to-teal-500',
                      'shadow-[0_4px_16px_rgba(16,185,129,0.3)]',
                      'hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)]',
                      'transition-all duration-300 hover:-translate-y-0.5',
                    )}
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Popular searches */}
            <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wider font-semibold">
                Trending:
              </span>
              {[
                'Tractor',
                'Welding',
                'Generator',
                'Irrigation',
                'Seeds',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => setGlobalSearch(term)}
                  className={cn(
                    'text-xs px-3.5 py-1.5 rounded-full font-medium',
                    'bg-muted/20 border border-border/30',
                    'text-muted-foreground/70 hover:text-foreground',
                    'hover:bg-muted/50 hover:border-border/60',
                    'hover:shadow-sm hover:-translate-y-px',
                    'transition-all duration-200',
                  )}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* ── Stats Row ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto mt-12">
            <PremiumStatCard
              icon={Package}
              label="Total Listings"
              value={totalListings}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
              delay={0}
            />
            <PremiumStatCard
              icon={BadgeCheck}
              label="Verified Sellers"
              value={membersMeta?.total || 0}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
              delay={100}
            />
            <PremiumStatCard
              icon={Globe}
              label="States Covered"
              value={36}
              suffix="+"
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
              delay={200}
            />
            <PremiumStatCard
              icon={Shield}
              label="Trust Score"
              value={99}
              suffix="%"
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
              delay={300}
            />
          </div>
        </div>

        {/* Section divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY TABS
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-16 z-40 bg-background/70 backdrop-blur-2xl border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 gap-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-1 px-1 py-1">
              {(Object.keys(TAB_CONFIG) as MarketTab[]).map((tab) => {
                const config = TAB_CONFIG[tab];
                const Icon = config.icon;
                const isActive = activeTab === tab;
                const count =
                  tab === 'tools'
                    ? toolsMeta?.total
                    : tab === 'products'
                      ? productsMeta?.total
                      : tab === 'services'
                        ? servicesMeta?.total
                        : membersMeta?.total;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'relative flex items-center gap-2 px-4 py-2.5 rounded-xl',
                      'text-sm font-medium whitespace-nowrap',
                      'transition-all duration-300',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground/80 hover:bg-muted/30',
                    )}
                  >
                    {/* Active indicator background */}
                    {isActive && (
                      <div
                        className={cn(
                          'absolute inset-0 rounded-xl',
                          'bg-gradient-to-r',
                          config.gradient,
                          'opacity-[0.08]',
                        )}
                      />
                    )}

                    <div
                      className={cn(
                        'relative flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300',
                        isActive
                          ? `bg-gradient-to-br ${config.gradient} shadow-sm`
                          : 'bg-muted/40',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-3.5 w-3.5 transition-colors duration-300',
                          isActive ? 'text-white' : 'text-muted-foreground',
                        )}
                      />
                    </div>

                    <span className="relative">{config.label}</span>

                    {count !== undefined && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          'relative h-5 min-w-[1.25rem] px-1.5 text-[10px] font-bold rounded-md',
                          'transition-all duration-300',
                          isActive
                            ? `bg-gradient-to-r ${config.gradient} text-white border-0 shadow-sm`
                            : 'bg-muted/60 text-muted-foreground',
                        )}
                      >
                        {count > 999
                          ? `${(count / 1000).toFixed(1)}k`
                          : count}
                      </Badge>
                    )}

                    {/* Active bottom indicator */}
                    {isActive && (
                      <div
                        className={cn(
                          'absolute -bottom-[11px] left-1/2 -translate-x-1/2',
                          'w-8 h-0.5 rounded-full',
                          'bg-gradient-to-r',
                          config.gradient,
                        )}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile filter trigger */}
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden gap-2 rounded-xl h-9 relative border-border/50"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline text-xs">Filters</span>
                    {activeFilterCount > 0 && (
                      <span
                        className={cn(
                          'absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full text-[9px]',
                          'bg-gradient-to-r',
                          tabConfig.gradient,
                          'text-white font-bold',
                          'flex items-center justify-center shadow-lg',
                        )}
                      >
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-6 pb-4 border-b border-border/50">
                    <SheetTitle className="flex items-center gap-2 text-base">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center',
                          'bg-gradient-to-br',
                          tabConfig.gradient,
                        )}
                      >
                        <Filter className="h-4 w-4 text-white" />
                      </div>
                      Filter {tabConfig.label}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
                    <MobileFilterContent
                      tab={activeTab}
                      globalSearch={globalSearch}
                      setGlobalSearch={setGlobalSearch}
                      toolFilters={toolFilters}
                      handleToolFiltersChange={(f) => {
                        handleToolFiltersChange(f);
                        setMobileFiltersOpen(false);
                      }}
                      toolsMeta={toolsMeta}
                      productCategory={productCategory}
                      setProductCategory={setProductCategory}
                      productPricing={productPricing}
                      setProductPricing={setProductPricing}
                      categoriesData={categoriesData}
                      memberProviderType={memberProviderType}
                      setMemberProviderType={setMemberProviderType}
                      memberState={memberState}
                      setMemberState={setMemberState}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View mode toggle */}
              {activeTab !== 'members' && (
                <div
                  className={cn(
                    'flex items-center gap-0.5 p-1 rounded-xl',
                    'bg-muted/30 border border-border/40',
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-7 w-7 rounded-lg transition-all duration-200',
                      viewMode === 'grid' &&
                        'bg-background shadow-sm text-foreground',
                    )}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-7 w-7 rounded-lg transition-all duration-200',
                      viewMode === 'list' &&
                        'bg-background shadow-sm text-foreground',
                    )}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTENT TOOLBAR
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="border-b border-border/30 bg-muted/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {currentMeta && (
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  <span className="font-semibold text-foreground">
                    {currentMeta.total?.toLocaleString()}
                  </span>{' '}
                  {tabConfig.label.toLowerCase()} found
                </p>
              )}

              {/* Active filter pills */}
              <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {globalSearch && (
                  <ActiveFilterPill
                    label="Search"
                    value={globalSearch}
                    onClear={() => setGlobalSearch('')}
                  />
                )}

                {activeTab === 'tools' && (
                  <>
                    {toolFilters.condition &&
                      toolFilters.condition !== 'all' && (
                        <ActiveFilterPill
                          label="Condition"
                          value={toolFilters.condition}
                          onClear={() => clearToolFilter('condition')}
                        />
                      )}
                    {toolFilters.listingPurpose &&
                      toolFilters.listingPurpose !== 'all' && (
                        <ActiveFilterPill
                          label="Purpose"
                          value={toolFilters.listingPurpose}
                          onClear={() => clearToolFilter('listingPurpose')}
                        />
                      )}
                    {toolFilters.state && toolFilters.state !== 'all' && (
                      <ActiveFilterPill
                        label="State"
                        value={toolFilters.state}
                        onClear={() => clearToolFilter('state')}
                      />
                    )}
                  </>
                )}

                {activeTab === 'products' && (
                  <>
                    {productCategory && (
                      <ActiveFilterPill
                        label="Category"
                        value={productCategory}
                        onClear={() => setProductCategory('')}
                      />
                    )}
                    {productPricing && (
                      <ActiveFilterPill
                        label="Pricing"
                        value={productPricing}
                        onClear={() => setProductPricing('')}
                      />
                    )}
                  </>
                )}

                {activeTab === 'members' && (
                  <>
                    {memberProviderType !== '_all' && (
                      <ActiveFilterPill
                        label="Type"
                        value={memberProviderType}
                        onClear={() => setMemberProviderType('_all')}
                      />
                    )}
                    {memberState !== '_all' && (
                      <ActiveFilterPill
                        label="State"
                        value={memberState}
                        onClear={() => setMemberState('_all')}
                      />
                    )}
                  </>
                )}

                {(activeFilterCount > 1 || globalSearch) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Section descriptor */}
            <p className="hidden lg:block text-xs text-muted-foreground/60 italic">
              {tabConfig.description}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex gap-8">
          {/* ──────────────────────────────────────────────────────────────────
              DESKTOP SIDEBAR
          ─────────────────────────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-36 space-y-5">
              {/* Filter card */}
              <Card
                className={cn(
                  'overflow-hidden rounded-2xl',
                  'border border-border/40 bg-card/40 backdrop-blur-xl',
                  'shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.03)]',
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-between p-5 pb-4',
                    'border-b border-border/40',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'flex h-9 w-9 items-center justify-center rounded-xl',
                        'bg-gradient-to-br',
                        tabConfig.gradient,
                        'shadow-sm',
                      )}
                    >
                      <SlidersHorizontal className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Filters</h3>
                      {activeFilterCount > 0 && (
                        <p className="text-[11px] text-muted-foreground">
                          {activeFilterCount} active
                        </p>
                      )}
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className={cn(
                        'text-xs font-medium text-primary px-2.5 py-1 rounded-lg',
                        'hover:bg-primary/5 transition-colors',
                      )}
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Tab-specific filters */}
                  {activeTab === 'tools' && (
                    <ToolFilters
                      filters={toolFilters}
                      onFiltersChange={handleToolFiltersChange}
                      totalResults={toolsMeta?.total}
                    />
                  )}

                  {activeTab === 'products' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Category
                        </label>
                        <Select
                          value={productCategory || ALL_CATEGORIES}
                          onValueChange={(v) =>
                            setProductCategory(
                              v === ALL_CATEGORIES ? '' : v,
                            )
                          }
                        >
                          <SelectTrigger className="h-10 rounded-xl border-border/50 text-sm">
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value={ALL_CATEGORIES}>
                              All Categories
                            </SelectItem>
                            {categoriesData?.data?.map((cat: any) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Pricing Type
                        </label>
                        <Select
                          value={productPricing || ALL_PRICING}
                          onValueChange={(v) =>
                            setProductPricing(v === ALL_PRICING ? '' : v)
                          }
                        >
                          <SelectTrigger className="h-10 rounded-xl border-border/50 text-sm">
                            <SelectValue placeholder="All Pricing" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value={ALL_PRICING}>
                              All Pricing
                            </SelectItem>
                            <SelectItem value="FIXED">Fixed Price</SelectItem>
                            <SelectItem value="NEGOTIABLE">
                              Negotiable
                            </SelectItem>
                            <SelectItem value="BOTH">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div className="py-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Use the search bar to find specific services
                      </p>
                    </div>
                  )}

                  {activeTab === 'members' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Member Type
                        </label>
                        <Select
                          value={memberProviderType}
                          onValueChange={setMemberProviderType}
                        >
                          <SelectTrigger className="h-10 rounded-xl border-border/50 text-sm">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="_all">All Types</SelectItem>
                            <SelectItem value="FARMER">
                              🌾 Farmers
                            </SelectItem>
                            <SelectItem value="ARTISAN">
                              🔨 Artisans
                            </SelectItem>
                            <SelectItem value="BOTH">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          State
                        </label>
                        <Select
                          value={memberState}
                          onValueChange={setMemberState}
                        >
                          <SelectTrigger className="h-10 rounded-xl border-border/50 text-sm">
                            <SelectValue placeholder="All States" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl max-h-60">
                            <SelectItem value="_all">All States</SelectItem>
                            {NIGERIAN_STATES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Promo CTA Card */}
              <Card
                className={cn(
                  'overflow-hidden rounded-2xl relative',
                  'border-0',
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br',
                    tabConfig.gradient,
                    'opacity-[0.06]',
                  )}
                />
                <div
                  className={cn(
                    'absolute inset-0 border rounded-2xl',
                    `border-${tabConfig.glowColor}-500/20`,
                  )}
                />
                <div className="relative p-5 space-y-4">
                  <div
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-xl',
                      'bg-gradient-to-br',
                      tabConfig.gradient,
                      'shadow-lg',
                    )}
                  >
                    <Rocket className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      Grow Your Business
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      List your tools, products, or services and connect with
                      thousands of verified buyers across Nigeria.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className={cn(
                      'w-full rounded-xl gap-2 text-xs font-semibold h-10',
                      'bg-gradient-to-r',
                      tabConfig.gradient,
                      'hover:opacity-90',
                      'shadow-lg transition-all duration-300 hover:-translate-y-0.5',
                    )}
                    asChild
                  >
                    <a href="/my-tools/new">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Start Listing
                    </a>
                  </Button>
                </div>
              </Card>

              {/* Trust indicators */}
              <div className="space-y-3 px-1">
                {[
                  {
                    icon: Shield,
                    text: 'Verified sellers only',
                    color: 'text-emerald-600',
                  },
                  {
                    icon: Eye,
                    text: 'Quality inspected listings',
                    color: 'text-blue-600',
                  },
                  {
                    icon: Heart,
                    text: 'Community trusted platform',
                    color: 'text-rose-500',
                  },
                ].map(({ icon: I, text, color }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <I className={cn('h-4 w-4', color)} />
                    <span className="text-xs text-muted-foreground font-medium">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ──────────────────────────────────────────────────────────────────
              CONTENT AREA
          ─────────────────────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Loading */}
            {currentLoading ? (
              <div
                className={cn(
                  activeTab === 'members'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                    : viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                      : 'space-y-4',
                )}
              >
                {Array.from({ length: 6 }).map((_, i) =>
                  activeTab === 'members' ? (
                    <MemberSkeleton key={i} />
                  ) : (
                    <CardSkeleton key={i} variant={viewMode} />
                  ),
                )}
              </div>
            ) : /* Empty State */
            (activeTab === 'tools' && tools.length === 0) ||
              (activeTab === 'products' && products.length === 0) ||
              (activeTab === 'services' && services.length === 0) ||
              (activeTab === 'members' && members.length === 0) ? (
              <EmptyState activeTab={activeTab} onClear={clearAllFilters} />
            ) : (
              /* Results */
              <div className="space-y-8">
                {/* ─── TOOLS TAB ─── */}
                {activeTab === 'tools' && (
                  <div
                    className={cn(
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                        : 'space-y-4',
                    )}
                  >
                    {tools.map((tool: any, index: number) => (
                      <div
                        key={tool.id}
                        className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                        style={{
                          animationDelay: `${Math.min(index * 60, 300)}ms`,
                        }}
                      >
                        <ToolCard tool={tool} variant={viewMode} />
                      </div>
                    ))}
                  </div>
                )}

                {/* ─── PRODUCTS TAB ─── */}
                {activeTab === 'products' && (
                  <div
                    className={cn(
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                        : 'space-y-4',
                    )}
                  >
                    {products.map((product: any, index: number) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="animate-in fade-in slide-in-from-bottom-3 duration-500 block"
                        style={{
                          animationDelay: `${Math.min(index * 60, 300)}ms`,
                        }}
                      >
                        <Card
                          className={cn(
                            'h-full overflow-hidden rounded-2xl group',
                            'border border-border/40 bg-card/40 backdrop-blur-sm',
                            'hover:border-border/70 hover:shadow-xl hover:-translate-y-1',
                            'transition-all duration-500',
                          )}
                        >
                          <div className="aspect-[4/3] bg-muted/20 relative overflow-hidden">
                            {product.images?.[0]?.thumbnailUrl ? (
                              <img
                                src={product.images[0].thumbnailUrl}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Package className="h-12 w-12 text-muted-foreground/15" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          <CardContent className="p-5">
                            <p className="text-[10px] font-semibold text-blue-600/80 uppercase tracking-[0.1em]">
                              {product.category?.name}
                            </p>
                            <h3 className="font-semibold mt-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              by {product.member?.user?.fullName}
                            </p>
                            <div className="mt-4 pt-3 border-t border-border/30">
                              <PriceDisplay
                                pricingType={product.pricingType}
                                amount={
                                  product.priceAmount
                                    ? Number(product.priceAmount)
                                    : null
                                }
                                displayText={product.priceDisplayText}
                                className="text-sm font-bold text-primary"
                                showBadge
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ─── SERVICES TAB ─── */}
                {activeTab === 'services' && (
                  <div
                    className={cn(
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                        : 'space-y-4',
                    )}
                  >
                    {services.map((service: any, index: number) => (
                      <Link
                        key={service.id}
                        href={`/services/${service.id}`}
                        className="animate-in fade-in slide-in-from-bottom-3 duration-500 block"
                        style={{
                          animationDelay: `${Math.min(index * 60, 300)}ms`,
                        }}
                      >
                        <Card
                          className={cn(
                            'h-full overflow-hidden rounded-2xl group',
                            'border border-border/40 bg-card/40 backdrop-blur-sm',
                            'hover:border-border/70 hover:shadow-xl hover:-translate-y-1',
                            'transition-all duration-500',
                          )}
                        >
                          <div className="aspect-[16/9] bg-muted/20 relative overflow-hidden">
                            {service.images?.[0]?.thumbnailUrl ? (
                              <img
                                src={service.images[0].thumbnailUrl}
                                alt={service.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Briefcase className="h-12 w-12 text-muted-foreground/15" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          <CardContent className="p-5">
                            <p className="text-[10px] font-semibold text-amber-600/80 uppercase tracking-[0.1em]">
                              {service.category?.name}
                            </p>
                            <h3 className="font-semibold mt-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                              {service.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                              {service.shortDescription ||
                                service.description}
                            </p>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                              <PriceDisplay
                                pricingType={service.pricingType}
                                amount={
                                  service.startingPrice
                                    ? Number(service.startingPrice)
                                    : null
                                }
                                displayText={service.priceDisplayText}
                                className="text-sm font-bold text-primary"
                              />
                              <RatingStars
                                rating={Number(service.averageRating)}
                                size="sm"
                              />
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2.5">
                              <MapPin className="h-3 w-3" />
                              {service.member?.user?.fullName}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ─── MEMBERS TAB ─── */}
                {activeTab === 'members' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {members.map((member: any, index: number) => (
                      <Link
                        key={member.id}
                        href={`/members/${member.id}`}
                        className="animate-in fade-in slide-in-from-bottom-3 duration-500 block"
                        style={{
                          animationDelay: `${Math.min(index * 60, 300)}ms`,
                        }}
                      >
                        <Card
                          className={cn(
                            'h-full overflow-hidden rounded-2xl group',
                            'border border-border/40 bg-card/40 backdrop-blur-sm',
                            'hover:border-violet-500/20 hover:shadow-xl hover:-translate-y-1',
                            'transition-all duration-500',
                          )}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="relative inline-block">
                              <div
                                className={cn(
                                  'h-20 w-20 rounded-2xl mx-auto overflow-hidden',
                                  'bg-gradient-to-br from-violet-500/10 to-purple-500/10',
                                  'border border-violet-500/10',
                                  'flex items-center justify-center',
                                  'group-hover:shadow-lg group-hover:border-violet-500/20',
                                  'transition-all duration-500',
                                )}
                              >
                                {member.profilePhotoThumbnail ? (
                                  <img
                                    src={member.profilePhotoThumbnail}
                                    alt=""
                                    className="h-20 w-20 rounded-2xl object-cover"
                                  />
                                ) : (
                                  <span className="text-2xl font-bold bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                    {member.user?.fullName?.[0]}
                                  </span>
                                )}
                              </div>
                              {/* Verification badge */}
                              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background border-2 border-background flex items-center justify-center">
                                <div className="h-5 w-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                                  <BadgeCheck className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            </div>

                            <h3 className="font-semibold mt-4 group-hover:text-primary transition-colors">
                              {member.user?.fullName}
                            </h3>
                            <p className="text-xs text-primary font-medium mt-1">
                              {
                                PROVIDER_TYPE_MAP[member.providerType]
                                  ?.icon
                              }{' '}
                              {
                                PROVIDER_TYPE_MAP[member.providerType]
                                  ?.label
                              }
                            </p>
                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-2">
                              <MapPin className="h-3 w-3" />
                              {member.state}
                            </div>
                            {member.tagline && (
                              <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
                                {member.tagline}
                              </p>
                            )}
                            <div className="mt-4 flex justify-center">
                              <RatingStars
                                rating={Number(member.averageRating)}
                                size="sm"
                                showValue
                                totalRatings={member.totalRatings}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}

                {/* ─── PREMIUM PAGINATION ─── */}
                {currentMeta && currentMeta.totalPages > 1 && (
                  <div className="pt-8 pb-4">
                    <div
                      className={cn(
                        'flex flex-col sm:flex-row items-center justify-between gap-4',
                        'p-5 rounded-2xl',
                        'bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20',
                        'border border-border/30 backdrop-blur-sm',
                      )}
                    >
                      <p className="text-sm text-muted-foreground order-2 sm:order-1">
                        Showing{' '}
                        <span className="font-semibold text-foreground">
                          {(currentPage - 1) * 12 + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-semibold text-foreground">
                          {Math.min(currentPage * 12, currentMeta.total)}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-foreground">
                          {currentMeta.total.toLocaleString()}
                        </span>
                      </p>

                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            'gap-1.5 rounded-xl h-9 px-3 border-border/40',
                            'hover:bg-primary/5 hover:text-primary hover:border-primary/20',
                            'transition-all duration-200',
                          )}
                          disabled={currentPage <= 1}
                          onClick={() =>
                            setCurrentPage((p: number) => p - 1)
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">Prev</span>
                        </Button>

                        <div className="flex items-center gap-1">
                          {currentPage > 3 &&
                            currentMeta.totalPages > 5 && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl text-sm hover:bg-primary/5"
                                  onClick={() => setCurrentPage(1)}
                                >
                                  1
                                </Button>
                                {currentPage > 4 && (
                                  <span className="text-muted-foreground/50 px-1">
                                    ···
                                  </span>
                                )}
                              </>
                            )}

                          {Array.from(
                            {
                              length: Math.min(currentMeta.totalPages, 5),
                            },
                            (_, i) => {
                              const pageNum =
                                currentMeta.totalPages <= 5
                                  ? i + 1
                                  : currentPage <= 3
                                    ? i + 1
                                    : currentPage >=
                                        currentMeta.totalPages - 2
                                      ? currentMeta.totalPages - 4 + i
                                      : currentPage - 2 + i;
                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    currentPage === pageNum
                                      ? 'default'
                                      : 'ghost'
                                  }
                                  size="icon"
                                  className={cn(
                                    'h-9 w-9 rounded-xl text-sm transition-all duration-200',
                                    currentPage === pageNum
                                      ? cn(
                                          'bg-gradient-to-r text-white border-0',
                                          tabConfig.gradient,
                                          'shadow-lg scale-105',
                                        )
                                      : 'hover:bg-primary/5 hover:text-primary',
                                  )}
                                  onClick={() => setCurrentPage(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              );
                            },
                          )}

                          {currentPage < currentMeta.totalPages - 2 &&
                            currentMeta.totalPages > 5 && (
                              <>
                                {currentPage <
                                  currentMeta.totalPages - 3 && (
                                  <span className="text-muted-foreground/50 px-1">
                                    ···
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl text-sm hover:bg-primary/5"
                                  onClick={() =>
                                    setCurrentPage(currentMeta.totalPages)
                                  }
                                >
                                  {currentMeta.totalPages}
                                </Button>
                              </>
                            )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            'gap-1.5 rounded-xl h-9 px-3 border-border/40',
                            'hover:bg-primary/5 hover:text-primary hover:border-primary/20',
                            'transition-all duration-200',
                          )}
                          disabled={currentPage >= currentMeta.totalPages}
                          onClick={() =>
                            setCurrentPage((p: number) => p + 1)
                          }
                        >
                          <span className="hidden sm:inline">Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          BOTTOM CTA (MOBILE)
      ═══════════════════════════════════════════════════════════════════════ */}
      <section className="lg:hidden pb-8 max-w-7xl mx-auto px-4 sm:px-6">
        <Card
          className={cn(
            'overflow-hidden rounded-2xl relative border-0',
          )}
        >
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r',
              tabConfig.gradient,
              'opacity-[0.06]',
            )}
          />
          <div
            className={cn(
              'absolute inset-0 border rounded-2xl',
              `border-${tabConfig.glowColor}-500/20`,
            )}
          />
          <div className="relative p-5 flex items-center gap-4">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                'bg-gradient-to-br',
                tabConfig.gradient,
                'shadow-lg',
              )}
            >
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">
                Ready to sell or offer services?
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reach thousands of buyers on our platform
              </p>
            </div>
            <Button
              size="sm"
              className={cn(
                'rounded-xl gap-1.5 shrink-0 font-semibold',
                'bg-gradient-to-r',
                tabConfig.gradient,
                'hover:opacity-90',
                'shadow-lg transition-all duration-300',
              )}
              asChild
            >
              <a href="/my-tools/new">
                <ArrowUpRight className="h-3.5 w-3.5" />
                List
              </a>
            </Button>
          </div>
        </Card>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          GRADIENT ANIMATION KEYFRAMES
      ═══════════════════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EMPTY STATE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function EmptyState({
  activeTab,
  onClear,
}: {
  activeTab: MarketTab;
  onClear: () => void;
}) {
  const config = TAB_CONFIG[activeTab];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-24 md:py-36">
      <div className="relative">
        <div
          className={cn(
            'flex h-28 w-28 items-center justify-center rounded-3xl mb-8',
            'bg-gradient-to-br from-muted/40 to-muted/20',
            'border border-border/30',
            'shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
          )}
        >
          <Icon className="h-12 w-12 text-muted-foreground/30" />
        </div>
        <div
          className={cn(
            'absolute -bottom-2 -right-2 h-10 w-10 rounded-xl',
            'bg-gradient-to-br from-amber-500/15 to-orange-500/15',
            'border border-amber-500/15',
            'flex items-center justify-center',
            'shadow-sm',
          )}
        >
          <Search className="h-5 w-5 text-amber-600/50" />
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-2">
        No {config.label.toLowerCase()} found
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-8 leading-relaxed">
        We couldn&apos;t find any {config.label.toLowerCase()} matching your
        criteria. Try adjusting your filters or search terms.
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          className="rounded-xl gap-2 h-11 px-5 border-border/40"
          onClick={onClear}
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
        <Button
          className={cn(
            'rounded-xl gap-2 h-11 px-5',
            'bg-gradient-to-r',
            config.gradient,
            'hover:opacity-90 shadow-lg',
          )}
          asChild
        >
          <a href="/my-tools/new">
            <config.icon className="h-4 w-4" />
            List a {config.label.slice(0, -1)}
          </a>
        </Button>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOBILE FILTER CONTENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MobileFilterContent({
  tab,
  globalSearch,
  setGlobalSearch,
  toolFilters,
  handleToolFiltersChange,
  toolsMeta,
  productCategory,
  setProductCategory,
  productPricing,
  setProductPricing,
  categoriesData,
  memberProviderType,
  setMemberProviderType,
  memberState,
  setMemberState,
}: {
  tab: MarketTab;
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  toolFilters: ToolFilterValues;
  handleToolFiltersChange: (f: ToolFilterValues) => void;
  toolsMeta: any;
  productCategory: string;
  setProductCategory: (s: string) => void;
  productPricing: string;
  setProductPricing: (s: string) => void;
  categoriesData: any;
  memberProviderType: string;
  setMemberProviderType: (s: string) => void;
  memberState: string;
  setMemberState: (s: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
          <Input
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border/50"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      {/* Tab-specific */}
      {tab === 'tools' && (
        <ToolFilters
          filters={toolFilters}
          onFiltersChange={handleToolFiltersChange}
          totalResults={toolsMeta?.total}
        />
      )}

      {tab === 'products' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Category
            </label>
            <Select
              value={productCategory || ALL_CATEGORIES}
              onValueChange={(v) =>
                setProductCategory(v === ALL_CATEGORIES ? '' : v)
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                {categoriesData?.data?.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pricing
            </label>
            <Select
              value={productPricing || ALL_PRICING}
              onValueChange={(v) =>
                setProductPricing(v === ALL_PRICING ? '' : v)
              }
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="All Pricing" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value={ALL_PRICING}>All Pricing</SelectItem>
                <SelectItem value="FIXED">Fixed Price</SelectItem>
                <SelectItem value="NEGOTIABLE">Negotiable</SelectItem>
                <SelectItem value="BOTH">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Member Type
            </label>
            <Select
              value={memberProviderType}
              onValueChange={setMemberProviderType}
            >
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="_all">All Types</SelectItem>
                <SelectItem value="FARMER">🌾 Farmers</SelectItem>
                <SelectItem value="ARTISAN">🔨 Artisans</SelectItem>
                <SelectItem value="BOTH">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              State
            </label>
            <Select value={memberState} onValueChange={setMemberState}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                <SelectItem value="_all">All States</SelectItem>
                {NIGERIAN_STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {tab === 'services' && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Use the search bar above to find specific services.
        </p>
      )}
    </div>
  );
}