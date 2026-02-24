'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { certificatesApi } from '@/lib/api/certificates.api';

export function useMyCertificates(params?: any) {
  return useQuery({
    queryKey: ['my-certificates', params],
    queryFn: () => certificatesApi.getMyCertificates(params),
  });
}

export function useMemberCertificates(memberId: string) {
  return useQuery({
    queryKey: ['certificates', memberId],
    queryFn: () => certificatesApi.getByMember(memberId),
    enabled: !!memberId,
  });
}

export function useCreateCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: certificatesApi.create,
    onSuccess: () => {
      toast.success('Certificate uploaded successfully');
      qc.invalidateQueries({ queryKey: ['my-certificates'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to upload certificate'),
  });
}

export function useDeleteCertificate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: certificatesApi.delete,
    onSuccess: () => {
      toast.success('Certificate removed');
      qc.invalidateQueries({ queryKey: ['my-certificates'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to remove certificate'),
  });
}