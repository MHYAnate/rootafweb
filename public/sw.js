// public/sw.js

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `rootaf-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `rootaf-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `rootaf-images-${CACHE_VERSION}`;
const API_CACHE = `rootaf-api-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/images/rootaf.jpeg',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
];

const LIMITS = {
  dynamic: 80,
  images: 120,
  api: 50,
};

function trimCache(cacheName, maxItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(() => trimCache(cacheName, maxItems));
      }
    });
  });
}

function isNavigationRequest(req) {
  return (
    req.mode === 'navigate' ||
    (req.method === 'GET' && req.headers.get('accept')?.includes('text/html'))
  );
}

function isImageRequest(req) {
  const url = new URL(req.url);
  return (
    req.destination === 'image' ||
    /\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(url.pathname) ||
    req.url.includes('res.cloudinary.com')
  );
}

function isStaticAsset(req) {
  const url = new URL(req.url);
  return (
    /\.(js|css|woff|woff2|ttf|otf|eot)$/i.test(url.pathname) ||
    url.pathname.startsWith('/_next/static/')
  );
}

function isApiRequest(req) {
  const url = new URL(req.url);
  return url.pathname.startsWith('/api/') || url.origin !== self.location.origin;
}

// ── INSTALL ──
self.addEventListener('install', (event) => {
  console.log('[SW] Installing:', CACHE_VERSION);
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ── ACTIVATE ──
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating:', CACHE_VERSION);
  const keep = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => !keep.includes(n)).map((n) => caches.delete(n)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── FETCH ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith('http')) return;

  // Cache First: static assets
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((res) => {
              if (res.ok) {
                const clone = res.clone();
                caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
              }
              return res;
            })
            .catch(() => caches.match('/offline')),
      ),
    );
    return;
  }

  // Cache First: images
  if (isImageRequest(request)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((res) => {
              if (res.ok) {
                const clone = res.clone();
                caches.open(IMAGE_CACHE).then((c) => {
                  c.put(request, clone);
                  trimCache(IMAGE_CACHE, LIMITS.images);
                });
              }
              return res;
            })
            .catch(
              () =>
                new Response(
                  Uint8Array.from(
                    atob(
                      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                    ),
                    (c) => c.charCodeAt(0),
                  ),
                  { headers: { 'Content-Type': 'image/png' } },
                ),
            ),
      ),
    );
    return;
  }

  // Network First: API
  if (isApiRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(API_CACHE).then((c) => {
              c.put(request, clone);
              trimCache(API_CACHE, LIMITS.api);
            });
          }
          return res;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // SWR: navigation
  if (isNavigationRequest(request)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const net = fetch(request)
          .then((res) => {
            if (res.ok) {
              const clone = res.clone();
              caches.open(DYNAMIC_CACHE).then((c) => {
                c.put(request, clone);
                trimCache(DYNAMIC_CACHE, LIMITS.dynamic);
              });
            }
            return res;
          })
          .catch(() => caches.match('/offline'));
        return cached || net;
      }),
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((c) => {
            c.put(request, clone);
            trimCache(DYNAMIC_CACHE, LIMITS.dynamic);
          });
        }
        return res;
      })
      .catch(() => caches.match(request)),
  );
});

// ── PUSH ──
self.addEventListener('push', (event) => {
  let data = {
    title: 'RootAF',
    body: 'You have a new notification',
    icon: '/images/icons/icon-192x192.png',
    badge: '/images/icons/badge-72x72.png',
    url: '/',
  };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    if (event.data) data.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      image: data.image,
      vibrate: [100, 50, 100, 50, 200],
      data: { url: data.url, dateOfArrival: Date.now() },
      actions: data.actions || [
        { action: 'open', title: 'Open' },
        { action: 'dismiss', title: 'Dismiss' },
      ],
      tag: data.tag || 'rootaf-notification',
      renotify: true,
    }),
  );
});

// ── NOTIFICATION CLICK ──
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      }),
  );
});

// ── BACKGROUND SYNC ──
self.addEventListener('sync', (event) => {
  if (event.tag === 'rootaf-sync') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((c) =>
          c.postMessage({ type: 'BACKGROUND_SYNC', tag: event.tag }),
        );
      }),
    );
  }
});

// ── MESSAGE ──
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'GET_VERSION')
    event.ports[0]?.postMessage({ version: CACHE_VERSION });
  if (event.data?.type === 'CLEAR_CACHES')
    caches.keys().then((names) =>
      Promise.all(names.map((n) => caches.delete(n))).then(() =>
        event.ports[0]?.postMessage({ cleared: true }),
      ),
    );
});