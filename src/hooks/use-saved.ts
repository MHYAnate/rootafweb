'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { savedApi } from '@/lib/api/saved.api';

export function useMySaved(params?: any) {
  return useQuery({
    queryKey: ['my-saved', params],
    queryFn: () => savedApi.getMySaved(params),
  });
}

export function useSaveItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: savedApi.saveItem,
    onSuccess: () => {
      toast.success('Item saved');
      qc.invalidateQueries({ queryKey: ['my-saved'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to save item'),
  });
}

export function useRemoveSaved() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: savedApi.removeItem,
    onSuccess: () => {
      toast.success('Item removed from saved');
      qc.invalidateQueries({ queryKey: ['my-saved'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to remove item'),
  });
}