// src/components/tools/tool-filters.tsx
'use client';

import { useState } from 'react';
import { useCategoriesByType } from '@/hooks/use-categories';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';

const NIGERIA_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
  'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT',
  'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
  'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
  'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];

const CONDITION_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'FAIRLY_USED', label: 'Fairly Used' },
  { value: 'USED', label: 'Used' },
  { value: 'REFURBISHED', label: 'Refurbished' },
];

const PURPOSE_OPTIONS = [
  { value: 'SALE', label: 'For Sale' },
  { value: 'LEASE', label: 'For Lease' },
  { value: 'BOTH', label: 'Sale & Lease' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export interface ToolFilterValues {
  search: string;
  categoryId: string;
  condition: string;
  listingPurpose: string;
  state: string;
  sortBy: string;
  sortOrder: string;
}

interface ToolFiltersProps {
  filters: ToolFilterValues;
  onFiltersChange: (filters: ToolFilterValues) => void;
  totalResults?: number;
}

const GROUP_LABELS: Record<string, string> = {
  TOOL_FARMING: '🌾 Farming Tools',
  TOOL_ARTISAN: '🔨 Artisan Tools',
};

function FilterContent({
  filters,
  onFiltersChange,
  categories,
  grouped,
}: {
  filters: ToolFilterValues;
  onFiltersChange: (f: ToolFilterValues) => void;
  categories: any[];
  grouped: any;
}) {
  const update = (key: keyof ToolFilterValues, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasGroups = grouped && Object.keys(grouped).length > 1;

  return (
    <div className="space-y-5">
      {/* Category */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </Label>
        <Select value={filters.categoryId} onValueChange={(v) => update('categoryId', v)}>
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            <SelectItem value="all">All Categories</SelectItem>
            {hasGroups
              ? (Object.entries(grouped) as [string, any[]][]).map(([groupType, groupCats]) => (
                  <SelectGroup key={groupType}>
                    <SelectLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {GROUP_LABELS[groupType] || groupType}
                    </SelectLabel>
                    {groupCats.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              : categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Condition
        </Label>
        <Select value={filters.condition} onValueChange={(v) => update('condition', v)}>
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue placeholder="Any Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Condition</SelectItem>
            {CONDITION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Purpose */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Listing Type
        </Label>
        <Select
          value={filters.listingPurpose}
          onValueChange={(v) => update('listingPurpose', v)}
        >
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {PURPOSE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Location
        </Label>
        <Select value={filters.state} onValueChange={(v) => update('state', v)}>
          <SelectTrigger className="h-10 rounded-lg">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent className="max-h-[250px]">
            <SelectItem value="all">All States</SelectItem>
            {NIGERIA_STATES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ToolFilters({
  filters,
  onFiltersChange,
  totalResults,
}: ToolFiltersProps) {
  const { data } = useCategoriesByType('TOOL');
  const categories = data?.data || [];
  const grouped = data?.grouped || null;

  const activeFilterCount = [
    filters.categoryId,
    filters.condition,
    filters.listingPurpose,
    filters.state,
  ].filter((v) => v && v !== 'all').length;

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      categoryId: '',
      condition: '',
      listingPurpose: '',
      state: '',
      sortBy: 'newest',
      sortOrder: 'desc',
    });
  };

  const updateSort = (value: string) => {
    const map: Record<string, { sortBy: string; sortOrder: string }> = {
      newest: { sortBy: 'createdAt', sortOrder: 'desc' },
      oldest: { sortBy: 'createdAt', sortOrder: 'asc' },
      price_low: { sortBy: 'price', sortOrder: 'asc' },
      price_high: { sortBy: 'price', sortOrder: 'desc' },
      popular: { sortBy: 'viewCount', sortOrder: 'desc' },
    };
    const sort = map[value] || map.newest;
    onFiltersChange({ ...filters, ...sort });
  };

  return (
    <div className="space-y-4">
      {/* Search + Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="h-11 pl-10 rounded-lg"
          />
          {filters.search && (
            <button
              onClick={() => onFiltersChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select
          value={
            filters.sortBy === 'price'
              ? filters.sortOrder === 'asc'
                ? 'price_low'
                : 'price_high'
              : filters.sortBy === 'viewCount'
                ? 'popular'
                : filters.sortOrder === 'asc'
                  ? 'oldest'
                  : 'newest'
          }
          onValueChange={updateSort}
        >
          <SelectTrigger className="h-11 w-full sm:w-[180px] rounded-lg">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-11 rounded-lg gap-2 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent
                filters={filters}
                onFiltersChange={onFiltersChange}
                categories={categories}
                grouped={grouped}
              />
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="mt-4 gap-1 text-muted-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar Filters (rendered in page layout) */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Filters</h3>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs gap-1 text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          )}
        </div>
        <FilterContent
          filters={filters}
          onFiltersChange={onFiltersChange}
          categories={categories}
          grouped={grouped}
        />
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 lg:hidden">
          {filters.condition && filters.condition !== 'all' && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {CONDITION_OPTIONS.find((o) => o.value === filters.condition)?.label}
              <button onClick={() => onFiltersChange({ ...filters, condition: '' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.listingPurpose && filters.listingPurpose !== 'all' && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {PURPOSE_OPTIONS.find((o) => o.value === filters.listingPurpose)?.label}
              <button onClick={() => onFiltersChange({ ...filters, listingPurpose: '' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.state && filters.state !== 'all' && (
            <Badge variant="secondary" className="gap-1 text-xs">
              {filters.state}
              <button onClick={() => onFiltersChange({ ...filters, state: '' })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results count */}
      {totalResults !== undefined && (
        <p className="text-sm text-muted-foreground">
          {totalResults} tool{totalResults !== 1 ? 's' : ''} found
        </p>
      )}
    </div>
  );
}