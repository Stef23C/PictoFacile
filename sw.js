
/* PictoFacile - Service Worker PWA */
const CACHE = 'pictofacile-shell-v3';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './PictoFacile_logo.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('pictofacile-shell-') && k !== CACHE)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isShell = ASSETS.some(asset => {
    const assetURL = new URL(asset, self.registration.scope);
    return assetURL.pathname === url.pathname;
  });

  if (!isShell) return;

  event.respondWith(
    caches.match(request, { ignoreSearch: true })
      .then(cached => cached || fetch(request))
  );
});
