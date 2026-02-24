'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/store/admin-auth-store';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ShieldAlert } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  requiredPermission?: string;
}

export function AdminGuard({ children, requiredPermission }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasPermission, checkAuth } =
    useAdminAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Loading admin panel..." />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (
    requiredPermission &&
    !hasPermission(requiredPermission as any)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground mt-2">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}