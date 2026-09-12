/**
 * Gramin Career Setu — Unified API Client & Offline Sync Engine
 * ─────────────────────────────────────────────────────────────
 * Communicates with the Spring Boot REST API (/api/v1/*) with:
 * - Automatic base URL detection (relative, proxy, or direct :8080)
 * - Offline detection & local snapshot fallback
 * - Idempotent background sync queue for offline registrations & applications
 * - Seamless integration with GCS_APP and GCS_AUTH
 */

(function () {
  'use strict';

  // Base URL configuration:
  // 1. Explicit window.GCS_API_BASE
  // 2. Relative '/api/v1' if running under node server.js proxy or unified domain
  // 3. Fallback to http://localhost:8080/api/v1 if running directly on file/custom port
  const DEFAULT_API_BASE = (function () {
    if (window.GCS_API_BASE) return window.GCS_API_BASE;
    if (window.location.protocol === 'file:') return 'http://localhost:8085/api/v1';
    // If running on port 8085 or port 5000 (with proxy), use relative path
    return '/api/v1';
  })();

  const QUEUE_KEY = 'gcs_offline_queue';

  const GCS_API = {
    baseUrl: DEFAULT_API_BASE,

    /**
     * Generic fetch wrapper with timeout, auth token header, and error handling.
     */
    async request(endpoint, options = {}) {
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.headers || {})
      };

      // Attach token if user is logged in with real verified session
      const currentUser = (window.GCS_AUTH && window.GCS_AUTH.getUser) ? window.GCS_AUTH.getUser() : null;
      if (currentUser && currentUser.token && !currentUser.isDemoSession) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 8000);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          const error = new Error(errBody.message || `HTTP ${response.status}: ${response.statusText}`);
          error.status = response.status;
          error.data = errBody;

          // Attempt token refresh on 401 Unauthorized if refresh token is available
          if (response.status === 401 && !options._retry && window.GCS_AUTH && window.GCS_AUTH.refreshToken) {
            const newToken = await window.GCS_AUTH.refreshToken();
            if (newToken) {
              const retryOptions = { ...options, _retry: true };
              return await GCS_API.request(endpoint, retryOptions);
            }
          }

          throw error;
        }

        return await response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },

    // ── Jobs API ───────────────────────────────────────────────────
    jobs: {
      /**
       * Fetch jobs with optional category and search query.
       * Falls back to local JOBS_DATABASE if offline.
       */
      async getAll({ category, query, page = 0, size = 10 } = {}) {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.set('category', category);
        if (query) params.set('query', query);
        params.set('page', String(page));
        params.set('size', String(size));

        try {
          const res = await GCS_API.request(`/jobs?${params.toString()}`);
          if (res && res.success && res.data) {
            return res.data;
          }
        } catch (err) {
          console.warn('[GCS_API] Backend unreachable, using offline fallback for jobs:', err.message);
        }

        // Offline fallback using local snapshot
        const localJobs = (window.GCS_APP && window.GCS_APP.jobs) || [];
        let filtered = localJobs;

        if (category && category !== 'all') {
          filtered = filtered.filter(j => (j.category || '').toLowerCase() === category.toLowerCase());
        }
        if (query) {
          const q = query.toLowerCase();
          filtered = filtered.filter(j =>
            (j.title || '').toLowerCase().includes(q) ||
            (j.company || '').toLowerCase().includes(q)
          );
        }

        return {
          content: filtered.slice(page * size, (page + 1) * size),
          page,
          size,
          totalElements: filtered.length,
          totalPages: Math.ceil(filtered.length / size) || 1,
          last: (page + 1) * size >= filtered.length,
          isOfflineFallback: true
        };
      },

      async getById(id) {
        try {
          const res = await GCS_API.request(`/jobs/${encodeURIComponent(id)}`);
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Falling back to local job detail:', err.message);
        }

        const localJobs = (window.GCS_APP && window.GCS_APP.jobs) || [];
        return localJobs.find(j => j.id === id) || null;
      },

      async apply(jobId, { applicantName, phone, village }) {
        const payload = { applicantName, phone, village };

        try {
          const res = await GCS_API.request(`/jobs/${encodeURIComponent(jobId)}/apply`, {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          return { success: true, data: res.data, queued: false };
        } catch (err) {
          // If server returned an HTTP error (4xx / 5xx), do not queue offline - rethrow business rejection
          if (err.status) {
            console.warn('[GCS_API] Server rejected job application:', err.message);
            throw err;
          }

          console.warn('[GCS_API] Online job application failed due to network; queuing offline:', err.message);
          // Queue for background sync
          GCS_API.offlineQueue.enqueue({
            type: 'JOB_APPLICATION',
            jobId,
            payload,
            timestamp: new Date().toISOString()
          });
          return { success: true, queued: true, message: 'Saved offline. Will submit automatically when online.' };
        }
      },

      async toggleBookmark(jobId) {
        try {
          const res = await GCS_API.request(`/jobs/${encodeURIComponent(jobId)}/bookmark`, {
            method: 'POST'
          });
          return res.data?.isBookmarked;
        } catch (err) {
          // Fallback to localStorage bookmark
          if (window.GCS_APP && window.GCS_APP.storage) {
            return window.GCS_APP.storage.toggleBookmark('jobs', jobId);
          }
          return false;
        }
      }
    },

    // ── Workshops API ──────────────────────────────────────────────
    workshops: {
      async getUpcoming() {
        try {
          const res = await GCS_API.request('/workshops');
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Falling back to offline workshop data:', err.message);
        }
        return [
          { id: 'WS-101', titleTe: 'రైల్వే పరీక్షల సన్నద్ధత', titleEn: 'Railway RRB NTPC & Group D Strategy', category: 'Government Exam', speaker: 'K. V. Subbarao' },
          { id: 'WS-102', titleTe: 'గ్రామీణ యువతకు సాఫ్ట్‌వేర్ నైపుణ్యాలు', titleEn: 'Software Coding & Web Skills for Rural Youth', category: 'Technical Skill', speaker: 'P. Ananya' }
        ];
      },

      async register(workshopId, { name, phone, idempotencyKey }) {
        const key = idempotencyKey || ('IDEMP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7));
        const payload = { name, phone, idempotencyKey: key };

        try {
          const res = await GCS_API.request(`/workshops/${encodeURIComponent(workshopId)}/register`, {
            method: 'POST',
            headers: { 'Idempotency-Key': key },
            body: JSON.stringify(payload)
          });
          return { success: true, data: res.data, queued: false };
        } catch (err) {
          if (err.status) {
            console.warn('[GCS_API] Server rejected workshop registration:', err.message);
            throw err;
          }
          console.warn('[GCS_API] Online registration failed; queuing offline:', err.message);
          GCS_API.offlineQueue.enqueue({
            type: 'WORKSHOP_REGISTRATION',
            workshopId,
            payload,
            timestamp: new Date().toISOString()
          });
          return { success: true, queued: true, message: 'Registration queued offline. Will sync when reconnected.' };
        }
      },

      async cancel(workshopId, { phone }) {
        try {
          const res = await GCS_API.request(`/workshops/${encodeURIComponent(workshopId)}/cancel`, {
            method: 'POST',
            body: JSON.stringify({ phone })
          });
          return { success: true, data: res.data };
        } catch (err) {
          console.warn('[GCS_API] Workshop cancellation API error:', err.message);
          return { success: false, error: err.message };
        }
      }
    },

    // ── Resumes API ────────────────────────────────────────────────
    resumes: {
      async calculateAts(resumeData) {
        const jsonString = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData);
        try {
          const res = await GCS_API.request('/resumes/calculate-ats', {
            method: 'POST',
            body: jsonString
          });
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Server ATS calculation unavailable, using local calculation:', err.message);
        }

        // Local fallback calculation
        return null;
      },

      async save(templateId, resumeData) {
        const jsonString = typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData);
        try {
          const res = await GCS_API.request('/resumes', {
            method: 'POST',
            body: JSON.stringify({ templateId, resumeJson: jsonString })
          });
          return res.data;
        } catch (err) {
          console.warn('[GCS_API] Saving resume online failed, storing in localStorage:', err.message);
          localStorage.setItem('gcs_resume_data', jsonString);
          return null;
        }
      },

      async getMyResume() {
        try {
          const res = await GCS_API.request('/resumes/my-resume');
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Fetching remote resume failed, reading from localStorage:', err.message);
        }
        const local = localStorage.getItem('gcs_resume_data');
        return local ? { resumeJson: local, templateId: 'modern' } : null;
      }
    },

    // ── User Profile API ───────────────────────────────────────────
    users: {
      async getMe() {
        try {
          const res = await GCS_API.request('/users/me');
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Remote profile lookup failed:', err.message);
        }
        return null;
      },

      async updateProfile(profileData) {
        try {
          const res = await GCS_API.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
          });
          return res.data;
        } catch (err) {
          console.warn('[GCS_API] Profile update failed:', err.message);
          throw err;
        }
      }
    },

    // ── Quiz & Career Recommendation API ───────────────────────────
    quiz: {
      async submit(answersMap, qualification) {
        const payload = {
          answers: answersMap || {},
          qualification: qualification || 'General'
        };

        try {
          const res = await GCS_API.request('/quiz/submit', {
            method: 'POST',
            body: JSON.stringify(payload)
          });
          if (res && res.success && res.data) {
            return res.data;
          }
        } catch (err) {
          console.warn('[GCS_API] Server quiz evaluation unavailable, fallback to local scoring:', err.message);
        }
        return null;
      },

      async getMyResults() {
        try {
          const res = await GCS_API.request('/quiz/my-results');
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Candidate quiz history unavailable:', err.message);
        }
        return [];
      }
    },

    // ── Scholarships API ───────────────────────────────────────────
    scholarships: {
      async getAll({ category, all = true } = {}) {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.set('category', category);
        if (all) params.set('all', 'true');

        try {
          const res = await GCS_API.request(`/scholarships?${params.toString()}`);
          if (res && res.success && res.data) {
            return Array.isArray(res.data) ? res.data : (res.data.content || []);
          }
        } catch (err) {
          console.warn('[GCS_API] Scholarships server fetch failed, using offline cache:', err.message);
        }

        return [
          { id: 'SCH-01', titleTe: 'జగనన్న విద్యా దీవెన', titleEn: 'Jagananna Vidya Deevena (Full Fee Reimbursement)', category: 'Degree & Professional', eligibility: 'SC/ST/BC/EWS Students enrolled in ITI/Polytechnic/Degree', amountRange: 'Full Tuition Fee (Up to ₹50,000/yr)', deadline: 'Annual State Cycle', portalUrl: 'https://jnanabhumi.ap.gov.in' },
          { id: 'SCH-02', titleTe: 'జగనన్న వసతి దీవెన', titleEn: 'Jagananna Vasathi Deevena (Hostel & Food)', category: 'Higher Education', eligibility: 'College students staying in hostels / rural commuters', amountRange: '₹10,000 – ₹20,000 / year', deadline: 'Annual State Cycle', portalUrl: 'https://jnanabhumi.ap.gov.in' },
          { id: 'SCH-03', titleTe: 'ఏఐసీటీఈ ప్రగతి స్కాలర్‌షిప్', titleEn: 'AICTE Pragati Scholarship for Girls', category: 'Technical & Diploma', eligibility: 'Girl students admitted to AICTE approved 1st year degree/diploma', amountRange: '₹50,000 / year', deadline: 'October 31', portalUrl: 'https://scholarships.gov.in' },
          { id: 'SCH-04', titleTe: 'సెంట్రల్ సెక్టార్ స్కాలర్‌షిప్', titleEn: 'Central Sector Scheme of Scholarships (CSSS)', category: 'College & University', eligibility: 'Class 12th pass > 80th percentile, family income < 4.5 Lakhs', amountRange: '₹12,000 – ₹20,000 / year', deadline: 'December 31', portalUrl: 'https://scholarships.gov.in' },
          { id: 'SCH-05', titleTe: 'పీఎం యశస్వి స్కాలర్‌షిప్', titleEn: 'PM YASASVI Pre/Post Matric Scholarship', category: 'School & College', eligibility: 'OBC/EBC/DNT students studying in Class 9 to 12', amountRange: '₹75,000 – ₹1,25,000 / year', deadline: 'November 30', portalUrl: 'https://yet.nta.ac.in' }
        ];
      },

      async getById(id) {
        try {
          const res = await GCS_API.request(`/scholarships/${encodeURIComponent(id)}`);
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Scholarship detail offline fallback:', err.message);
        }
        const all = await this.getAll();
        return all.find(s => s.id === id) || null;
      }
    },

    // ── Government Schemes API ─────────────────────────────────────
    schemes: {
      async getAll({ category, all = true } = {}) {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.set('category', category);
        if (all) params.set('all', 'true');

        try {
          const res = await GCS_API.request(`/schemes?${params.toString()}`);
          if (res && res.success && res.data) {
            return Array.isArray(res.data) ? res.data : (res.data.content || []);
          }
        } catch (err) {
          console.warn('[GCS_API] Government schemes server fetch failed, using offline cache:', err.message);
        }

        return [
          { id: 'SCHEME-01', titleTe: 'పీఎం ముద్ర యోజన', titleEn: 'Pradhan Mantri MUDRA Yojana (PMMY)', ministry: 'Ministry of Finance', benefit: 'Collateral-free business loans up to ₹10 Lakhs (Shishu, Kishore, Tarun)', eligibility: 'Rural youth starting Kirana, Tailoring, Food units', applicationUrl: 'https://www.mudra.org.in', category: 'MSME & Self-Employment' },
          { id: 'SCHEME-02', titleTe: 'పీఎం విశ్వకర్మ యోజన', titleEn: 'PM Vishwakarma Scheme', ministry: 'Ministry of MSME', benefit: '₹15,000 Toolkit incentive + collateral free loans at 5%', eligibility: 'Traditional artisans: Carpenters, Blacksmiths, Electricians, Potters', applicationUrl: 'https://pmvishwakarma.gov.in', category: 'Artisans & Trades' },
          { id: 'SCHEME-03', titleTe: 'పీఎం కుసుమ్ సోలార్ పథకం', titleEn: 'PM KUSUM Solar Pump Scheme', ministry: 'Ministry of New & Renewable Energy', benefit: 'Up to 60% subsidy for setting up solar irrigation pumps on agricultural lands', eligibility: 'Farmers and rural agricultural landholders', applicationUrl: 'https://pmkusum.mnre.gov.in', category: 'Agriculture' },
          { id: 'SCHEME-04', titleTe: 'పీఎం ఎఫ్‌ఎంఈ మైక్రో ఫుడ్ ప్రాసెసింగ్', titleEn: 'PM Formalisation of Micro Food Processing (PMFME)', ministry: 'Ministry of Food Processing', benefit: '35% credit-linked capital subsidy up to ₹10 Lakhs for micro food units', eligibility: 'Pickle, Spice, Flour, Dairy units in rural mandals', applicationUrl: 'https://pmfme.mofpi.gov.in', category: 'Agri-Business' }
        ];
      },

      async getById(id) {
        try {
          const res = await GCS_API.request(`/schemes/${encodeURIComponent(id)}`);
          if (res && res.success && res.data) return res.data;
        } catch (err) {
          console.warn('[GCS_API] Government scheme detail offline fallback:', err.message);
        }
        const all = await this.getAll();
        return all.find(s => s.id === id) || null;
      }
    },

    // ── Offline Sync Queue ─────────────────────────────────────────
    offlineQueue: {
      _protect(payload) {
        if (!payload || typeof payload !== 'object') return payload;
        const p = { ...payload };
        for (const k of ['phone', 'applicantName', 'name', 'village']) {
          if (typeof p[k] === 'string' && !p[k].startsWith('__enc_')) {
            p[k] = '__enc_' + btoa(unescape(encodeURIComponent(p[k])));
          }
        }
        return p;
      },

      _unprotect(payload) {
        if (!payload || typeof payload !== 'object') return payload;
        const p = { ...payload };
        for (const k of ['phone', 'applicantName', 'name', 'village']) {
          if (typeof p[k] === 'string' && p[k].startsWith('__enc_')) {
            try {
              p[k] = decodeURIComponent(escape(atob(p[k].slice(6))));
            } catch (_) {}
          }
        }
        return p;
      },

      getAll() {
        try {
          const raw = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
          return raw.map(item => ({
            ...item,
            payload: this._unprotect(item.payload)
          }));
        } catch (_) {
          return [];
        }
      },

      enqueue(item) {
        try {
          const raw = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
          const protectedItem = {
            ...item,
            payload: this._protect(item.payload)
          };
          raw.push(protectedItem);
          localStorage.setItem(QUEUE_KEY, JSON.stringify(raw));
        } catch (e) {
          console.warn('[GCS_API] Failed to persist offline item:', e);
        }
        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show('📶 Offline mode: Action queued. Will sync when online.');
        }
      },

      async sync() {
        const queue = this.getAll();
        if (!queue.length) return;

        console.log(`[GCS_API] Attempting to synchronize ${queue.length} offline actions...`);
        const remaining = [];
        let syncedCount = 0;

        for (const item of queue) {
          try {
            if (item.type === 'JOB_APPLICATION') {
              await GCS_API.request(`/jobs/${encodeURIComponent(item.jobId)}/apply`, {
                method: 'POST',
                body: JSON.stringify(item.payload)
              });
              syncedCount++;
            } else if (item.type === 'WORKSHOP_REGISTRATION') {
              await GCS_API.request(`/workshops/${encodeURIComponent(item.workshopId)}/register`, {
                method: 'POST',
                headers: { 'Idempotency-Key': item.payload.idempotencyKey },
                body: JSON.stringify(item.payload)
              });
              syncedCount++;
            }
          } catch (err) {
            console.warn('[GCS_API] Sync item failed, retaining in queue:', item, err);
            remaining.push({
              ...item,
              payload: this._protect(item.payload)
            });
          }
        }

        localStorage.setItem(QUEUE_KEY, JSON.stringify(remaining));

        if (syncedCount > 0 && window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`✅ Synchronized ${syncedCount} offline action(s) with server!`);
        }
      }
    }
  };

  // Auto-sync when back online
  window.addEventListener('online', () => {
    console.log('[GCS_API] Network reconnected. Triggering sync...');
    GCS_API.offlineQueue.sync();
  });

  // Expose globally
  window.GCS_API = GCS_API;

})();
