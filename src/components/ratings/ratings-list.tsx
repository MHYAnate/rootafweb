// src/components/ratings/ratings-list.tsx
'use client';

import { useState } from 'react';
import { RatingCard } from './rating-card';
import { RatingSummary } from './rating-summary';
import { useMemberRatings } from '@/hooks/use-ratings';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

interface RatingsListProps {
  memberId: string;
  averageRating?: number;
  totalRatings?: number;
  oneStarCount?: number;
  twoStarCount?: number;
  threeStarCount?: number;
  fourStarCount?: number;
  fiveStarCount?: number;
  showSummary?: boolean;
}

export function RatingsList({
  memberId,
  averageRating = 0,
  totalRatings = 0,
  oneStarCount = 0,
  twoStarCount = 0,
  threeStarCount = 0,
  fourStarCount = 0,
  fiveStarCount = 0,
  showSummary = true,
}: RatingsListProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useMemberRatings(memberId, page);

  const ratings = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {showSummary && totalRatings > 0 && (
        <RatingSummary
          averageRating={averageRating}
          totalRatings={totalRatings}
          oneStarCount={oneStarCount}
          twoStarCount={twoStarCount}
          threeStarCount={threeStarCount}
          fourStarCount={fourStarCount}
          fiveStarCount={fiveStarCount}
        />
      )}

      {/* Loading */}
      {isLoading && (
        <LoadingSpinner text="Loading reviews…" className="py-12" />
      )}

      {/* Empty state */}
      {!isLoading && ratings.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center text-muted-foreground gap-3">
          <MessageSquare className="h-10 w-10 opacity-30" />
          <p className="font-medium">No reviews yet</p>
          <p className="text-sm">Be the first to leave a review!</p>
        </div>
      )}

      {/* Cards */}
      {ratings.length > 0 && (
        <div
          className={cn(
            'grid gap-4 sm:grid-cols-2 transition-opacity duration-200',
            isFetching && 'opacity-60',
          )}
        >
          {ratings.map((r) => (
            <RatingCard key={r.id} rating={r} showReviewer />
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === meta.totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// missing import — add at top of file
import { cn } from '@/lib/utils';