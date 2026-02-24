'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { servicesApi } from '@/lib/api/services.api';

export function useServices(params?: any) {
  return useQuery({
    queryKey: ['services', params],
    queryFn: () => servicesApi.getAll(params),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: () => servicesApi.getById(id),
    enabled: !!id,
  });
}

export function useMyServices(params?: any) {
  return useQuery({
    queryKey: ['my-services', params],
    queryFn: () => servicesApi.getMyServices(params),
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.create,
    onSuccess: () => {
      toast.success('Service created successfully');
      qc.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to create service'),
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      toast.success('Service updated successfully');
      qc.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to update service'),
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: servicesApi.delete,
    onSuccess: () => {
      toast.success('Service deleted');
      qc.invalidateQueries({ queryKey: ['my-services'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to delete service'),
  });
}