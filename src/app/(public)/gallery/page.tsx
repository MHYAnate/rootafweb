'use client';

import { useState, useMemo } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { eventsApi } from '@/lib/api/events.api';
import { aboutApi } from '@/lib/api/about.api';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { EmptyState } from '@/components/shared/empty-state';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import {
  Image as ImageIcon,
  Users,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Download,
  Star,
  Crown,
  Shield,
  Award,
  Camera,
  Sparkles,
  Filter,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ─── Animation Variants ─── */
const cubicEase = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: cubicEase },
  }),
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.06, ease: cubicEase },
  }),
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface GalleryImage {
  id: string;
  imageUrl: string;
  thumbnailUrl: string | null;
  mediumUrl: string | null;
  caption: string | null;
  altText: string | null;
  photographer: string | null;
  takenAt: string | null;
  originalFileName: string | null;
  isFeatured: boolean;
  displayOrder: number;
  eventTitle?: string;
  eventId?: string;
}

// ═══════════════════════════════════════════════════════════
// MOSAIC PATTERN HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Generates a repeating mosaic pattern of CSS grid spans.
 * Each "tile" gets a { colSpan, rowSpan } indicating how many
 * grid columns/rows it should occupy.
 *
 * Pattern repeats every 8 images:
 *   0: 2×2  (hero)
 *   1: 1×1
 *   2: 1×1
 *   3: 1×2  (tall)
 *   4: 1×1
 *   5: 2×1  (wide)
 *   6: 1×1
 *   7: 1×1
 */
function getMosaicSpan(index: number): { colSpan: number; rowSpan: number } {
  const patterns = [
    { colSpan: 2, rowSpan: 2 }, // hero
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 2 }, // tall
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 2, rowSpan: 1 }, // wide
    { colSpan: 1, rowSpan: 1 },
    { colSpan: 1, rowSpan: 1 },
  ];
  return patterns[index % patterns.length];
}

// ═══════════════════════════════════════════════════════════
// LIGHTBOX COMPONENT
// ═══════════════════════════════════════════════════════════

interface LightboxProps {
  images: GalleryImage[];
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
  useState(() => {
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
  });

