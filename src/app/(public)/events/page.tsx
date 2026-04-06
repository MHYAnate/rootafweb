'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events.api';
import { usePagination } from '@/hooks/use-pagination';
import { PageHeader } from '@/components/shared/page-header';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EVENT_TYPE_MAP, EVENT_STATUS_MAP } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { Calendar, MapPin, Clock, Globe, Users } from 'lucide-react';
import Link from 'next/link';

type EventFilter = 'all' | 'upcoming' | 'past';

export default function EventsPage() {
  const { page, setPage } = usePagination();
  const [filter, setFilter] = useState<EventFilter>('all');

  const queryFn = () => {
    const params = { page, limit: 9 };
    if (filter === 'upcoming') return eventsApi.getUpcoming(params);
    if (filter === 'past') return eventsApi.getPast(params);
    return eventsApi.getAll(params);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['events', filter, page],
    queryFn,
  });

  const events = data?.data || [];

  const getStatusBadge = (status: string) => {
    const config = EVENT_STATUS_MAP[status];
    if (!config) return <Badge variant="outline">{status}</Badge>;
    return (
      <span className={`rounded-lg px-2 py-0.5 text-[10px] font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="container-custom py-10">
      <PageHeader
        title="Events"
        description="Stay updated with our upcoming and past events"
      />

      <div className="mb-8">
        <Tabs
          value={filter}
          onValueChange={(v) => {
            setFilter(v as EventFilter);
            setPage(1);
          }}
        >
          <TabsList className="rounded-xl">
            <TabsTrigger value="all" className="rounded-lg">
              All Events
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-lg">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg">
              Past Events
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" className="py-24" />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={
            filter === 'upcoming'
              ? 'No upcoming events'
              : filter === 'past'
                ? 'No past events'
                : 'No events found'
          }
          description={
            filter === 'upcoming'
              ? 'Check back later for new events'
              : 'There are no events to display at the moment'
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event: any, idx: number) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card
                  className="card-premium h-full overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${(idx % 3) * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="aspect-[16/9] overflow-hidden bg-muted/30">
                    {event.featuredImageThumbnail || event.featuredImageUrl ? (
                      <img
                        src={event.featuredImageThumbnail || event.featuredImageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Calendar className="h-12 w-12 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    {/* Badges */}
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {getStatusBadge(event.status)}
                      <Badge variant="outline" className="rounded-lg text-[10px]">
                        {EVENT_TYPE_MAP[event.eventType] ||
                          event.eventType?.replace(/_/g, ' ')}
                      </Badge>
                      {event.isFeatured && (
                        <Badge className="rounded-lg bg-amber-500 text-[10px]">
                          Featured
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-heading font-semibold line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Short description */}
                    {event.shortDescription && (
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                        {event.shortDescription}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{formatDate(event.startDate)}</span>
                        {event.endDate &&
                          event.endDate !== event.startDate && (
                            <span className="text-muted-foreground/60">
                              — {formatDate(event.endDate)}
                            </span>
                          )}
                      </div>

                      {event.startTime && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>
                            {event.startTime}
                            {event.endTime ? ` – ${event.endTime}` : ''}
                          </span>
                        </div>
                      )}

                      {event.venueName && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">
                            {event.venueName}
                            {event.state ? `, ${event.state}` : ''}
                          </span>
                        </div>
                      )}

                      {event.isVirtualEvent && (
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>Virtual Event</span>
                        </div>
                      )}

                      {event.attendanceCount && event.status === 'COMPLETED' && (
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 flex-shrink-0" />
                          <span>{event.attendanceCount} attendees</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {data?.meta && (
            <PaginationControls meta={data.meta} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}