// src/components/ratings/rating-card.tsx
'use client';

import { Star, MessageSquare, Package, Wrench } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { DateDisplay } from '@/components/shared/date-display';
import { Rating } from '@/lib/api/ratings.api';
import { cn } from '@/lib/utils';

// ── Mini star display (read-only) ─────────────────────────────────────────────

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

// ── Category icon ─────────────────────────────────────────────────────────────

const categoryConfig = {
  MEMBER: {
    icon: MessageSquare,
    label: 'Member Review',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  PRODUCT: {
    icon: Package,
    label: 'Product Review',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  SERVICE: {
    icon: Wrench,
    label: 'Service Review',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
};

// ── Main Component ────────────────────────────────────────────────────────────

interface RatingCardProps {
  rating: Rating;
  /** Show the rated member info (for "ratings I gave" view) */
  showMember?: boolean;
  /** Show the reviewer info (for public / received view) */
  showReviewer?: boolean;
}

export function RatingCard({
  rating,
  showMember = false,
  showReviewer = true,
}: RatingCardProps) {
  const config = categoryConfig[rating.ratingCategory] ?? categoryConfig.MEMBER;
  const CategoryIcon = config.icon;

  const hasSubRatings =
    rating.qualityRating ||
    rating.communicationRating ||
    rating.valueRating ||
    rating.timelinessRating;

  return (
    <Card className="card-premium overflow-hidden group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          {/* Reviewer / Member info */}
          {(showReviewer || showMember) && (
            <div className="flex items-center gap-2.5 min-w-0">
              <PremiumAvatar
                src={undefined}
                name={
                  showReviewer
                    ? rating.client?.user?.fullName || 'Anonymous'
                    : rating.member?.user?.fullName || 'Unknown'
                }
                size="sm"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">
                  {showReviewer
                    ? rating.client?.user?.fullName || 'Anonymous'
                    : rating.member?.user?.fullName || 'Unknown'}
                </p>
                <DateDisplay
                  date={rating.createdAt}
                  className="text-xs text-muted-foreground"
                />
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={cn(
                'h-7 w-7 rounded-lg flex items-center justify-center',
                config.bg,
              )}
            >
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
          {(rating.product?.name || rating.service?.name) && (
            <span className="text-xs text-muted-foreground truncate">
              • {rating.product?.name || rating.service?.name}
            </span>
          )}
        </div>

        {/* Review text */}
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

        {/* Sub-ratings — collapsed by default */}
        {hasSubRatings && (
          <div className="pt-3 border-t space-y-2">
            {rating.qualityRating && (
              <SubRating label="Quality" value={rating.qualityRating} />
            )}
            {rating.communicationRating && (
              <SubRating label="Communication" value={rating.communicationRating} />
            )}
            {rating.valueRating && (
              <SubRating label="Value" value={rating.valueRating} />
            )}
            {rating.timelinessRating && (
              <SubRating label="Timeliness" value={rating.timelinessRating} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}