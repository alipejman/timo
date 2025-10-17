/* public/sw.js */
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `timo-static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `timo-runtime-${CACHE_VERSION}`;

// App Shell دقیقاً بر اساس فایل‌های موجود در public شما
const APP_SHELL = [
  '/',
  '/index.html',
  '/pomodoro.html',
  '/mood.html',
  '/checklist.html',
  '/manifest.json',
  '/js/timer.js',
  '/favicon-32.png',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// الگوهای API پروژه
const API_PATTERNS = [
  /\/api\/health/i,
  /\/api\/checklist/i,
  /\/api\/timer/i,
  /\/api\/mood/i
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // نسخه‌ی جدید سریع فعال شود
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      // اضافه کردن فایل‌ها یکی یکی برای جلوگیری از خطا
      return Promise.allSettled(
        APP_SHELL.map(url => 
          fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
          }).catch(err => {
            console.log('Failed to cache:', url, err);
          })
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map(k => {
        if (![STATIC_CACHE, RUNTIME_CACHE].includes(k)) {
          return caches.delete(k);
        }
      })
    );
    await self.clients.claim();
  })());
});

function isApiRequest(url) {
  const u = new URL(url);
  return API_PATTERNS.some(rx => rx.test(u.pathname));
}

// Cache First برای استاتیک‌ها
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const res = await fetch(request);
    if (res && res.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, res.clone());
    }
    return res;
  } catch (error) {
    console.log('Cache first failed for:', request.url, error);
    return new Response('', { status: 404 });
  }
}

// Stale-While-Revalidate برای APIها
async function staleWhileRevalidate(request) {
  try {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);
    const network = fetch(request)
      .then(res => {
        if (res && res.ok) cache.put(request, res.clone());
        return res;
      })
      .catch(() => cached);
    return cached || network;
  } catch (error) {
    console.log('Stale while revalidate failed for:', request.url, error);
    return new Response('', { status: 404 });
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  try {
    if (isApiRequest(request.url)) {
      event.respondWith(staleWhileRevalidate(request));
      return;
    }

    const url = new URL(request.url);

    if (url.origin === self.location.origin) {
      event.respondWith(cacheFirst(request));
      return;
    }

    // برای تصاویر خارجی، فقط fetch کن و cache نکن
    if (request.destination === 'image' && !url.origin.includes(self.location.origin)) {
      event.respondWith(fetch(request).catch(() => {
        // اگر تصویر بارگذاری نشد، یک تصویر خالی برگردان
        return new Response('', {
          status: 200,
          statusText: 'OK',
          headers: { 'Content-Type': 'image/png' }
        });
      }));
      return;
    }

    event.respondWith(fetch(request).catch(() => caches.match(request)));
  } catch (error) {
    console.log('Fetch event error:', error);
    event.respondWith(new Response('', { status: 404 }));
  }
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
