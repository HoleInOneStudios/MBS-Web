const CACHE_NAME = 'mbs-web-v1';
const APP_FILES = [
    './',
    './index.html',
    './style.css',
    './manifest.webmanifest',
    './scripts/Math.js',
    './scripts/field.js',
    './scripts/importExport.js',
    './scripts/mbs.js',
    './scripts/player.js',
    './scripts/show.js',
    './fonts/Clarendon-Light.otf',
    './image/android-chrome-192x192.png',
    './image/android-chrome-512x512.png',
    './image/apple-touch-icon.png',
    './image/favicon-16x16.png',
    './image/favicon-32x32.png'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key != CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.method != 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
