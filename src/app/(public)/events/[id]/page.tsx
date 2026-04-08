'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events.api';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { Calendar, MapPin, Clock, ExternalLink, Users, Video } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id as string),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
  if (error || !data?.data) return <ErrorDisplay message="Event not found" />;

  const event = data.data;

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Events" href="/events" />

      {event.bannerImageUrl && (
        <div className="aspect-[3/1] rounded-2xl overflow-hidden mb-8">
          <img src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="rounded-lg">{event.status}</Badge>
              <Badge variant="outline" className="rounded-lg">{event.eventType?.replace(/_/g, ' ')}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
          </div>

          <Card className="card-premium">
            <CardHeader><CardTitle>About This Event</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </CardContent>
          </Card>

          {event.agenda?.length > 0 && (
            <Card className="card-premium">
              <CardHeader><CardTitle>Agenda</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {event.agenda.map((item: any) => (
                  <div key={item.id} className={`p-4 rounded-xl ${item.isBreak ? 'bg-amber-50 border border-amber-100' : 'bg-muted/30'}`}>
                    {item.startTime && <p className="text-xs font-semibold text-primary">{item.startTime}{item.endTime ? ` - ${item.endTime}` : ''}</p>}
                    <p className="font-semibold mt-1">{item.title}</p>
                    {item.speakerName && <p className="text-sm text-muted-foreground mt-1">Speaker: {item.speakerName}</p>}
                    {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {event.gallery?.length > 0 && (
            <Card className="card-premium">
              <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {event.gallery.map((img: any) => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden">
                      <img src={img.thumbnailUrl || img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {event.eventSummary && (
            <Card className="card-gold">
              <CardHeader><CardTitle>Event Summary</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{event.eventSummary}</p>
                {event.attendanceCount && <p className="text-sm mt-2"><Users className="h-4 w-4 inline mr-1" />{event.attendanceCount} attendees</p>}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="card-gold sticky top-24">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{formatDate(event.startDate)}</p>
                    {event.endDate && event.endDate !== event.startDate && <p className="text-muted-foreground">to {formatDate(event.endDate)}</p>}
                  </div>
                </div>
                {event.startTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ''}</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{event.venueName}</p>
                    {event.venueAddress && <p className="text-muted-foreground text-xs">{event.venueAddress}</p>}
                  </div>
                </div>
              </div>

              {event.registrationLink && (
                <a href={event.registrationLink} target="_blank" rel="noreferrer" className="btn-premium rounded-xl w-full flex items-center justify-center gap-2 py-2.5 text-sm">
                  Register Now <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {event.videoLink && (
                <a href={event.videoLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm text-primary hover:underline">
                  <Video className="h-4 w-4" />Watch Video
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}