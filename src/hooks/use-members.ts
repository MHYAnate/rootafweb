'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { membersApi } from '@/lib/api/members.api';

export function useMembers(params?: any) {
  return useQuery({
    queryKey: ['members', params],
    queryFn: () => membersApi.getAll(params),
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.getById(id),
    enabled: !!id,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: membersApi.getMyProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: membersApi.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Update failed'),
  });
}