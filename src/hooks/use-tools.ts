'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toolsApi } from '@/lib/api/tools.api';

export function useTools(params?: any) {
  return useQuery({
    queryKey: ['tools', params],
    queryFn: () => toolsApi.getAll(params),
  });
}

export function useTool(id: string) {
  return useQuery({
    queryKey: ['tool', id],
    queryFn: () => toolsApi.getById(id),
    enabled: !!id,
  });
}

export function useMyTools(params?: any) {
  return useQuery({
    queryKey: ['my-tools', params],
    queryFn: () => toolsApi.getMyTools(params),
  });
}

export function useCreateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toolsApi.create,
    onSuccess: () => {
      toast.success('Tool listed successfully');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to list tool'),
  });
}

export function useUpdateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      toolsApi.update(id, data),
    onSuccess: () => {
      toast.success('Tool updated successfully');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update tool'),
  });
}

export function useDeleteTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toolsApi.delete,
    onSuccess: () => {
      toast.success('Tool deleted');
      qc.invalidateQueries({ queryKey: ['my-tools'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to delete tool'),
  });
}