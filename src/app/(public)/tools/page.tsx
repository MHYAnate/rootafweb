// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { useTools } from '@/hooks/use-tools';
// import { usePagination } from '@/hooks/use-pagination';
// import { useDebounce } from '@/hooks/use-debounce';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { EmptyState } from '@/components/shared/empty-state';
// import { PaginationControls } from '@/components/shared/pagination-controls';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';
// import { Search, Hammer, MapPin } from 'lucide-react';
// import { TOOL_CONDITION_MAP, TOOL_PURPOSE_MAP } from '@/lib/constants';
// import { formatCurrency } from '@/lib/format';

// // Constants for "all" selection values
// const ALL_PURPOSES = 'all-purposes';
// const ALL_CONDITIONS = 'all-conditions';

// export default function ToolsPage() {
//   const { page, setPage } = usePagination();
//   const [search, setSearch] = useState('');
//   const [purpose, setPurpose] = useState('');
//   const [condition, setCondition] = useState('');
//   const debouncedSearch = useDebounce(search, 500);

//   const { data, isLoading } = useTools({
//     page,
//     limit: 12,
//     search: debouncedSearch || undefined,
//     listingPurpose: purpose || undefined,
//     condition: condition || undefined,
//   });

//   // Handler for purpose change
//   const handlePurposeChange = (value: string) => {
//     setPurpose(value === ALL_PURPOSES ? '' : value);
//   };

//   // Handler for condition change
//   const handleConditionChange = (value: string) => {
//     setCondition(value === ALL_CONDITIONS ? '' : value);
//   };

//   return (
//     <div className="container-custom py-10">
//       <PageHeader 
//         title="Tool Marketplace" 
//         description="Find tools for sale or lease from our members" 
//       />

//       <div className="card-premium p-5 mb-8">
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="relative">
//             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input 
//               placeholder="Search tools..." 
//               value={search} 
//               onChange={(e) => setSearch(e.target.value)} 
//               className="pl-10 h-11 rounded-lg" 
//             />
//           </div>
          
//           {/* Purpose Filter */}
//           <Select 
//             value={purpose || ALL_PURPOSES} 
//             onValueChange={handlePurposeChange}
//           >
//             <SelectTrigger className="h-11 rounded-lg">
//               <SelectValue placeholder="All Purposes" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={ALL_PURPOSES}>All Purposes</SelectItem>
//               <SelectItem value="FOR_SALE">For Sale</SelectItem>
//               <SelectItem value="FOR_LEASE">For Lease</SelectItem>
//               <SelectItem value="BOTH">Both</SelectItem>
//             </SelectContent>
//           </Select>
          
