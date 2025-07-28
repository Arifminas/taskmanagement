// public/sw.js
const CACHE_NAME = 'task-app-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  // add your CSS/JS bundles here
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
