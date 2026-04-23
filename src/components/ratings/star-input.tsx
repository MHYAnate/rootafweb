// src/components/ratings/star-input.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-7 w-7',
  lg: 'h-9 w-9',
};

export function StarInput({
  value,
  onChange,
  size = 'md',
  label,
  disabled = false,
  required = false,
  error,
}: StarInputProps) {
  const [hovered, setHovered] = useState(0);

  const activeStars = hovered || value;

  return (
    <div className="shrink-0 transition-opacity group-hover:opacity-100 opacity-90">
      {label && (
        <p className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </p>
      )}

      <div
        className="flex items-center gap-1"
        onMouseLeave={() => !disabled && setHovered(0)}
        role="group"
        aria-label={label || 'Star rating'}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            aria-pressed={value === star}
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            className={cn(
              'transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded',
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-110',
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                'transition-colors duration-100',
                star <= activeStars
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-muted-foreground/40',
              )}
            />
          </button>
        ))}

        {value > 0 && (
          <span className="ml-2 text-sm font-semibold text-amber-600">
            {value}/5
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}