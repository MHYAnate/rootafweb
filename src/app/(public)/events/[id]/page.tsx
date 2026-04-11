'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events.api';
import { BackButton } from '@/components/shared/back-button';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ErrorDisplay } from '@/components/shared/error-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EVENT_TYPE_MAP, EVENT_STATUS_MAP } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Users,
  Video,
  Globe,
  Coffee,
  User,
  Star,
  BookOpen,
  Newspaper,
  ListOrdered,
  Image as ImageIcon,
  Tag,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// LIGHTBOX COMPONENT
// ═══════════════════════════════════════════════════════════

interface LightboxProps {
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function GalleryLightbox({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const currentImage = images[currentIndex];
  const hasNext = currentIndex < images.length - 1;
  const hasPrev = currentIndex > 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrev) onNavigate(currentIndex - 1);
          break;
        case 'ArrowRight':
          if (hasNext) onNavigate(currentIndex + 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex, hasNext, hasPrev, onClose, onNavigate]);

  // Touch/swipe handling
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && hasNext) {
      onNavigate(currentIndex + 1);
    }
    if (isRightSwipe && hasPrev) {
      onNavigate(currentIndex - 1);
    }
  };

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [currentIndex, hasNext, onNavigate]);

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [currentIndex, hasPrev, onNavigate]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = currentImage.imageUrl;
    link.download = currentImage.originalFileName || `image-${currentIndex + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-50 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Top toolbar */}
      <div className="absolute left-4 top-4 z-50 flex items-center gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white">
          {currentIndex + 1} / {images.length}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={downloadImage}
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>

      {/* Previous button */}
      {hasPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
          onClick={goPrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {/* Next button */}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-30"
          onClick={goNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {/* Main image */}
      <div
        className={`relative flex max-h-[85vh] max-w-[90vw] items-center justify-center transition-transform duration-300 ${
          isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsZoomed(!isZoomed);
        }}
      >
        <img
          src={currentImage.imageUrl}
          alt={currentImage.altText || currentImage.caption || ''}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
          draggable={false}
        />
      </div>

      {/* Bottom info bar */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          {currentImage.caption && (
            <p className="text-base text-white">{currentImage.caption}</p>
          )}
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-white/70">
            {currentImage.photographer && (
              <span>📷 {currentImage.photographer}</span>
            )}
            {currentImage.takenAt && (
              <span>📅 {formatDate(currentImage.takenAt)}</span>
            )}
          </div>
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((img: any, idx: number) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(idx);
                }}
                className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg transition-all ${
                  idx === currentIndex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={img.thumbnailUrl || img.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════

export default function EventDetailPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsApi.getById(id as string),
    enabled: !!id,
  });

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  if (isLoading) return <LoadingSpinner size="lg" className="py-24" />;
  if (error || !data?.data) return <ErrorDisplay message="Event not found" />;

  const event = data.data;
  const statusCfg = EVENT_STATUS_MAP[event.status];

  const agenda = event.agenda
    ? [...event.agenda].sort(
        (a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      )
    : [];

  const gallery = event.gallery
    ? [...event.gallery].sort(
        (a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      )
    : [];

  const hasPostEvent =
    event.eventSummary ||
    event.keyOutcomes ||
    event.notableAttendees ||
    event.lessonsLearned ||
    event.attendanceCount;

  return (
    <div className="container-custom py-10">
      <BackButton label="Back to Events" href="/events" />

      {/* Banner */}
      {event.bannerImageUrl && (
        <div className="mb-8 aspect-[3/1] overflow-hidden rounded-2xl">
          <img
            src={event.bannerImageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* ═══ Main ═══ */}
        <div className="space-y-6 lg:col-span-2">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {statusCfg && (
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusCfg.color}`}
                >
                  {statusCfg.label}
                </span>
              )}
              <Badge variant="outline" className="rounded-lg">
                {EVENT_TYPE_MAP[event.eventType] ||
                  event.eventType?.replace(/_/g, ' ')}
              </Badge>
              {event.isFeatured && (
                <Badge className="rounded-lg bg-amber-500">
                  <Star className="mr-0.5 h-3 w-3" />
                  Featured
                </Badge>
              )}
              {event.isVirtualEvent && (
                <Badge variant="outline" className="rounded-lg">
                  <Globe className="mr-0.5 h-3 w-3" />
                  Virtual
                </Badge>
              )}
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              {event.title}
            </h1>
            {event.shortDescription && (
              <p className="mt-2 text-lg text-muted-foreground">
                {event.shortDescription}
              </p>
            )}
          </div>

          {/* Featured image fallback */}
          {!event.bannerImageUrl && event.featuredImageUrl && (
            <div className="overflow-hidden rounded-2xl">
              <img
                src={event.featuredImageUrl}
                alt={event.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          <Card className="card-premium rounded-2xl">
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Agenda */}
          {agenda.length > 0 && (
            <Card className="card-premium rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListOrdered className="h-5 w-5 text-primary" />
                  Agenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {agenda.map((item: any) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-4 ${
                      item.isBreak
                        ? 'border border-amber-100 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 text-center">
                        <div
                          className={`rounded-lg px-3 py-1.5 ${
                            item.isBreak
                              ? 'bg-amber-100 dark:bg-amber-900/30'
                              : 'bg-primary/10'
                          }`}
                        >
                          {item.isBreak ? (
                            <Coffee className="mx-auto mb-0.5 h-3.5 w-3.5 text-amber-600" />
                          ) : (
                            <Clock className="mx-auto mb-0.5 h-3.5 w-3.5 text-primary" />
                          )}
                          {item.startTime && (
                            <p
                              className={`text-xs font-semibold ${
                                item.isBreak
                                  ? 'text-amber-700'
                                  : 'text-primary'
                              }`}
                            >
                              {item.startTime}
                            </p>
                          )}
                          {item.endTime && (
                            <p className="text-[10px] text-muted-foreground">
                              – {item.endTime}
                            </p>
                          )}
                          {item.duration && (
                            <p className="text-[10px] text-muted-foreground">
                              {item.duration}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{item.title}</p>
                          {item.isBreak && (
                            <Badge
                              variant="outline"
                              className="border-amber-300 text-[10px] text-amber-600"
                            >
                              Break
                            </Badge>
                          )}
                        </div>
                        {(item.speakerName || item.speakerTitle) && (
                          <div className="mt-2 flex items-center gap-2">
                            {item.speakerPhoto ? (
                              <img
                                src={item.speakerPhoto}
                                alt={item.speakerName}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : item.speakerName ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                            ) : null}
                            <div>
                              {item.speakerName && (
                                <p className="text-sm font-medium">
                                  {item.speakerName}
                                </p>
                              )}
                              {item.speakerTitle && (
                                <p className="text-xs text-muted-foreground">
                                  {item.speakerTitle}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {item.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                        {item.location && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Gallery with Lightbox */}
          {gallery.length > 0 && (
            <Card className="card-premium rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  Gallery
                  <span className="ml-auto text-sm font-normal text-muted-foreground">
                    {gallery.length} photo{gallery.length !== 1 ? 's' : ''}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {gallery.map((img: any, index: number) => (
                    <button
                      key={img.id}
                      onClick={() => openLightbox(index)}
                      className="group relative aspect-square overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <img
                        src={
                          img.mediumUrl || img.thumbnailUrl || img.imageUrl
                        }
                        alt={img.altText || img.caption || ''}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      {img.isFeatured && (
                        <div className="absolute left-2 top-2">
                          <Badge className="bg-amber-500 text-[10px]">
                            <Star className="mr-0.5 h-2.5 w-2.5" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      {(img.caption || img.photographer) && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6">
                          {img.caption && (
                            <p className="line-clamp-2 text-xs text-white">
                              {img.caption}
                            </p>
                          )}
                          {img.photographer && (
                            <p className="text-[10px] text-white/70">
                              📷 {img.photographer}
                            </p>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Post-Event */}
          {event.status === 'COMPLETED' && hasPostEvent && (
            <Card className="card-gold rounded-2xl">
              <CardHeader>
                <CardTitle>Event Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.attendanceCount && (
                  <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold">
                      {event.attendanceCount.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      attendees
                    </span>
                  </div>
                )}
                {event.eventSummary && (
                  <div>
                    <h4 className="mb-1.5 text-sm font-semibold">Summary</h4>
                    <p className="whitespace-pre-line text-sm text-muted-foreground">
                      {event.eventSummary}
                    </p>
                  </div>
                )}
                {event.keyOutcomes && (
                  <div>
                    <h4 className="mb-1.5 text-sm font-semibold">
                      Key Outcomes
                    </h4>
                    <p className="whitespace-pre-line text-sm text-muted-foreground">
                      {event.keyOutcomes}
                    </p>
                  </div>
                )}
                {event.notableAttendees && (
                  <div>
                    <h4 className="mb-1.5 text-sm font-semibold">
                      Notable Attendees
                    </h4>
                    <p className="whitespace-pre-line text-sm text-muted-foreground">
                      {event.notableAttendees}
                    </p>
                  </div>
                )}
                {event.lessonsLearned && (
                  <div>
                    <h4 className="mb-1.5 text-sm font-semibold">
                      Lessons Learned
                    </h4>
                    <p className="whitespace-pre-line text-sm text-muted-foreground">
                      {event.lessonsLearned}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* ═══ Sidebar ═══ */}
        <div className="space-y-6">
          <Card className="card-gold sticky top-24 rounded-2xl">
            <CardContent className="space-y-5 p-5">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">
                      {formatDate(event.startDate)}
                    </p>
                    {event.endDate &&
                      event.endDate !== event.startDate && (
                        <p className="text-muted-foreground">
                          to {formatDate(event.endDate)}
                        </p>
                      )}
                  </div>
                </div>
                {event.startTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span>
                      {event.startTime}
                      {event.endTime ? ` – ${event.endTime}` : ''}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{event.venueName}</p>
                    {event.venueAddress && (
                      <p className="text-xs text-muted-foreground">
                        {event.venueAddress}
                      </p>
                    )}
                    {(event.cityLga || event.state) && (
                      <p className="text-xs text-muted-foreground">
                        {[event.cityLga, event.state]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                {event.isVirtualEvent && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 flex-shrink-0 text-primary" />
                    <div>
                      <span className="font-medium">Virtual Event</span>
                      {event.virtualEventPlatform && (
                        <p className="text-xs capitalize text-muted-foreground">
                          {event.virtualEventPlatform.replace(/_/g, ' ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-premium flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm"
                  >
                    Register Now <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {event.virtualEventLink && event.isVirtualEvent && (
                  <a
                    href={event.virtualEventLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-sm font-medium text-primary hover:bg-primary/10"
                  >
                    <Globe className="h-4 w-4" />
                    Join Virtual Event
                  </a>
                )}
                {event.videoLink && (
                  <a
                    href={event.videoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Video className="h-4 w-4" />
                    Watch Video
                  </a>
                )}
                {event.newsLink && (
                  <a
                    href={event.newsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Newspaper className="h-4 w-4" />
                    News Coverage
                  </a>
                )}
                {event.reportDocumentLink && (
                  <a
                    href={event.reportDocumentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    <BookOpen className="h-4 w-4" />
                    View Report
                  </a>
                )}
              </div>

              {event.tags?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.map((tag: string, i: number) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="rounded-lg text-[10px]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {event.viewCount > 0 && (
                <>
                  <Separator />
                  <p className="text-center text-xs text-muted-foreground">
                    {event.viewCount.toLocaleString()} views
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightboxOpen && gallery.length > 0 && (
        <GalleryLightbox
          images={gallery}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}