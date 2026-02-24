'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/store/auth-store';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { accessToken, refreshToken, user } = response.data;
      setAuth(user, accessToken, refreshToken);
      toast.success('Welcome back!', {
        description: `Logged in as ${user.fullName}`,
      });

      if (
        user.verificationStatus === 'PENDING' ||
        user.verificationStatus === 'REJECTED'
      ) {
        router.push('/verification-pending');
      } else {
        router.push('/dashboard');
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Login failed. Please try again.',
      );
    },
  });
}

export function useRegisterMember() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.registerMember,
    onSuccess: () => {
      toast.success('Registration successful!', {
        description: 'Your account is awaiting admin verification.',
      });
      router.push('/verification-pending');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Registration failed',
      );
    },
  });
}

export function useRegisterClient() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.registerClient,
    onSuccess: () => {
      toast.success('Registration successful!', {
        description: 'Your account is awaiting admin verification.',
      });
      router.push('/verification-pending');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Registration failed',
      );
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    enabled: useAuthStore.getState().isAuthenticated,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () =>
      toast.success('Password changed successfully'),
    onError: (error: any) =>
      toast.error(
        error.response?.data?.message || 'Failed to change password',
      ),
  });
}