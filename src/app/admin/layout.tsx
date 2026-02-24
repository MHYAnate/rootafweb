'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminGuard } from '@/components/auth/admin-guard';
import { Shield, Leaf } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 bg-muted/30">
          <div className="border-b border-border/50 bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Admin Portal</h2>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Leaf className="h-3 w-3 text-primary" />
                RootAF
              </div>
            </div>
          </div>
          <div className="p-6 lg:p-8 animate-fade-in">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}