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
};

export const metadata: Metadata = {
  title: {
    default: 'Uplifting Root Artisan Farmers Development Foundation',
    template: '%s | URAFD',
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
  authors: [{ name: 'URAFD' }],
  creator: 'URAFD',
  publisher: 'Uplifting Root Artisan Farmers Development Foundation',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://upliftingroot.org'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'URAFD',
    title: 'Uplifting Root Artisan Farmers Development Foundation',
    description: 'Empowering artisan farmers across Nigeria',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URAFD',
    description: 'Empowering artisan farmers across Nigeria',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}