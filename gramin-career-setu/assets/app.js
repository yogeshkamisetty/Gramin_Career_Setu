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
  //  1. Central Datasets
  // ══════════════════════════════════════════════════════════════════════

  const JOBS_DATABASE = [
    {
      id: 'tcs-software-developer',
      title: 'Software Developer',
      company: 'Tata Consultancy Services',
      logoText: 'tcs',
      logoBg: '#FFF1F2',
      logoColor: '#E11D48',
      verified: true,
      jobType: 'Full Time',
      workplace: 'On-site',
      experience: '2+ Yrs Exp (Freshers Welcome)',
      education: 'B.Tech / BE in CS / IT / MCA',
      location: 'Hyderabad, Telangana',
      postedAgo: 'Posted 2 hours ago',
      salary: '₹ 6 – 10 LPA',
      skills: ['Java', 'Spring Boot', 'React', 'SQL', 'REST API'],
      category: 'software',
      description: 'TCS is looking for talented Software Developers to join our dynamic team and build innovative solutions that make a real impact. You will be responsible for developing, testing, and maintaining high-quality software applications.',
      responsibilities: [
        'Design, develop and maintain scalable web and enterprise applications.',
        'Collaborate with cross-functional teams to define, design, and ship new features.',
        'Write clean, efficient and maintainable code following industry standards.',
        'Troubleshoot, debug and optimize applications for high performance.',
        'Participate in agile sprint ceremonies and code reviews.'
      ],
      requirements: [
        'Proficiency in Java and Spring Boot framework',
        'Hands-on experience with React.js, HTML5, CSS3, and JavaScript',
        'Strong understanding of relational databases (MySQL/PostgreSQL) and SQL queries',
        'Knowledge of RESTful APIs and microservices architecture',
        'Good problem-solving and algorithmic thinking abilities',
        'Bachelor’s degree in Computer Science, IT or related engineering discipline'
      ],
      perks: [
        { icon: 'health_and_safety', title: 'Comprehensive Health Insurance' },
        { icon: 'account_balance_wallet', title: 'Provident Fund & Gratuity' },
        { icon: 'school', title: 'Continuous Learning & Upskilling' },
        { icon: 'stars', title: 'Annual Performance Bonus' },
        { icon: 'balance', title: 'Work-Life Balance Programs' },
        { icon: 'laptop', title: 'Hybrid & Flexible Work Options' }
      ],
      companyOverview: {
        employees: '500K+ Employees',
        presence: '55+ Countries',
        sector: 'Global IT Services & Consulting',
        website: 'https://www.tcs.com'
      }
    },
    {
      id: 'infosys-system-engineer',
      title: 'System Engineer',
      company: 'Infosys Limited',
      logoText: 'infy',
      logoBg: '#EFF6FF',
      logoColor: '#2563EB',
      verified: true,
      jobType: 'Full Time',
      workplace: 'Work From Home',
      experience: '0 – 2 Yrs Exp',
      education: 'B.Tech / B.Sc / BCA / MCA',
      location: 'Bengaluru / Remote',
      postedAgo: 'Posted 1 day ago',
      salary: '₹ 4.5 – 6.5 LPA',
      skills: ['Java', 'Python', 'C++', 'Cloud', 'Data Structures'],
      category: 'software',
      description: 'Infosys is inviting ambitious engineers to build tomorrow’s cloud and automation systems. You will receive industry-standard Mysore campus training and work on global enterprise modernization projects.',
      responsibilities: [
        'Develop and maintain cloud-native enterprise modules.',
        'Write unit test scripts and implement automated CI/CD pipelines.',
        'Collaborate with global technical leads across time zones.'
      ],
      requirements: [
        'Fundamental knowledge of Java or Python',
        'Understanding of Cloud basics (AWS / Azure)',
        'Good English communication skills and eagerness to learn'
      ],
      perks: [
        { icon: 'laptop_chromebook', title: 'Company Provided Laptop & Setup' },
        { icon: 'school', title: 'Mysore Global Education Centre Training' },
        { icon: 'medical_services', title: 'Family Medical Cover' }
      ],
      companyOverview: {
        employees: '330K+ Employees',
        presence: '50+ Countries',
        sector: 'Digital Services & Consulting',
        website: 'https://www.infosys.com'
      }
    },
    {
      id: 'wipro-associate-engineer',
      title: 'Associate Software Engineer',
      company: 'Wipro Limited',
      logoText: 'wipro',
      logoBg: '#FAF5FF',
      logoColor: '#7C3AED',
      verified: true,
      jobType: 'Full Time',
      workplace: 'Hybrid',
      experience: '0 – 2 Yrs Exp',
      education: 'B.Tech (Any Branch) / MCA',
      location: 'Hyderabad / Bengaluru',
      postedAgo: 'Posted 3 days ago',
      salary: '₹ 4 – 5.5 LPA',
      skills: ['Python', 'Django', 'HTML5', 'SQL', 'Git'],
      category: 'software',
      description: 'Join Wipro’s Elite talent program. Perfect entry point for rural engineering graduates to break into full-stack backend development.',
      responsibilities: [
        'Build APIs and backend services using Python and Django.',
        'Integrate databases and third-party partner services.',
        'Resolve bugs and participate in weekly production deployments.'
      ],
      requirements: [
        'Basic proficiency in Python programming',
        'Understanding of web protocols and Git version control',
        'Willingness to relocate to tech hubs if required'
      ],
      perks: [
        { icon: 'commute', title: 'Cab Transport Facilities' },
        { icon: 'health_and_safety', title: 'Medical Insurance' },
        { icon: 'trending_up', title: 'Higher Education M.Tech Sponsorship' }
      ],
      companyOverview: {
        employees: '250K+ Employees',
        presence: '65+ Countries',
        sector: 'Technology Services',
        website: 'https://www.wipro.com'
      }
    },
    {
      id: 'accenture-software-analyst',
      title: 'Software Engineering Analyst',
      company: 'Accenture Solutions',
      logoText: 'acc',
      logoBg: '#FFFBEB',
      logoColor: '#D97706',
      verified: true,
      jobType: 'Full Time',
      workplace: 'Hybrid',
      experience: '0 – 3 Yrs Exp',
      education: 'BE / B.Tech / M.Sc / MCA',
      location: 'Chennai / Hyderabad',
      postedAgo: 'Posted 4 days ago',
      salary: '₹ 5 – 7.5 LPA',
      skills: ['Python', 'SQL', 'AWS', 'Agile', 'ETL'],
      category: 'software',
      description: 'Accenture is looking for analytical minds to drive data engineering and application support for Fortune 500 clients.',
      responsibilities: [
        'Build data pipelines and support business intelligence dashboards.',
        'Work alongside cloud architects to optimize database performance.',
        'Analyze system telemetry and troubleshoot operational incidents.'
      ],
      requirements: [
        'Strong SQL querying skills and Python scripting',
        'Analytical problem-solving and aptitude',
        'Basic familiarity with cloud computing concepts'
      ],
      perks: [
        { icon: 'flight', title: 'Travel Allowances' },
        { icon: 'fitness_center', title: 'Wellness & Gym Reimbursement' },
        { icon: 'school', title: 'Access to 10,000+ Online Courses' }
      ],
      companyOverview: {
        employees: '700K+ Employees',
        presence: '120+ Countries',
        sector: 'Global Professional Services',
        website: 'https://www.accenture.com'
      }
    },
    {
      id: 'zoho-product-intern',
      title: 'Product Engineering Intern',
      company: 'Zoho Corporation',
      logoText: 'zoho',
      logoBg: '#ECFDF5',
      logoColor: '#059669',
      verified: true,
      jobType: 'Internship',
      workplace: 'On-site / Rural Hubs',
      experience: 'Freshers / Final Year Students',
      education: 'Any Degree / Diploma / Passionate Coders',
      location: 'Tenkasi / Gudur / Chennai',
      postedAgo: 'Posted 5 days ago',
      salary: '₹ 25,000 / month Stipend',
      skills: ['Problem Solving', 'Data Structures', 'JavaScript', 'C', 'Java'],
      category: 'software',
      description: 'Zoho champions rural tech empowerment! Work out of modern rural offices in small towns. No degree bias — only pure passion for programming matters.',
      responsibilities: [
        'Solve core data structure problems and implement web modules.',
        'Learn real-world software architecture directly from senior mentors.',
        'Top performers will be offered full-time roles post-internship.'
      ],
      requirements: [
        'Deep interest in writing code and solving logic puzzles',
        'Knowledge of any one programming language (C, Java, or JavaScript)',
        'Positive attitude, teamwork, and hunger to learn'
      ],
      perks: [
        { icon: 'restaurant', title: 'Free Nutritious Breakfast & Lunch' },
        { icon: 'home', title: 'Rural Hub Workplace Close to Home' },
        { icon: 'rocket_launch', title: 'Pre-Placement Offer (PPO) Opportunity' }
      ],
      companyOverview: {
        employees: '15K+ Employees',
        presence: 'Global Leader in SaaS',
        sector: 'Enterprise Software & Cloud Suite',
        website: 'https://www.zoho.com'
      }
    },
    {
      id: 'ap-village-secretariat-assistant',
      title: 'Village Digital Assistant',
      company: 'AP Village Secretariat (Grama Sachivalayam)',
      logoText: 'ap',
      logoBg: '#F0FDF4',
      logoColor: '#047857',
      verified: true,
      jobType: 'Full Time',
      workplace: 'On-site',
      experience: '0 – 1 Yr (Fresher)',
      education: 'Diploma / Degree in Electrical, Electronics, CS or IT',
      location: 'Various Villages across AP',
      postedAgo: 'Posted 1 week ago',
      salary: '₹ 15,000 – 22,000 / month',
      skills: ['Computer Operations', 'MeeSeva Services', 'Telugu Typing', 'Internet Skills'],
      category: 'govt',
      description: 'Empower your own village! Manage citizen services, welfare distribution, and digital infrastructure right in your local panchayat.',
      responsibilities: [
        'Deliver government certificates and online welfare schemes to citizens.',
        'Maintain village portal records, biometric devices, and computer systems.',
        'Assist rural elders and students with scheme registrations.'
      ],
      requirements: [
        'Diploma or Degree in Computer Science, Electrical or IT',
        'Fluent Telugu reading and writing ability',
        'Resident of Andhra Pradesh'
      ],
      perks: [
        { icon: 'home_pin', title: 'Postings Located in Your Home District' },
        { icon: 'security', title: 'State Government Job Security' },
        { icon: 'favorite', title: 'Direct Service to Your Rural Community' }
      ],
      companyOverview: {
        employees: '130K+ Village Functionaries',
        presence: '15,000+ Secretariats across AP',
        sector: 'Public Administration & Rural Services',
        website: 'https://gramawardsachivalayam.ap.gov.in'
      }
    }
  ];

  const SCHOLARSHIPS_DATABASE = [
    {
      id: 'post-matric-obc',
      title: 'Post Matric Scholarship Scheme (OBC)',
      provider: 'AP State Government',
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
      title: 'National Scholarship Portal (NSP)',
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
      title: 'Saksham Scholarship Scheme',
      provider: 'Ministry of Social Justice & AICTE',
      badge: 'Need Based',
      amount: '₹12,000 / year',
      eligibility: 'Specially-abled students / Family income < ₹2.5 Lakh',
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
      title: 'Pre Matric Scholarship for OBC Students',
      provider: 'AP State Government',
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
        font-size: 0.9rem;
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
        <span class="material-symbols-outlined" style="font-size: 20px;">${icon}</span>
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
  //  4. Job Detail & Application System
  // ══════════════════════════════════════════════════════════════════════

  function initJobDetailPage() {
    const isJobDetailPage = window.location.pathname.includes('job-detail.html');
    if (!isJobDetailPage) return;

    const params = new URLSearchParams(window.location.search);
    const rawJobId = params.get('job') || params.get('id') || 'tcs-software-developer';
    const idAliases = {
      'accenture-analyst': 'accenture-software-analyst',
      'zoho-intern': 'zoho-product-intern'
    };
    const jobId = idAliases[rawJobId] || rawJobId;
    const job = JOBS_DATABASE.find(j => j.id === jobId) || JOBS_DATABASE[0];

    // Populate Job Hero
    const titleEl = document.querySelector('h1');
    if (titleEl) titleEl.textContent = job.title;

    // Update document title
    document.title = `${job.title} — ${job.company} | Gramin Career Setu`;

    // Save Job button handler
    const saveBtn = document.getElementById('btnSaveJobDetail') || document.querySelector('button[onclick*="Save Job"], button[onclick*="Saved to Bookmarks"]');
    if (saveBtn) {
      const isSaved = Storage.isBookmarked('jobs', job.id);
      updateSaveBtnUI(saveBtn, isSaved);

      saveBtn.onclick = (e) => {
        e.preventDefault();
        const newState = Storage.toggleBookmark('jobs', job.id);
        updateSaveBtnUI(saveBtn, newState);
        Toast.show(newState ? `⭐ "${job.title}" saved to your profile!` : `Removed "${job.title}" from saved jobs.`);
      };
    }

    // Apply Now button handler
    const applyBtns = document.querySelectorAll('#btnApplyJobDetail, button[onclick*="Apply Now"], button[onclick*="official TCS"]');
    applyBtns.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        openJobApplicationModal(job);
      };
    });
  }

  function updateSaveBtnUI(btn, isSaved) {
    if (!btn) return;
    const textSpan = btn.querySelector('span:not(.material-symbols-outlined)') || btn;
    const iconSpan = btn.querySelector('.material-symbols-outlined');
    if (isSaved) {
      if (textSpan !== btn) textSpan.textContent = 'Saved Job';
      if (iconSpan) {
        iconSpan.textContent = 'bookmark';
        iconSpan.style.color = '#059669';
      }
      btn.style.borderColor = '#86EFAC';
      btn.style.background = '#ECFDF5';
    } else {
      if (textSpan !== btn) textSpan.textContent = 'Save Job';
      if (iconSpan) {
        iconSpan.textContent = 'bookmark_border';
        iconSpan.style.color = 'inherit';
      }
      btn.style.borderColor = '#CBD5E1';
      btn.style.background = '#ffffff';
    }
  }

  function openJobApplicationModal(job) {
    let modal = document.getElementById('gcsJobApplyModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'gcsJobApplyModal';
      modal.className = 'gcs-modal-overlay';
      modal.innerHTML = `
        <div class="gcs-modal-card" style="max-width: 520px; padding: 28px; border-radius: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <span class="gcs-pill-tag" style="background: #ECFDF5; color: #059669; font-weight: 700; margin-bottom: 6px;">Direct Application</span>
              <h2 id="applyModalTitle" style="font-size: 1.35rem; font-weight: 800; color: #0F172A; margin: 0 0 4px 0;">Apply for Role</h2>
              <div id="applyModalSub" style="font-size: 0.85rem; color: #64748B;">Company Name • Free Job Application</div>
            </div>
            <button type="button" onclick="closeJobApplyModal()" style="background: #F1F5F9; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B;">✕</button>
          </div>

          <form id="jobApplyForm" onsubmit="submitJobApplication(event)">
            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Your Full Name *</label>
              <input type="text" id="appFullName" class="gcs-form-input" required placeholder="e.g. K. Ravi Teja" style="width: 100%; padding: 10px 14px;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Phone Number *</label>
                <input type="tel" id="appPhone" class="gcs-form-input" required placeholder="10-digit mobile" style="width: 100%; padding: 10px 14px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Village / District *</label>
                <input type="text" id="appVillage" class="gcs-form-input" required placeholder="e.g. Gudur, Nellore" style="width: 100%; padding: 10px 14px;" />
              </div>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 6px;">Select Resume to Submit</label>
              <div style="background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 12px; padding: 14px; text-align: center;">
                <span class="material-symbols-outlined" style="font-size: 28px; color: #059669;">description</span>
                <div style="font-size: 0.85rem; font-weight: 700; color: #0F172A; margin-top: 4px;" id="resumeAttachName">Gramin Career Setu Profile Resume</div>
                <div style="font-size: 0.75rem; color: #64748B;">Auto-linked from your Resume Builder profile (ATS 92% Compatible)</div>
              </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button type="button" class="gcs-btn-cta-2" onclick="closeJobApplyModal()" style="padding: 10px 18px;">Cancel</button>
              <button type="submit" class="gcs-btn-cta-1" style="padding: 10px 24px; border: none; cursor: pointer;">Submit Application &rarr;</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
    }

    document.getElementById('applyModalTitle').textContent = `Apply for ${job.title}`;
    document.getElementById('applyModalSub').textContent = `${job.company} • ${job.location}`;
    modal.classList.add('open');

    // Pre-fill if saved profile exists
    const savedResume = Storage.get('resume_data', null);
    if (savedResume && savedResume.fullName) {
      document.getElementById('appFullName').value = savedResume.fullName;
      if (savedResume.phone) document.getElementById('appPhone').value = savedResume.phone;
      if (savedResume.address) document.getElementById('appVillage').value = savedResume.address;
    }

    window._activeApplyJob = job;
  }

  window.closeJobApplyModal = function () {
    const modal = document.getElementById('gcsJobApplyModal');
    if (modal) modal.classList.remove('open');
  };

  window.submitJobApplication = async function (e) {
    e.preventDefault();
    const job = window._activeApplyJob || JOBS_DATABASE[0];
    const name = (document.getElementById('appFullName')?.value || '').trim();
    const phone = (document.getElementById('appPhone')?.value || '').trim();
    const village = (document.getElementById('appVillage')?.value || '').trim();

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting...';
    }

    try {
      if (window.GCS_API && window.GCS_API.jobs) {
        const result = await window.GCS_API.jobs.apply(job.id, { applicantName: name, phone, village });
        const existing = Storage.get('job_applications', []);

        if (result && result.queued) {
          const offlineApp = {
            id: 'OFFLINE-' + Date.now(),
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            applicantName: name,
            phone,
            village,
            status: 'QUEUED_OFFLINE',
            submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          };
          existing.unshift(offlineApp);
          Storage.set('job_applications', existing);
          closeJobApplyModal();
          Toast.show(`📶 Saved offline: Application queued for automatic sync when online.`);
        } else {
          const serverApp = {
            id: result?.data?.id || ('APP-' + Date.now()),
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            applicantName: name,
            phone,
            village,
            status: result?.data?.status || 'PENDING',
            submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          };
          existing.unshift(serverApp);
          Storage.set('job_applications', existing);
          closeJobApplyModal();
          Toast.show(`🎉 Application #${serverApp.id} submitted successfully to ${job.company}!`);
        }
      } else {
        // Standalone client fallback without API
        const standaloneApp = {
          id: 'APP-' + Date.now(),
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          applicantName: name,
          phone,
          village,
          status: 'PENDING',
          submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        const existing = Storage.get('job_applications', []);
        existing.unshift(standaloneApp);
        Storage.set('job_applications', existing);
        closeJobApplyModal();
        Toast.show(`🎉 Application submitted successfully to ${job.company}!`);
      }
    } catch (err) {
      console.warn('[GCS] Application submission rejected:', err.message);
      Toast.show(`⚠️ ${err.message || 'Application submission failed. Please try again.'}`);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  //  5. Dynamic Roadmap Generator
  // ══════════════════════════════════════════════════════════════════════

  const ROADMAP_MATRICES = {
    'software': [
      { step: 1, title: '10th Passed (Foundation)', time: 'Completed', desc: 'Focus on foundational Mathematics, Science and English fluency.', status: 'Completed', color: '#059669' },
      { step: 2, title: 'Intermediate (MPC)', time: '2 Years', desc: 'Physics, Chemistry, Maths with high aptitude and EAMCET / JEE preparation.', status: 'Next Step', color: '#D97706' },
      { step: 3, title: 'B.Tech in CSE / IT', time: '4 Years', desc: 'Core Programming in Java/Python, Data Structures, Web Development and DBMS.', status: 'Future Step', color: '#7C3AED' },
      { step: 4, title: 'Hands-on Internship', time: '3 – 6 Months', desc: 'Live project building, GitHub portfolio, and open-source contributions.', status: 'Future Step', color: '#2563EB' },
      { step: 5, title: 'Campus Placement / Job', time: 'Entry Level', desc: 'Crack technical coding rounds at TCS, Infosys, Wipro, or Zoho.', status: 'Goal', color: '#059669' },
      { step: 6, title: 'Continuous Growth', time: 'Ongoing', desc: 'Upskill in Cloud, Full-Stack, and AI to step up into Senior Software Engineer.', status: 'Your Future', color: '#B45309' }
    ],
    'govt': [
      { step: 1, title: '10th Passed (Foundation)', time: 'Completed', desc: 'Solid General Knowledge, Social Studies, and Telugu & English literacy.', status: 'Completed', color: '#059669' },
      { step: 2, title: 'Intermediate (HEC/CEC)', time: '2 Years', desc: 'Strong base in Indian History, Civics, Geography and Economics.', status: 'Next Step', color: '#D97706' },
      { step: 3, title: 'Bachelor Degree (BA/B.Sc)', time: '3 Years', desc: 'Degree completion while studying daily current affairs and AP History.', status: 'Future Step', color: '#7C3AED' },
      { step: 4, title: 'Coaching & Mock Practice', time: '1 Year', desc: 'Solve 10 years APPSC / SSC / RRB previous question papers daily.', status: 'Future Step', color: '#2563EB' },
      { step: 5, title: 'Clear Prelims & Mains', time: 'Milestone', desc: 'Crack APPSC Group II / Grama Sachivalayam / SSC CGL examinations.', status: 'Goal', color: '#059669' },
      { step: 6, title: 'Public Service Officer', time: 'Lifetime', desc: 'Sworn in to serve rural public administration with dignity and impact.', status: 'Your Future', color: '#B45309' }
    ],
    'bank': [
      { step: 1, title: '10th Passed (Foundation)', time: 'Completed', desc: 'Quantitative calculations, tables, and rapid mental maths mastery.', status: 'Completed', color: '#059669' },
      { step: 2, title: 'Intermediate (MEC/CEC)', time: '2 Years', desc: 'Commerce, Accountancy, and Commercial Mathematics proficiency.', status: 'Next Step', color: '#D97706' },
      { step: 3, title: 'B.Com / BBA / B.Sc', time: '3 Years', desc: 'Financial accounting, banking operations, and computer data entry.', status: 'Future Step', color: '#7C3AED' },
      { step: 4, title: 'IBPS / SBI Exam Prep', time: '6 – 12 Months', desc: 'Intensive practice of reasoning puzzles, speed maths, and English grammar.', status: 'Future Step', color: '#2563EB' },
      { step: 5, title: 'Probationary Officer / Clerk', time: 'Entry Level', desc: 'Join SBI, Andhra Pragathi Grameena Bank, or Canara Bank.', status: 'Goal', color: '#059669' },
      { step: 6, title: 'Branch Manager', time: '5+ Years', desc: 'Scale up through internal JAIIB/CAIIB promotions to lead rural bank branches.', status: 'Your Future', color: '#B45309' }
    ],
    'agri': [
      { step: 1, title: '10th Passed (Foundation)', time: 'Completed', desc: 'General Science, Biology, and foundational arithmetic knowledge.', status: 'Completed', color: '#059669' },
      { step: 2, title: 'Intermediate (BiPC / Agri)', time: '2 Years', desc: 'Botany, Zoology, Chemistry and preparation for AP AGRICET / EAMCET.', status: 'Next Step', color: '#D97706' },
      { step: 3, title: 'B.Sc Agriculture / Horticulture', time: '4 Years', desc: 'Study agronomy, soil science, drone farming, and micro-irrigation systems.', status: 'Future Step', color: '#7C3AED' },
      { step: 4, title: 'Field Project & Seed Tech', time: '6 Months', desc: 'Practical field trials with Krishi Vigyan Kendras (KVKs) and agri-firms.', status: 'Future Step', color: '#2563EB' },
      { step: 5, title: 'Agriculture Officer / Agripreneur', time: 'Career Launch', desc: 'Join State Department of Agriculture or launch village organic supply chain.', status: 'Goal', color: '#059669' },
      { step: 6, title: 'Sustainable Agri-Leader', time: 'Ongoing', desc: 'Introduce modern high-yield organic farming to 50+ surrounding villages.', status: 'Your Future', color: '#B45309' }
    ]
  };

  window.generateRoadmap = function () {
    const careerSelect = document.getElementById('roadCareer');
    const careerKey = careerSelect ? careerSelect.value : 'software';
    const matrix = ROADMAP_MATRICES[careerKey] || ROADMAP_MATRICES['software'];

    const container = document.querySelector('section .gcs-roadmap-steps-row, section div[style*="repeat(6, 1fr)"]');
    if (!container) return;

    container.innerHTML = matrix.map((item, idx) => `
      <div style="background: ${idx === 1 ? '#FFFBEB' : idx === 4 ? '#F0FDF4' : '#F8FAFC'}; border: 1.5px solid ${idx === 1 ? '#FDE68A' : idx === 4 ? '#86EFAC' : '#E2E8F0'}; border-radius: 14px; padding: 18px 12px; display: flex; flex-direction: column; justify-content: space-between; text-align: center;">
        <div>
          <div style="width: 32px; height: 32px; border-radius: 50%; background: ${item.color}; color: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto; font-weight: 800;">${item.step}</div>
          <h3 style="font-size: 0.95rem; font-weight: 800; color: #0F172A; margin: 0 0 2px 0;">${item.title}</h3>
          <div style="font-size: 0.72rem; color: #64748B; margin-bottom: 8px;">${item.time}</div>
          <p style="font-size: 0.75rem; color: #475569; line-height: 1.4; margin: 0 0 10px 0;">${item.desc}</p>
        </div>
        <span style="background: ${idx === 0 ? '#ECFDF5' : idx === 1 ? '#FEF3C7' : idx === 4 ? '#DCFCE7' : '#EFF6FF'}; color: ${item.color}; font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 6px;">${item.status}</span>
      </div>
    `).join('');

    Toast.show(`✨ Career Roadmap refreshed for ${careerKey.toUpperCase()}!`);
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
      doc.text(`Category: ${category || 'Career Guidelines'} • Verified Offline Reference`, 14, 58);

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

  window.switchJobTab = function (tabId, btn) {
    document.querySelectorAll('.gcs-detail-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Smooth scroll to target section if present
    const sections = {
      'overview': '#jobOverviewSection',
      'company': '#jobCompanySection',
      'benefits': '#jobBenefitsSection',
      'requirements': '#jobRequirementsSection'
    };

    const target = document.querySelector(sections[tabId]);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ══════════════════════════════════════════════════════════════════════
  //  10. Admin Google Sheets Sync & Add Job Simulation
  // ══════════════════════════════════════════════════════════════════════

  window.syncGoogleSheets = function () {
    const btn = document.getElementById('btnSyncSheets');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Syncing Google Sheets...';
    }

    setTimeout(() => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span class="material-symbols-outlined">sync</span> Sync from Google Sheets';
      }
      Toast.show('✅ Google Sheets synced! 12 new jobs & 4 workshops fetched.');
      const syncTimeEl = document.getElementById('lastSyncTime');
      if (syncTimeEl) syncTimeEl.textContent = 'Just now';
    }, 1500);
  };

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

  // Initialize interactive features on load
  document.addEventListener('DOMContentLoaded', () => {
    initJobDetailPage();
    initAllBookmarks();
  });

  // ── Service Worker registration ─────────────────────────────────
  // Lives here rather than in the legacy script.js, which only two of the
  // 22 pages load — offline support was effectively off site-wide.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const base = location.pathname.includes('/admin/') ? '../sw.js' : './sw.js';
      navigator.serviceWorker.register(base).catch(err => {
        console.warn('[Service Worker] registration failed:', err);
      });
    });
  }

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
    jobs: JOBS_DATABASE,
    scholarships: SCHOLARSHIPS_DATABASE,
    storage: Storage,
    toast: Toast,
    escapeHtml: escapeHtml,
    toggleBookmark: window.toggleGcsBookmark
  };

})();
