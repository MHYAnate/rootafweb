'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
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
    group: 'Overview',
  },
  {
    href: '/admin/verifications',
    label: 'Verifications',
    icon: CheckCircle,
    permission: 'canVerifyMembers' as const,
    group: 'Management',
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    permission: null,
    group: 'Management',
  },
  {
    href: '/admin/password-resets',
    label: 'Password Resets',
    icon: KeyRound,
    permission: 'canResetPasswords' as const,
    group: 'Management',
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: FolderTree,
    permission: 'canManageContent' as const,
    group: 'Content',
  },
  {
    href: '/admin/content/about',
    label: 'About Content',
    icon: FileText,
    permission: 'canManageContent' as const,
    group: 'Content',
  },
  {
    href: '/admin/content/leadership',
    label: 'Leadership',
    icon: Users,
    permission: 'canManageContent' as const,
    group: 'Content',
  },
  {
    href: '/admin/content/sponsors',
    label: 'Sponsors',
    icon: Heart,
    permission: 'canManageContent' as const,
    group: 'Content',
  },
  {
    href: '/admin/content/testimonials',
    label: 'Testimonials',
    icon: MessageSquare,
    permission: 'canManageContent' as const,
    group: 'Content',
  },
  {
    href: '/admin/events',
    label: 'Events',
    icon: Calendar,
    permission: 'canManageEvents' as const,
    group: 'Operations',
  },
  {
    href: '/admin/announcements',
    label: 'Announcements',
    icon: Megaphone,
    permission: 'canManageContent' as const,
    group: 'Operations',
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: BarChart3,
    permission: 'canAccessReports' as const,
    group: 'Analytics',
  },
  {
    href: '/admin/admins',
    label: 'Admin Users',
    icon: Shield,
    permission: 'canManageAdmins' as const,
    group: 'System',
  },
  {
    href: '/admin/activity-log',
    label: 'Activity Log',
    icon: Activity,
    permission: null,
    group: 'System',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    permission: null,
    group: 'System',
  },
];

function groupLinks(
  links: typeof adminLinks,
): Record<string, typeof adminLinks> {
  return links.reduce(
    (acc, link) => {
      const group = link.group;
      if (!acc[group]) acc[group] = [];
      acc[group].push(link);
      return acc;
    },
    {} as Record<string, typeof adminLinks>,
  );
}

/* ─── Floating tooltip for collapsed sidebar ─── */
function Tooltip({
  children,
  label,
  show,
}: {
  children: React.ReactNode;
  label: string;
  show: boolean;
}) {
  const [hover, setHover] = useState(false);

  if (!show) return <>{children}</>;

  return (
    <div
      className="relative group/tooltip"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
      <div
        className={cn(
          'absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[100]',
          'pointer-events-none transition-all duration-200',
          hover
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-1',
        )}
      >
        <div className="relative px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold whitespace-nowrap shadow-xl">
          {label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-foreground" />
        </div>
      </div>
    </div>
  );
}

/* ─── Active indicator pill ─── */
function ActiveIndicator() {
  return (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb,99,102,241),0.5)] transition-all duration-300" />
  );
}

/* ─── Sidebar nav link ─── */
function NavLink({
  link,
  isActive,
  collapsed,
  onClick,
}: {
  link: (typeof adminLinks)[0];
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip label={link.label} show={collapsed}>
      <Link
        href={link.href}
        onClick={onClick}
        className={cn(
          'group/link relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
          collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
          isActive
            ? 'bg-primary/[0.08] text-primary dark:bg-primary/[0.12]'
            : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        )}
      >
        {isActive && <ActiveIndicator />}
        <link.icon
          className={cn(
            'shrink-0 transition-all duration-200',
            collapsed ? 'h-5 w-5' : 'h-4 w-4',
            isActive
              ? 'text-primary drop-shadow-[0_0_6px_rgba(var(--primary-rgb,99,102,241),0.35)]'
              : 'group-hover/link:text-foreground',
          )}
        />
        {!collapsed && (
          <span className="truncate leading-none">{link.label}</span>
        )}
        {isActive && !collapsed && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(var(--primary-rgb,99,102,241),0.6)]" />
        )}
      </Link>
    </Tooltip>
  );
}

