// app/manifest.ts

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Uplifting Root Artisan Farmers Development Foundation',
    short_name: 'RootAF',
    description:
      'Empowering artisan farmers across Nigeria through skills development, market access, and community support.',
    start_url: '/',
    scope: '/',
    id: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    orientation: 'portrait-primary',
    theme_color: '#4a9d6e',
    background_color: '#fafdf9',
    lang: 'en',
    dir: 'ltr',
    categories: [
      'community',
      'agriculture',
      'business',
      'social',
      'lifestyle',
    ],
    prefer_related_applications: false,
    icons: [
      {
        src: '/images/icons/icon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-256x256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/icons/maskable-icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/images/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/images/screenshots/desktop-home.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'RootAF Home — Desktop',
      },
      {
        src: '/images/screenshots/mobile-home.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'RootAF Home — Mobile',
      },
    ],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        url: '/dashboard',
        description: 'View your dashboard',
        icons: [
          {
            src: '/images/icons/shortcut-dashboard.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Members',
        short_name: 'Members',
        url: '/members',
        description: 'Browse community members',
        icons: [
          {
            src: '/images/icons/shortcut-members.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Products',
        short_name: 'Products',
        url: '/products',
        description: 'Discover farm products',
        icons: [
          {
            src: '/images/icons/shortcut-products.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Events',
        short_name: 'Events',
        url: '/events',
        description: 'Upcoming events',
        icons: [
          {
            src: '/images/icons/shortcut-events.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
  };
}