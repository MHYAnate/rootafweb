'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useTools } from '@/hooks/use-tools';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { useCategories } from '@/hooks/use-categories';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { ToolCard } from '@/components/tools/tool-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Wrench,
  SlidersHorizontal,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ─── "all" sentinel values ────────────────────────────────────────────────────
const ALL_CATEGORIES = 'all-categories';
const ALL_CONDITIONS = 'all-conditions';
const ALL_PURPOSES  = 'all-purposes';
const ALL_STATES    = 'all-states';
const ALL_SORT      = 'createdAt-desc';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe',
  'Zamfara','FCT',
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ToolsMarketplacePage() {
  const { page, setPage } = usePagination();
  const [viewMode, setViewMode]         = useState<'grid' | 'list'>('grid');
  const [search, setSearch]             = useState('');
  const [categoryId, setCategoryId]     = useState('');
  const [condition, setCondition]       = useState('');
  const [listingPurpose, setListingPurpose] = useState('');
  const [state, setState]               = useState('');
  const [sortKey, setSortKey]           = useState('createdAt-desc');

  const debouncedSearch = useDebounce(search, 500);

  const { data: categoriesData } = useCategories('TOOL');

  const [sortBy, sortOrder] = useMemo(() => sortKey.split('-') as [string, string], [sortKey]);

  const { data, isLoading } = useTools({
    page,
    limit: 12,
    search:         debouncedSearch || undefined,
    categoryId:     categoryId      || undefined,
    condition:      condition        || undefined,
    listingPurpose: listingPurpose  || undefined,
    state:          state           || undefined,
    sortBy:         sortBy          || undefined,
    sortOrder:      sortOrder       || undefined,
  });

  const tools = data?.data ?? [];
  const meta  = data?.meta 

  // ── helpers ──────────────────────────────────────────────────────────────
  const handle = useCallback(
    (setter: (v: string) => void, allValue: string) => (value: string) => {
      setter(value === allValue ? '' : value);
      setPage(1);
    },
    [setPage],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortKey(value === ALL_SORT ? 'createdAt-desc' : value);
    setPage(1);
  };

  return (
    <div className="container-custom py-10">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <PageHeader
        title="Tools Marketplace"
        description="Discover quality farming and artisan tools for sale and lease"
        badge={
          <span className="badge-premium text-[10px]">
            {meta?.total ?? 0} Tools
          </span>
        }
      />

      {/* ── Filter bar ───────────────────────────────────────────────────── */}
      <div className="card-premium p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filter Tools
          </div>

          {/* View-mode toggle */}
          <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted/50 border border-border/50">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-7 w-7 rounded-md transition-all duration-200',
                viewMode === 'grid' && 'bg-background shadow-sm text-primary',
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-7 w-7 rounded-md transition-all duration-200',
                viewMode === 'list' && 'bg-background shadow-sm text-primary',
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Row 1: search + category + condition */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={handleSearch}
              className="pl-10 h-11 rounded-lg"
            />
          </div>

          {/* Category */}
          <Select
            value={categoryId || ALL_CATEGORIES}
            onValueChange={handle(setCategoryId, ALL_CATEGORIES)}
          >
            <SelectTrigger className="h-11 rounded-lg">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
              {categoriesData?.data?.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Condition */}
          <Select
            value={condition || ALL_CONDITIONS}
            onValueChange={handle(setCondition, ALL_CONDITIONS)}
          >
            <SelectTrigger className="h-11 rounded-lg">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_CONDITIONS}>All Conditions</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="USED_LIKE_NEW">Used – Like New</SelectItem>
              <SelectItem value="USED_GOOD">Used – Good</SelectItem>
              <SelectItem value="USED_FAIR">Used – Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Row 2: purpose + state + sort */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Listing purpose */}
          <Select
            value={listingPurpose || ALL_PURPOSES}
            onValueChange={handle(setListingPurpose, ALL_PURPOSES)}
          >
            <SelectTrigger className="h-11 rounded-lg">
              <SelectValue placeholder="Sale & Lease" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PURPOSES}>Sale &amp; Lease</SelectItem>
              <SelectItem value="SELL">For Sale</SelectItem>
              <SelectItem value="LEASE">For Lease</SelectItem>
              <SelectItem value="BOTH">Both</SelectItem>
            </SelectContent>
          </Select>

          {/* State */}
          <Select
            value={state || ALL_STATES}
            onValueChange={handle(setState, ALL_STATES)}
          >
            <SelectTrigger className="h-11 rounded-lg">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATES}>All States</SelectItem>
              {NIGERIAN_STATES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={sortKey || ALL_SORT}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="h-11 rounded-lg">
              <SelectValue placeholder="Newest First" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading tools..." className="py-24" />
      ) : tools.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No tools found"
          description="Try adjusting your filters or search terms"
        />
      ) : (
        <>
          <div
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4',
            )}
          >
            {tools.map((tool: any, idx: number) => (
              <div
                key={tool.id}
                className="animate-fade-up"
                style={{ animationDelay: `${(idx % 4) * 0.05}s` }}
              >
                <ToolCard tool={tool} variant={viewMode} />
              </div>
            ))}
          </div>

         {data?.meta && <PaginationControls meta={{...data.meta, hasNextPage: data.meta.page < data.meta.totalPages, hasPreviousPage: data.meta.page > 1}} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}