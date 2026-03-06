// // // src/app/(dashboard)/tools/page.tsx
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
//               icon={<Wrench className="h-12 w-12" /> as any}
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

// src/app/(dashboard)/my-tools/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMyTools, useDeleteTool } from '@/hooks/use-tools';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { ToolStatsBar } from '@/components/tools/tool-stats-bar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Wrench,
  MapPin,
  Package,
  MoreVertical,
  Search,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const conditionColors: Record<string, string> = {
  NEW: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  FAIRLY_USED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  USED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  REFURBISHED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

const purposeConfig: Record<string, { label: string; className: string }> = {
  SALE: { label: 'Sale', className: 'bg-green-100 text-green-800' },
  LEASE: { label: 'Lease', className: 'bg-sky-100 text-sky-800' },
  BOTH: { label: 'Sale & Lease', className: 'bg-violet-100 text-violet-800' },
};

function formatPrice(amount: number | null | undefined) {
  if (!amount) return '—';
  return `₦${Number(amount).toLocaleString()}`;
}

export default function MyToolsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data, isLoading } = useMyTools({ page, limit: 12 });
  const { mutate: deleteTool, isPending: isDeleting } = useDeleteTool();

  const allTools = data?.data || [];
  const meta = data?.meta;

  // Client-side filtering for quick search
  const tools = useMemo(() => {
    let filtered = allTools;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t: any) =>
          t.name?.toLowerCase().includes(q) ||
          t.category?.name?.toLowerCase().includes(q),
      );
    }
    if (statusFilter === 'active') {
      filtered = filtered.filter((t: any) => t.isActive);
    } else if (statusFilter === 'sale') {
      filtered = filtered.filter(
        (t: any) => t.listingPurpose === 'SALE' || t.listingPurpose === 'BOTH',
      );
    } else if (statusFilter === 'lease') {
      filtered = filtered.filter(
        (t: any) => t.listingPurpose === 'LEASE' || t.listingPurpose === 'BOTH',
      );
    }
    return filtered;
  }, [allTools, search, statusFilter]);

  // Compute stats
  const stats = useMemo(
    () => ({
      total: allTools.length,
      active: allTools.filter((t: any) => t.isActive).length,
      totalViews: allTools.reduce((sum: number, t: any) => sum + (t.viewCount || 0), 0),
      forSale: allTools.filter(
        (t: any) => t.listingPurpose === 'SALE' || t.listingPurpose === 'BOTH',
      ).length,
      forLease: allTools.filter(
        (t: any) => t.listingPurpose === 'LEASE' || t.listingPurpose === 'BOTH',
      ).length,
    }),
    [allTools],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="My Tools" description="Manage your tool listings" />
        <Link href="/my-tools/new">
          <Button className="btn-premium rounded-xl gap-2">
            <Plus className="h-4 w-4" />
            List New Tool
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : allTools.length === 0 ? (
        <EmptyState
          icon={<Wrench className="h-12 w-12" /> as any}
          title="No tools listed yet"
          description="List your first tool to start selling or leasing to the community"
          action={
            <Link href="/my-tools/new">
              <Button className="btn-premium rounded-xl gap-2">
                <Plus className="h-4 w-4" />
                List Your First Tool
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Stats */}
          <ToolStatsBar stats={stats} />

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-10 rounded-lg"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-full sm:w-[150px] rounded-lg">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="lease">For Lease</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tools Grid */}
          {tools.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No tools match your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((tool: any) => {
                const primaryImage = tool.images?.[0];
                const purpose = purposeConfig[tool.listingPurpose] || purposeConfig.SALE;

                return (
                  <Card key={tool.id} className="card-premium overflow-hidden group">
                    {/* Image */}
                    <div className="relative h-44 bg-muted">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.imageUrl || primaryImage.thumbnailUrl}
                          alt={tool.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Wrench className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 flex gap-1.5">
                        <Badge className={conditionColors[tool.condition] || ''}>
                          {tool.condition?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className={purpose.className}>{purpose.label}</Badge>
                      </div>

                      {!tool.isActive && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive">Inactive</Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm line-clamp-1">{tool.name}</h3>
                          {tool.category && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {tool.category.name}
                            </p>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/tools/${tool.id}`} className="gap-2">
                                <ExternalLink className="h-3.5 w-3.5" /> View Listing
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/my-tools/${tool.id}/edit`} className="gap-2">
                                <Edit className="h-3.5 w-3.5" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="gap-2 text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Tool</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &quot;{tool.name}&quot;?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteTool(tool.id)}
                                    disabled={isDeleting}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        {tool.salePrice && (
                          <span className="text-base font-bold text-primary">
                            {formatPrice(tool.salePrice)}
                          </span>
                        )}
                        {tool.leaseRate && (
                          <span className="text-xs text-muted-foreground">
                            {formatPrice(tool.leaseRate)}/
                            {tool.leaseRatePeriod?.toLowerCase() || 'day'}
                          </span>
                        )}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" /> {tool.viewCount || 0}
                          </span>
                          {tool.quantityAvailable > 1 && (
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" /> {tool.quantityAvailable}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <Link href={`/tools/${tool.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Link href={`/my-tools/${tool.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}