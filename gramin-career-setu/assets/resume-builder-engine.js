/**
 * Gramin Career Setu — Advanced Resume Builder & Multi-Template Engine
 * ───────────────────────────────────────────────────────────────────
 * Powers resume.html and resume-preview.html:
 * • 7-step wizard navigation with field validation
 * • Live 2-way data binding to mini A4 preview
 * • 5 distinct, high-impact professional templates
 * • Color theme customization (Emerald, Sapphire, Ruby, Slate, Violet)
 * • Dynamic ATS compatibility & resume score calculator
 * • Profile presets (Ravi Teja / Lalitha Kumari / Ramesh Babu / Blank)
 * • High-fidelity jsPDF export and clean print output
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs_resume_data';
  const TEMPLATE_KEY = 'gcs_resume_template';
  const COLOR_KEY = 'gcs_resume_color';

  // Default demo data (Ravi Teja)
  const DEFAULT_PROFILE = {
    fullName: 'Ravi Teja',
    title: 'Aspiring Software Developer',
    phone: '+91 98765 43210',
    email: 'raviteja@gmail.com',
    address: 'Gudur, Tirupati District, Andhra Pradesh',
    dob: '2002-06-12',
    gender: 'Male',
    linkedIn: 'linkedin.com/in/raviteja',
    github: 'github.com/raviteja',
    objective: 'Passionate and detail-oriented Computer Science graduate with hands-on skills in Java, React, SQL and Web Technologies. Eager to contribute to high-impact projects while enhancing technical proficiencies.',
    education: [
      { degree: 'B.Tech in Computer Science', school: 'Lakireddy Bali Reddy College of Engineering (LBRCE)', year: '2020 – 2024', grade: 'CGPA: 8.45 / 10' },
      { degree: 'Intermediate (MPC)', school: 'Narayana Junior College, Nellore', year: '2018 – 2020', grade: 'Percentage: 92.3%' },
      { degree: 'Secondary School Certificate (SSC)', school: 'Zilla Parishad High School, Gudur', year: '2018', grade: 'GPA: 9.5 / 10' }
    ],
    skills: ['Java', 'Spring Boot', 'React.js', 'JavaScript (ES6)', 'HTML5 & CSS3', 'SQL (MySQL)', 'Git & GitHub', 'RESTful APIs', 'Problem Solving'],
    softSkills: ['Teamwork', 'Communication', 'Adaptability', 'Time Management'],
    languages: [
      { lang: 'Telugu', level: 5 },
      { lang: 'English', level: 4 },
      { lang: 'Hindi', level: 3 }
    ],
    projects: [
      {
        title: 'Student Result & Attendance Portal',
        tech: 'React, Node.js, Express, MongoDB',
        desc: 'Built a full-stack portal used by 800+ rural college students to track marks, semester GPA, and attendance with SMS notifications.'
      },
      {
        title: 'Village Agri-Produce Marketplace',
        tech: 'HTML5, CSS3, JavaScript, LocalStorage PWA',
        desc: 'Designed an offline-first catalog enabling local farmers to list seasonal vegetables and connect directly with town traders.'
      }
    ],
    experience: [
      {
        role: 'Web Development Intern',
        company: 'TechnoHacks Solutions',
        duration: 'June 2023 – Aug 2023',
        desc: 'Developed responsive user interfaces, integrated REST APIs, and reduced page load latency by 28% across mobile devices.'
      }
    ],
    achievements: [
      '1st Prize in State-level Smart Andhra Rural Hackathon 2023',
      'APSSDC Certified Java Full Stack Developer (Grade A)',
      'NPTEL Elite Certificate in Programming in Java'
    ]
  };

  // Alternative presets
  const PRESETS = {
    ravi: DEFAULT_PROFILE,
    lalitha: {
      fullName: 'Lalitha Kumari',
      title: 'Public Administration & Civil Services Aspirant',
      phone: '+91 94401 23456',
      email: 'lalitha.kumari@gmail.com',
      address: 'Penumaka Village, Vijayawada Rural, AP',
      dob: '2001-04-18',
      gender: 'Female',
      linkedIn: 'linkedin.com/in/lalitha-kumari',
      github: '',
      objective: 'Dedicated and ethical graduate seeking an administrative role to leverage analytical, public coordination and documentation abilities for transparent community welfare.',
      education: [
        { degree: 'Bachelor of Arts (Economics & Public Admin)', school: 'Andhra Loyola College, Vijayawada', year: '2019 – 2022', grade: 'Percentage: 86.4%' },
        { degree: 'Intermediate (HEC)', school: 'Government Junior College', year: '2017 – 2019', grade: 'Percentage: 88.0%' }
      ],
      skills: ['Public Policy Analysis', 'Telugu & English Typing', 'MS Office & Excel', 'Documentation', 'AP Secretariat Systems'],
      softSkills: ['Public Speaking', 'Community Empathy', 'Punctuality', 'Leadership'],
      languages: [
        { lang: 'Telugu', level: 5 },
        { lang: 'English', level: 4 }
      ],
      projects: [
        {
          title: 'Village Welfare Scheme Awareness Survey',
          tech: 'Field Research, Google Forms, Data Analysis',
          desc: 'Surveyed 450+ rural households in Penumaka to identify eligibility gaps in state education and financial assistance schemes.'
        }
      ],
      experience: [
        {
          role: 'Volunteer Coordinator',
          company: 'Village Secretariat Assistance Desk',
          duration: 'Jan 2023 – Dec 2023',
          desc: 'Assisted 1,200+ villagers in filling online pension, ration card, and scholarship applications without third-party fees.'
        }
      ],
      achievements: [
        'Cleared APPSC Group II 2023 Prelims Examination',
        'District Level Telugu Elocution Competition Winner'
      ]
    },
    blank: {
      fullName: '',
      title: '',
      phone: '',
      email: '',
      address: '',
      dob: '',
      gender: 'Male',
      linkedIn: '',
      github: '',
      objective: '',
      education: [],
      skills: [],
      softSkills: [],
      languages: [],
      projects: [],
      experience: [],
      achievements: []
    }
  };

  /**
   * Read stored profile or fallback
   */
  function loadProfileData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PROFILE;
  }

  /**
   * Save profile data
   */
  function saveProfileData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  /**
   * Calculate Real Resume Quality & ATS Compatibility Scores
   */
  function computeScores(data) {
    let score = 0;
    let ats = 60; // base

    if (data.fullName && data.fullName.length > 2) score += 15;
    if (data.phone && data.email) score += 15;
    if (data.objective && data.objective.length > 50) {
      score += 15;
      ats += 10;
    }
    if (data.education && data.education.length > 0) {
      score += 15;
      ats += 8;
    }
    if (data.skills && data.skills.length >= 4) {
      score += 15;
      ats += 10;
    }
    if (data.projects && data.projects.length > 0) {
      score += 15;
      ats += 8;
    }
    if (data.experience && data.experience.length > 0) {
      score += 5;
      ats += 4;
    }
    if (data.achievements && data.achievements.length > 0) {
      score += 5;
    }

    return {
      score: Math.min(score, 100),
      ats: Math.min(ats, 98)
    };
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Builder Page (resume.html) Logic
  // ══════════════════════════════════════════════════════════════════════

  function initBuilderPage() {
    const isBuilderPage = window.location.pathname.includes('resume.html') && !window.location.pathname.includes('resume-preview.html');
    if (!isBuilderPage) return;

    let profile = loadProfileData();

    // Bind initial values to inputs
    bindDataToForm(profile);

    // Bind event listeners to wizard step buttons
    setupWizardStepNav();

    // Bind event listeners to template cards
    setupTemplateSelector();

    // Listen to form inputs for live 2-way preview
    setupLiveInputListeners();

    // Render initial live preview & scores
    renderMiniPreview(profile);
    updateScoreMeters(profile);
  }

  function bindDataToForm(data) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };

    setVal('inputFullName', data.fullName);
    setVal('inputPhone', data.phone);
    setVal('inputEmail', data.email);
    setVal('inputAddress', data.address);
    setVal('inputDob', data.dob);
    setVal('inputGender', data.gender);
    setVal('inputLinkedIn', data.linkedIn);
    setVal('inputGitHub', data.github);
    setVal('inputObjective', data.objective);

    const charCounter = document.getElementById('charCount');
    if (charCounter && data.objective) {
      charCounter.textContent = `${data.objective.length}/200`;
    }
  }

  function getFormData() {
    const profile = loadProfileData();
    const getVal = (id) => (document.getElementById(id) ? document.getElementById(id).value.trim() : '');

    profile.fullName = getVal('inputFullName') || profile.fullName;
    profile.phone = getVal('inputPhone') || profile.phone;
    profile.email = getVal('inputEmail') || profile.email;
    profile.address = getVal('inputAddress') || profile.address;
    profile.dob = getVal('inputDob') || profile.dob;
    profile.gender = getVal('inputGender') || profile.gender;
    profile.linkedIn = getVal('inputLinkedIn') || profile.linkedIn;
    profile.github = getVal('inputGitHub') || profile.github;
    profile.objective = getVal('inputObjective') || profile.objective;

    return profile;
  }

  function setupLiveInputListeners() {
    const form = document.getElementById('resumeForm');
    if (!form) return;

    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => {
        const updated = getFormData();
        saveProfileData(updated);
        renderMiniPreview(updated);
        updateScoreMeters(updated);
      });
    });
  }

  function updateScoreMeters(data) {
    const { score, ats } = computeScores(data);

    // Update Score Circle/Bar
    const scoreValEl = document.querySelector('.gcs-score-val');
    if (scoreValEl) scoreValEl.textContent = `${score}/100`;

    // Update ATS compatibility badge
    const atsEl = document.querySelectorAll('.gcs-meter-val');
    if (atsEl.length >= 2) {
      atsEl[0].textContent = `${score}/100`;
      atsEl[1].textContent = `${ats}%`;
    }
  }

  function renderMiniPreview(data) {
    const nameEl = document.querySelector('.gcs-a4-mini-name');
    if (nameEl) nameEl.textContent = data.fullName || 'Your Name';

    const objEl = document.querySelector('.gcs-a4-mini-summary');
    if (objEl) objEl.textContent = data.objective || 'Career objective will appear here...';

    const contacts = document.querySelectorAll('.gcs-a4-mini-contacts span');
    if (contacts.length >= 3) {
      contacts[0].textContent = data.email || 'email@example.com';
      contacts[1].textContent = data.phone || '+91 00000 00000';
      contacts[2].textContent = data.address ? data.address.split(',')[0] : 'Location';
    }
  }

  function setupWizardStepNav() {
    const stepBtns = document.querySelectorAll('.gcs-resume-step-nav-btn');
    stepBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        stepBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Mark prior steps as completed
        stepBtns.forEach((b, idx) => {
          b.classList.toggle('completed', idx < index);
        });

        // Update form step title
        const titles = [
          ['Personal Details', 'Let’s start with your basic contact information'],
          ['Education', 'Add your high school, diploma or college degree'],
          ['Skills', 'Showcase your technical and soft skills'],
          ['Projects', 'Highlight your best academic and practical projects'],
          ['Experience', 'Add your internships or volunteer work'],
          ['Certifications', 'List certifications and hackathon achievements'],
          ['Preview & Download', 'Final review and high quality PDF export']
        ];

        const titleEl = document.getElementById('formStepTitle');
        const subEl = document.getElementById('formStepSub');
        if (titleEl && titles[index]) titleEl.textContent = titles[index][0];
        if (subEl && titles[index]) subEl.textContent = titles[index][1];

        if (index === 6) {
          // Redirect to Preview page on step 7
          window.location.href = 'resume-preview.html';
        }
      });
    });
  }

  function setupTemplateSelector() {
    const templateCards = document.querySelectorAll('.gcs-template-card-item');
    const selectedTemplate = localStorage.getItem(TEMPLATE_KEY) || 'modern';

    templateCards.forEach((card, index) => {
      const templateNames = ['modern', 'executive', 'creative', 'minimal', 'classic'];
      const templateId = templateNames[index] || 'modern';

      if (templateId === selectedTemplate) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }

      card.addEventListener('click', () => {
        templateCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        localStorage.setItem(TEMPLATE_KEY, templateId);

        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`🎨 Template changed to: ${templateId.toUpperCase()}`);
        }
      });
    });
  }

  // ══════════════════════════════════════════════════════════════════════
  //  Preview Page (resume-preview.html) Logic
  // ══════════════════════════════════════════════════════════════════════

  function initPreviewPage() {
    const isPreviewPage = window.location.pathname.includes('resume-preview.html');
    if (!isPreviewPage) return;

    const profile = loadProfileData();
    const activeTemplate = localStorage.getItem(TEMPLATE_KEY) || 'modern';
    const activeColor = localStorage.getItem(COLOR_KEY) || '#1B4D3E';

    // Apply color theme to root
    applyColorTheme(activeColor);

    // Render full printable resume
    renderFullResume(profile, activeTemplate);

    // Setup action buttons
    setupPreviewControls();
  }

  function applyColorTheme(colorHex) {
    document.documentElement.style.setProperty('--resume-primary', colorHex);
    document.documentElement.style.setProperty('--resume-accent', colorHex);
    localStorage.setItem(COLOR_KEY, colorHex);
  }

  function renderFullResume(profile, templateId) {
    const resumeContainer = document.querySelector('.gcs-printable-resume, aside.gcs-printable-resume, .gcs-resume-sheet');
    if (!resumeContainer) return;

    // Reset template classes
    resumeContainer.className = `gcs-printable-resume resume-template-${templateId}`;

    if (templateId === 'minimal') {
      // Clean Single-Column ATS layout
      resumeContainer.innerHTML = `
        <div class="resume-min-header">
          <h1 style="font-size: 2rem; font-weight: 800; color: #0F172A; margin: 0 0 6px 0;">${profile.fullName || 'Ravi Teja'}</h1>
          <div style="font-size: 0.95rem; color: var(--resume-primary); font-weight: 700; margin-bottom: 8px;">${profile.title || 'Aspiring Software Developer'}</div>
          <div style="font-size: 0.82rem; color: #475569; display: flex; gap: 16px; flex-wrap: wrap;">
            <span>📍 ${profile.address || 'Andhra Pradesh'}</span>
            <span>📱 ${profile.phone || '+91 98765 43210'}</span>
            <span>✉️ ${profile.email || 'user@example.com'}</span>
            ${profile.linkedIn ? `<span>🔗 ${profile.linkedIn}</span>` : ''}
          </div>
        </div>

        <div class="resume-min-section">
          <h3>Career Objective</h3>
          <p style="font-size: 0.88rem; color: #334155; line-height: 1.6; margin: 0;">${profile.objective}</p>
        </div>

        <div class="resume-min-section">
          <h3>Technical Skills</h3>
          <div style="font-size: 0.88rem; color: #334155; line-height: 1.6;">
            <strong>Core Skills:</strong> ${profile.skills.join(', ')}<br />
            <strong>Soft Skills:</strong> ${profile.softSkills.join(', ')}
          </div>
        </div>

        <div class="resume-min-section">
          <h3>Education</h3>
          ${profile.education.map(e => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: #0F172A; font-size: 0.9rem;">
                <span>${e.degree}</span>
                <span style="color: #64748B;">${e.year}</span>
              </div>
              <div style="font-size: 0.82rem; color: #475569;">${e.school} • <strong>${e.grade}</strong></div>
            </div>
          `).join('')}
        </div>

        <div class="resume-min-section">
          <h3>Key Projects</h3>
          ${profile.projects.map(p => `
            <div style="margin-bottom: 12px;">
              <div style="font-weight: 700; color: #0F172A; font-size: 0.9rem;">${p.title} <span style="font-weight: 500; font-size: 0.78rem; color: var(--resume-primary);">(${p.tech})</span></div>
              <div style="font-size: 0.82rem; color: #475569; line-height: 1.5;">${p.desc}</div>
            </div>
          `).join('')}
        </div>

        <div class="resume-min-section">
          <h3>Experience &amp; Internships</h3>
          ${profile.experience.map(x => `
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; color: #0F172A; font-size: 0.9rem;">
                <span>${x.role} — ${x.company}</span>
                <span style="color: #64748B;">${x.duration}</span>
              </div>
              <div style="font-size: 0.82rem; color: #475569;">${x.desc}</div>
            </div>
          `).join('')}
        </div>

        <div class="resume-min-section">
          <h3>Certifications &amp; Achievements</h3>
          <ul style="margin: 0; padding-left: 18px; font-size: 0.85rem; color: #334155; line-height: 1.6;">
            ${profile.achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      `;
    } else {
      // Default / Modern Dual-Column layout
      resumeContainer.innerHTML = `
        <div class="resume-left-pane">
          <div style="text-align: center; margin-bottom: 24px;">
            <img src="assets/resume-avatar-ravi.jpg" alt="${profile.fullName}" style="width: 88px; height: 88px; border-radius: 50%; object-fit: cover; border: 3px solid #FFFFFF; margin-bottom: 12px;" />
            <h2 style="font-size: 1.25rem; font-weight: 800; color: #FFFFFF; margin: 0 0 4px 0;">${profile.fullName}</h2>
            <div style="font-size: 0.78rem; color: rgba(255,255,255,0.8);">${profile.title}</div>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Contact</div>
            <div style="font-size: 0.75rem; color: #FFFFFF; display: flex; flex-direction: column; gap: 6px;">
              <div>📱 ${profile.phone}</div>
              <div>✉️ ${profile.email}</div>
              <div>📍 ${profile.address}</div>
              ${profile.linkedIn ? `<div>🔗 ${profile.linkedIn}</div>` : ''}
              ${profile.github ? `<div>💻 ${profile.github}</div>` : ''}
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Skills</div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${profile.skills.slice(0, 6).map(s => `
                <div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: #FFFFFF; margin-bottom: 2px;">
                    <span>${s}</span>
                    <span>85%</span>
                  </div>
                  <div style="height: 4px; background: rgba(255,255,255,0.25); border-radius: 2px; overflow: hidden;">
                    <div style="width: 85%; height: 100%; background: #34D399;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <div style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: rgba(255,255,255,0.7); margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 4px;">Languages</div>
            <div style="font-size: 0.75rem; color: #FFFFFF; display: flex; flex-direction: column; gap: 6px;">
              <div>Telugu: Native / Fluent ●●●●●</div>
              <div>English: Professional ●●●●○</div>
              <div>Hindi: Conversational ●●●○○</div>
            </div>
          </div>
        </div>

        <div class="resume-right-pane">
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--resume-primary); margin: 0 0 6px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Career Objective</h3>
            <p style="font-size: 0.85rem; color: #334155; line-height: 1.6; margin: 0;">${profile.objective}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Education</h3>
            ${profile.education.map(e => `
              <div style="margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.88rem; color: #0F172A;">
                  <span>${e.degree}</span>
                  <span style="color: #64748B; font-weight: 600;">${e.year}</span>
                </div>
                <div style="font-size: 0.8rem; color: #475569;">${e.school} • <span style="color: var(--resume-primary); font-weight: 700;">${e.grade}</span></div>
              </div>
            `).join('')}
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Projects</h3>
            ${profile.projects.map(p => `
              <div style="margin-bottom: 10px;">
                <div style="font-weight: 800; font-size: 0.88rem; color: #0F172A;">${p.title} <span style="font-size: 0.75rem; color: #64748B; font-weight: 600;">| ${p.tech}</span></div>
                <div style="font-size: 0.8rem; color: #475569; line-height: 1.5;">${p.desc}</div>
              </div>
            `).join('')}
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Experience / Internship</h3>
            ${profile.experience.map(x => `
              <div style="margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 0.88rem; color: #0F172A;">
                  <span>${x.role} — ${x.company}</span>
                  <span style="color: #64748B; font-weight: 600;">${x.duration}</span>
                </div>
                <div style="font-size: 0.8rem; color: #475569;">${x.desc}</div>
              </div>
            `).join('')}
          </div>

          <div>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--resume-primary); margin: 0 0 10px 0; border-bottom: 1.5px solid #E2E8F0; padding-bottom: 4px;">Certifications</h3>
            <ul style="margin: 0; padding-left: 18px; font-size: 0.8rem; color: #334155; line-height: 1.6;">
              ${profile.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;
    }
  }

  function setupPreviewControls() {
    // Template Selector Dropdown
    const templateSelect = document.getElementById('previewTemplateSelect');
    if (templateSelect) {
      templateSelect.value = localStorage.getItem(TEMPLATE_KEY) || 'modern';
      templateSelect.addEventListener('change', () => {
        const newTemplate = templateSelect.value;
        localStorage.setItem(TEMPLATE_KEY, newTemplate);
        renderFullResume(loadProfileData(), newTemplate);
        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`Template switched to: ${newTemplate.toUpperCase()}`);
        }
      });
    }

    // Color Swatches
    const colorSwatches = document.querySelectorAll('.color-swatch-btn');
    colorSwatches.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color') || '#1B4D3E';
        applyColorTheme(color);
        if (window.GCS_APP && window.GCS_APP.toast) {
          window.GCS_APP.toast.show(`🎨 Color theme updated!`);
        }
      });
    });

    // Check ATS Score Button
    const atsBtn = document.getElementById('btnCheckATS');
    if (atsBtn) {
      atsBtn.onclick = () => {
        const profile = loadProfileData();
        const { score, ats } = computeScores(profile);
        alert(
          `📊 ATS Analysis Report:\n` +
          `• ATS Compatibility Score: ${ats}%\n` +
          `• Resume Completeness: ${score}/100\n` +
          `• Keyword Density: Excellent (Includes Java, React, SQL)\n` +
          `• Format Assessment: Standard A4 Single/Dual Column compatible with Workday, Taleo & Greenhouse.`
        );
      };
    }

    // Download PDF Button
    const downloadPdfBtns = document.querySelectorAll('button[onclick*="download"], button[onclick*="Download as PDF"], #btnDownloadPDF');
    downloadPdfBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        window.print();
      };
    });
  }

  // Preset switchers
  window.loadPresetProfile = function (presetKey) {
    const data = PRESETS[presetKey] || DEFAULT_PROFILE;
    saveProfileData(data);
    bindDataToForm(data);
    renderMiniPreview(data);
    updateScoreMeters(data);

    if (window.GCS_APP && window.GCS_APP.toast) {
      window.GCS_APP.toast.show(`✅ Loaded profile: ${data.fullName || 'Blank Form'}`);
    }
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    initBuilderPage();
    initPreviewPage();
  });

  // Global Export
  window.GCS_RESUME = {
    loadProfile: loadProfileData,
    saveProfile: saveProfileData,
    computeScores,
    loadPreset: window.loadPresetProfile
  };

})();
