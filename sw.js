const CACHE = 'thai-challenge-v3';

const ASSETS = [
  './',
  './index.html',
  './challenges.js',
  './manifest.json',
  './fonts/mplus-japanese-700.woff2',
  './fonts/mplus-latin-700.woff2',
  './fonts/mplus-japanese-900.woff2',
  './fonts/mplus-latin-900.woff2',
];

// Install — cache everything
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — page and challenge data: network first (so edits show up), cache when offline.
//         Everything else (fonts): cache first.
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const fresh = e.request.mode === 'navigate' || url.pathname.endsWith('challenges.js');

  if (fresh) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
