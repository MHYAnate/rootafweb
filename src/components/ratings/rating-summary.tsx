// src/components/ratings/rating-summary.tsx
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingSummaryProps {
  averageRating: number;
  totalRatings: number;
  oneStarCount?: number;
  twoStarCount?: number;
  threeStarCount?: number;
  fourStarCount?: number;
  fiveStarCount?: number;
  className?: string;
}

function BarSegment({
  label,
  count,
  total,
  stars,
}: {
  label: string;
  count: number;
  total: number;
  stars: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Star label */}
      <span className="w-3 text-right text-muted-foreground font-medium shrink-0">
        {stars}
      </span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />

      {/* Bar */}
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Count */}
      <span className="w-6 text-right text-muted-foreground shrink-0">
        {count}
      </span>
    </div>
  );
}

export function RatingSummary({
  averageRating,
  totalRatings,
  oneStarCount = 0,
  twoStarCount = 0,
  threeStarCount = 0,
  fourStarCount = 0,
  fiveStarCount = 0,
  className,
}: RatingSummaryProps) {
  const avg = Number(averageRating) || 0;

  return (
    <div className={cn('flex flex-col sm:flex-row gap-6 items-start', className)}>
      {/* Big number */}
      <div className="flex flex-col items-center justify-center shrink-0 min-w-[100px]">
        <span className="text-5xl font-extrabold leading-none">
          {avg.toFixed(1)}
        </span>
        <div className="flex items-center gap-0.5 mt-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={cn(
                'h-4 w-4',
                s <= Math.round(avg)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-muted-foreground/30',
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          {totalRatings.toLocaleString()} review{totalRatings !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Bars */}
      <div className="flex-1 w-full space-y-2">
        {[
          { stars: 5, count: fiveStarCount },
          { stars: 4, count: fourStarCount },
          { stars: 3, count: threeStarCount },
          { stars: 2, count: twoStarCount },
          { stars: 1, count: oneStarCount },
        ].map(({ stars, count }) => (
          <BarSegment
            key={stars}
            label={`${stars} star`}
            stars={stars}
            count={count}
            total={totalRatings}
          />
        ))}
      </div>
    </div>
  );
}