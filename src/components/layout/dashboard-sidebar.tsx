'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Package,
  Wrench,
  Award,
  DollarSign,
  Star,
  Bell,
  Bookmark,
  Settings,
  Hammer,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { StatusBadge } from '@/components/shared/status-badge';

const memberLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/my-products', label: 'My Products', icon: Package },
  { href: '/my-services', label: 'My Services', icon: Wrench },
  { href: '/my-tools', label: 'My Tools', icon: Hammer },
  { href: '/my-certificates', label: 'Certificates', icon: Award },
  { href: '/my-transactions', label: 'Transactions', icon: DollarSign },
  { href: '/my-ratings', label: 'Ratings', icon: Star },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/saved', label: 'Saved Items', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const clientLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'My Profile', icon: User },
  { href: '/my-ratings', label: 'My Ratings', icon: Star },
  { href: '/saved', label: 'Saved Items', icon: Bookmark },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const isMember = user?.userType === 'MEMBER';
  const links = isMember ? memberLinks : clientLinks;

  return (
    <aside className="w-72 min-h-screen border-r border-border/50 bg-card hidden lg:block">
      <div className="p-6">
        {/* User Card */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
          <div className="flex items-center gap-3">
            <PremiumAvatar
              name={user?.fullName || ''}
              size="md"
              verified={user?.verificationStatus === 'VERIFIED'}
            />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {user?.fullName}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <StatusBadge
                  status={user?.verificationStatus || 'PENDING'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <link.icon
                  className={cn(
                    'h-[18px] w-[18px]',
                    isActive && 'text-primary',
                  )}
                />
                {link.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Brand Accent */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex items-center gap-2 px-3.5 text-xs text-muted-foreground">
            <Leaf className="h-3.5 w-3.5 text-primary" />
            <span>URAFD Platform</span>
          </div>
        </div>
      </div>
    </aside>
  );
}