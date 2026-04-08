// components/shared/pagination-controls.tsx
'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Props {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function PaginationControls({ meta, onPageChange }: Props) {
  if (meta.totalPages <= 1) return null;

  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  const handlePageChange = (newPage: number) => {
    onPageChange(newPage);
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers with ellipsis support
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    if (meta.totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= meta.totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (meta.page > 3) {
        pages.push('ellipsis');
      }

      // Pages around current
      const rangeStart = Math.max(2, meta.page - 1);
      const rangeEnd = Math.min(meta.totalPages - 1, meta.page + 1);

      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }

      if (meta.page < meta.totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      pages.push(meta.totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-10 pt-6 border-t border-border/50 gap-4">
      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-medium text-foreground">{start}</span> to{' '}
        <span className="font-medium text-foreground">{end}</span> of{' '}
        <span className="font-medium text-foreground">{meta.total}</span>{' '}
        results
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(meta.page - 1)}
          disabled={!meta.hasPreviousPage}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-1 px-2">
          {getPageNumbers().map((item, index) => {
            if (item === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="h-8 w-8 flex items-center justify-center text-sm text-muted-foreground"
                >
                  …
                </span>
              );
            }

            return (
              <button
                key={item}
                onClick={() => handlePageChange(item)}
                disabled={item === meta.page}
                className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                  item === meta.page
                    ? 'bg-primary text-primary-foreground shadow-sm cursor-default'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(meta.page + 1)}
          disabled={!meta.hasNextPage}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}