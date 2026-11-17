/**
 * Gramin Career Setu — Service Worker
 * Offline caching for PWA support & resilient navigation
 */

const CACHE_NAME = 'gcs-cache-v21';
const ASSETS_TO_CACHE = [
  // ── App shell ───────────────────────────────────────────────────────────
  // Only what a student needs on a first offline visit. Everything else —
  // careers, schemes, scholarships, stories, the admin pages and their
  // images — is cached by the fetch handler below the first time it is
  // opened, so it costs nothing until it is actually wanted.
  './',
  './index.html',
  './404.html',

  // Styles and scripts every page loads
  './assets/fonts/text.css',
  './assets/tokens.css',
  './assets/style.css',
  './assets/saas.css',
  './assets/landing.css',
  './assets/ui.css',
  './assets/i18n-dict.js',
  './assets/i18n.js',
  './assets/api.js',
  './assets/app.js',
  './assets/actions.js',
  './assets/auth.js',
  './assets/landing.js',
  './assets/pdf-loader.js',
  './assets/firebase-config.js',

  // Content data
  './data/jobs-data.js',
  './data/roadmaps.js',
  './data/survey-data.js',
  './data/workshops.js',

  // Fonts: Latin and Telugu subsets only
  './assets/fonts/files/567244088c9c.woff2',
  './assets/fonts/files/8e11d0a3a21c.woff2',
  './assets/fonts/files/2f8d8ec7d7a4.woff2',
  './assets/fonts/files/plus-jakarta-sans-var.woff2',

  // The pages a student is most likely to want without a connection
  './jobs.html',
  './quiz.html',
  './quiz-results.html',
  './roadmap.html',
  './resume.html',
  './resume-preview.html',
  './apply-online.html',

  // Light illustrations used by those pages
  './assets/hero-crossroads.webp',
  './assets/jobs-hero-student.webp',
  './assets/quiz-hero-student.webp',
  './assets/resume-hero-clipboard.webp',
  './assets/roadmap-hero-explorer.svg',
  './assets/resources-hero-folder.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './manifest.json'
];

// ── Install Event: Pre-cache static assets and core shell ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching core assets and CDNs...');
        return Promise.allSettled(ASSETS_TO_CACHE.map(asset => cache.add(asset)));
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[Service Worker] Caching failed during install:', err))
  );
});

// ── Activate Event: Clean up old caches & take control immediately ──
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

  // Only GET responses can be cached; POSTs (analytics, auth) go straight out.
  if (event.request.method !== 'GET') return;

  // 1. Google Sheets CSV, Firebase Auth, Google sign-in and reCAPTCHA bypass
  // (Network-Only). Serving these cache-first would pin a stale copy of
  // Google's login/reCAPTCHA scripts and break sign-in when they change.
  if (
    url.hostname === 'docs.google.com' ||
    url.hostname === 'www.google.com' ||
    url.hostname === 'apis.google.com' ||
    url.hostname === 'accounts.google.com' ||
    url.hostname.endsWith('firebaseapp.com') ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('googletagmanager.com') ||
    url.pathname.startsWith('/recaptcha/') ||
    url.pathname.startsWith('/__/') ||
    url.pathname.includes('spreadsheets') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('identitytoolkit')
  ) {
    return; // Direct network request, do not intercept
  }

  // 2. Navigation Requests (HTML Pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Follow redirects explicitly so 301/302 redirects (e.g. careers.html -> /careers) resolve to 200 OK
          const networkResponse = await fetch(event.request.url, {
            method: 'GET',
            headers: event.request.headers,
            credentials: 'same-origin',
            redirect: 'follow',
            // Revalidate with the server instead of reusing the browser's
            // HTTP cache, or a deploy stays invisible until that copy expires.
            cache: 'no-cache'
          });

          if (networkResponse && networkResponse.ok) {
            // CRITICAL: Chrome throws net::ERR_FAILED if a response with redirected: true is
            // returned to navigation FetchEvent.respondWith(). When Firebase redirects .html to clean URLs,
            // re-constructing a new Response object sets redirected: false and renders seamlessly!
            let responseToReturn = networkResponse;
            if (networkResponse.redirected) {
              const body = await networkResponse.text();
              responseToReturn = new Response(body, {
                status: networkResponse.status,
                statusText: networkResponse.statusText,
                headers: networkResponse.headers
              });
            }

            if (networkResponse.status === 200) {
              const copy = responseToReturn.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
            }
            return responseToReturn;
          }

          if (networkResponse && networkResponse.status === 404) {
            return networkResponse;
          }
        } catch (_) {
          // Network failed or offline - fall back to cache
        }

        // Clean path resolution for offline matching (matches both /careers and /careers.html)
        const cleanPath = url.pathname.replace(/\.html$/, '');
        const htmlPath = cleanPath + '.html';
        const cached = (await caches.match(event.request))
                    || (await caches.match(cleanPath))
                    || (await caches.match(htmlPath))
                    || (await caches.match('/index.html'))
                    || (await caches.match('./index.html'))
                    || (await caches.match('./'))
                    || (await caches.match('/'));
        if (cached) return cached;

        const fallback404 = (await caches.match('./404.html')) || (await caches.match('/404.html'));
        if (fallback404) return fallback404;

        return new Response('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Offline</title></head><body style="font-family:sans-serif;text-align:center;padding:40px;"><h2>You are offline</h2><p>Please check your connection and reload.</p></body></html>', {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      })()
    );
    return;
  }

  // 3. Cache-First Strategy for all static assets and CDN libraries
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then(networkResponse => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const fallback = await caches.match(event.request);
          if (fallback) return fallback;
          return new Response('', { status: 408, statusText: 'Request timed out or offline' });
        });
    })
  );
});
