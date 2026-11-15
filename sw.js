/* PictoFacile Beta 1: cache only app shell and local icons. Do not cache remote API responses or personal data. */
const CACHE = 'pictofacile-shell-beta2';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./PictoFacile_logo.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-192.png','./icons/icon-maskable-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('pictofacile-shell-') && k !== CACHE).map(k => caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // ARASAAC/network requests stay online
  const path = url.pathname;
  const isShell = path.endsWith('/index.html') || path.endsWith('/') || path.endsWith('/manifest.webmanifest') || path.endsWith('/PictoFacile_logo.png') || /\/icons\/icon-(?:maskable-)?(?:192|512)\.png$/.test(path);
  if (!isShell) return;
  event.respondWith(caches.match(request, {ignoreSearch:true}).then(cached => cached || fetch(request)));
});
