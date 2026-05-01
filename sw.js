const CACHE = 'thai-challenge-v6';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './fonts/mplus-japanese-700.woff2',
  './fonts/mplus-latin-700.woff2',
  './fonts/mplus-japanese-900.woff2',
  './fonts/mplus-latin-900.woff2',
  './sheets/1a.webp',
  './sheets/1b.webp',
  './sheets/1c.webp',
  './sheets/2a.webp',
  './sheets/2b.webp',
  './sheets/2c.webp',
  './sheets/2d.webp',
  './sheets/3a.webp',
  './sheets/3b.webp',
  './sheets/3c.webp',
  './sheets/3d.webp',
  './sheets/4a.webp',
  './sheets/4b.webp',
  './sheets/5a.webp',
  './sheets/5b.webp',
];

// Install — cache everything, take over immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches and take control of open tabs
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache first, fallback to network
self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
