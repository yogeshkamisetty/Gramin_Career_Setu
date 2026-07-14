/**
 * Gramin Career Setu — Service Worker
 * Offline caching for PWA support
 */

const CACHE_NAME = 'gcs-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './jobs.html',
  './quiz.html',
  './results.html',
  './resume.html',
  './assets/style.css',
  './assets/script.js',
  './assets/quiz.js',
  './assets/resume.js',
  './manifest.json',
  './data/lang.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
];

// ── Install Event: Pre-cache static assets and external CDNs ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching core assets and CDNs...');
        // We use map & Promise.allSettled or cache.addAll to cache.
        // If one fails, we still want the rest to be cached, but cache.addAll fails if any item fails.
        // To be safe, we will add them all. If they are locally hosted, they should succeed.
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[Service Worker] Caching failed during install:', err))
  );
});

// ── Activate Event: Clean up old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Fetch Event: Intercept network requests ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Google Sheets CSV bypass (Network-Only)
  // Let the script's own fetchSheetWithCache handle localStorage-based offline fallback.
  if (url.hostname === 'docs.google.com' || url.pathname.includes('spreadsheets')) {
    return; // Direct network request, do not intercept
  }

  // 2. Cache-First Strategy for all static assets and CDN libraries
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache
          return cachedResponse;
        }

        // Fallback to network
        return fetch(event.request)
          .then(networkResponse => {
            // Only cache valid standard responses (status 200 or 0 for CORS)
            if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(err => {
            console.warn('[Service Worker] Fetch failed for:', event.request.url, err);
            // Offline fallback could be added here if needed
          });
      })
  );
});
