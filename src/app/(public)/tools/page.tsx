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
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTools } from '@/hooks/use-tools';
import { ToolCard } from '@/components/tools/tool-card';
import { ToolFilters, ToolFilterValues } from '@/components/tools/tool-filter';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LayoutGrid, List, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';

export default function ToolsMarketplacePage() {
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      categoryId: filters.categoryId && filters.categoryId !== 'all' ? filters.categoryId : undefined,
      condition: filters.condition && filters.condition !== 'all' ? filters.condition : undefined,
      listingPurpose:
        filters.listingPurpose && filters.listingPurpose !== 'all'
          ? filters.listingPurpose
          : undefined,
      state: filters.state && filters.state !== 'all' ? filters.state : undefined,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader
          title="Tools Marketplace"
          description="Browse farming and artisan tools available for sale and lease"
        />
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Layout: Sidebar + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Card className="card-premium p-4 sticky top-24">
            <ToolFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              totalResults={meta?.total}
            />
          </Card>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Mobile Filters */}
          <div className="lg:hidden">
            <ToolFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              totalResults={meta?.total}
            />
          </div>

          {/* Results */}
          {isLoading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : tools.length === 0 ? (
            <EmptyState
              icon={<Wrench className="h-12 w-12" /> as any}
              title="No tools found"
              description="Try adjusting your filters or search terms"
              action={
                <Button
                  variant="outline"
                  onClick={() =>
                    handleFiltersChange({
                      search: '',
                      categoryId: '',
                      condition: '',
                      listingPurpose: '',
                      state: '',
                      sortBy: 'createdAt',
                      sortOrder: 'desc',
                    })
                  }
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <>
              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                    : 'space-y-4',
                )}
              >
                {tools.map((tool: any) => (
                  <ToolCard key={tool.id} tool={tool} variant={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
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
                          variant={page === pageNum ? 'default' : 'ghost'}
                          size="icon"
                          className="h-8 w-8 text-sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}