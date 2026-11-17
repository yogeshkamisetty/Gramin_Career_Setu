/**
 * Gramin Career Setu — Unified Interactive Client-Side Engine (app.js)
 * ───────────────────────────────────────────────────────────────────
 * • Centralized datasets (Jobs, Scholarships, Schemes, Workshops, Resources)
 * • Real-time filtering, instant search & tag-based live queries
 * • Dynamic job detail loading with URL params (?id=...)
 * • Interactive job application modal & resume attachment
 * • Roadmap generator with tailored milestone matrix
 * • Client-side jsPDF downloads for resources, roadmaps, and resumes
 * • LocalStorage persistence for bookmarks, applications, registrations, and quiz
 * • Universal toast notification system
 */

(function () {
  'use strict';

  // ══════════════════════════════════════════════════════════════════════
  //  1. Central Datasets (job roles live in data/jobs.csv)
  // ══════════════════════════════════════════════════════════════════════

  const SCHOLARSHIPS_DATABASE = [
    {
      id: 'post-matric-obc',
      title: 'Post Matric Fee Reimbursement (RTF & MTF)',
      provider: 'AP Social Welfare & BC Welfare Departments',
      badge: 'Merit Based',
      amount: '₹15,000 / year',
      eligibility: '10th Pass & above, OBC category, income < ₹2.5 Lakh',
      deadline: '31 Aug 2024',
      qual: ['10th', 'inter', 'degree'],
      category: 'obc',
      gender: 'all',
      maxIncome: 2.5,
      description: 'Financial assistance for students belonging to Other Backward Classes studying post-matriculation courses in recognized institutions in Andhra Pradesh.',
      documents: ['Aadhaar Card', 'Caste Certificate', 'Income Certificate', 'Previous Marks Memo', 'Bank Passbook']
    },
    {
      id: 'nsp-central-sector',
      title: 'PM-USP Central Sector Scheme of Scholarship (CSSS)',
      provider: 'Government of India',
      badge: 'Merit Based',
      amount: '₹20,000 / year',
      eligibility: '10th Pass & above with >80% marks, all categories',
      deadline: '30 Sep 2024',
      qual: ['inter', 'degree'],
      category: 'all',
      gender: 'all',
      maxIncome: 5.0,
      description: 'Central sector scheme for college and university students to support day-to-day expenses while pursuing higher education.',
      documents: ['Aadhaar Card', 'College Bonafide Certificate', '12th Class Marks Card', 'Parent Income Proof']
    },
    {
      id: 'saksham-scholarship',
      title: 'AICTE Saksham Scholarship for Specially-Abled (Divyang)',
      provider: 'Ministry of Social Justice & AICTE',
      badge: 'Need Based',
      amount: '₹50,000 / year',
      eligibility: 'Specially-abled students (disability >= 40%) in technical degree/diploma',
      deadline: '15 Sep 2024',
      qual: ['10th', 'inter', 'degree'],
      category: 'all',
      gender: 'all',
      maxIncome: 2.5,
      description: 'Scholarship dedicated to encourage economically disadvantaged and specially-abled students to pursue technical education without financial strain.',
      documents: ['Medical Disability Certificate (if applicable)', 'Income Certificate', 'Aadhaar Card']
    },
    {
      id: 'pre-matric-obc',
      title: 'PM-YASASVI Scholarship Scheme (OBC, EBC & DNT)',
      provider: 'AP Social Welfare & BC Welfare Departments',
      badge: 'Merit Based',
      amount: '₹10,000 / year',
      eligibility: '9th & 10th Class students with passing grades',
      deadline: '31 Aug 2024',
      qual: ['10th'],
      category: 'obc',
      gender: 'all',
      maxIncome: 2.5,
      description: 'State scholarship to prevent student dropouts in high school and promote transition to intermediate and vocational education.',
      documents: ['School Study Certificate', 'Ration Card / Income Certificate', 'Aadhaar Card']
    },
    {
      id: 'pragati-girls-scholarship',
      title: 'Pragati Scholarship for Girl Students',
      provider: 'AICTE / Govt. of India',
      badge: 'Girl Child Only',
      amount: '₹50,000 / year',
      eligibility: 'Girls admitted to 1st year Degree/Diploma, Family Income < ₹8 Lakh',
      deadline: '31 Oct 2024',
      qual: ['inter', 'degree'],
      category: 'all',
      gender: 'female',
      maxIncome: 8.0,
      description: 'Prestigious national scholarship dedicated exclusively to empowering female students pursuing technical engineering and diploma degrees.',
      documents: ['College Admission Receipt', '10th/12th Marksheet', 'Family Income Certificate']
    }
  ];

  // ══════════════════════════════════════════════════════════════════════
  //  2. Local Storage Manager
  // ══════════════════════════════════════════════════════════════════════

  const Storage = {
    get(key, defaultValue) {
      try {
        const val = localStorage.getItem('gcs_' + key);
        return val ? JSON.parse(val) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem('gcs_' + key, JSON.stringify(value));
      } catch (e) {
        console.warn('[GCS Storage] write error:', e);
      }
    },
    toggleBookmark(type, id) {
      const key = `saved_${type}`;
      const list = this.get(key, []);
      const index = list.indexOf(id);
      let isSaved = false;

      if (index === -1) {
        list.push(id);
        isSaved = true;
      } else {
        list.splice(index, 1);
        isSaved = false;
      }

      this.set(key, list);
      return isSaved;
    },
    isBookmarked(type, id) {
      const list = this.get(`saved_${type}`, []);
      return list.includes(id);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  //  3. Toast Notification Component
  // ══════════════════════════════════════════════════════════════════════

  const Toast = {
    show(message, type = 'success', duration = 3500) {
      let container = document.getElementById('gcsToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'gcsToastContainer';
        container.style.cssText = `
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        `;
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      const isSuccess = type === 'success';
      toast.style.cssText = `
        background: ${isSuccess ? '#1B4D3E' : '#DC2626'};
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: var(--text-base);
        font-weight: 600;
        font-family: 'Plus Jakarta Sans', sans-serif;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: auto;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      `;

      const icon = isSuccess ? 'check_circle' : 'info';
      toast.innerHTML = `
        <span class="material-symbols-outlined" style="font-size: var(--text-xl);">${icon}</span>
        <span>${message}</span>
      `;

      container.appendChild(toast);

      // Trigger enter animation
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });

      // Auto dismiss
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 350);
      }, duration);
    }
  };


  // ══════════════════════════════════════════════════════════════════════
  //  6. Scholarships Interactive Filtering
  // ══════════════════════════════════════════════════════════════════════

  window.filterScholarshipCards = function () {
    const qual = (document.getElementById('schQual') ? document.getElementById('schQual').value : 'all');
    const cat = (document.getElementById('schCat') ? document.getElementById('schCat').value : 'all');
    const gen = (document.getElementById('schGen') ? document.getElementById('schGen').value : 'all');
    const inc = (document.getElementById('schInc') ? document.getElementById('schInc').value : 'all');

    const cards = document.querySelectorAll('.scholarship-card-item');
    let visible = 0;

    cards.forEach(card => {
      const cardText = card.textContent.toLowerCase();
      let match = true;

      if (qual !== 'all' && !cardText.includes(qual.toLowerCase()) && !cardText.includes('pass')) {
        match = false;
      }
      if (cat !== 'all' && !cardText.includes(cat.toLowerCase()) && !cardText.includes('all')) {
        match = false;
      }
      if (gen === 'female' && !cardText.includes('girl') && !cardText.includes('female') && !cardText.includes('need based')) {
        match = false;
      }

      if (match) {
        card.style.display = 'flex';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    const countEl = document.getElementById('schCount');
    if (countEl) {
      countEl.textContent = `Showing ${visible} scholarships matching your filters`;
    }
  };

  window.resetScholarshipFilters = function () {
    ['schQual', 'schCat', 'schGen', 'schInc'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 'all';
    });
    window.filterScholarshipCards();
    Toast.show('Filters reset to default');
  };

  // ══════════════════════════════════════════════════════════════════════
  //  7. Workshops Registration & My Registrations View
  // ══════════════════════════════════════════════════════════════════════

  // Workshop registration lives in assets/actions.js (GCS_ACTIONS.toggleWorkshop).
  // The previous implementation here collected details through three
  // sequential prompt() dialogs, which are blocked outright in sandboxed and
  // embedded contexts, and — being defined in a deferred script — silently
  // overwrote the page-level handler. It also wrote a fourth distinct shape
  // under the shared storage key.

  window.filterWorkshopCategory = function (cat, btn) {
    if (btn) {
      document.querySelectorAll('.gcs-tab-pill-btn, .gcs-pill-tag').forEach(b => {
        b.classList.remove('active');
        b.style.background = '#fff';
        b.style.color = '#334155';
      });
      btn.classList.add('active');
      btn.style.background = 'var(--gcs-green-primary)';
      btn.style.color = '#fff';
    }

    const cards = document.querySelectorAll('.gcs-workshop-card');

    if (cat === 'my') {
      const myRegs = Storage.get('workshop_registrations', []);
      // Entries have been written in several shapes over time (bare title
      // strings, {title}, {workshop, id}). Normalise before comparing so a
      // legacy entry cannot throw on a missing field.
      const regTitles = myRegs.map(r => {
        if (typeof r === 'string') return r.toLowerCase();
        return String((r && (r.workshop || r.title || r.id)) || '').toLowerCase();
      });
      cards.forEach(c => {
        const title = c.querySelector('.gcs-workshop-title');
        const t = title ? title.textContent.trim().toLowerCase() : '';
        const match = !!t && regTitles.some(r => r.includes(t) || r === 'ws-' + t.replace(/\s+/g, '-'));
        c.style.display = match ? 'block' : 'none';
      });
      Toast.show(`Showing ${myRegs.length} registered workshops.`);
      return;
    }

    cards.forEach(c => {
      if (cat === 'all' || c.getAttribute('data-cat') === cat) {
        c.style.display = 'block';
      } else {
        c.style.display = 'none';
      }
    });
  };

  // ══════════════════════════════════════════════════════════════════════
  //  8. Resource Kit Direct PDF Generation
  // ══════════════════════════════════════════════════════════════════════

  window.downloadResourcePDF = function (resourceTitle, category) {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        Toast.show(`📥 Preparing ${resourceTitle}...`);
        return;
      }
      const doc = new jsPDF();
      doc.setFillColor(27, 77, 62);
      doc.rect(0, 0, 210, 36, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text('Gramin Career Setu — Study Resource Kit', 14, 22);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(14);
      doc.text(resourceTitle, 14, 50);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Category: ${category || 'Career Guidelines'} • Summary generated by this site`, 14, 58);

      doc.text('Key Highlights & Comprehensive Exam Guidelines:', 14, 72);
      doc.text('1. Eligibility: Open to rural youth passing 10th, Intermediate, or Degree.', 14, 82);
      doc.text('2. Syllabus & Exam Pattern: General Studies, Aptitude, English & Telugu literacy.', 14, 92);
      doc.text('3. Free Materials: Handouts, question banks, and mock papers via your Panchayat desk.', 14, 102);
      doc.text('4. Official Portal: Always register directly on official .gov.in portals.', 14, 112);

      doc.setFillColor(240, 253, 244);
      doc.rect(14, 130, 182, 24, 'F');
      doc.setTextColor(21, 128, 61);
      doc.text('Prepared for rural students under the CareerBridge CSP Initiative.', 20, 144);

      doc.save(`${resourceTitle.replace(/\s+/g, '_')}_GCS.pdf`);
      Toast.show(`📥 Downloaded ${resourceTitle}!`);
    } catch (e) {
      Toast.show(`📥 Downloaded ${resourceTitle}!`);
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  //  9. Job Detail Tab Switcher
  // ══════════════════════════════════════════════════════════════════════


  // HTML Escaping Utility for XSS Prevention
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Universal Bookmark Toggle
  window.toggleGcsBookmark = function (type, id, btn) {
    const isSaved = Storage.toggleBookmark(type, id);
    if (btn) {
      const icon = btn.querySelector('.material-symbols-outlined') || (btn.classList.contains('material-symbols-outlined') ? btn : null);
      if (icon) {
        icon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
      }
      btn.style.color = isSaved ? '#059669' : '#64748B';
    }
    const typeLabel = type === 'jobs' ? 'Job' : type === 'scholarships' ? 'Scholarship' : type === 'resources' ? 'Resource' : 'Career';
    Toast.show(isSaved ? `✅ ${typeLabel} saved to bookmarks!` : `ℹ️ ${typeLabel} removed from bookmarks.`);
    return isSaved;
  };


  // ── Notification Center & In-App Alert System ─────────────
  const NotificationManager = {
    STORAGE_KEY: 'gcs_notifications_v1',

    getDefaults() {
      return [
        {
          id: 'notif_welcome',
          title: 'గ్రామీణ కెరీర్ సేతుకు స్వాగతం! 🌾',
          message: 'Explore jobs, government schemes, scholarships, and free skill workshops in your district.',
          time: 'Just now',
          type: 'info',
          icon: 'spa',
          read: false
        },
        {
          id: 'notif_workshop',
          title: 'ఉచిత సోలార్ టెక్నీషియన్ వర్క్‌షాప్ ⚡',
          message: 'Free technical hands-on training registration open for youth in Krishna and surrounding districts.',
          time: '1h ago',
          type: 'opportunity',
          icon: 'event',
          link: 'workshops.html',
          read: false
        },
        {
          id: 'notif_resume',
          title: 'తెలుగు & ఇంగ్లీష్ రెజ్యూమ్ బిల్డర్ 📄',
          message: 'Build a job-ready biodata in 5 minutes with one-click print and export.',
          time: '2h ago',
          type: 'success',
          icon: 'description',
          link: 'resume.html',
          read: true
        }
      ];
    },

    getAll() {
      try {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        if (raw) return JSON.parse(raw);
      } catch (_) {}
      const defs = this.getDefaults();
      this.save(defs);
      return defs;
    },

    save(list) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      } catch (_) {}
      this.updateBadge();
    },

    add(title, message, type = 'info', link = '') {
      const list = this.getAll();
      const notif = {
        id: 'notif_' + Date.now(),
        title,
        message,
        time: 'Just now',
        type,
        icon: type === 'sms' ? 'sms' : type === 'success' ? 'check_circle' : type === 'warning' ? 'warning' : 'notifications',
        link,
        read: false
      };
      list.unshift(notif);
      if (list.length > 20) list.pop();
      this.save(list);
      this.renderDrawer();

      if (Toast && Toast.show) {
        Toast.show(`${notif.icon === 'sms' ? '📱' : '🔔'} ${title}: ${message}`, type === 'sms' ? 'info' : type);
      }

      return notif;
    },

    getUnreadCount() {
      return this.getAll().filter(n => !n.read).length;
    },

    markAllRead() {
      const list = this.getAll().map(n => ({ ...n, read: true }));
      this.save(list);
      this.renderDrawer();
    },

    toggle() {
      const drawer = document.getElementById('gcsNotifDrawer');
      if (drawer && drawer.classList.contains('active')) {
        this.close();
      } else {
        this.open();
      }
    },

    open() {
      const drawer = document.getElementById('gcsNotifDrawer');
      const backdrop = document.getElementById('gcsNotifBackdrop');
      if (drawer && backdrop) {
        this.renderDrawer();
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    close() {
      const drawer = document.getElementById('gcsNotifDrawer');
      const backdrop = document.getElementById('gcsNotifBackdrop');
      if (drawer && backdrop) {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    updateBadge() {
      const count = this.getUnreadCount();
      document.querySelectorAll('.gcs-notif-badge').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-flex' : 'none';
      });
    },

    renderDrawer() {
      const listEl = document.getElementById('gcsNotifList');
      if (!listEl) return;
      const notifs = this.getAll();
      this.updateBadge();

      if (!notifs.length) {
        listEl.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: #94A3B8;">
            <span class="material-symbols-outlined" style="font-size: 48px; color: #CBD5E1; margin-bottom: 8px;">notifications_off</span>
            <p style="font-size: var(--text-sm); margin: 0;">No new notifications</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = notifs.map(n => `
        <div class="gcs-notif-item${n.read ? ' read' : ' unread'}" onclick="window.GCS_APP.notifications.markRead('${n.id}', '${n.link || ''}')">
          <div class="gcs-notif-icon-col ${n.type}">
            <span class="material-symbols-outlined">${n.icon || 'notifications'}</span>
          </div>
          <div class="gcs-notif-content-col">
            <div class="gcs-notif-item-title">${escapeHtml(n.title)}</div>
            <div class="gcs-notif-item-desc">${escapeHtml(n.message)}</div>
            <div class="gcs-notif-item-time">${escapeHtml(n.time)}</div>
          </div>
          ${!n.read ? '<span class="gcs-notif-unread-dot"></span>' : ''}
        </div>
      `).join('');
    },

    markRead(id, link) {
      const list = this.getAll().map(n => n.id === id ? { ...n, read: true } : n);
      this.save(list);
      this.renderDrawer();
      if (link && link !== 'undefined' && link !== '') {
        window.location.href = link;
      }
    },

    setupHeaderBell() {
      const actions = document.querySelectorAll('.gcs-header-actions, .header-actions');
      actions.forEach(container => {
        if (container.querySelector('#gcsHeaderNotifBtn')) return;
        const btn = document.createElement('div');
        btn.id = 'gcsHeaderNotifBtn';
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.marginRight = '6px';
        btn.innerHTML = `
          <button type="button" class="gcs-notif-bell-btn" onclick="window.GCS_APP.notifications.toggle()" aria-label="Notifications" title="Notifications">
            <span class="material-symbols-outlined">notifications</span>
            <span class="gcs-notif-badge">0</span>
          </button>
        `;
        container.insertBefore(btn, container.firstChild);
      });

      this.updateBadge();
    },

    init() {
      this.injectDrawerElements();
      this.setupHeaderBell();
    },

    injectDrawerElements() {
      if (document.getElementById('gcsNotifDrawer')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'gcsNotifBackdrop';
      backdrop.className = 'gcs-bottom-sheet-backdrop';
      backdrop.onclick = () => this.close();

      const drawer = document.createElement('aside');
      drawer.id = 'gcsNotifDrawer';
      drawer.className = 'gcs-notif-drawer';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-label', 'Notifications Center');

      drawer.innerHTML = `
        <div class="gcs-notif-drawer-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined" style="color: #059669; font-size: 24px;">notifications_active</span>
            <div>
              <h3 style="font-size: var(--text-base); font-weight: 800; color: #0F172A; margin: 0;">Notifications</h3>
              <span style="font-size: var(--text-xs); color: #64748B;">తాజా నోటిఫికేషన్లు & సమాచారం</span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 6px;">
            <button type="button" class="gcs-pill-tag" onclick="window.GCS_APP.notifications.markAllRead()" style="cursor: pointer; background: #F1F5F9; border: 1px solid #CBD5E1; color: #475569; font-size: 0.72rem; padding: 4px 8px;">
              Mark all read
            </button>
            <button type="button" class="gcs-sheet-close-btn" onclick="window.GCS_APP.notifications.close()" aria-label="Close">✕</button>
          </div>
        </div>
        <div class="gcs-notif-list" id="gcsNotifList"></div>
      `;

      document.body.appendChild(backdrop);
      document.body.appendChild(drawer);
      this.renderDrawer();
    }
  };

  function initAllBookmarks() {
    document.querySelectorAll('[data-bookmark-type][data-bookmark-id]').forEach(btn => {
      const type = btn.getAttribute('data-bookmark-type');
      const id = btn.getAttribute('data-bookmark-id');
      const isSaved = Storage.isBookmarked(type, id);
      const icon = btn.querySelector('.material-symbols-outlined') || (btn.classList.contains('material-symbols-outlined') ? btn : null);
      if (icon) {
        icon.textContent = isSaved ? 'bookmark' : 'bookmark_border';
      }
      btn.style.color = isSaved ? '#059669' : '#64748B';
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.toggleGcsBookmark(type, id, btn);
      };
    });
  }

  // ── Universal Font Scaling Engine ──────────────────────────
  const FontScaleManager = {
    PRESETS: {
      small:  { scale: '0.875', label: 'A- (88%)',  name: 'small' },
      normal: { scale: '1.0',   label: 'A (100%)',  name: 'normal' },
      large:  { scale: '1.15',  label: 'A+ (115%)', name: 'large' },
      xlarge: { scale: '1.30',  label: 'A++ (130%)', name: 'xlarge' }
    },

    init() {
      const saved = this.getCurrent();
      this.apply(saved, false);
      this.bindTriggers();
    },

    getCurrent() {
      try {
        const val = localStorage.getItem('gcs_font_scale');
        if (val && this.PRESETS[val]) return val;
      } catch (e) {}
      return 'normal';
    },

    apply(presetName, showToast = true) {
      const preset = this.PRESETS[presetName] || this.PRESETS.normal;
      try {
        document.documentElement.setAttribute('data-font-scale', preset.name);
        document.documentElement.style.setProperty('--mobile-font-scale', preset.scale);
        localStorage.setItem('gcs_font_scale', preset.name);
      } catch (e) {}

      // Update UI elements on page
      document.querySelectorAll('.gcs-font-size-btn').forEach(btn => {
        const p = btn.getAttribute('data-scale');
        btn.classList.toggle('active', p === preset.name);
        btn.setAttribute('aria-pressed', p === preset.name ? 'true' : 'false');
      });

      const indicator = document.querySelector('.gcs-floating-text-scaler .scaler-label');
      if (indicator) {
        indicator.textContent = preset.name === 'normal' ? '100%' : preset.name === 'small' ? '88%' : preset.name === 'large' ? '115%' : '130%';
      }

      const labelInSheet = document.getElementById('gcsCurrentScaleLabel');
      if (labelInSheet) {
        labelInSheet.textContent = preset.label;
      }

      window.dispatchEvent(new CustomEvent('gcs-font-scale-changed', {
        detail: { scale: preset.name, factor: preset.scale }
      }));

      if (showToast && Toast && Toast.show) {
        const isTe = document.documentElement.getAttribute('data-lang') === 'te';
        const msg = isTe 
          ? `అక్షరాల పరిమాణం మార్చబడింది: ${preset.label}`
          : `Text size updated: ${preset.label}`;
        Toast.show(msg, 'info');
      }
    },

    cycleNext() {
      const order = ['small', 'normal', 'large', 'xlarge'];
      const current = this.getCurrent();
      const idx = order.indexOf(current);
      const next = order[(idx + 1) % order.length];
      this.apply(next, true);
    },

    cyclePrev() {
      const order = ['small', 'normal', 'large', 'xlarge'];
      const current = this.getCurrent();
      const idx = order.indexOf(current);
      const prev = order[(idx - 1 + order.length) % order.length];
      this.apply(prev, true);
    },

    bindTriggers() {
      document.querySelectorAll('[data-font-scale-trigger]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-font-scale-trigger');
          if (target === 'next') this.cycleNext();
          else if (target === 'prev') this.cyclePrev();
          else if (this.PRESETS[target]) this.apply(target, true);
        });
      });
    }
  };

  // ── Dedicated Mobile Web App Controller ────────────────────
  const MobileUiController = {
    init() {
      this.setupBottomNav();
      this.setupMoreSheet();
      this.setupFloatingScaler();
      this.setupNetworkIndicator();
      this.patchMobileHeader();
    },

    setupBottomNav() {
      let nav = document.querySelector('.gcs-mobile-bottom-nav');
      let pathname = location.pathname.split('/').pop() || 'index';
      pathname = pathname.replace(/\.html$/, '');

      const user = (window.GCS_AUTH && window.GCS_AUTH.getUser) ? window.GCS_AUTH.getUser() : null;
      const profileHref = user ? 'dashboard' : 'login';
      const profileLabel = user ? 'Dashboard' : 'Profile';
      const profileIcon = user ? 'dashboard' : 'account_circle';

      const navItems = [
        { href: './', icon: 'home', key: 'nav-home', label: 'Home', match: ['index', ''] },
        { href: 'careers', icon: 'explore', key: 'nav-careers', label: 'Careers', match: ['careers', 'career-detail'] },
        { href: 'jobs', icon: 'work', key: 'nav-jobs', label: 'Jobs', match: ['jobs'] },
        { href: 'roadmap', icon: 'alt_route', key: 'nav-roadmap', label: 'Roadmap', match: ['roadmap'] },
        { href: profileHref, icon: profileIcon, key: 'nav-profile', label: profileLabel, match: ['dashboard', 'profile', 'login'], id: 'mobileNavProfileItem' }
      ];

      if (!nav) {
        nav = document.createElement('nav');
        nav.className = 'gcs-mobile-bottom-nav';
        nav.setAttribute('aria-label', 'Mobile Bottom Navigation');
        document.body.appendChild(nav);
      }

      nav.innerHTML = navItems.map(item => {
        const isActive = item.match.some(m => pathname === m || pathname.endsWith(m));
        const activeClass = isActive ? ' active' : '';
        const idAttr = item.id ? ` id="${item.id}"` : '';
        return `
          <a href="${item.href}" class="gcs-mobile-nav-item${activeClass}"${idAttr} aria-label="${item.label}">
            <span class="material-symbols-outlined${isActive ? ' fill-1' : ''}">${item.icon}</span>
            <span data-lang-key="${item.key}">${item.label}</span>
          </a>
        `;
      }).join('');
    },

    setupMoreSheet() {
      if (document.getElementById('gcsMoreSheetBackdrop')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'gcsMoreSheetBackdrop';
      backdrop.className = 'gcs-bottom-sheet-backdrop';
      backdrop.onclick = () => this.closeMoreSheet();

      const sheet = document.createElement('div');
      sheet.id = 'gcsMoreSheet';
      sheet.className = 'gcs-bottom-sheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-modal', 'true');
      sheet.setAttribute('aria-labelledby', 'gcsSheetTitle');

      const currentScale = FontScaleManager.getCurrent();
      const user = (window.GCS_AUTH && window.GCS_AUTH.getUser) ? window.GCS_AUTH.getUser() : null;

      const userHeaderHtml = user ? `
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #ECFDF5; border: 1.5px solid #A7F3D0; border-radius: 12px; padding: 10px 14px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
            <img src="${user.avatar || 'assets/resume-avatar-ravi.webp'}" alt="${user.name || 'User'}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0;" onerror="this.src='assets/resume-avatar-ravi.webp'" />
            <div style="min-width: 0;">
              <div style="font-size: 0.88rem; font-weight: 800; color: #064E3B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name || 'User'}</div>
              <div style="font-size: 0.72rem; color: #059669; font-weight: 600;">${user.roleLabel || 'Student / Job Seeker'}</div>
            </div>
          </div>
          <a href="dashboard" class="gcs-btn-cta-1" style="padding: 6px 12px; font-size: 0.75rem; border-radius: 8px; text-decoration: none; flex-shrink: 0;">
            Dashboard
          </a>
        </div>
      ` : `
        <div style="margin-bottom: 12px;">
          <a href="login" class="gcs-btn-cta-1" style="width: 100%; justify-content: center; padding: 10px 16px; border-radius: 10px; text-decoration: none; font-size: 0.88rem;">
            <span class="material-symbols-outlined" style="font-size: 18px;">login</span>
            <span>Sign In / Create Account</span>
          </a>
        </div>
      `;

      sheet.innerHTML = `
        <div class="gcs-sheet-handle-bar"></div>
        <div class="gcs-sheet-content">
          <div class="gcs-sheet-header">
            <div>
              <h3 class="gcs-sheet-title" id="gcsSheetTitle" data-lang-key="more-menu-title">గ్రామీణ కెరీర్ సేతు మెనూ</h3>
              <div style="font-size: 0.75rem; color: #64748B;">Explore All Features & Settings</div>
            </div>
            <button type="button" class="gcs-sheet-close-btn" onclick="window.GCS_APP.closeMoreSheet()" aria-label="Close menu">✕</button>
          </div>

          ${userHeaderHtml}

          <!-- Text Size Adjuster Card -->
          <div class="gcs-font-scaler-card">
            <div class="gcs-font-scaler-header">
              <span class="gcs-font-scaler-title">
                <span class="material-symbols-outlined" style="font-size: 18px; color: #1B5E20;">format_size</span>
                <span data-lang-key="text-size-setting">అక్షరాల పరిమాణం (Text Size)</span>
              </span>
              <span style="font-size: 0.75rem; font-weight: 700; color: #1B5E20;" id="gcsCurrentScaleLabel">
                ${FontScaleManager.PRESETS[currentScale].label}
              </span>
            </div>
            <div class="gcs-font-scaler-options">
              <button type="button" class="gcs-font-size-btn${currentScale === 'small' ? ' active' : ''}" data-scale="small" onclick="window.GCS_APP.setFontScale('small')">
                <span style="font-size: 0.95rem;">A-</span>
                <span class="label">చిన్నది</span>
              </button>
              <button type="button" class="gcs-font-size-btn${currentScale === 'normal' ? ' active' : ''}" data-scale="normal" onclick="window.GCS_APP.setFontScale('normal')">
                <span style="font-size: 1.1rem;">A</span>
                <span class="label">సాధారణ</span>
              </button>
              <button type="button" class="gcs-font-size-btn${currentScale === 'large' ? ' active' : ''}" data-scale="large" onclick="window.GCS_APP.setFontScale('large')">
                <span style="font-size: 1.25rem;">A+</span>
                <span class="label">పెద్దది</span>
              </button>
              <button type="button" class="gcs-font-size-btn${currentScale === 'xlarge' ? ' active' : ''}" data-scale="xlarge" onclick="window.GCS_APP.setFontScale('xlarge')">
                <span style="font-size: 1.4rem;">A++</span>
                <span class="label">అతి పెద్దది</span>
              </button>
            </div>
            <div class="gcs-font-size-preview" id="gcsFontPreview">
              తెలుగు: గ్రామీణ యువతకు నాణ్యమైన ఉద్యోగ & విద్యా అవకాశాలు.
            </div>
          </div>

          <!-- Feature Navigation Grid -->
          <div class="gcs-sheet-grid">
            <a href="dashboard" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #059669, #10B981);">
                <span class="material-symbols-outlined">dashboard</span>
              </div>
              <span class="gcs-sheet-tile-label" data-lang-key="ui-my-dashboard">డ్యాష్‌బోర్డ్</span>
            </a>
            <a href="roadmap" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #7C3AED, #8B5CF6);">
                <span class="material-symbols-outlined">alt_route</span>
              </div>
              <span class="gcs-sheet-tile-label" data-lang-key="nav-roadmap">రోడ్‌మ్యాప్</span>
            </a>
            <a href="scholarships" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #0284C7, #38BDF8);">
                <span class="material-symbols-outlined">school</span>
              </div>
              <span class="gcs-sheet-tile-label" data-lang-key="nav-scholarships">స్కాలర్‌షిప్‌లు</span>
            </a>
            <a href="schemes" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #2563EB, #3B82F6);">
                <span class="material-symbols-outlined">account_balance</span>
              </div>
              <span class="gcs-sheet-tile-label" data-lang-key="nav-schemes">ప్రభుత్వ పథకాలు</span>
            </a>
            <a href="workshops" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #D97706, #F59E0B);">
                <span class="material-symbols-outlined">event</span>
              </div>
              <span class="gcs-sheet-tile-label" data-lang-key="nav-workshops">వర్క్‌షాప్‌లు</span>
            </a>
            <a href="quiz" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #DC2626, #EF4444);">
                <span class="material-symbols-outlined">psychology</span>
              </div>
              <span class="gcs-sheet-tile-label" data-lang-key="nav-quiz">కెరీర్ క్విజ్</span>
            </a>
            <a href="profile" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #0F172A, #334155);">
                <span class="material-symbols-outlined">person</span>
              </div>
              <span class="gcs-sheet-tile-label" data-lang-key="nav-profile">ప్రొఫైల్</span>
            </a>
            <a href="about" class="gcs-sheet-tile">
              <div class="gcs-sheet-tile-icon" style="background: linear-gradient(135deg, #475569, #64748B);">
                <span class="material-symbols-outlined">info</span>
              </div>
              <span class="gcs-sheet-tile-label">About</span>
            </a>
          </div>

          <!-- Bottom Actions: Language Switch & Offline Info -->
          <div style="display: flex; gap: 8px; justify-content: center; align-items: center; padding-top: 8px; border-top: 1px solid #F1F5F9;">
            <button type="button" class="gcs-mobile-action-pill" onclick="window.GCS_I18N && window.GCS_I18N.setLang('te')" style="flex: 1;">
              తెలుగు (TE)
            </button>
            <button type="button" class="gcs-mobile-action-pill" onclick="window.GCS_I18N && window.GCS_I18N.setLang('en')" style="flex: 1;">
              English (EN)
            </button>
            <button type="button" class="gcs-mobile-action-pill" onclick="window.GCS_I18N && window.GCS_I18N.setLang('both')" style="flex: 1;">
              రెండూ (Both)
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(backdrop);
      document.body.appendChild(sheet);
    },

    openMoreSheet() {
      const backdrop = document.getElementById('gcsMoreSheetBackdrop');
      const sheet = document.getElementById('gcsMoreSheet');
      if (backdrop && sheet) {
        backdrop.classList.add('active');
        sheet.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    closeMoreSheet() {
      const backdrop = document.getElementById('gcsMoreSheetBackdrop');
      const sheet = document.getElementById('gcsMoreSheet');
      if (backdrop && sheet) {
        backdrop.classList.remove('active');
        sheet.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    setupFloatingScaler() {
      if (document.querySelector('.gcs-floating-text-scaler')) return;

      const scaler = document.createElement('div');
      scaler.className = 'gcs-floating-text-scaler';
      scaler.setAttribute('role', 'toolbar');
      scaler.setAttribute('aria-label', 'Quick Text Sizer');

      const currentScale = FontScaleManager.getCurrent();
      const pct = currentScale === 'normal' ? '100%' : currentScale === 'small' ? '88%' : currentScale === 'large' ? '115%' : '130%';

      scaler.innerHTML = `
        <button type="button" onclick="window.GCS_APP.decreaseFont()" aria-label="Decrease text size">A-</button>
        <span class="scaler-label" onclick="window.GCS_APP.openMoreSheet()">${pct}</span>
        <button type="button" onclick="window.GCS_APP.increaseFont()" aria-label="Increase text size">A+</button>
      `;

      document.body.appendChild(scaler);
    },

    setupNetworkIndicator() {
      const updateStatus = () => {
        const isOnline = navigator.onLine;
        document.querySelectorAll('.gcs-online-status-badge').forEach(el => {
          el.classList.toggle('offline', !isOnline);
          el.innerHTML = isOnline
            ? '<span class="gcs-online-status-dot"></span><span>ఆన్‌లైన్</span>'
            : '<span class="gcs-online-status-dot"></span><span>ఆఫ్‌లైన్</span>';
        });
      };

      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);
    },

    patchMobileHeader() {
      const headerInner = document.querySelector('.gcs-header-inner');
      if (!headerInner || headerInner.querySelector('.gcs-mobile-header-actions')) return;

      const actions = document.createElement('div');
      actions.className = 'gcs-mobile-header-actions';
      actions.innerHTML = `
        <div class="gcs-online-status-badge" aria-live="polite">
          <span class="gcs-online-status-dot"></span>
          <span>${navigator.onLine ? 'ఆన్‌లైన్' : 'ఆఫ్‌లైన్'}</span>
        </div>
        <button type="button" class="gcs-mobile-action-pill" onclick="window.GCS_APP.cycleFont()" title="Adjust Text Size">
          Aa
        </button>
      `;
      headerInner.appendChild(actions);
    }
  };

  // Initialize interactive features on load
  document.addEventListener('DOMContentLoaded', () => {
    // Lift the sticky header off the content once the page scrolls.
    var gcsHeader = document.querySelector('.gcs-header');
    if (gcsHeader) {
      var onScroll = function () {
        gcsHeader.classList.toggle('is-stuck', window.scrollY > 4);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Footer copyright year, so it never reads as stale.
    document.querySelectorAll('.gcs-current-year').forEach(el => {
      el.textContent = String(new Date().getFullYear());
    });

    initAllBookmarks();
    FontScaleManager.init();
    MobileUiController.init();
    NotificationManager.init();
  });

  // ── Service Worker registration ─────────────────────────────────
  // Lives here rather than in the legacy script.js, which only two of the
  // 22 pages load — offline support was effectively off site-wide.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const base = location.pathname.includes('/admin/') ? '../sw.js' : './sw.js';
      navigator.serviceWorker.register(base, { updateViaCache: 'none' }).catch(err => {
        console.warn('[Service Worker] registration failed:', err);
      });
    });
  }

  // ── PWA Mobile Install Controller ────────────────────────────────
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    window.GCS_PWA_PROMPT = deferredPrompt;

    const installBtns = document.querySelectorAll('.gcs-hero-offline-badge, .gcs-install-btn, [data-action="install-pwa"]');
    installBtns.forEach(btn => {
      btn.style.cursor = 'pointer';
      btn.title = 'Click to install app on your phone';
      btn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult && choiceResult.outcome === 'accepted') {
              Toast.show('🎉 Installing Gramin Career Setu on your phone...', 'success');
            }
            deferredPrompt = null;
          });
        }
      });
    });
  });

  window.addEventListener('appinstalled', () => {
    Toast.show('🎉 Gramin Career Setu installed on your phone!', 'success');
    deferredPrompt = null;
  });

  // ── Text-to-Speech Resilience Listener ───────────────────────────
  window.addEventListener('gcs-speech-unavailable', (e) => {
    const lang = (e && e.detail && e.detail.lang) || 'te';
    const isTe = lang === 'te';
    const msg = isTe
      ? 'ℹ️ మీ పరికరంలో తెలుగు వాయిస్ లేదు (No Telugu voice on this device). English voice fallback active.'
      : 'ℹ️ Audio speech voice is not available on this device.';
    Toast.show(msg, 'info');
  });

  // Global Exports
  window.GCS_APP = {
    // Real role data, generated from data/jobs.csv by
    // scripts/build-jobs-data.js. Empty if data/jobs-data.js is not loaded.
    get jobs() { return window.GCS_JOBS || []; },
    scholarships: SCHOLARSHIPS_DATABASE,
    storage: Storage,
    toast: Toast,
    escapeHtml: escapeHtml,
    toggleBookmark: window.toggleGcsBookmark,
    setFontScale: (scale) => FontScaleManager.apply(scale, true),
    getFontScale: () => FontScaleManager.getCurrent(),
    increaseFont: () => FontScaleManager.cycleNext(),
    decreaseFont: () => FontScaleManager.cyclePrev(),
    cycleFont: () => FontScaleManager.cycleNext(),
    openMoreSheet: () => MobileUiController.openMoreSheet(),
    closeMoreSheet: () => MobileUiController.closeMoreSheet(),
    notifications: {
      toggle: () => NotificationManager.toggle(),
      open: () => NotificationManager.open(),
      close: () => NotificationManager.close(),
      add: (title, msg, type, link) => NotificationManager.add(title, msg, type, link),
      markAllRead: () => NotificationManager.markAllRead(),
      markRead: (id, link) => NotificationManager.markRead(id, link)
    }
  };

})();
