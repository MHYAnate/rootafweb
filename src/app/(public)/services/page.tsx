'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useServices } from '@/hooks/use-services';
import { usePagination } from '@/hooks/use-pagination';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { PriceDisplay } from '@/components/shared/price-display';
import { RatingStars } from '@/components/shared/rating-stars';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Wrench, MapPin, SlidersHorizontal } from 'lucide-react';

export default function ServicesPage() {
  const { page, setPage } = usePagination();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useServices({
    page, limit: 12, search: debouncedSearch || undefined,
  });

  return (
    <div className="container-custom py-10">
      <PageHeader title="Services" description="Professional services from our skilled members" />

      <div className="card-premium p-5 mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search services..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-lg" />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Loading services..." className="py-24" />
      ) : data?.data?.length === 0 ? (
        <EmptyState icon={Wrench} title="No services found" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((service: any, idx: number) => (
              <Link key={service.id} href={`/services/${service.id}`}>
                <Card className="card-premium h-full overflow-hidden animate-fade-up" style={{ animationDelay: `${(idx % 3) * 0.05}s` }}>
                  <div className="aspect-[16/9] bg-muted/30 flex items-center justify-center overflow-hidden">
                    {service.images?.[0]?.thumbnailUrl ? (
                      <img src={service.images[0].thumbnailUrl} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <Wrench className="h-12 w-12 text-muted-foreground/20" />
                    )}
                  </div>
                  <CardContent className="p-5">
                    <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">{service.category?.name}</p>
                    <h3 className="font-semibold mt-1 line-clamp-1">{service.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.shortDescription || service.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                      <PriceDisplay pricingType={service.pricingType} amount={service.startingPrice ? Number(service.startingPrice) : null} displayText={service.priceDisplayText} className="text-sm font-bold text-primary" />
                      <RatingStars rating={Number(service.averageRating)} size="sm" />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <MapPin className="h-3 w-3" />
                      {service.member?.user?.fullName}
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