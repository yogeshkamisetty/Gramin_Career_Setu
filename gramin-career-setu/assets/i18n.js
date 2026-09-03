/**
 * Gramin Career Setu — Complete Bilingual Translation Engine (Telugu ↔ English)
 * ─────────────────────────────────────────────────────────────────────────────
 * • Offline dictionary for all 18+ portal pages
 * • Real-time DOM replacement for elements with data-lang-key or common UI phrases
 * • Automatic localStorage persistence ('gcs-lang': 'te' | 'en')
 * • Bilingual Text-to-Speech (TTS) audio accessibility helper
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs-lang';
  const DEFAULT_LANG = 'te'; // Default to Telugu for rural outreach

  // Complete, comprehensive bilingual dictionary
  const dictionary = {
    // Brand & Navigation
    'site-title': { te: 'గ్రామీణ కెరీర్ సేతు', en: 'Gramin Career Setu' },
    'site-subtitle': { te: 'CareerBridge ఇనిషియేటివ్', en: 'CareerBridge Initiative' },
    'skip-to-content': { te: 'ప్రధాన విషయానికి వెళ్ళండి', en: 'Skip to main content' },
    'nav-home': { te: 'హోమ్', en: 'Home' },
    'nav-careers': { te: 'కెరీర్స్', en: 'Careers' },
    'nav-jobs': { te: 'ఉద్యోగాలు', en: 'Jobs' },
    'nav-quiz': { te: 'క్విజ్', en: 'Quiz' },
    'nav-resume': { te: 'రెజ్యూమ్', en: 'Resume' },
    'nav-workshops': { te: 'వర్క్‌షాప్‌లు', en: 'Workshops' },
    'nav-resources': { te: 'వనరులు', en: 'Resources' },
    'nav-more': { te: 'మరిన్ని', en: 'More' },
    'nav-profile': { te: 'నా ప్రొఫైల్', en: 'My Profile' },
    'nav-impact': { te: 'ఇంపాక్ట్ డాష్‌బోర్డ్', en: 'Impact Dashboard' },
    'nav-admin': { te: 'వాలంటీర్ అడ్మిన్', en: 'Volunteer Admin' },
    'nav-scholarships': { te: 'స్కాలర్‌షిప్‌లు', en: 'Scholarships' },
    'nav-schemes': { te: 'ప్రభుత్వ పథకాలు', en: 'Govt Schemes' },
    'nav-roadmap': { te: 'కెరీర్ రోడ్‌మ్యాప్', en: 'Career Roadmap' },
    'nav-stories': { te: 'విజయ గాథలు', en: 'Success Stories' },
    'nav-about': { te: 'ప్రాజెక్ట్ గురించి', en: 'About Project' },

    // Footer
    'footer-desc': {
      te: 'గ్రామీణ యువతకు కెరీర్ మార్గదర్శకత్వం, నైపుణ్యాలు మరియు అవకాశాలను అందించే వేదిక.',
      en: 'Empowering rural youth with career guidance, practical skills and verified opportunities.'
    },
    'footer-important': { te: 'ముఖ్యమైన లింకులు', en: 'Important Links' },
    'footer-quick': { te: 'త్వరిత లింకులు', en: 'Quick Links' },
    'footer-support': { te: 'సహాయం & మద్దతు', en: 'Support & Help' },
    'footer-lang': { te: 'భాష', en: 'Language' },

    // Common Buttons & Actions
    'btn-apply': { te: 'దరఖాస్తు చేసుకోండి', en: 'Apply Now' },
    'btn-save': { te: 'సేవ్ చేయండి', en: 'Save Job' },
    'btn-download': { te: 'డౌన్‌లోడ్', en: 'Download' },
    'btn-view-details': { te: 'వివరాలు చూడండి', en: 'View Details' },
    'btn-register': { te: 'నమోదు చేసుకోండి', en: 'Register Now' },
    'btn-search': { te: 'వెతకండి', en: 'Search' },
    'btn-clear': { te: 'ఫిల్టర్లు క్లియర్ చేయండి', en: 'Clear Filters' },
    'btn-back': { te: 'వెనక్కి వెళ్ళండి', en: 'Go Back' },
    'btn-back-jobs': { te: '← ఉద్యోగాల జాబితాకు', en: '← Back to Jobs' },
    'btn-generate-roadmap': { te: 'రోడ్‌మ్యాప్ రూపొందించండి', en: 'Generate Roadmap' },
    'btn-download-pdf': { te: 'PDF డౌన్‌లోడ్ చేయండి', en: 'Download PDF' },
    'btn-share': { te: 'షేర్ చేయండి', en: 'Share' },

    // Home Page Hero & Stats
    'hero-headline': {
      te: 'మీ భవిష్యత్తుకు కెరీర్ వారధి 🌿',
      en: 'Your Bridge to a Bright Career 🌿'
    },
    'hero-tagline': {
      te: 'గ్రామీణ విద్యార్థుల కోసం సరైన కెరీర్ మార్గదర్శకత్వం, ఉద్యోగ సమాచారం మరియు నైపుణ్యాల వేదిక.',
      en: 'Tailored career guidance, job vacancies, and free skill workshops for rural youth.'
    },
    'hero-btn-quiz': { te: 'స్కిల్ అసెస్‌మెంట్ క్విజ్ రాయండి', en: 'Take Skill Assessment Quiz' },
    'hero-btn-explore': { te: 'కెరీర్ మార్గాలు అన్వేషించండి', en: 'Explore Career Pathways' },
    'hero-stat-students': { te: '5,000+ గ్రామీణ విద్యార్థులు', en: '5,000+ Rural Students' },
    'hero-stat-jobs': { te: '120+ ఉద్యోగ అవకాశాలు', en: '120+ Verified Jobs' },
    'hero-stat-villages': { te: '35+ గ్రామాలలో వర్క్‌షాప్‌లు', en: '35+ Villages Reached' },
    'hero-stat-offline': { te: '100% ఆఫ్‌లైన్ PWA మద్దతు', en: '100% Offline PWA Ready' },

    // 4A Framework
    'framework-title': { te: 'మా 4A ఫ్రేమ్‌వర్క్', en: 'Our 4A Framework' },
    'framework-desc': {
      te: 'గ్రామీణ యువతకు స్థిరమైన ఉపాధి కల్పించే మా ప్రత్యేక కార్యాచరణ పద్ధతి.',
      en: 'Our proven methodology to transition rural students into sustainable careers.'
    },
    'pillar-1-title': { te: 'అవగాహన (Awareness)', en: '1. Awareness' },
    'pillar-1-desc': {
      te: 'గ్రామ పంచాయతీలు, కాలేజీలలో 100+ ఉద్యోగ మార్గాలు, ప్రభుత్వ పథకాలపై సమాచారం అందించడం.',
      en: 'Demystifying 100+ career streams, government schemes, and exams at village panchayat level.'
    },
    'pillar-2-title': { te: 'యాక్సెస్ (Access)', en: '2. Access' },
    'pillar-2-desc': {
      te: 'ఇంటర్నెట్ లేకపోయినా పనిచేసే ఆఫ్‌లైన్ టెక్నాలజీ మరియు సులభమైన తెలుగు భాషలో వనరులు.',
      en: 'Zero-barrier access with offline PWA technology and native Telugu language guides.'
    },
    'pillar-3-title': { te: 'కార్యాచరణ (Action)', en: '3. Action' },
    'pillar-3-desc': {
      te: 'ఉచిత రెజ్యూమ్ తయారీ, దరఖాస్తు ఫారమ్ సహాయం మరియు మాక్ ఇంటర్వ్యూలు.',
      en: 'Form-filling assistance, free ATS resume builder, and practical interview preparation.'
    },
    'pillar-4-title': { te: 'జవాబుదారీతనం (Accountability)', en: '4. Accountability' },
    'pillar-4-desc': {
      te: 'గ్రామ వాలంటీర్ల నిరంతర పర్యవేక్షణ, మెంటార్‌షిప్ మరియు ఉపాధి సాధన ట్రాకింగ్.',
      en: 'Village coordinators providing peer mentorship and tracking career placements.'
    },

    // Job Page & Filters
    'jobs-search-placeholder': {
      te: 'ఉద్యోగం, నైపుణ్యం లేదా కంపెనీ పేరుతో వెతకండి...',
      en: 'Search jobs by title, skills or company...'
    },
    'jobs-filter-all': { te: 'అన్ని ఉద్యోగాలు', en: 'All Jobs' },
    'jobs-filter-fulltime': { te: 'ఫుల్ టైమ్', en: 'Full Time' },
    'jobs-filter-internship': { te: 'ఇంటర్న్‌షిప్', en: 'Internship' },
    'jobs-filter-wfh': { te: 'వర్క్ ఫ్రమ్ హోమ్', en: 'Work From Home' },
    'jobs-filter-parttime': { te: 'పార్ట్ టైమ్', en: 'Part Time' },
    'jobs-alert-title': { te: 'ఉద్యోగ సమాచారం నోటిఫికేషన్లు పొందండి', en: 'Get instant job alerts' },
    'jobs-alert-desc': {
      te: 'మీ విద్యార్హతలకు సరిపోయే కొత్త ఉద్యోగాలు రాగానే మెసేజ్ పొందండి.',
      en: 'Be the first to know about new job openings that match your skills.'
    },

    // Resume Builder
    'resume-wizard-title': { te: 'ప్రొఫెషనల్ రెజ్యూమ్ బిల్డర్', en: 'Professional Resume Builder' },
    'resume-step-1': { te: 'వ్యక్తిగత వివరాలు', en: 'Personal Details' },
    'resume-step-2': { te: 'విద్యార్హతలు', en: 'Education' },
    'resume-step-3': { te: 'నైపుణ్యాలు', en: 'Skills' },
    'resume-step-4': { te: 'ప్రాజెక్టులు', en: 'Projects' },
    'resume-step-5': { te: 'అనుభవం', en: 'Experience' },
    'resume-step-6': { te: 'సర్టిఫికేట్లు', en: 'Certifications' },
    'resume-step-7': { te: 'ప్రివ్యూ & డౌన్‌లోడ్', en: 'Preview & Download' },
    'resume-score-title': { te: 'రెజ్యూమ్ స్కోరు', en: 'Resume Score' },
    'resume-ats-title': { te: 'ATS అనుకూలత', en: 'ATS Compatibility' },

    // Workshops
    'workshops-title': { te: 'ఉచిత వర్క్‌షాప్‌లు & వెబ్‌నార్లు', en: 'Workshops & Events' },
    'workshops-tab-all': { te: 'అన్ని వర్క్‌షాప్‌లు', en: 'All Workshops' },
    'workshops-tab-upcoming': { te: 'రాబోయేవి', en: 'Upcoming' },
    'workshops-tab-live': { te: 'లైవ్ నౌ', en: 'Live Now' },
    'workshops-tab-recorded': { te: 'రికార్డెడ్ సెషన్లు', en: 'Recorded' },
    'workshops-tab-my': { te: 'నా రిజిస్ట్రేషన్లు', en: 'My Registrations' },

    // Resource Kit
    'resources-title': { te: 'కెరీర్ రిసోర్స్ కిట్', en: 'Resource Kit' },
    'resources-desc': {
      te: 'మీ కెరీర్ ప్రయాణానికి ఉపయోగపడే స్టడీ మెటీరియల్, ప్రభుత్వ పథకాలు, స్కాలర్‌షిప్ గైడ్‌లను డౌన్‌లోడ్ చేసుకోండి.',
      en: 'Download useful study materials, scheme brochures, and competitive exam roadmaps.'
    },

    // Scholarships
    'scholarships-title': { te: 'స్కాలర్‌షిప్ ఫైండర్', en: 'Scholarship Finder' },
    'scholarships-desc': {
      te: 'మీ విద్యార్హత మరియు వర్గానికి తగిన స్కాలర్‌షిప్పులను సులభంగా కనుగొనండి.',
      en: 'Find and apply for the best scholarships matching your qualification and category.'
    },

    // Schemes
    'schemes-title': { te: 'ప్రభుత్వ పథకాల సమాచారం', en: 'Government Scheme Explorer' },
    'schemes-desc': {
      te: 'కేంద్ర, రాష్ట్ర ప్రభుత్వాలు యువతకు అందించే నైపుణ్య, రుణ మరియు స్వయం ఉపాధి పథకాలు.',
      en: 'Discover central and state government schemes for skill development, loans, and self-employment.'
    },

    // Roadmap
    'roadmap-title': { te: 'కెరీర్ రోడ్‌మ్యాప్ జనరేటర్', en: 'Career Roadmap Generator' },
    'roadmap-desc': {
      te: 'మీ ప్రస్తుత విద్యార్హతను ఎంచుకోండి — దశలవారీగా మీ లక్ష్యాన్ని ఎలా చేరుకోవాలో చూడండి.',
      en: 'Plan your future step by step. Select your current education and see the optimal pathway.'
    },

    // Impact Dashboard
    'impact-title': { te: 'ప్రభావ విశ్లేషణ డాష్‌బోర్డ్', en: 'Impact Dashboard' },
    'impact-desc': {
      te: 'మన గ్రామాల్లో సర్వే చేసిన కుటుంబాలు, నిర్వహించిన వర్క్‌షాప్‌లు మరియు సాధించిన విజయాలు.',
      en: 'Tracking our field impact: households surveyed, workshop attendance, and career outcomes.'
    },

    // Success Stories
    'stories-title': { te: 'మా గ్రామాల విజయ గాథలు', en: 'Success Stories' },
    'stories-desc': {
      te: 'గ్రామీణ సేతు మార్గదర్శకత్వంతో ఉద్యోగాలు సాధించి నిలబడిన నిజమైన యువతీ యువకుల కథలు.',
      en: 'Real stories from our villages: real people, real transformations, and inspiring achievements.'
    },

    // About Project
    'about-title': { te: 'గ్రామీణ కెరీర్ సేతు గురించి', en: 'About Gramin Career Setu' },
    'about-mission-title': { te: 'మా లక్ష్యం (Our Mission)', en: 'Our Mission' },
    'about-vision-title': { te: 'మా దృష్టి (Our Vision)', en: 'Our Vision' },
    'about-values-title': { te: 'మా విలువలు (Our Values)', en: 'Our Values' },
    'about-why-title': { te: 'ఇది ఎందుకు ముఖ్యం?', en: 'Why It Matters' }
  };

  // Plain-text fallback phrase maps for universal translation
  const phrasePairs = [
    ['Home', 'హోమ్'],
    ['Careers', 'కెరీర్స్'],
    ['Jobs', 'ఉద్యోగాలు'],
    ['Quiz', 'క్విజ్'],
    ['Resume', 'రెజ్యూమ్'],
    ['Workshops', 'వర్క్‌షాప్‌లు'],
    ['Resources', 'వనరులు'],
    ['More', 'మరిన్ని'],
    ['My Profile', 'నా ప్రొఫైల్'],
    ['Impact Dashboard', 'ఇంపాక్ట్ డాష్‌బోర్డ్'],
    ['Volunteer Admin', 'వాలంటీర్ అడ్మిన్'],
    ['Scholarship Finder', 'స్కాలర్‌షిప్ ఫైండర్'],
    ['Govt Schemes', 'ప్రభుత్వ పథకాలు'],
    ['Career Roadmap', 'కెరీర్ రోడ్‌మ్యాప్'],
    ['Success Stories', 'విజయ గాథలు'],
    ['About Project', 'ప్రాజెక్ట్ గురించి'],
    ['Back to Jobs', 'ఉద్యోగాల జాబితాకు'],
    ['Save Job', 'సేవ్ చేయండి'],
    ['Apply Now', 'దరఖాస్తు చేసుకోండి'],
    ['Download PDF', 'PDF డౌన్‌లోడ్'],
    ['View Details', 'వివరాలు చూడండి'],
    ['Register Now', 'నమోదు చేసుకోండి'],
    ['Search Scholarships', 'స్కాలర్‌షిప్‌లు వెతకండి'],
    ['Clear Filters', 'ఫిల్టర్లు క్లియర్'],
    ['Generate Roadmap', 'రోడ్‌మ్యాప్ చూపించు'],
    ['Share', 'షేర్ చేయండి'],
    ['Full Time', 'ఫుల్ టైమ్'],
    ['On-site', 'ఆన్-సైట్'],
    ['Work From Home', 'వర్క్ ఫ్రమ్ హోమ్'],
    ['Internship', 'ఇంటర్న్‌షిప్'],
    ['Works Offline', 'ఆఫ్‌లైన్‌లో పనిచేస్తుంది'],
    ['All Rights Reserved', 'సర్వహక్కులు ప్రత్యేకించబడ్డాయి'],
    ['Need Help to Apply?', 'దరఖాస్తు చేయడానికి సహాయం కావాలా?'],
    ['Help Center', 'సహాయ కేంద్రం'],
    ['Contact Us', 'మమ్మల్ని సంప్రదించండి'],
    ['Privacy Policy', 'గోప్యతా విధానం'],
    ['Terms & Conditions', 'నిబంధనలు'],
    ['Offline Help', 'ఆఫ్‌లైన్ సహాయం']
  ];

  /**
   * Get currently active language ('te' or 'en')
   */
  function getCurrentLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'te' || saved === 'en') return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  /**
   * Apply language to the page
   */
  function setLanguage(lang) {
    if (lang !== 'te' && lang !== 'en') lang = DEFAULT_LANG;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    document.documentElement.lang = lang;

    // 1. Update elements with [data-lang-key]
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      if (dictionary[key] && dictionary[key][lang]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = dictionary[key][lang];
        } else {
          el.textContent = dictionary[key][lang];
        }
      }
    });

    // 2. Update elements with [data-lang-placeholder]
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
      const key = el.getAttribute('data-lang-placeholder');
      if (dictionary[key] && dictionary[key][lang]) {
        el.placeholder = dictionary[key][lang];
      }
    });

    // 3. Update active state of language pills across the header and footer
    document.querySelectorAll('#gcsPillTe, .pill-te').forEach(btn => {
      btn.classList.toggle('active', lang === 'te');
      btn.style.fontWeight = lang === 'te' ? '700' : '500';
    });
    document.querySelectorAll('#gcsPillEn, .pill-en').forEach(btn => {
      btn.classList.toggle('active', lang === 'en');
      btn.style.fontWeight = lang === 'en' ? '700' : '500';
    });

    // 4. Translate common buttons, headings and navigation links dynamically
    translateCommonPhrases(lang);

    // 5. Fire custom event for dynamic modules (jobs, roadmap, resume, quiz)
    window.dispatchEvent(new CustomEvent('gcs-language-changed', { detail: { lang } }));
  }

  /**
   * Scan text nodes for common bilingual phrases
   */
  function translateCommonPhrases(lang) {
    const isTe = lang === 'te';

    // Update Navigation links text
    const navMappings = [
      ['a[href*="index.html"]', isTe ? 'హోమ్' : 'Home'],
      ['a[href*="careers.html"]', isTe ? 'కెరీర్స్' : 'Careers'],
      ['a[href*="jobs.html"]', isTe ? 'ఉద్యోగాలు' : 'Jobs'],
      ['a[href*="quiz.html"]', isTe ? 'క్విజ్' : 'Quiz'],
      ['a[href*="resume.html"]', isTe ? 'రెజ్యూమ్' : 'Resume'],
      ['a[href*="workshops.html"]', isTe ? 'వర్క్‌షాప్‌లు' : 'Workshops'],
      ['a[href*="resources.html"]', isTe ? 'వనరులు' : 'Resources'],
      ['a[href*="scholarships.html"]', isTe ? 'స్కాలర్‌షిప్‌లు' : 'Scholarships'],
      ['a[href*="schemes.html"]', isTe ? 'పథకాలు' : 'Govt Schemes'],
      ['a[href*="roadmap.html"]', isTe ? 'రోడ్‌మ్యాప్' : 'Roadmap'],
      ['a[href*="stories.html"]', isTe ? 'విజయ గాథలు' : 'Stories'],
      ['a[href*="about.html"]', isTe ? 'గురించి' : 'About']
    ];

    navMappings.forEach(([selector, translatedText]) => {
      document.querySelectorAll(`.gcs-nav-link${selector}, .gcs-mobile-nav-item${selector}`).forEach(el => {
        // preserve icons inside if any
        const icon = el.querySelector('.material-symbols-outlined');
        if (icon) {
          const span = el.querySelector('span:not(.material-symbols-outlined)') || el;
          if (span !== el) span.textContent = translatedText;
        } else if (!el.hasAttribute('data-lang-key')) {
          el.textContent = translatedText;
        }
      });
    });

    // Update search placeholders if unkeyed
    const searchInputs = document.querySelectorAll('input[type="text"][placeholder*="Search"], input[type="text"][placeholder*="వెతకండి"]');
    searchInputs.forEach(input => {
      if (input.id === 'jobSearchInput') {
        input.placeholder = isTe ? 'ఉద్యోగం, కంపెనీ లేదా నైపుణ్యంతో వెతకండి...' : 'Search jobs by title, company or skills...';
      } else if (input.id === 'resourceSearchInput') {
        input.placeholder = isTe ? 'స్టడీ మెటీరియల్ లేదా పరీక్ష గైడ్ల కోసం వెతకండి...' : 'Search resources by topic, scheme or exam...';
      }
    });
  }

  /**
   * Text-to-Speech (TTS) Voice Narration Engine
   * Speaks in Telugu or Indian English based on current setting
   */
  function speakText(text, explicitLang) {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported by this browser.');
      return;
    }

    window.speechSynthesis.cancel(); // stop previous speech

    const lang = explicitLang || getCurrentLanguage();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    let voice = null;

    if (lang === 'te') {
      voice = voices.find(v => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu'));
      utterance.lang = 'te-IN';
      utterance.rate = 0.9; // clear, steady pace for rural learners
    } else {
      voice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.lang.startsWith('en'));
      utterance.lang = 'en-IN';
      utterance.rate = 1.0;
    }

    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  }

  // Global APIs
  window.GCS_I18N = {
    setLanguage,
    getCurrentLanguage,
    speakText,
    dictionary
  };

  // Expose legacy alias for backward compatibility
  window.switchGcsLanguage = setLanguage;
  window.I18n = {
    applyLanguage: setLanguage,
    getSavedLang: getCurrentLanguage,
    t: (key) => {
      const l = getCurrentLanguage();
      return (dictionary[key] && dictionary[key][l]) || key;
    }
  };

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    const initialLang = getCurrentLanguage();
    setLanguage(initialLang);

    // Ensure voices are loaded for TTS
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }
  });

})();
