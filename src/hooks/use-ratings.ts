'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ratingsApi } from '@/lib/api/ratings.api';

export function useMemberRatings(memberId: string, params?: any) {
  return useQuery({
    queryKey: ['member-ratings', memberId, params],
    queryFn: () => ratingsApi.getByMember(memberId, params),
    enabled: !!memberId,
  });
}

export function useMyReceivedRatings(params?: any) {
  return useQuery({
    queryKey: ['my-received-ratings', params],
    queryFn: () => ratingsApi.getMyReceived(params),
  });
}

export function useMyGivenRatings() {
  return useQuery({
    queryKey: ['my-given-ratings'],
    queryFn: ratingsApi.getMyGiven,
  });
}

export function useCreateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ratingsApi.create,
    onSuccess: () => {
      toast.success('Rating submitted successfully');
      qc.invalidateQueries({ queryKey: ['member-ratings'] });
      qc.invalidateQueries({ queryKey: ['my-given-ratings'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to submit rating'),
  });
}