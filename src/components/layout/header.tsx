// components/layout/header.tsx

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  ArrowRight,
  Package,
  Wrench,
  Users,
  Calendar,
  Info,
  Phone,
  Hammer,
  ChevronRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth-store';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════
// NAV CONFIG
// ═══════════════════════════════════════════════════════════

const navLinks = [
  { href: '/members', label: 'Members', icon: Users },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/services', label: 'Services', icon: Wrench },
  { href: '/tools', label: 'Tools', icon: Hammer },
  { href: '/events', label: 'Events', icon: Calendar },
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Phone },
];

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();

  // ── Scroll tracking ──
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);
      setScrollDirection(currentY > lastScrollY.current && currentY > 80 ? 'down' : 'up');
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close mobile on route change ──
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ── Lock body scroll when mobile menu open ──
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full',
          'transition-all duration-500 ease-out',
          scrollDirection === 'down' && scrolled && !mobileOpen
            ? '-translate-y-full'
            : 'translate-y-0',
          scrolled
            ? [
                'bg-white/80 dark:bg-gray-950/80',
                'backdrop-blur-xl backdrop-saturate-150',
                'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,0,0,0.04)]',
                'dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_12px_rgba(0,0,0,0.15)]',
                'border-b border-black/[0.04] dark:border-white/[0.06]',
              ]
            : [
                'bg-white dark:bg-gray-950',
                'border-b border-transparent',
              ],
        )}
      >
        {/* ── Top accent line ── */}
        <div className="h-[2px] bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 transition-opacity duration-500"
          style={{ opacity: scrolled ? 0 : 0 }}
        />

        <div className="container-custom">
          <div className="flex h-16 lg:h-[70px] items-center justify-between gap-4">

            {/* ═══════════ LOGO ═══════════ */}
            <Link
              href="/"
              className="flex items-center gap-3 group shrink-0 relative"
            >
              {/* Logo image - clean, no background wrapper */}
              <Image
                src="/images/rootaf.jpeg"
                alt="RootAF"
                width={40}
                height={40}
                className={cn(
                  'h-9 w-9 rounded-xl object-cover',
                  'ring-1 ring-black/[0.08] dark:ring-white/[0.12]',
                  'transition-all duration-500 ease-out',
                  'group-hover:ring-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10',
                  'group-hover:scale-105',
                )}
                priority
              />

              {/* Brand text */}
              <div className="hidden sm:flex flex-col">
                <span
                  className={cn(
                    'text-[1.15rem] font-extrabold tracking-tight leading-none',
                    'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700',
                    'dark:from-white dark:via-gray-100 dark:to-gray-300',
                    'bg-clip-text text-transparent',
                    'transition-all duration-300',
                    'group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary/70',
                  )}
                >
                  RootAF
                </span>
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted-foreground/50 leading-none mt-0.5">
                  Foundation
                </span>
              </div>
            </Link>

            {/* ═══════════ DESKTOP NAV ═══════════ */}
            <nav className="hidden lg:flex items-center">
              <div
                className={cn(
                  'flex items-center gap-0.5 px-1.5 py-1',
                  'rounded-2xl',
                  scrolled && 'bg-gray-50/80 dark:bg-gray-900/50',
                  'transition-colors duration-500',
                )}
              >
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'relative px-3.5 py-2 text-[13px] font-semibold rounded-xl',
                        'transition-all duration-300 ease-out',
                        'outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                        active
                          ? [
                              'text-primary',
                              scrolled
                                ? 'bg-white dark:bg-gray-800 shadow-sm shadow-black/[0.04] dark:shadow-black/20'
                                : 'bg-primary/[0.06]',
                            ]
                          : [
                              'text-gray-600 dark:text-gray-400',
                              'hover:text-gray-900 dark:hover:text-gray-100',
                              'hover:bg-gray-100/80 dark:hover:bg-gray-800/60',
                            ],
                      )}
                    >
                      {link.label}

                      {/* Active dot indicator */}
                      {active && (
                        <span
                          className={cn(
                            'absolute -bottom-0.5 left-1/2 -translate-x-1/2',
                            'h-[3px] w-4 rounded-full',
                            'bg-gradient-to-r from-primary to-primary/70',
                          )}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* ═══════════ RIGHT ACTIONS ═══════════ */}
            <div className="flex items-center gap-1.5">

              {/* Search */}
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'rounded-xl h-9 w-9',
                    'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                    'hover:bg-gray-100/80 dark:hover:bg-gray-800/60',
                    'transition-all duration-200',
                  )}
                >
                  <Search className="h-[17px] w-[17px]" strokeWidth={2.2} />
                </Button>
              </Link>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <Link href="/notifications">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'rounded-xl h-9 w-9 relative',
                        'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                        'hover:bg-gray-100/80 dark:hover:bg-gray-800/60',
                        'transition-all duration-200',
                      )}
                    >
                      <Bell className="h-[17px] w-[17px]" strokeWidth={2.2} />
                      {/* Notification badge */}
                      <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950" />
                      </span>
                    </Button>
                  </Link>

                  {/* User dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          'gap-2 rounded-xl h-9 pl-1 pr-2.5',
                          'hover:bg-gray-100/80 dark:hover:bg-gray-800/60',
                          'transition-all duration-200',
                          'data-[state=open]:bg-gray-100/80 dark:data-[state=open]:bg-gray-800/60',
                        )}
                      >
                        <PremiumAvatar
                          name={user?.fullName || ''}
                          size="sm"
                          verified={user?.verificationStatus === 'VERIFIED'}
                        />
                        <span className="hidden md:block text-[13px] font-semibold text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                          {user?.fullName?.split(' ')[0]}
                        </span>
                        <ChevronDown className="h-3 w-3 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      sideOffset={8}
                      className={cn(
                        'w-64 rounded-2xl p-1.5',
                        'bg-white/95 dark:bg-gray-900/95',
                        'backdrop-blur-xl backdrop-saturate-150',
                        'border border-black/[0.08] dark:border-white/[0.08]',
                        'shadow-xl shadow-black/10 dark:shadow-black/30',
                        'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
                        'duration-200',
                      )}
                    >
                      {/* User info header */}
                      <div className="px-3 py-3 mb-1">
                        <div className="flex items-center gap-3">
                          <PremiumAvatar
                            name={user?.fullName || ''}
                            size="md"
                            verified={user?.verificationStatus === 'VERIFIED'}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {user?.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user?.phoneNumber}
                            </p>
                            {user?.verificationStatus === 'VERIFIED' && (
                              <div className="flex items-center gap-1 mt-1">
                                <Shield className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Verified
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenuSeparator className="bg-border/50 mx-2" />

                      <DropdownMenuGroup className="p-1">
                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 px-3 focus:bg-gray-50 dark:focus:bg-gray-800/60">
                          <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                              <LayoutDashboard className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Dashboard</p>
                              <p className="text-[11px] text-muted-foreground">Overview & analytics</p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 px-3 focus:bg-gray-50 dark:focus:bg-gray-800/60">
                          <Link href="/profile" className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">My Profile</p>
                              <p className="text-[11px] text-muted-foreground">View & edit profile</p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2.5 px-3 focus:bg-gray-50 dark:focus:bg-gray-800/60">
                          <Link href="/settings" className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/10">
                              <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Settings</p>
                              <p className="text-[11px] text-muted-foreground">Preferences & security</p>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>

                      <DropdownMenuSeparator className="bg-border/50 mx-2" />

                      <div className="p-1">
                        <DropdownMenuItem
                          onClick={logout}
                          className={cn(
                            'rounded-xl cursor-pointer py-2.5 px-3',
                            'text-red-600 dark:text-red-400',
                            'focus:text-red-700 dark:focus:text-red-300',
                            'focus:bg-red-50 dark:focus:bg-red-950/30',
                          )}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 mr-3">
                            <LogOut className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">Sign Out</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                /* ── Auth buttons (desktop) ── */
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'rounded-xl font-semibold text-[13px] h-9 px-4',
                        'text-gray-700 dark:text-gray-300',
                        'hover:bg-gray-100/80 dark:hover:bg-gray-800/60',
                        'transition-all duration-200',
                      )}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className={cn(
                        'rounded-xl font-semibold text-[13px] h-9 px-5',
                        'bg-gradient-to-r from-primary to-primary/90',
                        'hover:from-primary/95 hover:to-primary/85',
                        'shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25',
                        'hover:-translate-y-[1px]',
                        'transition-all duration-300 active:scale-[0.97]',
                        'text-primary-foreground',
                      )}
                    >
                      Get Started
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* ── Mobile hamburger ── */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'lg:hidden rounded-xl h-9 w-9 ml-0.5',
                  'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                  'hover:bg-gray-100/80 dark:hover:bg-gray-800/60',
                  'transition-all duration-200',
                )}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <div className="relative h-5 w-5">
                  <Menu
                    className={cn(
                      'absolute inset-0 h-5 w-5 transition-all duration-300',
                      mobileOpen ? 'rotate-90 opacity-0 scale-75' : 'rotate-0 opacity-100 scale-100',
                    )}
                    strokeWidth={2.2}
                  />
                  <X
                    className={cn(
                      'absolute inset-0 h-5 w-5 transition-all duration-300',
                      mobileOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-75',
                    )}
                    strokeWidth={2.2}
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ MOBILE OVERLAY ═══════════ */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          'transition-all duration-500',
          mobileOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 pointer-events-none',
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm',
            'transition-opacity duration-500',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={closeMobile}
        />

        {/* Panel */}
        <div
          className={cn(
            'absolute top-[65px] left-0 right-0 bottom-0',
            'bg-white dark:bg-gray-950',
            'border-t border-border/50',
            'overflow-y-auto overscroll-contain',
            'transition-all duration-500 ease-out',
            mobileOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-4 opacity-0',
          )}
        >
          <div className="container-custom py-6">
            {/* Nav links */}
            <nav className="space-y-1">
              {navLinks.map((link, idx) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3.5 rounded-2xl',
                      'text-[15px] font-semibold',
                      'transition-all duration-300 ease-out',
                      'animate-fade-up',
                      active
                        ? 'text-primary bg-primary/[0.06]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900/50',
                    )}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        'transition-colors duration-300',
                        active
                          ? 'bg-primary/10'
                          : 'bg-gray-100 dark:bg-gray-800/60',
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px]',
                          active
                            ? 'text-primary'
                            : 'text-gray-500 dark:text-gray-400',
                        )}
                        strokeWidth={2}
                      />
                    </div>
                    <span className="flex-1">{link.label}</span>
                    {active && (
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User section or auth buttons */}
            {isAuthenticated ? (
              <div
                className="mt-6 pt-6 border-t border-border/50 animate-fade-up"
                style={{ animationDelay: '400ms' }}
              >
                {/* User card */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900/50 mb-4">
                  <PremiumAvatar
                    name={user?.fullName || ''}
                    size="md"
                    verified={user?.verificationStatus === 'VERIFIED'}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.phoneNumber}
                    </p>
                  </div>
                  {user?.verificationStatus === 'VERIFIED' && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                      <Shield className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-primary bg-primary/10' },
                    { href: '/profile', icon: User, label: 'Profile', color: 'text-blue-600 bg-blue-500/10' },
                    { href: '/settings', icon: Settings, label: 'Settings', color: 'text-gray-600 bg-gray-500/10' },
                  ].map((action) => (
                    <Link
                      key={action.href}
                      href={action.href}
                      onClick={closeMobile}
                      className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                    >
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', action.color)}>
                        <action.icon className="h-[18px] w-[18px]" />
                      </div>
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {action.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Sign out */}
                <button
                  onClick={() => {
                    logout();
                    closeMobile();
                  }}
                  className={cn(
                    'w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl',
                    'text-red-600 dark:text-red-400 font-semibold text-[15px]',
                    'bg-red-50/80 dark:bg-red-950/20',
                    'hover:bg-red-100 dark:hover:bg-red-950/40',
                    'transition-colors duration-200',
                    'active:scale-[0.98]',
                  )}
                >
                  <LogOut className="h-[18px] w-[18px]" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div
                className="mt-8 pt-6 border-t border-border/50 space-y-3 animate-fade-up"
                style={{ animationDelay: '400ms' }}
              >
                {/* Feature callout */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/[0.04] border border-primary/10 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      Join the Community
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Connect with farmers and artisans across Nigeria
                    </p>
                  </div>
                </div>

                <Link href="/register" onClick={closeMobile}>
                  <Button
                    className={cn(
                      'w-full rounded-2xl h-13 text-[15px] font-bold',
                      'bg-gradient-to-r from-primary to-primary/90',
                      'hover:from-primary/95 hover:to-primary/85',
                      'shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25',
                      'transition-all duration-300 active:scale-[0.98]',
                      'text-primary-foreground',
                    )}
                    size="lg"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <Link href="/login" onClick={closeMobile}>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full rounded-2xl h-13 text-[15px] font-semibold',
                      'border-gray-200 dark:border-gray-800',
                      'hover:bg-gray-50 dark:hover:bg-gray-900/50',
                      'transition-all duration-200',
                    )}
                    size="lg"
                  >
                    Sign In
                  </Button>
                </Link>

                <p className="text-center text-[11px] text-muted-foreground/60 pt-2">
                  Free registration · No hidden fees · Verified community
                </p>
              </div>
            )}

            {/* Bottom spacing for safe area */}
            <div className="h-20" />
          </div>
        </div>
      </div>
    </>
  );
}