// src/hooks/use-ratings.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ratingsApi, CreateRatingPayload, RatingCategory } from '@/lib/api/ratings.api';
import { useAuthStore } from '@/store/auth-store';

export type { RatingCategory };

export const ratingKeys = {
  all: ['ratings'] as const,
  byMember: (memberId: string, page?: number) =>
    ['ratings', 'member', memberId, page] as const,
  myGiven: () => ['ratings', 'me', 'given'] as const,
  myReceived: (page?: number) => ['ratings', 'me', 'received', page] as const,
};

export function useMemberRatings(memberId: string, page = 1, limit = 8) {
  return useQuery({
    queryKey: ratingKeys.byMember(memberId, page),
    queryFn: () => ratingsApi.getByMember(memberId, { page, limit }),
    enabled: !!memberId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useMyRatingsGiven() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ratingKeys.myGiven(),
    queryFn: ratingsApi.getMyGiven,
    enabled: isAuthenticated,
  });
}

export function useMyRatingsReceived(page = 1) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ratingKeys.myReceived(page),
    queryFn: () => ratingsApi.getMyReceived({ page }),
    enabled: isAuthenticated,
  });
}

export function useCreateRating(memberId?: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRatingPayload) => ratingsApi.create(payload),

    onSuccess: () => {
      toast.success('Rating submitted!', {
        description: 'Thank you for your feedback.',
      });
      if (memberId) {
        qc.invalidateQueries({ queryKey: ratingKeys.byMember(memberId) });
      }
      qc.invalidateQueries({ queryKey: ratingKeys.myGiven() });
    },

    onError: (error: any) => {
      if (error.response?.status === 409) {
        toast.error('Already rated', {
          description: 'You have already submitted a rating for this.',
        });
        return;
      }
      if (error.response?.status === 403) {
        toast.error('Not allowed', {
          description: error.response?.data?.message,
        });
        return;
      }
      toast.error(
        error.response?.data?.message || 'Failed to submit rating.',
      );
    },
  });
}