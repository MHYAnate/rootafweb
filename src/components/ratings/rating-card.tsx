// src/components/ratings/rating-card.tsx
'use client';

import { MessageSquare, Package, Wrench, Hammer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { DateDisplay } from '@/components/shared/date-display';
import { Rating, RatingCategory } from '@/lib/api/ratings.api';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

// ── Read-only star display ────────────────────────────────────────────────────

export function ReadOnlyStars({
  rating,
  size = 'sm',
  className,
}: {
  rating: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}) {
  const sizeMap = { xs: 'h-3 w-3', sm: 'h-4 w-4', md: 'h-5 w-5' };

  return (
    <span className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            sizeMap[size],
            s <= rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-transparent text-muted-foreground/30',
          )}
        />
      ))}
    </span>
  );
}

// ── Sub-rating row ────────────────────────────────────────────────────────────

function SubRating({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <ReadOnlyStars rating={value} size="xs" />
        <span className="font-medium text-foreground w-3">{value}</span>
      </div>
    </div>
  );
}

// ── Category config — keys must exactly match RatingCategory enum ─────────────

const categoryConfig: Record<
  RatingCategory,
  { icon: React.ElementType; label: string; color: string; bg: string }
> = {
  OVERALL_MEMBER:    {
    icon:  MessageSquare,
    label: 'Member Review',
    color: 'text-emerald-600',
    bg:    'bg-emerald-50',
  },
  PRODUCT_RATING:    {
    icon:  Package,
    label: 'Product Review',
    color: 'text-blue-600',
    bg:    'bg-blue-50',
  },
  SERVICE_RATING:    {
    icon:  Wrench,
    label: 'Service Review',
    color: 'text-violet-600',
    bg:    'bg-violet-50',
  },
  TOOL_LEASE_RATING: {
    icon:  Hammer,
    label: 'Tool / Lease Review',
    color: 'text-amber-600',
    bg:    'bg-amber-50',
  },
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface RatingCardProps {
  rating: Rating;
  showMember?: boolean;
  showReviewer?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RatingCard({
  rating,
  showMember   = false,
  showReviewer = true,
}: RatingCardProps) {
  // Safe fallback: if an unexpected category arrives at runtime use OVERALL_MEMBER
  const config       = categoryConfig[rating.ratingCategory] ?? categoryConfig.OVERALL_MEMBER;
  const CategoryIcon = config.icon;

  const hasSubRatings =
    rating.qualityRating       ||
    rating.communicationRating ||
    rating.valueRating         ||
    rating.timelinessRating;

  const displayName = showReviewer
    ? rating.client?.user?.fullName || 'Anonymous'
    : rating.member?.user?.fullName || 'Unknown';

  return (
    <Card className="card-premium overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5 space-y-4">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">

          {/* Reviewer / member info */}
          {(showReviewer || showMember) && (
            <div className="flex items-center gap-2.5 min-w-0">
              <PremiumAvatar src={undefined} name={displayName} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{displayName}</p>
                <DateDisplay
                  date={rating.createdAt}
                  className="text-xs text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={cn(
              'h-7 w-7 rounded-lg flex items-center justify-center',
              config.bg,
            )}>
              <CategoryIcon className={cn('h-3.5 w-3.5', config.color)} />
            </span>
            <Badge variant="outline" className="text-xs rounded-lg hidden sm:flex">
              {config.label}
            </Badge>
          </div>
        </div>

        {/* Overall rating */}
        <div className="flex items-center gap-3">
          <ReadOnlyStars rating={rating.overallRating} size="sm" />
          <span className="text-sm font-bold">{rating.overallRating}/5</span>
          {(rating.product?.name || rating.service?.name || rating.tool?.name) && (
            <span className="text-xs text-muted-foreground truncate">
              · {rating.product?.name ?? rating.service?.name ?? rating.tool?.name}
            </span>
          )}
        </div>

        {/* Written review */}
        {(rating.reviewTitle || rating.reviewText) && (
          <div className="space-y-1">
            {rating.reviewTitle && (
              <p className="text-sm font-semibold">{rating.reviewTitle}</p>
            )}
            {rating.reviewText && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {rating.reviewText}
              </p>
            )}
          </div>
        )}

        {/* Sub-ratings */}
        {hasSubRatings && (
          <div className="pt-3 border-t space-y-2">
            {rating.qualityRating && (
              <SubRating label="Quality"       value={rating.qualityRating} />
            )}
            {rating.communicationRating && (
              <SubRating label="Communication" value={rating.communicationRating} />
            )}
            {rating.valueRating && (
              <SubRating label="Value"         value={rating.valueRating} />
            )}
            {rating.timelinessRating && (
              <SubRating label="Timeliness"    value={rating.timelinessRating} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}