'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { useCategories } from '@/hooks/use-categories';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { PriceDisplay } from '@/components/shared/price-display';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Package, SlidersHorizontal } from 'lucide-react';

export default function ProductsPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pricingType, setPricingType] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data: categoriesData } = useCategories('PRODUCT_AGRICULTURAL');
  const { data, isLoading } = useProducts({
    page,
    limit: 12,
    search: debouncedSearch || undefined,
    categoryId: categoryId || undefined,
    pricingType: pricingType || undefined,
  });

  return (
    <div className="container-custom py-10">
      <PageHeader
        title="Products"
        description="Quality products from our farmers and artisans"
        badge={<span className="badge-premium text-[10px]">{data?.meta?.total || 0} Products</span>}
      />

      <div className="card-premium p-5 mb-8">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
          <SlidersHorizontal className="h-4 w-4" />
          Filter Products
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-lg" />
          </div>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categoriesData?.data?.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={pricingType} onValueChange={setPricingType}>
            <SelectTrigger className="h-11 rounded-lg"><SelectValue placeholder="All Pricing" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Pricing</SelectItem>
              <SelectItem value="FIXED">Fixed Price</SelectItem>
              <SelectItem value="NEGOTIABLE">Negotiable</SelectItem>
              <SelectItem value="BOTH">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading products..." className="py-24" />
      ) : data?.data?.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="Try adjusting your filters" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((product: any, idx: number) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="card-premium h-full overflow-hidden animate-fade-up" style={{ animationDelay: `${(idx % 4) * 0.05}s` }}>
                  <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                    {product.images?.[0]?.thumbnailUrl ? (
                      <img src={product.images[0].thumbnailUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <Package className="h-12 w-12 text-muted-foreground/20" />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{product.category?.name}</p>
                    <h3 className="font-semibold mt-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">by {product.member?.user?.fullName}</p>
                    <div className="mt-3">
                      <PriceDisplay pricingType={product.pricingType} amount={product.priceAmount ? Number(product.priceAmount) : null} displayText={product.priceDisplayText} className="text-sm font-bold text-primary" showBadge />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {data?.meta && <PaginationControls meta={data.meta} onPageChange={setPage} />}
        </>
      )}
    </div>
  );
}