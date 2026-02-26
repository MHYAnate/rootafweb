import Link from 'next/link';
import { Phone, Mail, MapPin, Leaf, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="relative bg-green-900 text-green-100 overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 dot-pattern opacity-[0.03]" />

      {/* Gold Accent Line */}
      <div className="gold-divider" />

      <div className="container-custom relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--gradient-premium)' }}
              >
                <Image src="/image/rootaf.jpeg" alt="RootAF Logo" width={20} height={20} />
              </div>
              <span className="text-xl font-bold text-white">
                URAFD
              </span>
            </div>
            <p className="text-sm leading-relaxed text-green-200/80">
              Uplifting the Root Artisan Farmers Development Foundation.
              Empowering artisan farmers across Nigeria through skills
              development, market access, and community support.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="text-xs text-green-300/60">
                IT Number: 8552454
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span
                className="h-1 w-6 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, hsl(42 85% 55%), transparent)',
                }}
              />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/members', label: 'Our Members' },
                { href: '/products', label: 'Products' },
                { href: '/services', label: 'Services' },
                { href: '/tools', label: 'Tool Marketplace' },
                { href: '/events', label: 'Events' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-green-200/70 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Members */}
          <div>
            <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span
                className="h-1 w-6 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, hsl(42 85% 55%), transparent)',
                }}
              />
              Get Started
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/register/member"
                  className="text-green-200/70 hover:text-white transition-colors"
                >
                  Join as Member
                </Link>
              </li>
              <li>
                <Link
                  href="/register/client"
                  className="text-green-200/70 hover:text-white transition-colors"
                >
                  Join as Client
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-green-200/70 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-green-200/70 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-green-200/70 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span
                className="h-1 w-6 rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, hsl(42 85% 55%), transparent)',
                }}
              />
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-green-200/70">Kaduna, Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-green-200/70">
                  +234 800 000 0000
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-green-200/70">
                  info@upliftingroot.org
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="green-divider mt-12 mb-8 opacity-30" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-green-300/50">
          <p>
            © {new Date().getFullYear()} Uplifting the Root Artisan Farmers
            Development Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-green-200 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-green-200 transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}