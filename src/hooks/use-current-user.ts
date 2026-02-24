'use client';

import { useAuthStore } from '@/store/auth-store';

export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isMember: user?.userType === 'MEMBER',
    isClient: user?.userType === 'CLIENT',
    isVerified: user?.verificationStatus === 'VERIFIED',
    isPending: user?.verificationStatus === 'PENDING',
  };
}