/* ─── Sidebar content (shared between mobile drawer & desktop) ─── */
function SidebarContent({
  collapsed,
  onLinkClick,
  onToggleCollapse,
  showCollapseToggle,
}: {
  collapsed: boolean;
  onLinkClick?: () => void;
  onToggleCollapse?: () => void;
  showCollapseToggle?: boolean;
}) {
  const pathname = usePathname();
  const { admin, hasPermission, logout } = useAdminAuthStore();

  const visibleLinks = adminLinks.filter(
    (link) => !link.permission || hasPermission(link.permission),
  );
  const grouped = groupLinks(visibleLinks);

  return (
    <div className="flex flex-col h-full">
      {/* ── Header / Branding ── */}
      <div
        className={cn(
          'shrink-0 border-b border-border/40',
          collapsed ? 'px-3 py-5' : 'px-5 py-5',
        )}
      >
        <div
          className={cn(
            'flex items-center',
            collapsed ? 'justify-center' : 'gap-3',
          )}
        >
          <div className="relative shrink-0">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10"
              style={{ background: 'var(--gradient-premium, linear-gradient(135deg, #6366f1, #8b5cf6))' }}
            >
              <Shield className="h-5 w-5 text-white drop-shadow-sm" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-card shadow-sm" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary/80">
                Admin Portal
              </p>
              <p className="text-xs text-muted-foreground/70 font-medium">
                RootAF
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Admin profile card ── */}
      <div
        className={cn(
          'shrink-0 border-b border-border/40',
          collapsed ? 'px-2 py-3' : 'px-4 py-4',
        )}
      >
        <div
          className={cn(
            'rounded-xl transition-all duration-200',
            collapsed
              ? 'flex justify-center p-2'
              : 'p-3 bg-gradient-to-br from-muted/40 to-muted/20 border border-border/40 shadow-sm',
          )}
        >
          <div
            className={cn(
              'flex items-center',
              collapsed ? 'justify-center' : 'gap-3',
            )}
          >
            <div className="relative shrink-0">
              <PremiumAvatar name={admin?.fullName || ''} size="sm" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-[1.5px] ring-card" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate leading-tight">
                  {admin?.fullName}
                </p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                  <Shield className="h-2.5 w-2.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {admin?.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable navigation ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sidebar-scroll">
        <nav className="space-y-5">
          {Object.entries(grouped).map(([group, links]) => (
            <div key={group}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/50 select-none">
                  {group}
                </p>
              )}
              {collapsed && (
                <div className="flex justify-center mb-2">
                  <span className="h-px w-5 bg-border/60 rounded-full" />
                </div>
              )}
              <div className="space-y-0.5">
                {links.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  return (
                    <NavLink
                      key={link.href}
                      link={link}
                      isActive={isActive}
                      collapsed={collapsed}
                      onClick={onLinkClick}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Footer ── */}
      <div
        className={cn(
          'shrink-0 border-t border-border/40',
          collapsed ? 'px-2 py-3' : 'px-4 py-4',
        )}
      >
        {/* Collapse toggle for tablet/desktop */}
        {showCollapseToggle && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'flex items-center gap-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200 mb-1 w-full',
              collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        )}

        {/* Logout */}
        <Tooltip label="Sign Out" show={collapsed}>
          <button
            onClick={logout}
            className={cn(
              'group/logout flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 w-full',
              collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
              'text-muted-foreground hover:text-destructive hover:bg-destructive/[0.06]',
            )}
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover/logout:-translate-x-0.5" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </Tooltip>

        {/* Version badge */}
        {!collapsed && (
          <div className="mt-3 px-3">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40">
              <Leaf className="h-3 w-3" />
              <span className="font-medium">v2.0.0</span>
              <span className="ml-auto px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] uppercase">
                Stable
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Mobile top bar ─── */
function MobileTopBar({ onOpen }: { onOpen: () => void }) {
  const { admin } = useAdminAuthStore();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 border-b border-border/40 bg-card/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between h-full px-4">
        {/* Hamburger */}
        <button
          onClick={onOpen}
          className="relative h-10 w-10 rounded-xl bg-muted/50 hover:bg-muted/80 flex items-center justify-center transition-all duration-200 active:scale-95"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>

        {/* Center branding */}
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center shadow-md shadow-primary/20"
            style={{ background: 'var(--gradient-premium, linear-gradient(135deg, #6366f1, #8b5cf6))' }}
          >
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary/80 leading-none">
              Admin
            </p>
            <p className="text-[11px] font-semibold text-foreground leading-tight">
              RootAF
            </p>
          </div>
        </div>

        {/* Avatar */}
        <div className="relative">
          <PremiumAvatar name={admin?.fullName || ''} size="sm" />
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-[1.5px] ring-card" />
        </div>
      </div>
    </header>
  );
}

/* ─── Mobile drawer overlay ─── */
function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-card border-r border-border/40 shadow-2xl shadow-black/20 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Close utton */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-8 w-8 rounded-lg bg-muted/60 hover:bg-muted flex items-center justify-center transition-all duration-200 active:scale-90"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>

        <SidebarContent collapsed={false} onLinkClick={onClose} />
      </div>
    </>
  );
}

/* ─── Main export ─── */
export function  AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleMobileClose = useCallback(() => setMobileOpen(false), []);
  const handleMobileOpen = useCallback(() => setMobileOpen(true), []);
  const handleToggleCollapse = useCallback(
    () => setCollapsed((c) => !c),
    [],
  );

  return (
    <>
      {/* Mobile top bar */}
      <MobileTopBar onOpen={handleMobileOpen} />

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={handleMobileClose} />

      {/* Mobile spacer so content isn't hidden behind fixed top bar */}
      <div className="lg:hidden h-16 shrink-0" />

      {/* Desktop / Tablet sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col min-h-screen border-r border-border/40 bg-card/50 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-card/40 transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] shrink-0 sticky top-0 h-screen overflow-hidden',
          collapsed ? 'w-[72px]' : 'w-[272px]',
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          showCollapseToggle
        />
      </aside>

      {/* Global styles for custom scrollbar */}
      <style jsx global>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--border)) transparent;
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: hsl(var(--border));
          border-radius: 9999px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.3);
        }
      `}</style>
    </>
  );
}