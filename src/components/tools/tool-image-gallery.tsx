// src/components/tools/tool-image-gallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Expand, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface ToolImageGalleryProps {
  images: any[];
  toolName: string;
}

export function ToolImageGallery({ images, toolName }: ToolImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-xl bg-muted flex items-center justify-center">
        <div className="text-center">
          <Wrench className="h-16 w-16 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No photos available</p>
        </div>
      </div>
    );
  }

  const currentImage = images[selectedIndex];

  const goNext = () => setSelectedIndex((i) => (i + 1) % images.length);
  const goPrev = () => setSelectedIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <div className="space-y-3">
        {/* Main Image */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted group">
          <Image
            src={currentImage.imageUrl || currentImage.thumbnailUrl}
            alt={`${toolName} - Image ${selectedIndex + 1}`}
            fill
            className="object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
            priority
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/60"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/60"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Expand button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/60"
            onClick={() => setLightboxOpen(true)}
          >
            <Expand className="h-4 w-4" />
          </Button>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img: any, index: number) => (
              <button
                key={img.id || index}
                onClick={() => setSelectedIndex(index)}
                className={cn(
                  'relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                  index === selectedIndex
                    ? 'border-primary ring-1 ring-primary/20'
                    : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <Image
                  src={img.thumbnailUrl || img.imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          <DialogTitle className="sr-only">{toolName}</DialogTitle>
          <div className="relative aspect-[4/3] sm:aspect-[16/10]">
            <Image
              src={currentImage.imageUrl}
              alt={toolName}
              fill
              className="object-contain"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goPrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={goNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedIndex(i)}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        i === selectedIndex ? 'w-6 bg-white' : 'w-2 bg-white/40',
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}