/**
 * Gramin Career Setu — Shared Logic
 * ─────────────────────────────────
 * • i18n language toggle (Telugu ↔ English) with localStorage persistence
 * • Google Sheets CSV fetch utility
 * • Shared constants
 */

// ── Google Sheets CSV URLs (replace with your published sheet links) ──
const SHEETS = {
  JOBS: 'https://docs.google.com/spreadsheets/d/e/PLACEHOLDER_JOBS/pub?output=csv',
  QUIZ: 'https://docs.google.com/spreadsheets/d/e/PLACEHOLDER_QUIZ/pub?output=csv',
};

// ══════════════════════════════════════════════════════════════════════
//  i18n — Language System
// ══════════════════════════════════════════════════════════════════════

const I18n = (() => {
  // ── Config ──
  const STORAGE_KEY  = 'gcs-lang';      // localStorage key
  const DEFAULT_LANG = 'te';            // Telugu is default
  const LANG_FILE    = 'data/lang.json'; // relative to page root
  const ATTR         = 'data-lang-key';  // attribute on translatable elements

  // ── State ──
  let langData    = null;   // cached { te: {...}, en: {...} }
  let currentLang = DEFAULT_LANG;

  /**
   * Determine the base URL for fetching lang.json.
   * Works whether the page is at root (index.html) or in a subfolder.
   */
  function resolveLangPath() {
    // If the page includes a <script> tag with src containing 'assets/script.js',
    // we know the structure is flat: lang.json is at ./data/lang.json from root.
    // For pages at root level, the relative path works directly.
    // For nested pages, we'd need to adjust — but this project is flat.
    return LANG_FILE;
  }

  /**
   * Read stored language preference, or fall back to default.
   */
  function getSavedLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved === 'te' || saved === 'en') ? saved : DEFAULT_LANG;
    } catch (e) {
      // localStorage may be blocked (private browsing on some devices)
      return DEFAULT_LANG;
    }
  }

  /**
   * Persist the language choice.
   */
  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // Silently fail — the toggle still works for the current session
    }
  }

  /**
   * Apply a language to the entire page.
   * Finds every element with [data-lang-key] and sets its textContent
   * to the matching string from langData.
   */
  function applyLanguage(lang) {
    if (!langData || !langData[lang]) return;

    currentLang = lang;
    const strings = langData[lang];

    // Update <html lang="te|en">
    document.documentElement.lang = lang;

    // Walk every translatable element
    const elements = document.querySelectorAll('[' + ATTR + ']');
    elements.forEach(el => {
      const key = el.getAttribute(ATTR);
      if (key && strings[key] !== undefined) {
        el.textContent = strings[key];
      }
    });

    // Update placeholder text on inputs with data-lang-placeholder
    const placeholders = document.querySelectorAll('[data-lang-placeholder]');
    placeholders.forEach(el => {
      const key = el.getAttribute('data-lang-placeholder');
      if (key && strings[key] !== undefined) {
        el.placeholder = strings[key];
      }
    });

    // Update the toggle button's visible label
    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) {
      // The button contains an icon <span> and a label <span>.
      // We update only the label (last child text node or last <span>).
      const labelSpan = toggleBtn.querySelector('span:not(.lang-toggle-icon)');
      if (labelSpan && strings['lang-toggle'] !== undefined) {
        labelSpan.textContent = strings['lang-toggle'];
      }
    }

    // Save preference
    saveLang(lang);
  }

  /**
   * Toggle between the two languages.
   */
  function toggle() {
    const next = currentLang === 'te' ? 'en' : 'te';
    applyLanguage(next);
  }

  /**
   * Fetch lang.json, then apply the saved (or default) language.
   * Returns a Promise so callers can await if needed.
   */
  async function init() {
    currentLang = getSavedLang();

    try {
      const response = await fetch(resolveLangPath());
      if (!response.ok) throw new Error('Failed to load ' + LANG_FILE);
      langData = await response.json();
    } catch (err) {
      console.warn('[i18n] Could not load language file:', err.message);
      // Page will keep its hardcoded Telugu text as fallback
      return;
    }

    // Apply the correct language immediately
    applyLanguage(currentLang);

    // Wire up the toggle button
    const toggleBtn = document.getElementById('langToggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    }
  }

  // ── Public API ──
  return {
    init,
    toggle,
    applyLanguage,
    getCurrentLang: () => currentLang,
    getStrings:     () => langData ? langData[currentLang] : {},
    getString:      (key) => langData && langData[currentLang] ? langData[currentLang][key] || key : key,
  };
})();

// ══════════════════════════════════════════════════════════════════════
//  CSV Fetch Utility (for Google Sheets)
// ══════════════════════════════════════════════════════════════════════

/**
 * Fetch a Google Sheets published CSV and parse it into an array of objects.
 * The first row is treated as headers (keys).
 *
 * @param {string} url  - The published CSV URL
 * @returns {Promise<Object[]>}
 */
async function fetchSheetCSV(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('CSV fetch failed: ' + response.status);
  const text = await response.text();
  return parseCSV(text);
}

/**
 * Minimal CSV parser — handles quoted fields and newlines within quotes.
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i]);
    if (values.length === 0) continue;

    const row = {};
    headers.forEach((header, idx) => {
      row[header.trim()] = (values[idx] || '').trim();
    });
    results.push(row);
  }

  return results;
}

/**
 * Split a single CSV line respecting quoted fields.
 */
function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

// ══════════════════════════════════════════════════════════════════════
//  Network-First Fetch with localStorage Cache
// ══════════════════════════════════════════════════════════════════════

/**
 * Fetch a Google Sheets CSV with offline fallback.
 *
 * Strategy:
 *   1. Try to fetch from network.
 *   2. On success → cache the raw CSV text in localStorage, parse, return.
 *   3. On failure → try to read cached CSV from localStorage, parse, return.
 *   4. If both fail → throw so the caller can display an error state.
 *
 * @param {string} url       - The published CSV URL
 * @param {string} cacheKey  - localStorage key to store/retrieve cached CSV
 * @returns {Promise<Object[]>}
 */
async function fetchSheetWithCache(url, cacheKey) {
  // ── 1. Try Network ──
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const csvText = await response.text();

    // Validate that we got real CSV (not an error page)
    if (!csvText || csvText.trim().length < 10) {
      throw new Error('Empty or invalid CSV response');
    }

    // Cache for offline use
    try {
      localStorage.setItem(cacheKey, csvText);
      localStorage.setItem(cacheKey + '_ts', Date.now().toString());
    } catch (e) {
      // Storage full or blocked — continue anyway
      console.warn('[cache] Could not cache CSV:', e.message);
    }

    return parseCSV(csvText);
  } catch (networkErr) {
    console.warn('[fetchSheetWithCache] Network failed:', networkErr.message);
  }

  // ── 2. Fall back to Cache ──
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached && cached.trim().length > 10) {
      const ts = localStorage.getItem(cacheKey + '_ts');
      const age = ts ? Math.round((Date.now() - Number(ts)) / 60000) : '?';
      console.info('[fetchSheetWithCache] Using cached data (' + age + ' min old)');
      return parseCSV(cached);
    }
  } catch (e) {
    // localStorage blocked
  }

  // ── 3. Both Failed ──
  throw new Error('No data available — network failed and no offline cache found.');
}

// ══════════════════════════════════════════════════════════════════════
//  Bootstrap — Run on every page
// ══════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
});

// ── Register Service Worker for Offline/PWA Support ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[Service Worker] Registered successfully with scope:', reg.scope);
      })
      .catch(err => {
        console.error('[Service Worker] Registration failed:', err);
      });
  });
}
