'use client';

import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events.api';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  const { page, setPage } = usePagination();
  const { data, isLoading } = useQuery({
    queryKey: ['events', page],
    queryFn: () => eventsApi.getAll({ page, limit: 9, isPublished: true }),
  });

  return (
    <div className="container-custom py-10">
      <PageHeader title="Events" description="Stay updated with our upcoming and past events" />

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-24" />
      ) : data?.data?.length === 0 ? (
        <EmptyState icon={Calendar} title="No events found" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((event: any, idx: number) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="card-premium h-full overflow-hidden animate-fade-up" style={{ animationDelay: `${(idx % 3) * 0.05}s` }}>
                  <div className="aspect-[16/9] bg-muted/30 overflow-hidden">
                    {event.featuredImageUrl ? (
                      <img src={event.featuredImageUrl} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><Calendar className="h-12 w-12 text-muted-foreground/20" /></div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="rounded-lg text-[10px]">{event.status}</Badge>
                      <Badge variant="outline" className="rounded-lg text-[10px]">{event.eventType?.replace(/_/g, ' ')}</Badge>
                    </div>
                    <h3 className="font-semibold line-clamp-2">{event.title}</h3>
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(event.startDate)}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.venueName}</div>
                      {event.startTime && <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{event.startTime}</div>}
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