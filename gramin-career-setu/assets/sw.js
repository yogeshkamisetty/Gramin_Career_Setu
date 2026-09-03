/**
 * Gramin Career Setu — Service Worker
 * Offline caching for PWA support
 */

const CACHE_NAME = 'gcs-cache-v12';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './login.html',
  './dashboard.html',
  './careers.html',
  './career-detail.html',
  './jobs.html',
  './job-detail.html',
  './quiz.html',
  './quiz-results.html',
  './resume.html',
  './resume-preview.html',
  './workshops.html',
  './resources.html',
  './scholarships.html',
  './schemes.html',
  './roadmap.html',
  './stories.html',
  './about.html',
  './profile.html',
  './results.html',
  './admin/index.html',
  './assets/tokens.css',
  './assets/style.css',
  './assets/landing.css',
  './assets/landing.js',
  './assets/i18n.js',
  './assets/app.js',
  './assets/auth.js',
  './assets/resume-builder-engine.js',
  './assets/auth-village-hero.svg',
  './assets/auth-students-success.svg',
  './assets/auth-otp-phone.svg',
  './assets/dashboard-student-laptop.svg',
  './assets/hero-crossroads.jpg',
  './assets/career-explorer-hero.jpg',
  './assets/quiz-hero-student.jpg',
  './assets/quiz-results-student.jpg',
  './assets/jobs-hero-student.jpg',
  './assets/resume-hero-clipboard.jpg',
  './assets/resume-avatar-ravi.jpg',
  './assets/workshops-hero-class.jpg',
  './assets/resources-hero-folder.svg',
  './assets/stories-hero-trophy.svg',
  './assets/impact-hero-growth.svg',
  './assets/about-hero-students.svg',
  './assets/job-detail-developer.svg',
  './assets/scholarships-hero-cap.svg',
  './assets/schemes-hero-citizens.svg',
  './assets/roadmap-hero-explorer.svg',
  './assets/career-software.jpg',
  './assets/career-civil.jpg',
  './assets/career-teacher.jpg',
  './assets/career-police.jpg',
  './assets/career-bank.jpg',
  './assets/career-agriculture.jpg',
  './assets/profile-ramesh.jpg',
  './assets/profile-lalitha.jpg',
  './assets/profile-suresh.jpg',
  './assets/script.js',
  './assets/quiz.js',
  './assets/resume.js',
  './assets/saas.css',
  './assets/career-data.js',
  './assets/profile.js',
  './assets/roadmap.js',
  './assets/jspdf.umd.min.js',
  './data/lang.json',
  './data/jobs.csv',
];

// ── Install Event: Pre-cache static assets and external CDNs ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching core assets and CDNs...');
        // Cache each asset independently: one optional/missing file must not
        // make the entire offline install fail.
        return Promise.allSettled(ASSETS_TO_CACHE.map(asset => cache.add(asset)));
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
