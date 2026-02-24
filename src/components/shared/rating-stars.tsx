'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  totalRatings?: number;
  interactive?: boolean;
  className?: string;
  onRate?: (rating: number) => void;
}

const sizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4.5 w-4.5',
  lg: 'h-5.5 w-5.5',
};

export function RatingStars({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  totalRatings,
  interactive = false,
  onRate,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, i) => (
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && onRate?.(i + 1)}
          className={cn(
            'transition-all duration-150',
            interactive &&
              'hover:scale-125 cursor-pointer disabled:cursor-default',
          )}
        >
          <Star
            className={cn(
              sizeMap[size],
              i < Math.round(rating)
                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                : 'fill-gray-200 text-gray-200',
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1.5 font-medium">
          {Number(rating).toFixed(1)}
          {totalRatings !== undefined && (
            <span className="font-normal"> ({totalRatings})</span>
          )}
        </span>
      )}
    </div>
  );
}