  const minSwipeDistance = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && hasNext) onNavigate(currentIndex + 1);
    if (distance < -minSwipeDistance && hasPrev) onNavigate(currentIndex - 1);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = currentImage.imageUrl;
    link.download = currentImage.originalFileName || `gallery-${currentIndex + 1}.jpg`;
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
      {/* Close */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-50 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>

      {/* Toolbar */}
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

      {/* Nav */}
      {hasPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={() => onNavigate(currentIndex - 1)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      {hasNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 z-50 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={() => onNavigate(currentIndex + 1)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {/* Main image */}
      <div
        className={cn(
          'relative flex max-h-[85vh] max-w-[90vw] items-center justify-center transition-transform duration-300',
          isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in',
        )}
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

      {/* Bottom info */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          {currentImage.eventTitle && (
            <p className="text-xs text-amber-400/80 font-medium mb-1 uppercase tracking-wider">
              {currentImage.eventTitle}
            </p>
          )}
          {currentImage.caption && (
            <p className="text-base text-white">{currentImage.caption}</p>
          )}
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-white/70">
            {currentImage.photographer && <span>📷 {currentImage.photographer}</span>}
            {currentImage.takenAt && <span>📅 {formatDate(currentImage.takenAt)}</span>}
          </div>
        </div>

        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(idx);
                }}
                className={cn(
                  'relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg transition-all',
                  idx === currentIndex
                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black'
                    : 'opacity-50 hover:opacity-80',
                )}
              >
                <img src={img.thumbnailUrl || img.imageUrl} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MOSAIC TILE COMPONENT
// ═══════════════════════════════════════════════════════════

function MosaicTile({
  img,
  index,
  onClick,
}: {
  img: GalleryImage;
  index: number;
  onClick: () => void;
}) {
  const { colSpan, rowSpan } = getMosaicSpan(index);

  const isLarge = colSpan === 2 && rowSpan === 2;
  const isWide = colSpan === 2 && rowSpan === 1;
  const isTall = colSpan === 1 && rowSpan === 2;

  return (
    <motion.div
      variants={scaleIn}
      custom={index}
      className={cn('relative')}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
      }}
    >
      <button
        onClick={onClick}
        className="group relative w-full h-full min-h-0 overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 block"
      >
        <img
          src={img.mediumUrl || img.thumbnailUrl || img.imageUrl}
          alt={img.altText || img.caption || ''}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Permanent subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />

        {/* Zoom icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-white/0 group-hover:bg-white/20 backdrop-blur-none group-hover:backdrop-blur-sm flex items-center justify-center transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
            <ZoomIn className={cn('text-white', isLarge ? 'h-7 w-7' : 'h-5 w-5')} />
          </div>
        </div>

        {/* Featured badge */}
        {img.isFeatured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-amber-500/90 backdrop-blur-sm text-[9px] shadow-lg border-0">
              <Star className="mr-0.5 h-2.5 w-2.5" />
              Featured
            </Badge>
          </div>
        )}

        {/* Bottom info — always visible on large tiles, hover on small */}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 p-3 md:p-4 transition-all duration-500 z-10',
            isLarge || isWide || isTall
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
          )}
        >
          {img.eventTitle && (
            <p
              className={cn(
                'text-amber-400 font-bold uppercase tracking-wider line-clamp-1',
                isLarge ? 'text-[11px] mb-1' : 'text-[9px] mb-0.5',
              )}
            >
              {img.eventTitle}
            </p>
          )}
          {img.caption && (
            <p
              className={cn(
                'text-white font-medium',
                isLarge ? 'text-sm line-clamp-2' : 'text-xs line-clamp-1',
              )}
            >
              {img.caption}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1">
            {img.photographer && (
              <span
                className={cn(
                  'text-white/70 flex items-center gap-1',
                  isLarge ? 'text-xs' : 'text-[10px]',
                )}
              >
                <Camera className="h-2.5 w-2.5" />
                {img.photographer}
              </span>
            )}
            {img.takenAt && (
              <span
                className={cn(
                  'text-white/70 flex items-center gap-1',
                  isLarge ? 'text-xs' : 'text-[10px]',
                )}
              >
                <Calendar className="h-2.5 w-2.5" />
                {formatDate(img.takenAt)}
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN GALLERY PAGE
// ═══════════════════════════════════════════════════════════

type GalleryTab = 'events' | 'leadership';

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<GalleryTab>('events');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ─── Step 1: Fetch events list ───
  const { data: eventsListData, isLoading: eventsListLoading } = useQuery({
    queryKey: ['events-list-for-gallery'],
    queryFn: () => eventsApi.getAll({ page: 1, limit: 100 }),
    staleTime: 1000 * 60 * 5,
  });

  const eventsList: any[] = eventsListData?.data || [];

  const eventIds = useMemo(
    () =>
      eventsList
        .filter((e: any) => e.gallery && e.gallery.length > 0)
        .map((e: any) => e.id),
    [eventsList],
  );

  // ─── Step 2: Fetch full details per event ───
  const eventDetailQueries = useQueries({
    queries: eventIds.map((id: string) => ({
      queryKey: ['event-detail-gallery', id],
      queryFn: () => eventsApi.getById(id),
      staleTime: 1000 * 60 * 10,
      enabled: eventIds.length > 0,
    })),
  });

  const eventDetailsLoading = eventDetailQueries.some((q) => q.isLoading);
  const eventsLoading = eventsListLoading || eventDetailsLoading;

  const eventsWithFullGallery = useMemo(
    () =>
      eventDetailQueries
        .filter((q) => q.data?.data)
        .map((q) => q.data!.data)
        .filter((event: any) => event.gallery && event.gallery.length > 0),
    [eventDetailQueries],
  );

  const allGalleryImages: GalleryImage[] = useMemo(
    () =>
      eventsWithFullGallery.flatMap((event: any) =>
        [...(event.gallery || [])]
          .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((img: any) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            thumbnailUrl: img.thumbnailUrl,
            mediumUrl: img.mediumUrl,
            caption: img.caption,
            altText: img.altText,
            photographer: img.photographer,
            takenAt: img.takenAt,
            originalFileName: img.originalFileName,
            isFeatured: img.isFeatured,
            displayOrder: img.displayOrder,
            eventTitle: event.title,
            eventId: event.id,
          })),
      ),
    [eventsWithFullGallery],
  );

  const filteredGalleryImages = useMemo(
    () =>
      eventFilter === 'all'
        ? allGalleryImages
        : allGalleryImages.filter((img) => img.eventId === eventFilter),
    [allGalleryImages, eventFilter],
  );

  // ─── About / Leadership ───
  const { data: aboutData, isLoading: aboutLoading } = useQuery({
    queryKey: ['about'],
    queryFn: aboutApi.getAll,
    staleTime: 1000 * 60 * 10,
  });

  const aboutContent = aboutData?.data || {};
  const leadership: any[] = aboutContent.leadership || [];
  const activeLeaders = leadership
    .filter((l: any) => l.isActive && l.showOnAboutPage)
    .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  // ─── Lightbox ───
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const navigateLightbox = (index: number) => setLightboxIndex(index);

  const totalEventPhotos = allGalleryImages.length;
  const totalLeaders = activeLeaders.length;

  return (
    <div className="bg-stone-50 min-h-screen overflow-hidden selection:bg-emerald-900 selection:text-amber-400">
      {/* ═══════════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════════ */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-stone-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-950" />
          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-600/15 blur-[140px] animate-pulse" />
          <div className="absolute -bottom-40 right-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse delay-1000" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(251,191,36,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.3) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        <div className="container mx-auto max-w-7xl relative z-10 text-center px-6 py-20">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="space-y-6">
            <motion.div variants={fadeInUp} custom={0} className="flex justify-center">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/25 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <Camera className="h-8 w-8 text-emerald-950" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-300 animate-ping" />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} custom={1}>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.35em] text-amber-400/90 bg-amber-400/[0.08] backdrop-blur-sm px-5 py-2.5 rounded-full border border-amber-400/20">
                <Sparkles className="h-3.5 w-3.5" />
                Visual Stories
                <Sparkles className="h-3.5 w-3.5" />
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} custom={2} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[0.9] tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-white">
                  Our
                </span>
                <span className="block bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  Gallery
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              custom={3}
              className="text-emerald-100/50 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed"
            >
              A visual journey through our events, achievements, and the people who make it all possible.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              custom={4}
              className="flex flex-wrap items-center justify-center gap-10 md:gap-16 pt-4"
            >
              {[
                { value: eventsLoading ? '...' : totalEventPhotos, label: 'Event Photos' },
                { value: eventsLoading ? '...' : eventsWithFullGallery.length, label: 'Events Covered' },
                { value: totalLeaders, label: 'Leaders' },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <p className="text-2xl md:text-3xl font-heading font-bold text-amber-400 group-hover:text-amber-300 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-200/40 mt-1 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0,80 L0,40 Q360,0 720,40 Q1080,80 1440,40 L1440,80 Z" className="fill-stone-50" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TAB NAVIGATION (Sticky)
         ═══════════════════════════════════════════════ */}
      <section className="py-6 sticky top-0 z-30 bg-stone-50/95 backdrop-blur-lg border-b border-stone-200/60">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80 shadow-inner">
              {(
                [
                  {
                    key: 'events' as GalleryTab,
                    label: 'Event Gallery',
                    icon: ImageIcon,
                    count: eventsLoading ? '…' : totalEventPhotos,
                  },
                  {
                    key: 'leadership' as GalleryTab,
                    label: 'Leadership',
                    icon: Users,
                    count: totalLeaders,
                  },
                ] as const
              ).map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300',
                    activeTab === key
                      ? 'bg-white text-stone-900 shadow-md shadow-stone-200/60'
                      : 'text-stone-500 hover:text-stone-700 hover:bg-white/50',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  <span
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors',
                      activeTab === key ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200/60 text-stone-400',
                    )}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CONTENT
         ═══════════════════════════════════════════════ */}
      <div className="min-h-[60vh]">
        {activeTab === 'events' ? (
          eventsLoading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="text-center space-y-4">
                <LoadingSpinner size="lg" className="py-0" />
                <p className="text-stone-400 text-sm">
                  {eventsListLoading
                    ? 'Discovering events...'
                    : `Loading galleries (${eventDetailQueries.filter((q) => q.isSuccess).length}/${eventIds.length})…`}
                </p>
              </div>
            </div>
          ) : (
            <EventGalleryTab
              allImages={allGalleryImages}
              filteredImages={filteredGalleryImages}
              eventsWithGallery={eventsWithFullGallery}
              eventFilter={eventFilter}
              setEventFilter={setEventFilter}
              openLightbox={openLightbox}
            />
          )
        ) : aboutLoading ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center space-y-4">
              <LoadingSpinner size="lg" className="py-0" />
              <p className="text-stone-400 text-sm">Loading leadership…</p>
            </div>
          </div>
        ) : (
          <LeadershipTab leaders={activeLeaders} />
        )}
      </div>

      {/* ═══════════════════════════════════════════════
          LIGHTBOX
         ═══════════════════════════════════════════════ */}
      {lightboxOpen && filteredGalleryImages.length > 0 && (
        <GalleryLightbox
          images={filteredGalleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}

      {/* Footer accent */}
      <div className="h-1 bg-gradient-to-r from-emerald-800 via-emerald-600 to-amber-500" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EVENT GALLERY TAB — MOSAIC LAYOUT
// ═══════════════════════════════════════════════════════════

function EventGalleryTab({
  allImages,
  filteredImages,
  eventsWithGallery,
  eventFilter,
  setEventFilter,
  openLightbox,
}: {
  allImages: GalleryImage[];
  filteredImages: GalleryImage[];
  eventsWithGallery: any[];
  eventFilter: string;
  setEventFilter: (v: string) => void;
  openLightbox: (index: number) => void;
}) {
  if (allImages.length === 0) {
    return (
      <div className="py-24">
        <EmptyState
          icon={ImageIcon}
          title="No gallery photos yet"
          description="Photos from our events will appear here once uploaded."
        />
      </div>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto max-w-7xl px-6">
        {/* ─── Event Filter ─── */}
        {eventsWithGallery.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-stone-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500">
                Filter by Event
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEventFilter('all')}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border',
                  eventFilter === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200/50'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700',
                )}
              >
                All Events
                <span
                  className={cn(
                    'ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                    eventFilter === 'all' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400',
                  )}
                >
                  {allImages.length}
                </span>
              </button>
              {eventsWithGallery.map((event: any) => {
                const count = (event.gallery || []).length;
                return (
                  <button
                    key={event.id}
                    onClick={() => setEventFilter(event.id)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border max-w-[280px] truncate',
                      eventFilter === event.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200/50'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700',
                    )}
                  >
                    {event.title}
                    <span
                      className={cn(
                        'ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                        eventFilter === event.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-400',
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ─── Gallery Heading ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-stone-900">
              {eventFilter === 'all'
                ? 'All Event Photos'
                : eventsWithGallery.find((e: any) => e.id === eventFilter)?.title || 'Event Photos'}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {filteredImages.length} photo{filteredImages.length !== 1 ? 's' : ''}
              {eventFilter !== 'all' && ' from this event'}
            </p>
          </div>
        </motion.div>

        {/* ─── MOSAIC GRID ─── */}
        <motion.div
          key={eventFilter}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] lg:auto-rows-[240px] gap-3 md:gap-4"
        >
          {filteredImages.map((img, index) => (
            <MosaicTile key={img.id} img={img} index={index} onClick={() => openLightbox(index)} />
          ))}
        </motion.div>

        {/* Bottom flourish */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-3 text-stone-300">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-300/50" />
            <Camera className="h-5 w-5 text-amber-400/50" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-300/50" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════
// LEADERSHIP TAB
// ═══════════════════════════════════════════════════════════

function LeadershipTab({ leaders }: { leaders: any[] }) {
  if (leaders.length === 0) {
    return (
      <div className="py-24">
        <EmptyState
          icon={Users}
          title="No leadership profiles yet"
          description="Leadership information will appear here soon."
        />
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-stone-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.05),transparent_60%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-700/30 to-transparent" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-400/[0.06] px-4 py-2 rounded-full border border-amber-400/15 mb-5">
            <Users className="h-3 w-3" />
            Executive Board
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            Meet the{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
              Visionaries
            </span>
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto text-base font-light">
            Dedicated leaders committed to transforming lives and building sustainable futures
          </p>
          <div className="w-20 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 mx-auto rounded-full mt-8" />
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {leaders.map((leader: any, idx: number) => (
            <motion.div key={leader.id} variants={scaleIn} custom={idx}>
              <div className="group relative h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-amber-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-700" />
                <Card className="relative bg-stone-900/80 backdrop-blur border-stone-800/80 rounded-2xl overflow-hidden h-full group-hover:border-stone-700/80 transition-all duration-500">
                  <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="relative mt-2 mb-5">
                      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-emerald-500/30 to-amber-500/30 opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />
                      <div className="relative">
                        <div className="h-28 w-28 rounded-full ring-[3px] ring-stone-800 group-hover:ring-stone-700 transition-all duration-500 overflow-hidden">
                          <PremiumAvatar
                            name={leader.fullName}
                            src={leader.photoUrl || leader.photoThumbnailUrl}
                            size="xl"
                            className="h-full w-full rounded-full object-cover"
                          />
                        </div>
                        {leader.isChairman && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-stone-900 shadow-lg shadow-amber-500/20">
                            <Star className="h-3.5 w-3.5 text-white fill-white" />
                          </div>
                        )}
                        {leader.isFounder && !leader.isChairman && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-7 w-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-stone-900 shadow-lg shadow-amber-500/20">
                            <Crown className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <h3 className="text-[15px] font-heading font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors duration-300">
                        {leader.title && <span className="text-stone-500 font-medium">{leader.title} </span>}
                        {leader.fullName}
                      </h3>
                      <p className="text-xs font-semibold tracking-widest uppercase text-amber-400/80">
                        {leader.position}
                      </p>
                    </div>

                    <div className="w-8 h-px bg-stone-800 group-hover:w-12 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-amber-500 transition-all duration-500 mb-3" />

                    {leader.shortBio && (
                      <p className="text-[13px] text-stone-500 leading-relaxed line-clamp-3 font-light mb-4 group-hover:text-stone-400 transition-colors duration-300">
                        {leader.shortBio}
                      </p>
                    )}

                    <div className="flex flex-wrap justify-center gap-1.5 mt-auto pt-1">
                      {leader.isFounder && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/15 text-amber-400 text-[10px] font-bold tracking-wider uppercase">
                          <Crown className="h-2.5 w-2.5" />
                          Founder
                        </span>
                      )}
                      {leader.isTrustee && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
                          <Shield className="h-2.5 w-2.5" />
                          Trustee
                        </span>
                      )}
                      {leader.isChairman && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-500/10 border border-stone-500/15 text-stone-300 text-[10px] font-bold tracking-wider uppercase">
                          <Award className="h-2.5 w-2.5" />
                          Chairman
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-3 text-stone-600">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/30" />
            <Crown className="h-5 w-5 text-amber-400/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/30" />
          </div>
        </div>
      </div>
    </section>
  );
}