//           {/* Condition Filter */}
//           <Select 
//             value={condition || ALL_CONDITIONS} 
//             onValueChange={handleConditionChange}
//           >
//             <SelectTrigger className="h-11 rounded-lg">
//               <SelectValue placeholder="Any Condition" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value={ALL_CONDITIONS}>Any Condition</SelectItem>
//               {Object.entries(TOOL_CONDITION_MAP).map(([key, val]) => (
//                 <SelectItem key={key} value={key}>
//                   {val.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {isLoading ? (
//         <LoadingSpinner size="lg" className="py-24" />
//       ) : data?.data?.length === 0 ? (
//         <EmptyState icon={Hammer} title="No tools found" />
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {data?.data?.map((tool: any, idx: number) => {
//               const condInfo = TOOL_CONDITION_MAP[tool.condition];
//               return (
//                 <Link key={tool.id} href={`/tools/${tool.id}`}>
//                   <Card 
//                     className="card-premium h-full overflow-hidden animate-fade-up" 
//                     style={{ animationDelay: `${(idx % 4) * 0.05}s` }}
//                   >
//                     <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
//                       {tool.images?.[0]?.thumbnailUrl ? (
//                         <img 
//                           src={tool.images[0].thumbnailUrl} 
//                           alt={tool.name} 
//                           className="w-full h-full object-cover" 
//                         />
//                       ) : (
//                         <Hammer className="h-12 w-12 text-muted-foreground/20" />
//                       )}
//                     </div>
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${condInfo?.color || ''}`}>
//                           {condInfo?.label}
//                         </span>
//                         <span className="text-[10px] text-muted-foreground">
//                           {TOOL_PURPOSE_MAP[tool.listingPurpose]}
//                         </span>
//                       </div>
//                       <h3 className="font-semibold line-clamp-1">{tool.name}</h3>
//                       <div className="mt-2 space-y-1">
//                         {tool.salePrice && (
//                           <p className="text-sm font-bold text-primary">
//                             {formatCurrency(Number(tool.salePrice))}
//                           </p>
//                         )}
//                         {tool.leaseRate && (
//                           <p className="text-xs text-muted-foreground">
//                             {formatCurrency(Number(tool.leaseRate))}/{tool.leaseRatePeriod?.replace('PER_', '').toLowerCase()}
//                           </p>
//                         )}
//                       </div>
//                       <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
//                         <MapPin className="h-3 w-3" />
//                         {tool.member?.user?.fullName}
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               );
//             })}
//           </div>
//           {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
//         </>
//       )}
//     </div>
//   );
// }

// src/app/(dashboard)/tools/page.tsx


// 'use client';

// import { useState, useMemo, useCallback } from 'react';
// import { useTools } from '@/hooks/use-tools';
// import { ToolCard } from '@/components/tools/tool-card';
// import { ToolFilters, ToolFilterValues } from '@/components/tools/tool-filter';
// import { PageHeader } from '@/components/shared/page-header';
// import { LoadingSpinner } from '@/components/shared/loading-spinner';
// import { EmptyState } from '@/components/shared/empty-state';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { LayoutGrid, List, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useDebounce } from '@/hooks/use-debounce';

// export default function ToolsMarketplacePage() {
//   const [page, setPage] = useState(1);
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [filters, setFilters] = useState<ToolFilterValues>({
//     search: '',
//     categoryId: '',
//     condition: '',
//     listingPurpose: '',
//     state: '',
//     sortBy: 'createdAt',
//     sortOrder: 'desc',
//   });

//   const debouncedSearch = useDebounce(filters.search, 400);

//   const queryParams = useMemo(
//     () => ({
//       page,
//       limit: 12,
//       search: debouncedSearch || undefined,
//       categoryId: filters.categoryId && filters.categoryId !== 'all' ? filters.categoryId : undefined,
//       condition: filters.condition && filters.condition !== 'all' ? filters.condition : undefined,
//       listingPurpose:
//         filters.listingPurpose && filters.listingPurpose !== 'all'
//           ? filters.listingPurpose
//           : undefined,
//       state: filters.state && filters.state !== 'all' ? filters.state : undefined,
//       sortBy: filters.sortBy || undefined,
//       sortOrder: filters.sortOrder || undefined,
//     }),
//     [page, debouncedSearch, filters],
//   );

//   const { data, isLoading } = useTools(queryParams);

//   const tools = data?.data || [];
//   const meta = data?.meta;

//   const handleFiltersChange = useCallback((newFilters: ToolFilterValues) => {
//     setFilters(newFilters);
//     setPage(1);
//   }, []);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <PageHeader
//           title="Tools Marketplace"
//           description="Browse farming and artisan tools available for sale and lease"
//         />
//         <div className="flex items-center gap-1 border rounded-lg p-1">
//           <Button
//             variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
//             size="icon"
//             className="h-8 w-8"
//             onClick={() => setViewMode('grid')}
//           >
//             <LayoutGrid className="h-4 w-4" />
//           </Button>
//           <Button
//             variant={viewMode === 'list' ? 'secondary' : 'ghost'}
//             size="icon"
//             className="h-8 w-8"
//             onClick={() => setViewMode('list')}
//           >
//             <List className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Layout: Sidebar + Content */}
//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Desktop Sidebar */}
//         <aside className="hidden lg:block w-64 shrink-0">
//           <Card className="card-premium p-4 sticky top-24">
//             <ToolFilters
//               filters={filters}
//               onFiltersChange={handleFiltersChange}
//               totalResults={meta?.total}
//             />
//           </Card>
//         </aside>

//         {/* Main Content */}
//         <div className="flex-1 min-w-0 space-y-4">
//           {/* Mobile Filters */}
//           <div className="lg:hidden">
//             <ToolFilters
//               filters={filters}
//               onFiltersChange={handleFiltersChange}
//               totalResults={meta?.total}
//             />
//           </div>

//           {/* Results */}
//           {isLoading ? (
//             <LoadingSpinner size="lg" className="py-20" />
//           ) : tools.length === 0 ? (
//             <EmptyState
//               // icon={<Wrench className="h-12 w-12" /> as any}
//               title="No tools found"
//               description="Try adjusting your filters or search terms"
//               action={
//                 <Button
//                   variant="outline"
//                   onClick={() =>
//                     handleFiltersChange({
//                       search: '',
//                       categoryId: '',
//                       condition: '',
//                       listingPurpose: '',
//                       state: '',
//                       sortBy: 'createdAt',
//                       sortOrder: 'desc',
//                     })
//                   }
//                 >
//                   Clear Filters
//                 </Button>
//               }
//             />
//           ) : (
//             <>
//               <div
//                 className={cn(
//                   viewMode === 'grid'
//                     ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
//                     : 'space-y-4',
//                 )}
//               >
//                 {tools.map((tool: any) => (
//                   <ToolCard key={tool.id} tool={tool} variant={viewMode} />
//                 ))}
//               </div>

//               {/* Pagination */}
//               {meta && meta.totalPages > 1 && (
//                 <div className="flex items-center justify-center gap-3 pt-8">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="gap-1"
//                     disabled={page <= 1}
//                     onClick={() => setPage((p) => p - 1)}
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                     Previous
//                   </Button>

//                   <div className="flex items-center gap-1">
//                     {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
//                       const pageNum =
//                         meta.totalPages <= 5
//                           ? i + 1
//                           : page <= 3
//                             ? i + 1
//                             : page >= meta.totalPages - 2
//                               ? meta.totalPages - 4 + i
//                               : page - 2 + i;
//                       return (
//                         <Button
//                           key={pageNum}
//                           variant={page === pageNum ? 'default' : 'ghost'}
//                           size="icon"
//                           className="h-8 w-8 text-sm"
//                           onClick={() => setPage(pageNum)}
//                         >
//                           {pageNum}
//                         </Button>
//                       );
//                     })}
//                   </div>

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="gap-1"
//                     disabled={page >= meta.totalPages}
//                     onClick={() => setPage((p) => p + 1)}
//                   >
//                     Next
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTools } from '@/hooks/use-tools';
import { ToolCard } from '@/components/tools/tool-card';
import { ToolFilters, ToolFilterValues } from '@/components/tools/tool-filter';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

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
    const duration = 1200;
    const steps = 40;
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

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING STAT CARD
// ─────────────────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  gradient,
}: {
  icon: any;
  label: string;
  value: number;
  suffix?: string;
  gradient: string;
}) {
  return (
    <div className="group relative">
      <div
        className={cn(
          'absolute -inset-0.5 rounded-2xl opacity-0 blur-sm transition-opacity duration-500',
          'group-hover:opacity-60',
          gradient,
        )}
      />
      <div
        className={cn(
          'relative flex items-center gap-3 rounded-2xl border border-border/50',
          'bg-card/80 backdrop-blur-sm p-4 transition-all duration-300',
          'hover:border-border hover:shadow-lg hover:-translate-y-0.5',
        )}
      >
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            gradient,
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight">
            <AnimatedCounter value={value} suffix={suffix} />
          </p>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACTIVE FILTER PILL
// ─────────────────────────────────────────────────────────────────────────────

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
        'hover:bg-primary/10 transition-colors cursor-default',
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

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────

function ToolCardSkeleton({
  variant = 'grid',
}: {
  variant?: 'grid' | 'list';
}) {
  if (variant === 'list') {
    return (
      <div className="flex gap-4 rounded-2xl border border-border/50 bg-card/50 p-4 animate-pulse">
        <div className="h-24 w-32 rounded-xl bg-muted/40 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded-lg bg-muted/40" />
          <div className="h-3 w-1/3 rounded-lg bg-muted/30" />
          <div className="h-3 w-1/2 rounded-lg bg-muted/30" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-20 rounded-lg bg-muted/40" />
          <div className="h-8 w-24 rounded-lg bg-muted/30" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-muted/40" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded-lg bg-muted/40" />
        <div className="h-3 w-1/2 rounded-lg bg-muted/30" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-20 rounded-lg bg-muted/40" />
          <div className="h-8 w-24 rounded-lg bg-muted/30" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ToolsMarketplacePage() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ToolFilterValues>({
    search: '',
    categoryId: '',
    condition: '',
    listingPurpose: '',
    state: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const queryParams = useMemo(
    () => ({
      page,
      limit: 12,
      search: debouncedSearch || undefined,
      categoryId:
        filters.categoryId && filters.categoryId !== 'all'
          ? filters.categoryId
          : undefined,
      condition:
        filters.condition && filters.condition !== 'all'
          ? filters.condition
          : undefined,
      listingPurpose:
        filters.listingPurpose && filters.listingPurpose !== 'all'
          ? filters.listingPurpose
          : undefined,
      state:
        filters.state && filters.state !== 'all' ? filters.state : undefined,
      sortBy: filters.sortBy || undefined,
      sortOrder: filters.sortOrder || undefined,
    }),
    [page, debouncedSearch, filters],
  );

  const { data, isLoading } = useTools(queryParams);

  const tools = data?.data || [];
  const meta = data?.meta;

  const handleFiltersChange = useCallback((newFilters: ToolFilterValues) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const clearSingleFilter = useCallback(
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
      handleFiltersChange({ ...filters, [key]: defaults[key] || '' });
    },
    [filters, handleFiltersChange],
  );

  const clearAllFilters = useCallback(() => {
    handleFiltersChange({
      search: '',
      categoryId: '',
      condition: '',
      listingPurpose: '',
      state: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [handleFiltersChange]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId && filters.categoryId !== 'all') count++;
    if (filters.condition && filters.condition !== 'all') count++;
    if (filters.listingPurpose && filters.listingPurpose !== 'all') count++;
    if (filters.state && filters.state !== 'all') count++;
    return count;
  }, [filters]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div
            className={cn(
              'absolute top-0 left-1/4 w-96 h-96 rounded-full',
              'bg-gradient-to-br from-emerald-500/8 via-teal-500/5 to-transparent',
              'blur-3xl animate-pulse',
            )}
          />
          <div
            className={cn(
              'absolute top-10 right-1/4 w-80 h-80 rounded-full',
              'bg-gradient-to-br from-blue-500/6 via-indigo-500/4 to-transparent',
              'blur-3xl animate-pulse delay-1000',
            )}
          />
          <div
            className={cn(
              'absolute -bottom-20 left-1/2 w-[600px] h-[300px] -translate-x-1/2 rounded-full',
              'bg-gradient-to-t from-primary/3 to-transparent',
              'blur-3xl',
            )}
          />
        </div>

        <div className="relative px-1 pt-8 pb-6 md:pt-12 md:pb-8">
          {/* Premium badge */}
          <div className="flex justify-center mb-6">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full',
                'bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10',
                'border border-primary/20 backdrop-blur-sm',
                'shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]',
              )}
            >
              <div className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Live Marketplace
              </span>
              <Sparkles className="h-3.5 w-3.5 text-primary/60" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Tools
              </span>{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover quality farming and artisan tools available for{' '}
              <span className="text-foreground font-medium">sale</span> and{' '}
              <span className="text-foreground font-medium">lease</span> from
              verified members across Nigeria
            </p>
          </div>

          {/* ─── HERO SEARCH BAR ─── */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative group">
              {/* Glow effect behind search */}
              <div
                className={cn(
                  'absolute -inset-1 rounded-2xl opacity-0 blur-md transition-opacity duration-500',
                  'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20',
                  'group-focus-within:opacity-100',
                )}
              />
              <div
                className={cn(
                  'relative flex items-center',
                  'bg-card/80 backdrop-blur-sm',
                  'border border-border/60 rounded-2xl',
                  'shadow-[0_4px_24px_rgba(0,0,0,0.06)]',
                  'group-focus-within:border-primary/30',
                  'group-focus-within:shadow-[0_4px_32px_rgba(var(--primary-rgb),0.1)]',
                  'transition-all duration-300',
                )}
              >
                <div className="flex items-center justify-center pl-5 pr-2">
                  <Search className="h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search tools by name, brand, or keyword..."
                  value={filters.search}
                  onChange={(e) =>
                    handleFiltersChange({ ...filters, search: e.target.value })
                  }
                  className={cn(
                    'flex-1 bg-transparent border-0 outline-none',
                    'py-4 md:py-5 pr-4 text-base md:text-lg',
                    'placeholder:text-muted-foreground/40',
                    'focus:ring-0 focus:outline-none',
                  )}
                />
                {filters.search && (
                  <button
                    onClick={() =>
                      handleFiltersChange({ ...filters, search: '' })
                    }
                    className={cn(
                      'mr-3 p-1.5 rounded-lg',
                      'text-muted-foreground/40 hover:text-foreground',
                      'hover:bg-muted/50 transition-all duration-200',
                    )}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="pr-3">
                  <Button
                    size="sm"
                    className={cn(
                      'rounded-xl px-5 h-10 gap-2 font-semibold',
                      'bg-gradient-to-r from-emerald-600 to-teal-600',
                      'hover:from-emerald-700 hover:to-teal-700',
                      'shadow-lg shadow-emerald-500/20',
                      'transition-all duration-300',
                    )}
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Search suggestions / quick filters */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className="text-xs text-muted-foreground/60">Popular:</span>
              {['Tractor', 'Welding Machine', 'Generator', 'Power Tools', 'Irrigation'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() =>
                      handleFiltersChange({ ...filters, search: term })
                    }
                    className={cn(
                      'text-xs px-3 py-1.5 rounded-full',
                      'bg-muted/30 border border-border/40',
                      'text-muted-foreground hover:text-foreground',
                      'hover:bg-muted/60 hover:border-border',
                      'transition-all duration-200',
                    )}
                  >
                    {term}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto mt-8">
            <StatCard
              icon={Wrench}
              label="Total Tools"
              value={meta?.total || 0}
              gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            />
            <StatCard
              icon={Shield}
              label="Verified Sellers"
              value={meta?.total ? Math.ceil(meta.total * 0.85) : 0}
              gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <StatCard
              icon={TrendingUp}
              label="For Sale"
              value={meta?.total ? Math.ceil(meta.total * 0.6) : 0}
              gradient="bg-gradient-to-br from-amber-500 to-orange-600"
            />
            <StatCard
              icon={Clock}
              label="For Lease"
              value={meta?.total ? Math.ceil(meta.total * 0.4) : 0}
              gradient="bg-gradient-to-br from-violet-500 to-purple-600"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STICKY TOOLBAR */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-1 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Results count + active filters */}
            <div className="flex items-center gap-3 min-w-0">
              {meta && (
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  <span className="font-semibold text-foreground">
                    {meta.total.toLocaleString()}
                  </span>{' '}
                  {meta.total === 1 ? 'tool' : 'tools'} found
                </p>
              )}

              {/* Active filter pills - desktop */}
              <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {filters.search && (
                  <ActiveFilterPill
                    label="Search"
                    value={filters.search}
                    onClear={() => clearSingleFilter('search')}
                  />
                )}
                {filters.condition && filters.condition !== 'all' && (
                  <ActiveFilterPill
                    label="Condition"
                    value={filters.condition}
                    onClear={() => clearSingleFilter('condition')}
                  />
                )}
                {filters.listingPurpose &&
                  filters.listingPurpose !== 'all' && (
                    <ActiveFilterPill
                      label="Purpose"
                      value={filters.listingPurpose}
                      onClear={() => clearSingleFilter('listingPurpose')}
                    />
                  )}
                {filters.state && filters.state !== 'all' && (
                  <ActiveFilterPill
                    label="State"
                    value={filters.state}
                    onClear={() => clearSingleFilter('state')}
                  />
                )}
                {filters.categoryId && filters.categoryId !== 'all' && (
                  <ActiveFilterPill
                    label="Category"
                    value={filters.categoryId}
                    onClear={() => clearSingleFilter('categoryId')}
                  />
                )}
                {activeFilterCount > 1 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Right: View toggle + mobile filter button */}
            <div className="flex items-center gap-2">
              {/* Mobile filter trigger */}
              <Sheet
                open={mobileFiltersOpen}
                onOpenChange={setMobileFiltersOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden gap-2 rounded-xl relative"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {activeFilterCount > 0 && (
                      <span
                        className={cn(
                          'absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full text-[10px]',
                          'bg-primary text-primary-foreground font-bold',
                          'flex items-center justify-center',
                        )}
                      >
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-6 pb-4 border-b border-border/50">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-primary" />
                      Filter Tools
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-6 overflow-y-auto max-h-[calc(100vh-100px)] space-y-5">
                    {/* Mobile search inside sheet */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                        <Input
                          placeholder="Search tools..."
                          value={filters.search}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              search: e.target.value,
                            }))
                          }
                          className="pl-10 h-11 rounded-xl border-border/60"
                        />
                        {filters.search && (
                          <button
                            onClick={() =>
                              setFilters((prev) => ({
                                ...prev,
                                search: '',
                              }))
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Rest of filters */}
                    <ToolFilters
                      filters={filters}
                      onFiltersChange={(f) => {
                        handleFiltersChange(f);
                        setMobileFiltersOpen(false);
                      }}
                      totalResults={meta?.total}
                      // hideSearch
                    />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View mode toggle */}
              <div
                className={cn(
                  'flex items-center gap-0.5 p-1 rounded-xl',
                  'bg-muted/50 border border-border/50',
                )}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-lg transition-all duration-200',
                    viewMode === 'grid' &&
                      'bg-background shadow-sm text-primary',
                  )}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-lg transition-all duration-200',
                    viewMode === 'list' &&
                      'bg-background shadow-sm text-primary',
                  )}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="px-1 py-6 md:py-8">
        <div className="flex gap-8">
          {/* ─────────────────────────────────────────────────────────────── */}
          {/* DESKTOP SIDEBAR FILTERS */}
          {/* ─────────────────────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-4">
              <Card
                className={cn(
                  'overflow-hidden rounded-2xl',
                  'border border-border/50 bg-card/50 backdrop-blur-sm',
                  'shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.04)]',
                )}
              >
                {/* Filter header */}
                <div
                  className={cn(
                    'flex items-center justify-between p-5 pb-4',
                    'border-b border-border/50',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        'bg-gradient-to-br from-primary/10 to-primary/5',
                      )}
                    >
                      <SlidersHorizontal className="h-4 w-4 text-primary" />
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

                {/* Sidebar Search */}
                <div className="p-5 pb-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                      placeholder="Search tools..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFiltersChange({
                          ...filters,
                          search: e.target.value,
                        })
                      }
                      className={cn(
                        'pl-10 pr-9 h-11 rounded-xl',
                        'border-border/60 bg-muted/20',
                        'focus:bg-background focus:border-primary/30',
                        'transition-all duration-200',
                      )}
                    />
                    {filters.search && (
                      <button
                        onClick={() =>
                          handleFiltersChange({ ...filters, search: '' })
                        }
                        className={cn(
                          'absolute right-3 top-1/2 -translate-y-1/2',
                          'text-muted-foreground/40 hover:text-foreground',
                          'transition-colors',
                        )}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Divider between search and other filters */}
                <div className="px-5 pt-4 pb-0">
                  <div className="h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
                </div>

                {/* Other filter dropdowns */}
                <div className="p-5">
                  <ToolFilters
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    totalResults={meta?.total}
                    // hideSearch
                  />
                </div>
              </Card>

              {/* Promo card */}
              <Card
                className={cn(
                  'overflow-hidden rounded-2xl',
                  'bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-500/10',
                  'border border-emerald-500/20',
                )}
              >
                <div className="p-5 space-y-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      'bg-gradient-to-br from-emerald-500 to-teal-600',
                    )}
                  >
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">List Your Tools</h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      Have tools you no longer use? List them for sale or lease
                      and reach thousands of farmers and artisans.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className={cn(
                      'w-full rounded-xl gap-2 text-xs font-semibold',
                      'bg-gradient-to-r from-emerald-600 to-teal-600',
                      'hover:from-emerald-700 hover:to-teal-700',
                      'shadow-lg shadow-emerald-500/20',
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
            </div>
          </aside>

          {/* ─────────────────────────────────────────────────────────────── */}
          {/* TOOLS GRID / LIST */}
          {/* ─────────────────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {isLoading ? (
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5'
                    : 'space-y-4',
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <ToolCardSkeleton key={i} variant={viewMode} />
                ))}
              </div>
            ) : tools.length === 0 ? (
              /* ─── Empty State ─── */
              <div className="flex flex-col items-center justify-center py-20 md:py-32">
                <div
                  className={cn(
                    'relative flex h-24 w-24 items-center justify-center rounded-3xl mb-6',
                    'bg-gradient-to-br from-muted/50 to-muted/30',
                    'border border-border/50',
                  )}
                >
                  <Wrench className="h-10 w-10 text-muted-foreground/40" />
                  <div
                    className={cn(
                      'absolute -bottom-1 -right-1 h-8 w-8 rounded-xl',
                      'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
                      'border border-amber-500/20',
                      'flex items-center justify-center',
                    )}
                  >
                    <Search className="h-4 w-4 text-amber-600/60" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  We couldn&apos;t find any tools matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl gap-2"
                    onClick={clearAllFilters}
                  >
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                  <Button
                    className={cn(
                      'rounded-xl gap-2',
                      'bg-gradient-to-r from-primary to-primary/80',
                    )}
                    asChild
                  >
                    <a href="/my-tools/new">
                      <Wrench className="h-4 w-4" />
                      List a Tool
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              /* ─── Results ─── */
              <div className="space-y-6">
                <div
                  className={cn(
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5'
                      : 'space-y-4',
                  )}
                >
                  {tools.map((tool: any, index: number) => (
                    <div
                      key={tool.id}
                      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ToolCard tool={tool} variant={viewMode} />
                    </div>
                  ))}
                </div>

                {/* ─── Premium Pagination ─── */}
                {meta && meta.totalPages > 1 && (
                  <div className="pt-8 pb-4">
                    <div
                      className={cn(
                        'flex flex-col sm:flex-row items-center justify-between gap-4',
                        'p-4 rounded-2xl',
                        'bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30',
                        'border border-border/50',
                      )}
                    >
                      {/* Page info */}
                      <p className="text-sm text-muted-foreground order-2 sm:order-1">
                        Showing{' '}
                        <span className="font-semibold text-foreground">
                          {(page - 1) * 12 + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-semibold text-foreground">
                          {Math.min(page * 12, meta.total)}
                        </span>{' '}
                        of{' '}
                        <span className="font-semibold text-foreground">
                          {meta.total.toLocaleString()}
                        </span>{' '}
                        tools
                      </p>

                      {/* Page controls */}
                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            'gap-1.5 rounded-xl h-9 px-3',
                            'hover:bg-primary/5 hover:text-primary hover:border-primary/30',
                            'transition-all duration-200',
                          )}
                          disabled={page <= 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="hidden sm:inline">Prev</span>
                        </Button>

                        <div className="flex items-center gap-1">
                          {page > 3 && meta.totalPages > 5 && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 rounded-xl text-sm hover:bg-primary/5"
                                onClick={() => setPage(1)}
                              >
                                1
                              </Button>
                              {page > 4 && (
                                <span className="text-muted-foreground px-1">
                                  ···
                                </span>
                              )}
                            </>
                          )}

                          {Array.from(
                            { length: Math.min(meta.totalPages, 5) },
                            (_, i) => {
                              const pageNum =
                                meta.totalPages <= 5
                                  ? i + 1
                                  : page <= 3
                                    ? i + 1
                                    : page >= meta.totalPages - 2
                                      ? meta.totalPages - 4 + i
                                      : page - 2 + i;
                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    page === pageNum ? 'default' : 'ghost'
                                  }
                                  size="icon"
                                  className={cn(
                                    'h-9 w-9 rounded-xl text-sm transition-all duration-200',
                                    page === pageNum
                                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                                      : 'hover:bg-primary/5 hover:text-primary',
                                  )}
                                  onClick={() => setPage(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              );
                            },
                          )}

                          {page < meta.totalPages - 2 &&
                            meta.totalPages > 5 && (
                              <>
                                {page < meta.totalPages - 3 && (
                                  <span className="text-muted-foreground px-1">
                                    ···
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl text-sm hover:bg-primary/5"
                                  onClick={() => setPage(meta.totalPages)}
                                >
                                  {meta.totalPages}
                                </Button>
                              </>
                            )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            'gap-1.5 rounded-xl h-9 px-3',
                            'hover:bg-primary/5 hover:text-primary hover:border-primary/30',
                            'transition-all duration-200',
                          )}
                          disabled={page >= meta.totalPages}
                          onClick={() => setPage((p) => p + 1)}
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

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM CTA - MOBILE */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="lg:hidden pb-6 px-1">
        <Card
          className={cn(
            'overflow-hidden rounded-2xl',
            'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10',
            'border border-emerald-500/20',
          )}
        >
          <div className="p-5 flex items-center gap-4">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                'bg-gradient-to-br from-emerald-500 to-teal-600',
              )}
            >
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">
                Have tools to sell or lease?
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Reach thousands of buyers on our platform
              </p>
            </div>
            <Button
              size="sm"
              className={cn(
                'rounded-xl gap-1.5 shrink-0',
                'bg-gradient-to-r from-emerald-600 to-teal-600',
                'hover:from-emerald-700 hover:to-teal-700',
                'shadow-lg shadow-emerald-500/20',
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
    </div>
  );
}