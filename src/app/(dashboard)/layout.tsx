'use client';

import { Header } from '@/components/layout/header';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { AuthGuard } from '@/components/auth/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Header />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-muted/30 min-h-screen">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}