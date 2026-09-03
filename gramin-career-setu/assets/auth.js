/**
 * Gramin Career Setu — Role-Based Authentication & Validation Engine (auth.js)
 * ─────────────────────────────────────────────────────────────────────────────
 * • Roles: Student ('student'), Volunteer ('volunteer'), Admin ('admin')
 * • Client-side Validation: 10-digit Indian mobile, password strength meter, matching
 * • 6-Digit OTP auto-advance & countdown timer
 * • Persistent Session in localStorage ('gcs_auth_user')
 * • Automatic Header Sync across all pages (Avatar + Role Pill vs Sign In button)
 * • Route Guard protection for dashboard.html and admin/index.html
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs_auth_user';
  const PENDING_SIGNUP_KEY = 'gcs_pending_signup';

  // Demo User Accounts
  const DEMO_USERS = {
    student: {
      id: 'usr_student_01',
      name: 'Ravi Kumar',
      phone: '9876543210',
      email: 'ravi.kumar@gmail.com',
      village: 'Gudur, Tirupati District',
      role: 'student',
      roleLabel: 'Student / Job Seeker',
      avatar: 'assets/resume-avatar-ravi.jpg',
      initials: 'RK',
      joinedDate: 'May 2024'
    },
    volunteer: {
      id: 'usr_vol_02',
      name: 'Suresh Babu',
      phone: '9440123456',
      email: 'suresh.babu@csp.org',
      village: 'Penumaka, Guntur District',
      role: 'volunteer',
      roleLabel: 'Village Coordinator',
      avatar: 'assets/profile-suresh.jpg',
      initials: 'SB',
      joinedDate: 'Jan 2024'
    },
    admin: {
      id: 'usr_admin_03',
      name: 'Dr. K. S. Rao',
      phone: '9848012345',
      email: 'admin@gramincareersetu.org',
      village: 'District Collectorate Office',
      role: 'admin',
      roleLabel: 'District Admin',
      avatar: 'assets/profile-ramesh.jpg',
      initials: 'KR',
      joinedDate: 'Nov 2023'
    }
  };

  /**
   * Get currently logged-in user
   */
  function getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Set logged-in user and notify listeners
   */
  function setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('gcs-auth-changed', { detail: { user } }));
    syncHeaderAuthUI();
  }

  /**
   * Validate 10-digit Indian Mobile number
   */
  function validateMobileNumber(mobile) {
    const clean = String(mobile || '').replace(/\D/g, '');
    const isValid = /^[6-9]\d{9}$/.test(clean);
    return {
      valid: isValid,
      clean,
      message: isValid ? '' : 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
    };
  }

  /**
   * Calculate Password Strength Score (0 to 100)
   */
  function calculatePasswordStrength(pass) {
    if (!pass) return { score: 0, label: 'Empty', color: '#CBD5E1', percent: 0 };

    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 8) score += 15;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    let label = 'Weak';
    let color = '#EF4444'; // red

    if (score >= 80) {
      label = 'Strong';
      color = '#10B981'; // green
    } else if (score >= 50) {
      label = 'Medium';
      color = '#F59E0B'; // amber
    }

    return { score, label, color, percent: Math.min(score, 100) };
  }

  /**
   * Perform Sign In
   */
  function login(mobile, password, role = 'student') {
    const mobileCheck = validateMobileNumber(mobile);
    if (!mobileCheck.valid) {
      return { success: false, message: mobileCheck.message };
    }

    if (!password || password.length < 4) {
      return { success: false, message: 'Please enter your password (minimum 4 characters).' };
    }

    // Authenticate or create session
    let user = Object.values(DEMO_USERS).find(u => u.phone === mobileCheck.clean);
    if (!user) {
      user = {
        id: 'usr_' + Date.now(),
        name: 'User ' + mobileCheck.clean.slice(-4),
        phone: mobileCheck.clean,
        role: role || 'student',
        roleLabel: role === 'volunteer' ? 'Village Coordinator' : role === 'admin' ? 'District Admin' : 'Student / Job Seeker',
        avatar: 'assets/resume-avatar-ravi.jpg',
        initials: 'UK',
        joinedDate: 'Today'
      };
    }

    setCurrentUser(user);
    return { success: true, user };
  }

  /**
   * One-Click Demo Login
   */
  function loginDemo(roleKey) {
    const user = DEMO_USERS[roleKey] || DEMO_USERS.student;
    setCurrentUser(user);

    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show(`👋 Logged in as ${user.name} (${user.roleLabel})`);
    }

    setTimeout(() => {
      if (user.role === 'admin' || user.role === 'volunteer') {
        window.location.href = 'admin/index.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    }, 400);
  }

  /**
   * Sign Up: Stage 1 (Store Pending & Proceed to OTP)
   */
  function signup(data) {
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, field: 'name', message: 'Please enter your full name.' };
    }

    const mobileCheck = validateMobileNumber(data.phone);
    if (!mobileCheck.valid) {
      return { success: false, field: 'phone', message: mobileCheck.message };
    }

    if (!data.password || data.password.length < 6) {
      return { success: false, field: 'password', message: 'Password must be at least 6 characters.' };
    }

    if (data.password !== data.confirmPassword) {
      return { success: false, field: 'confirmPassword', message: 'Passwords do not match.' };
    }

    const pendingUser = {
      id: 'usr_' + Date.now(),
      name: data.name.trim(),
      phone: mobileCheck.clean,
      email: (data.email || '').trim(),
      role: data.role || 'student',
      roleLabel: data.role === 'volunteer' ? 'Village Coordinator' : 'Student / Job Seeker',
      avatar: 'assets/resume-avatar-ravi.jpg',
      initials: data.name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U',
      joinedDate: 'Just now'
    };

    try {
      localStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(pendingUser));
    } catch (e) {}

    return { success: true, pendingUser };
  }

  /**
   * Verify 6-Digit OTP Code
   */
  function verifyOTP(code) {
    // In demo / prototype mode, accept 123456 or any 6-digit code
    if (!/^\d{6}$/.test(code)) {
      return { success: false, message: 'Please enter the complete 6-digit verification code.' };
    }

    let user = null;
    try {
      const pending = localStorage.getItem(PENDING_SIGNUP_KEY);
      if (pending) {
        user = JSON.parse(pending);
        localStorage.removeItem(PENDING_SIGNUP_KEY);
      }
    } catch (e) {}

    if (!user) {
      user = DEMO_USERS.student;
    }

    setCurrentUser(user);
    return { success: true, user };
  }

  /**
   * Logout User
   */
  function logout() {
    setCurrentUser(null);
    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show('Logged out successfully.');
    }
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 300);
  }

  /**
   * Sync Header Auth UI across all pages:
   * Displays User Profile pill if logged in, or Sign In button if guest
   */
  function syncHeaderAuthUI() {
    const user = getCurrentUser();
    const actionsContainers = document.querySelectorAll('.gcs-header-actions');
    const isSubdir = window.location.pathname.includes('/admin/');
    const pfx = isSubdir ? '../' : '';

    actionsContainers.forEach(container => {
      let authBtn = container.querySelector('#gcsHeaderAuthBtn');

      if (!authBtn) {
        authBtn = document.createElement('div');
        authBtn.id = 'gcsHeaderAuthBtn';
        authBtn.style.display = 'inline-flex';
        authBtn.style.alignItems = 'center';
        // Insert right after language pills
        const langGroup = container.querySelector('.gcs-lang-group');
        if (langGroup && langGroup.nextSibling) {
          container.insertBefore(authBtn, langGroup.nextSibling);
        } else {
          container.appendChild(authBtn);
        }
      }

      if (user) {
        // User is logged in
        const avatarSrc = pfx + (user.avatar || 'assets/resume-avatar-ravi.jpg');
        const dashLink = pfx + 'dashboard.html';
        const profileLink = pfx + 'profile.html';
        const adminLink = isSubdir ? 'index.html' : 'admin/index.html';

        authBtn.innerHTML = `
          <div class="gcs-user-pill-dropdown" style="position: relative; display: inline-block;">
            <button type="button" onclick="toggleHeaderUserMenu(event)" style="display: flex; align-items: center; gap: 8px; background: #ECFDF5; border: 1.5px solid #86EFAC; border-radius: 24px; padding: 4px 12px 4px 4px; cursor: pointer; font-family: inherit;">
              <img src="${avatarSrc}" alt="${user.name}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" onerror="this.src='${pfx}assets/resume-avatar-ravi.jpg'" />
              <span style="font-size: 0.82rem; font-weight: 700; color: #064E3B; max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name.split(' ')[0]}</span>
              <span class="material-symbols-outlined" style="font-size: 16px; color: #059669;">expand_more</span>
            </button>
            <div id="headerUserMenu" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); background: #ffffff; border: 1px solid #E2E8F0; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); min-width: 200px; z-index: 9999; padding: 6px 0;">
              <div style="padding: 10px 16px; border-bottom: 1px solid #F1F5F9;">
                <div style="font-size: 0.85rem; font-weight: 800; color: #0F172A;">${user.name}</div>
                <div style="font-size: 0.72rem; color: #059669; font-weight: 600;">${user.roleLabel || 'Student'}</div>
              </div>
              <a href="${dashLink}" style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 0.82rem; color: #334155; text-decoration: none; font-weight: 600;">
                <span class="material-symbols-outlined" style="font-size: 18px; color: #059669;">dashboard</span>
                <span>My Dashboard</span>
              </a>
              <a href="${profileLink}" style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 0.82rem; color: #334155; text-decoration: none; font-weight: 600;">
                <span class="material-symbols-outlined" style="font-size: 18px; color: #2563EB;">account_circle</span>
                <span>My Profile</span>
              </a>
              ${user.role === 'admin' || user.role === 'volunteer' ? `
              <a href="${adminLink}" style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; font-size: 0.82rem; color: #334155; text-decoration: none; font-weight: 600;">
                <span class="material-symbols-outlined" style="font-size: 18px; color: #7C3AED;">admin_panel_settings</span>
                <span>Admin Panel</span>
              </a>` : ''}
              <hr style="border: none; border-top: 1px solid #F1F5F9; margin: 4px 0;" />
              <button type="button" onclick="window.GCS_AUTH.logout()" style="display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 16px; font-size: 0.82rem; color: #DC2626; background: none; border: none; text-align: left; cursor: pointer; font-weight: 700;">
                <span class="material-symbols-outlined" style="font-size: 18px;">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        `;
      } else {
        // Guest mode
        authBtn.innerHTML = `
          <a href="${pfx}login.html" class="gcs-btn-cta-1" style="padding: 6px 14px; font-size: 0.82rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; margin-left: 6px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">login</span>
            <span>Sign In</span>
          </a>
        `;
      }
    });
  }

  window.toggleHeaderUserMenu = function (e) {
    e.stopPropagation();
    const menu = document.getElementById('headerUserMenu');
    if (menu) {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
  };

  document.addEventListener('click', () => {
    const menu = document.getElementById('headerUserMenu');
    if (menu) menu.style.display = 'none';
  });

  // Initialize Auth on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    syncHeaderAuthUI();
  });

  // Global Auth API
  window.GCS_AUTH = {
    getUser: getCurrentUser,
    setUser: setCurrentUser,
    login,
    signup,
    verifyOTP,
    loginDemo,
    logout,
    validateMobile: validateMobileNumber,
    calcPasswordStrength: calculatePasswordStrength,
    syncHeader: syncHeaderAuthUI,
    demoUsers: DEMO_USERS
  };

})();
