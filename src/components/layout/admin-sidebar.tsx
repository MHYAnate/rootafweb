'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Shield,
  CheckCircle,
  FileText,
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  Activity,
  FolderTree,
  KeyRound,
  BarChart3,
  Megaphone,
  Leaf,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAuthStore } from '@/store/admin-auth-store';
import { PremiumAvatar } from '@/components/shared/premium-avatar';

const adminLinks = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    permission: null,
  },
  {
    href: '/admin/verifications',
    label: 'Verifications',
    icon: CheckCircle,
    permission: 'canVerifyMembers' as const,
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    permission: null,
  },
  {
    href: '/admin/password-resets',
    label: 'Password Resets',
    icon: KeyRound,
    permission: 'canResetPasswords' as const,
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: FolderTree,
    permission: 'canManageContent' as const,
  },
  {
    href: '/admin/content/about',
    label: 'About Content',
    icon: FileText,
    permission: 'canManageContent' as const,
  },
  {
    href: '/admin/content/leadership',
    label: 'Leadership',
    icon: Users,
    permission: 'canManageContent' as const,
  },
  {
    href: '/admin/content/sponsors',
    label: 'Sponsors',
    icon: Heart,
    permission: 'canManageContent' as const,
  },
  {
    href: '/admin/content/testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    permission: 'canManageContent' as const,
  },
  {
    href: '/admin/events',
    label: 'Events',
    icon: Calendar,
    permission: 'canManageEvents' as const,
  },
  {
    href: '/admin/announcements',
    label: 'Announcements',
    icon: Megaphone,
    permission: 'canManageContent' as const,
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: BarChart3,
    permission: 'canAccessReports' as const,
  },
  {
    href: '/admin/admins',
    label: 'Admin Users',
    icon: Shield,
    permission: 'canManageAdmins' as const,
  },
  {
    href: '/admin/activity-log',
    label: 'Activity Log',
    icon: Activity,
    permission: null,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    permission: null,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, hasPermission, logout } = useAdminAuthStore();

  const visibleLinks = adminLinks.filter(
    (link) => !link.permission || hasPermission(link.permission),
  );

  return (
    <aside className="w-72 min-h-screen border-r border-border/50 bg-card hidden lg:block overflow-y-auto">
      <div className="p-6">
        {/* Admin Branding */}
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--gradient-premium)' }}
          >
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              Admin Portal
            </p>
            <p className="text-[11px] text-muted-foreground">URAFD</p>
          </div>
        </div>

        {/* Admin Info */}
        <div className="mb-6 p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2.5">
            <PremiumAvatar
              name={admin?.fullName || ''}
              size="sm"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {admin?.fullName}
              </p>
              <p className="text-[11px] text-muted-foreground badge-gold px-1.5 py-0 inline-block mt-0.5 rounded">
                {admin?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {visibleLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <link.icon className="h-[16px] w-[16px]" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}