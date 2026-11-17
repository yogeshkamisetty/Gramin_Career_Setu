/**
 * Gramin Career Setu — Firebase Integration & Telemetry Module
 * గ్రామీణ కెరీర్ సేతు — ఫైర్‌బేస్ డేటా & లాగింగ్ సర్వీస్
 * 
 * Provides:
 * 1. Offline-first Firestore synchronization (IndexedDB persistence)
 * 2. Phone Number OTP & Anonymous Guest Authentication
 * 3. Client-side Telemetry & User Activity Logging
 * 4. Resilient Offline Operation Queue
 */

(function () {
  'use strict';

  // Live Firebase configuration for Gramin Career Setu
  const FIREBASE_CONFIG = window.GCS_FIREBASE_CONFIG || {
    apiKey: "AIzaSyBFs6Rv5ZOz0G1Z3F66SZrLS6OA8nXH280",
    authDomain: "gramin-career-setu.firebaseapp.com",
    projectId: "gramin-career-setu",
    storageBucket: "gramin-career-setu.firebasestorage.app",
    messagingSenderId: "95695324484",
    appId: "1:95695324484:web:2cda42af7511d84d2d8311",
    measurementId: "G-GRXPFVGWQX"
  };

  const OFFLINE_QUEUE_KEY = 'gcs_firebase_offline_queue';

  class FirebaseService {
    constructor() {
      this.isInitialized = false;
      this.isMockMode = true; // Safe fallback until CDN / network loads
      this.currentUser = null;
      this.db = null;
      this.auth = null;
      this.analytics = null;
      // Resolves once Firebase has restored (or ruled out) a signed-in user,
      // so a save made right after page load uses the right account.
      this.authReady = new Promise(res => { this._resolveAuthReady = res; });
      this.init();
    }

    async init() {
      // 1. Load cached user from localStorage immediately
      try {
        const cached = localStorage.getItem('gcs_user');
        if (cached) this.currentUser = JSON.parse(cached);
      } catch (e) {}

      // 2. Ensure Firebase scripts are available or load from Google CDN
      try {
        await this.ensureFirebaseScripts();
      } catch (err) {
        console.warn('[Firebase] CDN script loading delayed or offline:', err);
      }

      // 3. Initialize Firebase SDK if available
      if (window.firebase) {
        try {
          if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
          }
          this.auth = firebase.auth();
          this.db = firebase.firestore();

          // Enable IndexedDB offline persistence for rural resilience
          this.db.enablePersistence({ synchronizeTabs: true }).catch(err => {
            if (err.code === 'failed-precondition') {
              console.warn('[Firebase] Multiple tabs open, persistence in first tab');
            } else if (err.code === 'unimplemented') {
              console.warn('[Firebase] Browser does not support IndexedDB persistence');
            }
          });

          if (firebase.analytics) {
            try {
              this.analytics = firebase.analytics();
            } catch (e) {}
          }

          this.isMockMode = false;
          this.isInitialized = true;
          this.listenAuth();
          console.log('[Firebase] Connected to live Cloud Firestore (gramin-career-setu)');
        } catch (err) {
          console.warn('[Firebase] Live init failed, falling back to local offline mode:', err);
          this.initMockMode();
        }
      } else {
        this.initMockMode();
      }

      // Listen for network reconnection to flush offline queue
      window.addEventListener('online', () => this.flushOfflineQueue());
    }

    async ensureFirebaseScripts() {
      if (window.firebase) return;
      if (typeof document === 'undefined') return;

      const SDK_VERSION = '10.12.0';
      const scripts = [
        `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app-compat.js`,
        `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth-compat.js`,
        `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-firestore-compat.js`,
        `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-analytics-compat.js`
      ];

      for (const src of scripts) {
        await this.loadScript(src);
      }
    }

    loadScript(src) {
      return new Promise((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = () => {
          console.warn(`[Firebase] Could not load ${src} (possibly offline)`);
          resolve();
        };
        document.head.appendChild(s);
      });
    }

    initMockMode() {
      this.isMockMode = true;
      this.isInitialized = true;
      if (this._resolveAuthReady) this._resolveAuthReady(null);
      console.log('[Firebase] Running in Local Resilient Mode (Zero-cost, localStorage & IndexedDB cached)');
    }

    listenAuth() {
      if (this.auth) {
        this.auth.onAuthStateChanged(user => {
          this.currentUser = user;
          if (this._resolveAuthReady) { this._resolveAuthReady(user); this._resolveAuthReady = null; }
          this.flushOfflineQueue();
          if (user) {
            localStorage.setItem('gcs_user', JSON.stringify({
              uid: user.uid,
              phoneNumber: user.phoneNumber,
              isAnonymous: user.isAnonymous
            }));
          }
          window.dispatchEvent(new CustomEvent('gcs-auth-changed', { detail: { user } }));
        });
      }
    }

    // ── Authentication ───────────────────────────────────────
    async signInGuest() {
      if (!this.isMockMode && this.auth) {
        try {
          const cred = await this.auth.signInAnonymously();
          this.currentUser = cred.user;
          this.logEvent('login', { method: 'anonymous' });
          return { success: true, user: cred.user };
        } catch (e) {
          return { success: false, error: e.message };
        }
      }

      const mockUser = {
        uid: 'guest_' + Math.random().toString(36).substring(2, 9),
        isAnonymous: true,
        displayName: 'గ్రామీణ విద్యార్థి (Guest Student)'
      };
      this.currentUser = mockUser;
      localStorage.setItem('gcs_user', JSON.stringify(mockUser));
      this.logEvent('login', { method: 'local_guest' });
      return { success: true, user: mockUser };
    }

    async sendPhoneOtp(phoneNumber, appVerifier) {
      if (!this.isMockMode && this.auth) {
        try {
          const confirmationResult = await this.auth.signInWithPhoneNumber(phoneNumber, appVerifier);
          return { success: true, confirmationResult };
        } catch (err) {
          return { success: false, error: err.message };
        }
      }

      // No literal code may ever open an account. Without the live SDK there
      // is no way to send or verify an SMS, so say so instead of faking it.
      return { success: false, error: 'Phone sign-in needs an internet connection.' };
    }

    async signOut() {
      if (!this.isMockMode && this.auth) {
        await this.auth.signOut();
      }
      this.currentUser = null;
      localStorage.removeItem('gcs_user');
      this.logEvent('logout');
      return { success: true };
    }

    // The uid the security rules will check. Only a live Firebase session
    // counts; a demo/local session has no cloud identity.
    async cloudUid() {
      if (this.isMockMode || !this.auth) return null;
      await Promise.race([this.authReady, new Promise(r => setTimeout(r, 4000))]);
      return this.auth.currentUser ? this.auth.currentUser.uid : null;
    }

    // ── Data Transfer & Firestore Sync ───────────────────────
    async saveQuizAttempt(quizData) {
      const uid = await this.cloudUid();
      const payload = {
        userId: uid || 'anonymous',
        timestamp: new Date().toISOString(),
        score: quizData.score || 0,
        cluster: quizData.cluster || 'General',
        answers: quizData.answers || [],
        lang: document.documentElement.getAttribute('data-lang') || 'te'
      };

      this.logEvent('quiz_completed', { cluster: payload.cluster });

      if (this.db) {
        // With IndexedDB persistence the write is stored on the device at
        // once and sent when the network returns, so it is not awaited.
        const write = this.db.collection('quiz_attempts').add(payload)
          .catch(err => console.warn('[Firebase] quiz attempt not saved:', err && err.code));
        // Give it a moment so a page change right after does not drop it;
        // online that is the server ack, offline the local IndexedDB write.
        await Promise.race([write, new Promise(r => setTimeout(r, 1500))]);
        return { success: true };
      }

      this.enqueueOffline('quiz_attempts', payload);
      return { success: true, queued: true };
    }

    async saveResume(resumeData) {
      const uid = await this.cloudUid();
      // Guests and demo sessions keep their resume on this device only.
      if (!uid || !this.db) return { success: true, localOnly: true };

      const payload = {
        userId: uid,
        updatedAt: new Date().toISOString(),
        resume: resumeData
      };
      this.logEvent('resume_saved', { template: resumeData.template || 'classic' });
      this.db.collection('resumes').doc(uid).set(payload)
        .catch(err => console.warn('[Firebase] resume not saved:', err && err.code));
      return { success: true };
    }

    async loadResume() {
      const uid = await this.cloudUid();
      if (!uid || !this.db) return null;
      try {
        const snap = await this.db.collection('resumes').doc(uid).get();
        return snap.exists ? (snap.data().resume || null) : null;
      } catch (e) {
        return null;
      }
    }

    async logUserActivity(actionType, meta = {}) {
      const logEntry = {
        action: actionType,
        meta: meta,
        timestamp: new Date().toISOString(),
        path: location.pathname,
        lang: document.documentElement.getAttribute('data-lang') || 'te',
        fontScale: document.documentElement.getAttribute('data-font-scale') || 'normal',
        userId: (await this.cloudUid()) || 'anonymous'
      };

      this.logEvent(actionType, meta);

      if (this.db) {
        this.db.collection('telemetry_logs').add(logEntry).catch(() => {});
        return;
      }

      this.enqueueOffline('telemetry_logs', logEntry);
    }

    logEvent(eventName, params = {}) {
      if (this.analytics) {
        try {
          this.analytics.logEvent(eventName, params);
        } catch (e) {}
      }
      console.log(`[Telemetry] ${eventName}`, params);
    }

    // ── Resilient Offline Sync Queue ─────────────────────────
    enqueueOffline(collection, data) {
      try {
        const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
        queue.push({ collection, data, queuedAt: Date.now() });
        if (queue.length > 100) queue.shift();
        localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
      } catch (e) {}
    }

    async flushOfflineQueue() {
      if (this.isMockMode || !this.db || !navigator.onLine) return;

      try {
        const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
        if (!raw) return;
        const queue = JSON.parse(raw);
        if (!queue.length) return;

        console.log(`[Firebase Sync] Synchronizing ${queue.length} offline queued actions...`);
        // One write at a time: a single rejected item (for example a write
        // the security rules refuse) must not block every other item forever,
        // which is what one all-or-nothing batch did.
        const remaining = [];
        for (const item of queue) {
          try {
            if (item.collection === 'resumes') continue; // never queued any more
            // Queued before anyone's sign-in could be checked (possibly by a
            // different student on a shared phone), so it is never credited
            // to whoever happens to be signed in now.
            const data = { ...item.data, userId: 'anonymous', syncedAt: new Date().toISOString() };
            await this.db.collection(item.collection).add(data);
          } catch (e) {
            // Permission errors will never succeed; keep only retryable ones.
            if (!e || e.code !== 'permission-denied') remaining.push(item);
          }
        }
        if (remaining.length) localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
        else localStorage.removeItem(OFFLINE_QUEUE_KEY);
        console.log(`[Firebase Sync] Done; ${remaining.length} item(s) left to retry.`);
      } catch (err) {
        console.warn('[Firebase Sync] Could not flush offline queue, will retry later:', err);
      }
    }
  }

  // Global export
  window.GCS_FIREBASE = new FirebaseService();
})();
