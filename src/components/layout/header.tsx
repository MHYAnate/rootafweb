'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/auth-store';
import { PremiumAvatar } from '@/components/shared/premium-avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const navLinks = [
  { href: '/members', label: 'Members' },
  { href: '/products', label: 'Products' },
  { href: '/services', label: 'Services' },
  { href: '/tools', label: 'Tools' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50'
          : 'bg-white border-b border-transparent',
      )}
    >
      <div className="container-custom flex h-16 lg:h-[72px] items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'var(--gradient-premium)' }}
          >
            <Image src="/image/rootaf.jpeg" alt="RootAF Logo" width={20} height={20} />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-gradient-premium">
              RootAF
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                pathname === link.href
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/search">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl h-10 w-10"
            >
              <Search className="h-[18px] w-[18px]" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl h-10 w-10 relative"
                >
                  <Bell className="h-[18px] w-[18px]" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white" />
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-xl h-10 pl-1.5 pr-3"
                  >
                    <PremiumAvatar
                      name={user?.fullName || ''}
                      size="sm"
                      verified={
                        user?.verificationStatus === 'VERIFIED'
                      }
                    />
                    <span className="hidden md:block text-sm font-medium">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-60 rounded-xl p-2"
                >
                  <div className="px-3 py-2.5 mb-1">
                    <p className="text-sm font-semibold">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.phoneNumber}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer"
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer"
                  >
                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-lg cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2.5" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg font-medium"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="rounded-lg font-medium btn-premium"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-xl h-10 w-10"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white/98 backdrop-blur-md animate-fade-in">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pt-4 border-t mt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-xl"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    className="w-full rounded-xl btn-premium"
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}