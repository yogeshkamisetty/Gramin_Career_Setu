/**
 * Gramin Career Setu — Admin Dashboard Logic (assets/admin.js)
 * ─────────────────────────────────────────────────────────────
 * Handles:
 *  • Sidebar collapse/expand with localStorage persistence
 *  • Dark/Light theme toggle with localStorage persistence
 *  • Skeleton → content transitions
 *  • Chart.js initialization with design-token-derived colors
 *  • Demo data rendering for stat cards and activity feed
 */

const AdminDashboard = (() => {
  'use strict';

  // ── Storage Keys ──
  const STORAGE_SIDEBAR = 'gcs-admin-sidebar';
  const STORAGE_THEME   = 'gcs-admin-theme';

  // ── Demo Data ──
  const DEMO_STATS = {
    totalJobs:       8,
    totalSurveys:    45,
    workshopSessions: 3,
    participants:    127
  };

  const DEMO_TRENDS = {
    totalJobs:        { direction: 'up', value: '+2 this week' },
    totalSurveys:     { direction: 'up', value: '+12 this month' },
    workshopSessions: { direction: 'up', value: '+1 this month' },
    participants:     { direction: 'up', value: '+45 this session' }
  };

  const DEMO_ACTIVITY = [
    { type: 'green', text: 'New job added: Village Revenue Officer (VRO)', time: '2 hours ago' },
    { type: 'blue',  text: 'Survey response received from Peddapalli workshop', time: '5 hours ago' },
    { type: 'amber', text: 'Workshop session completed — 45 participants', time: '1 day ago' },
    { type: 'green', text: 'Resume builder used: Rajesh Kumar downloaded PDF', time: '1 day ago' },
    { type: 'blue',  text: 'Quiz completed: Career path — ITI / Technical', time: '2 days ago' },
    { type: 'green', text: 'New job added: Customer Support Executive (BPO)', time: '3 days ago' }
  ];

  const DEMO_CHART_DATA = {
    labels: [
      'Name 3+ Jobs',
      'Apply Online',
      'Created Resume'
    ],
    before: [12, 5, 0],
    after:  [42, 38, 35]
  };

  // ── DOM Cache ──
  const dom = {};

  function cacheDom() {
    dom.layout         = document.querySelector('.admin-layout');
    dom.sidebar        = document.querySelector('.admin-sidebar');
    dom.sidebarToggle  = document.getElementById('sidebarToggle');
    dom.themeToggle    = document.getElementById('themeToggle');
    dom.themeIcon      = document.getElementById('themeIcon');
    dom.mobileOverlay  = document.getElementById('mobileOverlay');

    // Stat values
    dom.statJobs         = document.getElementById('statJobs');
    dom.statSurveys      = document.getElementById('statSurveys');
    dom.statWorkshops    = document.getElementById('statWorkshops');
    dom.statParticipants = document.getElementById('statParticipants');

    // Trend badges
    dom.trendJobs         = document.getElementById('trendJobs');
    dom.trendSurveys      = document.getElementById('trendSurveys');
    dom.trendWorkshops    = document.getElementById('trendWorkshops');
    dom.trendParticipants = document.getElementById('trendParticipants');

    // Skeletons & content
    dom.statSkeletons    = document.querySelectorAll('.stat-card--skeleton');
    dom.statCards        = document.querySelectorAll('.stat-card--real');
    dom.chartSkeleton    = document.getElementById('chartSkeleton');
    dom.chartCanvas      = document.getElementById('impactChart');
    dom.chartContainer   = document.getElementById('chartContainer');
    dom.activitySkeleton = document.getElementById('activitySkeleton');
    dom.activityFeed     = document.getElementById('activityFeed');
  }

  // ════════════════════════════════════════════════════════════
  //  SIDEBAR
  // ════════════════════════════════════════════════════════════

  function initSidebar() {
    const saved = getSavedPreference(STORAGE_SIDEBAR, 'expanded');
    if (saved === 'collapsed') {
      collapseSidebar(false);
    }

    dom.sidebarToggle.addEventListener('click', toggleSidebar);

    // Mobile overlay
    if (dom.mobileOverlay) {
      dom.mobileOverlay.addEventListener('click', () => {
        dom.sidebar.classList.remove('mobile-open');
        dom.mobileOverlay.classList.remove('visible');
      });
    }
  }

  function toggleSidebar() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      dom.sidebar.classList.toggle('mobile-open');
      if (dom.mobileOverlay) {
        dom.mobileOverlay.classList.toggle('visible');
      }
    } else {
      const isCollapsed = dom.sidebar.classList.contains('collapsed');
      if (isCollapsed) {
        expandSidebar(true);
      } else {
        collapseSidebar(true);
      }
    }
  }

  function collapseSidebar(save) {
    dom.sidebar.classList.add('collapsed');
    dom.layout.classList.add('sidebar-collapsed');
    if (save) savePreference(STORAGE_SIDEBAR, 'collapsed');
  }

  function expandSidebar(save) {
    dom.sidebar.classList.remove('collapsed');
    dom.layout.classList.remove('sidebar-collapsed');
    if (save) savePreference(STORAGE_SIDEBAR, 'expanded');
  }

  // ════════════════════════════════════════════════════════════
  //  THEME
  // ════════════════════════════════════════════════════════════

  function initTheme() {
    const saved = getSavedPreference(STORAGE_THEME, 'dark');
    applyTheme(saved);

    dom.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      savePreference(STORAGE_THEME, next);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!dom.themeIcon) return;
    if (theme === 'dark') {
      dom.themeIcon.textContent = 'light_mode';
    } else {
      dom.themeIcon.textContent = 'dark_mode';
    }
  }

  // ════════════════════════════════════════════════════════════
  //  SKELETON → CONTENT TRANSITIONS
  // ════════════════════════════════════════════════════════════

  function showSkeletons() {
    dom.statSkeletons.forEach(s => s.style.display = '');
    dom.statCards.forEach(c => c.style.display = 'none');
    if (dom.chartSkeleton) dom.chartSkeleton.style.display = '';
    if (dom.chartContainer) dom.chartContainer.style.display = 'none';
    if (dom.activitySkeleton) dom.activitySkeleton.style.display = '';
    if (dom.activityFeed) dom.activityFeed.style.display = 'none';
  }

  function revealContent() {
    // Stat cards
    dom.statSkeletons.forEach(s => s.style.display = 'none');
    dom.statCards.forEach(c => {
      c.style.display = '';
      c.style.animation = 'fadeIn 0.3s var(--ease-out) both';
    });

    // Chart
    if (dom.chartSkeleton) dom.chartSkeleton.style.display = 'none';
    if (dom.chartContainer) {
      dom.chartContainer.style.display = '';
      dom.chartContainer.style.animation = 'fadeIn 0.3s var(--ease-out) 0.1s both';
    }

    // Activity
    if (dom.activitySkeleton) dom.activitySkeleton.style.display = 'none';
    if (dom.activityFeed) {
      dom.activityFeed.style.display = '';
      dom.activityFeed.style.animation = 'fadeIn 0.3s var(--ease-out) 0.2s both';
    }
  }

  // ════════════════════════════════════════════════════════════
  //  RENDER DATA
  // ════════════════════════════════════════════════════════════

  function renderStats(stats, trends) {
    if (dom.statJobs)         dom.statJobs.textContent         = stats.totalJobs;
    if (dom.statSurveys)      dom.statSurveys.textContent      = stats.totalSurveys;
    if (dom.statWorkshops)    dom.statWorkshops.textContent    = stats.workshopSessions;
    if (dom.statParticipants) dom.statParticipants.textContent = stats.participants;

    // Trends
    const trendMap = {
      trendJobs:         trends.totalJobs,
      trendSurveys:      trends.totalSurveys,
      trendWorkshops:    trends.workshopSessions,
      trendParticipants: trends.participants
    };

    Object.keys(trendMap).forEach(key => {
      const el = dom[key];
      if (!el) return;
      const t = trendMap[key];
      el.textContent = t.value;
      el.className = 'stat-card__trend stat-card__trend--' + t.direction;
    });
  }

  function renderActivity(items) {
    if (!dom.activityFeed) return;

    dom.activityFeed.innerHTML = items.map(item => `
      <div class="activity-item">
        <span class="activity-item__dot activity-item__dot--${item.type}" aria-hidden="true"></span>
        <div class="activity-item__content">
          <p class="activity-item__text">${escapeHtml(item.text)}</p>
          <span class="activity-item__time">${escapeHtml(item.time)}</span>
        </div>
      </div>
    `).join('');
  }

  // ════════════════════════════════════════════════════════════
  //  CHART
  // ════════════════════════════════════════════════════════════

  let chartInstance = null;

  function getTokenColor(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }

  function initChart(data) {
    if (!dom.chartCanvas || typeof Chart === 'undefined') {
      console.warn('[AdminDashboard] Chart.js not loaded or canvas not found');
      return;
    }

    const ctx = dom.chartCanvas.getContext('2d');
    const chartGreen = getTokenColor('--chart-green');
    const chartRed   = getTokenColor('--chart-red');
    const textColor  = getTokenColor('--color-text-secondary');
    const gridColor  = getTokenColor('--color-border-subtle');

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Before Workshop',
            data: data.before,
            backgroundColor: chartRed + 'cc',
            borderColor: chartRed,
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          },
          {
            label: 'After Workshop',
            data: data.after,
            backgroundColor: chartGreen + 'cc',
            borderColor: chartGreen,
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              font: {
                family: "'Inter', sans-serif",
                size: 12,
                weight: '600'
              },
              color: textColor,
              boxWidth: 12,
              boxHeight: 12,
              borderRadius: 3,
              useBorderRadius: true,
              padding: 16
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { family: "'Inter', sans-serif", size: 13 },
            bodyFont:  { family: "'Inter', sans-serif", size: 12 },
            padding: 12,
            cornerRadius: 6,
            callbacks: {
              label: function(context) {
                return ' ' + context.dataset.label + ': ' + context.raw + ' youth';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            ticks: {
              stepSize: 10,
              color: textColor,
              font: { family: "'Inter', sans-serif", size: 11 }
            },
            grid: { color: gridColor },
            title: {
              display: true,
              text: 'Number of Youth',
              color: textColor,
              font: { family: "'Inter', sans-serif", size: 12, weight: '600' }
            }
          },
          x: {
            ticks: {
              color: textColor,
              font: { family: "'Inter', sans-serif", size: 12, weight: '600' }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  /**
   * Re-render chart when theme changes (colors shift).
   * Called after applyTheme so CSS variables have updated.
   */
  function refreshChartColors() {
    if (!chartInstance) return;
    // Slight delay to allow CSS custom property reflow
    requestAnimationFrame(() => {
      const chartGreen = getTokenColor('--chart-green');
      const chartRed   = getTokenColor('--chart-red');
      const textColor  = getTokenColor('--color-text-secondary');
      const gridColor  = getTokenColor('--color-border-subtle');

      chartInstance.data.datasets[0].backgroundColor = chartRed + 'cc';
      chartInstance.data.datasets[0].borderColor = chartRed;
      chartInstance.data.datasets[1].backgroundColor = chartGreen + 'cc';
      chartInstance.data.datasets[1].borderColor = chartGreen;

      chartInstance.options.scales.y.ticks.color = textColor;
      chartInstance.options.scales.y.grid.color = gridColor;
      chartInstance.options.scales.y.title.color = textColor;
      chartInstance.options.scales.x.ticks.color = textColor;
      chartInstance.options.plugins.legend.labels.color = textColor;

      chartInstance.update('none');
    });
  }

  // ════════════════════════════════════════════════════════════
  //  HELPERS
  // ════════════════════════════════════════════════════════════

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getSavedPreference(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function savePreference(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // Silent fail
    }
  }

  // ════════════════════════════════════════════════════════════
  //  INIT
  // ════════════════════════════════════════════════════════════

  function init() {
    cacheDom();
    initSidebar();
    initTheme();
    showSkeletons();

    // Simulate data loading (replace with real fetch later)
    setTimeout(() => {
      renderStats(DEMO_STATS, DEMO_TRENDS);
      renderActivity(DEMO_ACTIVITY);
      initChart(DEMO_CHART_DATA);
      revealContent();
    }, 600);

    // Re-render chart colors on theme change
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.attributeName === 'data-theme') {
          refreshChartColors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // Handle responsive sidebar on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768) {
          dom.sidebar.classList.remove('mobile-open');
          if (dom.mobileOverlay) dom.mobileOverlay.classList.remove('visible');
        }
      }, 150);
    });
  }

  return { init };
})();

// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', () => {
  AdminDashboard.init();
});
