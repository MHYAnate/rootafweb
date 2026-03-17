// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4a9d6e' },
    { media: '(prefers-color-scheme: dark)', color: '#1a2e23' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  title: {
    default: 'Uplifting Root Artisan Farmers Development Foundation',
    template: '%s | RootAF',
  },
  description:
    'Empowering artisan farmers across Nigeria through skills development, market access, and community support.',
  keywords: [
    'farmers',
    'artisans',
    'Nigeria',
    'agriculture',
    'craftsmanship',
    'foundation',
    'marketplace',
    'farming tools',
    'artisan products',
  ],
  authors: [{ name: 'RootAF' }],
  creator: 'RootAF',
  publisher: 'Uplifting Root Artisan Farmers Development Foundation',
  applicationName: 'RootAF',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://upliftingroot.org',
  ),
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },

  // PWA manifest
  manifest: '/manifest.webmanifest',

  // Apple PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RootAF',
    startupImage: [
      {
        url: '/images/splash/apple-splash-750x1334.png',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/images/splash/apple-splash-1125x2436.png',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/images/splash/apple-splash-828x1792.png',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/images/splash/apple-splash-1242x2688.png',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/images/splash/apple-splash-1170x2532.png',
        media:
          '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/images/splash/apple-splash-1284x2778.png',
        media:
          '(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/images/splash/apple-splash-1179x2556.png',
        media:
          '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/images/splash/apple-splash-1290x2796.png',
        media:
          '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/images/splash/apple-splash-1536x2048.png',
        media:
          '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/images/splash/apple-splash-2048x2732.png',
        media:
          '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },

  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'RootAF',
    title: 'Uplifting Root Artisan Farmers Development Foundation',
    description: 'Empowering artisan farmers across Nigeria',
    images: [{ url: '/images/rootaf.jpeg', width: 1200, height: 630 }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'RootAF',
    description: 'Empowering artisan farmers across Nigeria',
    images: ['/images/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },

  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#4a9d6e',
    'msapplication-TileImage': '/images/icons/icon-144x144.png',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/icons/apple-touch-icon.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/images/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/images/icons/icon-120x120.png"
        />
        <meta
          name="msapplication-TileImage"
          content="/images/icons/icon-144x144.png"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}