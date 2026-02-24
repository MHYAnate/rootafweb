'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { LoadingSpinner } from '@/components/shared/loading-spinner';

interface Props {
  children: React.ReactNode;
  requireVerified?: boolean;
}

export function AuthGuard({ children, requireVerified = false }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      if (requireVerified && user?.verificationStatus !== 'VERIFIED') {
        router.push('/verification-pending');
      }
    }
  }, [isAuthenticated, isLoading, user, requireVerified, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Loading your account..." />
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requireVerified && user?.verificationStatus !== 'VERIFIED')
    return null;

  return <>{children}</>;
}