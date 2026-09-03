/**
 * Gramin Career Setu — Complete Bilingual Translation Engine (Telugu ↔ English)
 * ─────────────────────────────────────────────────────────────────────────────
 * • Embedded offline dictionary with all 160+ keys
 * • Instant real-time DOM translation without network dependencies
 * • Automatic localStorage persistence ('gcs-lang': 'te' | 'en')
 * • Bilingual Text-to-Speech (TTS) voice narration
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gcs-lang';
  const DEFAULT_LANG = 'te';

  const dictionary = {
  "site-title": {
    "te": "గ్రామీణ కెరీర్ సేతు",
    "en": "Gramin Career Setu"
  },
  "site-subtitle": {
    "te": "CareerBridge Initiative",
    "en": "CareerBridge Initiative"
  },
  "lang-toggle": {
    "te": "EN",
    "en": "తెలుగు"
  },
  "skip-to-content": {
    "te": "ప్రధాన విషయానికి వెళ్ళండి",
    "en": "Skip to main content"
  },
  "nav-home": {
    "te": "హోమ్",
    "en": "Home"
  },
  "nav-careers": {
    "te": "కెరీర్స్",
    "en": "Careers"
  },
  "nav-jobs": {
    "te": "ఉద్యోగాలు",
    "en": "Jobs"
  },
  "nav-quiz": {
    "te": "క్విజ్",
    "en": "Quiz"
  },
  "nav-resume": {
    "te": "రెజ్యూమ్",
    "en": "Resume"
  },
  "nav-workshops": {
    "te": "వర్క్‌షాప్‌లు",
    "en": "Workshops"
  },
  "nav-resources": {
    "te": "రిసోర్సెస్",
    "en": "Resources"
  },
  "nav-more": {
    "te": "మరిన్ని",
    "en": "More"
  },
  "nav-profile": {
    "te": "నా ప్రొఫైల్",
    "en": "My Profile"
  },
  "nav-impact": {
    "te": "వర్క్‌షాప్ ఇంపాక్ట్",
    "en": "Impact Dashboard"
  },
  "nav-admin": {
    "te": "అడ్మిన్ డాష్‌బోర్డ్",
    "en": "Volunteer Admin"
  },
  "hero-badge": {
    "te": "యాప్ ఇన్‌స్టాల్ · ఆఫ్‌లైన్‌లో పనిచేస్తుంది",
    "en": "Install App · Works Offline"
  },
  "hero-title-prefix": {
    "te": "మీ భవిష్యత్తుకు",
    "en": "A Bridge To"
  },
  "hero-title-highlight": {
    "te": "కెరీర్ వారధి 🌿",
    "en": "Your Career 🌿"
  },
  "hero-sub-en": {
    "te": "Career guidance, jobs, skill development and opportunities for rural youth.",
    "en": "Career guidance, jobs, skill development and opportunities for rural youth."
  },
  "hero-sub-te": {
    "te": "మీ కెరీర్‌కు మార్గదర్శనం, ఉద్యోగాలు, నైపుణ్య అభివృద్ధి మరియు అవకాశాలు.",
    "en": "మీ కెరీర్‌కు మార్గదర్శనం, ఉద్యోగాలు, నైపుణ్య అభివృద్ధి మరియు అవకాశాలు."
  },
  "cta-career": {
    "te": "కెరీర్ మార్గం ఎంచుకోండి",
    "en": "Find Career Path"
  },
  "cta-jobs": {
    "te": "ఉద్యోగాలు చూడండి",
    "en": "Explore Jobs"
  },
  "cta-resume": {
    "te": "రెజ్యూమ్ చేయండి",
    "en": "Build Resume"
  },
  "metric-paths": {
    "te": "కెరీర్ మార్గాలు",
    "en": "Career Paths"
  },
  "metric-jobs": {
    "te": "ఉద్యోగ వనరులు",
    "en": "Job Resources"
  },
  "metric-telugu": {
    "te": "తెలుగు మద్దతు",
    "en": "Telugu Support"
  },
  "metric-offline-val": {
    "te": "ఆఫ్‌లైన్",
    "en": "Offline"
  },
  "metric-access": {
    "te": "యాక్సెస్",
    "en": "Access"
  },
  "framework-heading": {
    "te": "మా 4A ఫ్రేమ్‌వర్క్",
    "en": "Our 4A Framework"
  },
  "framework-sub": {
    "te": "గ్రామీణ విద్యార్థుల నైపుణ్యాలను స్థిరమైన ఉపాధిగా మార్చే నిరూపిత విధానం.",
    "en": "A proven model to transform rural careers from awareness to sustainable livelihood."
  },
  "4a-awareness-title": {
    "te": "అవగాహన (Awareness)",
    "en": "Awareness"
  },
  "4a-awareness-desc": {
    "te": "గ్రామాల్లోని యువతకు ఎలాంటి ఉద్యోగాలు, కెరీర్ మార్గాలు ఉన్నాయో తెలియజేయడం.",
    "en": "Help villagers know what jobs and career paths exist."
  },
  "4a-access-title": {
    "te": "యాక్సెస్ (Access)",
    "en": "Access"
  },
  "4a-access-desc": {
    "te": "ఇంటర్నెట్ లేదా పరికర పరిమితులతో సంబంధం లేకుండా సమాచారాన్ని సులభంగా అందించడం.",
    "en": "Make information reachable regardless of internet, device or literacy."
  },
  "4a-action-title": {
    "te": "కార్యాచరణ (Action)",
    "en": "Action"
  },
  "4a-action-desc": {
    "te": "కేవలం సమాచారంతో ఆగకుండా, దరఖాస్తు వరకు ప్రతి అడుగు పూర్తి చేయించడం.",
    "en": "Turn awareness into a completed step, not just information."
  },
  "4a-account-title": {
    "te": "జవాబుదారీతనం (Accountability)",
    "en": "Accountability"
  },
  "4a-account-desc": {
    "te": "వర్క్‌షాప్ ముగిసిన తర్వాత కూడా ఫలితాలు కొనసాగేలా మద్దతు నిలపడం.",
    "en": "Ensure long-term support and outcome tracking beyond the workshop."
  },
  "learn-more": {
    "te": "మరిన్ని వివరాలు",
    "en": "Learn More"
  },
  "categories-heading": {
    "te": "కెరీర్ కేటగిరీలు",
    "en": "Career Categories"
  },
  "categories-sub": {
    "te": "మీకు నచ్చిన రంగాన్ని ఎంచుకుని ఉద్యోగ వివరాలు మరియు రోడ్‌మ్యాప్‌లను చూడండి.",
    "en": "Choose a domain to view curated paths, exams, and verified jobs."
  },
  "view-all": {
    "te": "అన్నీ చూడండి",
    "en": "View All"
  },
  "cat-govt": {
    "te": "ప్రభుత్వ ఉద్యోగాలు",
    "en": "Government Jobs"
  },
  "cat-private": {
    "te": "ప్రైవేట్ ఉద్యోగాలు",
    "en": "Private Jobs"
  },
  "cat-it": {
    "te": "IT కెరీర్స్",
    "en": "IT Careers"
  },
  "cat-poly": {
    "te": "పాలిటెక్నిక్",
    "en": "Polytechnic"
  },
  "cat-iti": {
    "te": "ITI నైపుణ్యాలు",
    "en": "ITI"
  },
  "cat-self": {
    "te": "స్వయం ఉపాధి",
    "en": "Self Employment"
  },
  "cat-agri": {
    "te": "వ్యవసాయ టెక్నాలజీ",
    "en": "Agriculture Technology"
  },
  "cat-exam": {
    "te": "పోటీ పరీక్షలు",
    "en": "Competitive Exams"
  },
  "stories-heading": {
    "te": "విజయ గాథలు",
    "en": "Success Stories"
  },
  "stories-sub": {
    "te": "గ్రామీణ సేతు మార్గదర్శకత్వంతో విజయవంతమైన యువత కథలు.",
    "en": "Real youth from rural Andhra Pradesh & Telangana building their dreams."
  },
  "story-ramesh-name": {
    "te": "రమేష్",
    "en": "Ramesh"
  },
  "story-ramesh-district": {
    "te": "పల్నాడు జిల్లా",
    "en": "Palnadu District"
  },
  "story-ramesh-role": {
    "te": "జూనియర్ ఇంజనీర్ (AP గవర్నమెంట్)",
    "en": "Junior Engineer (AP Government)"
  },
  "story-ramesh-quote": {
    "te": "వర్క్‌షాప్ నా జీవితాన్ని మార్చింది. ఇప్పుడు నాకు ప్రభుత్వ ఉద్యోగం వచ్చింది.",
    "en": "The workshop changed my life. Now I have a government job."
  },
  "story-lalitha-name": {
    "te": "లలిత",
    "en": "Lalitha"
  },
  "story-lalitha-district": {
    "te": "శ్రీకాకుళం జిల్లా",
    "en": "Srikakulam District"
  },
  "story-lalitha-role": {
    "te": "స్టాఫ్ నర్స్ (ప్రభుత్వ ఆసుపత్రి)",
    "en": "Staff Nurse (Government Hospital)"
  },
  "story-lalitha-quote": {
    "te": "నైపుణ్య శిక్షణ మరియు సరైన మార్గదర్శకత్వం నన్ను నర్స్‌గా మార్చాయి.",
    "en": "Skill training and guidance helped me become a nurse."
  },
  "story-suresh-name": {
    "te": "సురేష్",
    "en": "Suresh"
  },
  "story-suresh-district": {
    "te": "అనంతపురం జిల్లా",
    "en": "Anantapur District"
  },
  "story-suresh-role": {
    "te": "ఎంట్రప్రెన్యూర్ (అగ్రి స్టార్టప్)",
    "en": "Entrepreneur (Agri Startup)"
  },
  "story-suresh-quote": {
    "te": "ముద్రా లోన్ మద్దతుతో నేను నా స్వంత వ్యవసాయ వ్యాపారాన్ని ప్రారంభించాను.",
    "en": "I started my own business with Mudra Loan support."
  },
  "workshops-heading": {
    "te": "రాబోయే వర్క్‌షాప్‌లు",
    "en": "Upcoming Workshops"
  },
  "workshops-sub": {
    "te": "గ్రామాల్లో ఉచిత కెరీర్ కౌన్సెలింగ్, ఫారమ్ ఫిల్లింగ్ మరియు మాక్ పరీక్షలు.",
    "en": "Free village sessions with career counseling, form-filling & mock tests."
  },
  "register-now": {
    "te": "నమోదు చేసుకోండి",
    "en": "Register Now"
  },
  "ws1-title": {
    "te": "ప్రభుత్వ ఉద్యోగాల వర్క్‌షాప్",
    "en": "Government Jobs Workshop"
  },
  "ws2-title": {
    "te": "ప్రైవేట్ & BPO ఉద్యోగాల వర్క్‌షాప్",
    "en": "Private & BPO Jobs Workshop"
  },
  "ws3-title": {
    "te": "స్వయం ఉపాధి వర్క్‌షాప్",
    "en": "Self Employment Workshop"
  },
  "resource-kit-title": {
    "te": "రిసోర్స్ కిట్ డౌన్‌లోడ్ చేసుకోండి",
    "en": "Download Resource Kit"
  },
  "resource-kit-sub": {
    "te": "అన్ని కెరీర్ గైడ్లు, పరీక్ష క్యాలెండర్లు, స్కాలర్‌షిప్ వివరాలు ఒకే PDF లో పొందండి.",
    "en": "Get all career guides, exam calendars, scholarship lists and workshop materials in one PDF."
  },
  "download-now": {
    "te": "ఇప్పుడే డౌన్‌లోడ్ చేయండి",
    "en": "Download Now"
  },
  "footer-desc": {
    "te": "గ్రామీణ యువతకు కెరీర్ మార్గదర్శకత్వం, నైపుణ్యాలు మరియు అవకాశాలను అందించడం.",
    "en": "Empowering rural youth with career guidance, skills and opportunities."
  },
  "footer-important": {
    "te": "ముఖ్యమైన లింకులు",
    "en": "Important Links"
  },
  "footer-quick": {
    "te": "త్వరిత లింకులు",
    "en": "Quick Links"
  },
  "footer-support": {
    "te": "సహాయం & మద్దతు",
    "en": "Support"
  },
  "footer-lang": {
    "te": "భాష",
    "en": "Language"
  },
  "footer-text": {
    "te": "❤ CSP ప్రాజెక్ట్ — గ్రామీణ యువత కోసం రూపొందించబడింది",
    "en": "❤ CSP Project — Built for rural youth"
  },
  "jobs-page-title": {
    "te": "ఉద్యోగ సమాచారం",
    "en": "Job Information"
  },
  "jobs-page-subtitle": {
    "te": "అందుబాటులో ఉన్న అవకాశాలు",
    "en": "Available opportunities"
  },
  "jobs-search-placeholder": {
    "te": "ఉద్యోగం కోసం వెతకండి…",
    "en": "Search for a job…"
  },
  "filter-all": {
    "te": "అన్నీ",
    "en": "All"
  },
  "filter-government": {
    "te": "ప్రభుత్వం",
    "en": "Government"
  },
  "filter-iti": {
    "te": "ITI",
    "en": "ITI"
  },
  "filter-bpo": {
    "te": "BPO",
    "en": "BPO"
  },
  "filter-business": {
    "te": "వ్యాపారం",
    "en": "Business"
  },
  "job-qualification": {
    "te": "అర్హత",
    "en": "Qualification"
  },
  "job-exam": {
    "te": "పరీక్ష",
    "en": "Exam"
  },
  "job-salary": {
    "te": "జీతం",
    "en": "Salary"
  },
  "job-prep-time": {
    "te": "ప్రిపరేషన్ సమయం",
    "en": "Prep Time"
  },
  "job-resource": {
    "te": "ఉచిత రిసోర్స్",
    "en": "Free Resource"
  },
  "job-apply": {
    "te": "దరఖాస్తు చేయండి",
    "en": "Apply Here"
  },
  "jobs-loading": {
    "te": "ఉద్యోగాలు లోడ్ అవుతున్నాయి…",
    "en": "Loading jobs…"
  },
  "jobs-empty-title": {
    "te": "ఫలితాలు లేవు",
    "en": "No results"
  },
  "jobs-empty-desc": {
    "te": "ఈ ఫిల్టర్‌కు సరిపోయే ఉద్యోగాలు లేవు. వేరే ఫిల్టర్ ప్రయత్నించండి.",
    "en": "No jobs match this filter. Try a different filter or search term."
  },
  "jobs-error-title": {
    "te": "లోడ్ చేయడంలో సమస్య",
    "en": "Failed to load"
  },
  "jobs-error-desc": {
    "te": "డేటా లోడ్ చేయడంలో సమస్య ఏర్పడింది. దయచేసి మీ ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.",
    "en": "Could not load job data. Please check your internet connection and try again."
  },
  "jobs-retry": {
    "te": "మళ్ళీ ప్రయత్నించండి",
    "en": "Try Again"
  },
  "jobs-results-count": {
    "te": "ఉద్యోగాలు కనుగొనబడ్డాయి",
    "en": "jobs found"
  },
  "jobs-using-demo": {
    "te": "డెమో డేటా చూపబడుతోంది",
    "en": "Showing demo data"
  },
  "battery-saver": {
    "te": "బ్యాటరీ సేవర్",
    "en": "Battery Saver"
  },
  "job-view-details": {
    "te": "వివరాలు చూడండి",
    "en": "View Details"
  },
  "job-hide-details": {
    "te": "వివరాలు దాచు",
    "en": "Hide Details"
  },
  "quiz-page-title": {
    "te": "నైపుణ్య పరీక్ష",
    "en": "Skill Checker"
  },
  "quiz-page-subtitle": {
    "te": "మీకు సరైన కెరీర్ మార్గం కనుగొనండి",
    "en": "Find the right career path for you"
  },
  "quiz-your-result": {
    "te": "మీ ఫలితం",
    "en": "Your Result"
  },
  "quiz-score-breakdown": {
    "te": "స్కోర్ వివరాలు",
    "en": "Score Breakdown"
  },
  "quiz-next-steps": {
    "te": "తదుపరి అడుగులు",
    "en": "Next Steps"
  },
  "quiz-retake": {
    "te": "మళ్ళీ పరీక్ష చేయండి",
    "en": "Retake Quiz"
  },
  "resume-page-title": {
    "te": "రెజ్యూమ్ బిల్డర్",
    "en": "Resume Builder"
  },
  "resume-page-subtitle": {
    "te": "ఉచితంగా మీ ప్రొఫెషనల్ రెజ్యూమ్ తయారు చేయండి",
    "en": "Build your professional resume for free"
  },
  "resume-section-personal": {
    "te": "వ్యక్తిగత వివరాలు",
    "en": "Personal Details"
  },
  "resume-section-education": {
    "te": "విద్య & నైపుణ్యాలు",
    "en": "Education & Skills"
  },
  "resume-section-experience": {
    "te": "అనుభవం & భాషలు",
    "en": "Experience & Languages"
  },
  "resume-label-name": {
    "te": "పూర్తి పేరు",
    "en": "Full Name"
  },
  "resume-label-phone": {
    "te": "ఫోన్ నంబర్",
    "en": "Phone Number"
  },
  "resume-label-email": {
    "te": "ఇమెయిల్",
    "en": "Email"
  },
  "resume-label-village": {
    "te": "గ్రామం / నగరం",
    "en": "Village / City"
  },
  "resume-label-qualification": {
    "te": "అత్యధిక విద్యార్హత",
    "en": "Highest Qualification"
  },
  "resume-label-skills": {
    "te": "ప్రధాన నైపుణ్యాలు",
    "en": "Key Skills"
  },
  "resume-label-experience": {
    "te": "పని అనుభవం",
    "en": "Work Experience"
  },
  "resume-label-languages": {
    "te": "తెలిసిన భాషలు",
    "en": "Languages Known"
  },
  "resume-label-objective": {
    "te": "కెరీర్ ఆబ్జెక్టివ్",
    "en": "Career Objective"
  },
  "resume-optional": {
    "te": "(ఐచ్ఛికం)",
    "en": "(Optional)"
  },
  "resume-ph-name": {
    "te": "ఉదా: రాజేష్ కుమార్",
    "en": "e.g. Rajesh Kumar"
  },
  "resume-ph-phone": {
    "te": "ఉదా: 9876543210",
    "en": "e.g. 9876543210"
  },
  "resume-ph-email": {
    "te": "ఉదా: rajesh@email.com",
    "en": "e.g. rajesh@email.com"
  },
  "resume-ph-village": {
    "te": "ఉదా: పెద్దపల్లి, తెలంగాణ",
    "en": "e.g. Peddapalli, Telangana"
  },
  "resume-ph-qualification": {
    "te": "ఉదా: B.Com, ఇంటర్మీడియేట్, ITI ఎలక్ట్రీషియన్",
    "en": "e.g. B.Com, Intermediate, ITI Electrician"
  },
  "resume-ph-skills": {
    "te": "ఉదా: MS Office, Typing, ఎలక్ట్రికల్ వైరింగ్, వ్యవసాయం",
    "en": "e.g. MS Office, Typing, Electrical Wiring, Farming"
  },
  "resume-ph-experience": {
    "te": "ఉదా: XYZ వర్క్‌షాప్‌లో 1 సంవత్సరం హెల్పర్‌గా పనిచేశాను",
    "en": "e.g. Worked as Helper at XYZ Workshop for 1 year"
  },
  "resume-ph-languages": {
    "te": "ఉదా: తెలుగు, ఇంగ్లీష్, హింది",
    "en": "e.g. Telugu, English, Hindi"
  },
  "resume-ph-objective": {
    "te": "ఉదా: నా నైపుణ్యాలను ఉపయోగించి ఎదగడానికి స్థిరమైన ఉద్యోగం కోరుకుంటున్నాను.",
    "en": "e.g. Seeking a stable job where I can use my skills to contribute and grow."
  },
  "resume-hint-skills": {
    "te": "కామాలతో వేరు చేయండి (ఉదా: Typing, MS Office, Farming)",
    "en": "Separate with commas (e.g. Typing, MS Office, Farming)"
  },
  "resume-generate": {
    "te": "రెజ్యూమ్ PDF తయారు చేయండి",
    "en": "Generate Resume PDF"
  },
  "resume-note": {
    "te": "PDF ఆటోమేటిగ్గా డౌన్‌లోడ్ అవుతుంది. ఎటువంటి లాగిన్ అవసరం లేదు.",
    "en": "PDF will download automatically. No login required."
  },
  "resume-err-name": {
    "te": "దయచేసి మీ పేరు నమోదు చేయండి",
    "en": "Please enter your full name"
  },
  "resume-err-phone": {
    "te": "దయచేసి ఫోన్ నంబర్ నమోదు చేయండి",
    "en": "Please enter your phone number"
  },
  "resume-err-phone-invalid": {
    "te": "దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి",
    "en": "Please enter a valid 10-digit phone number"
  },
  "resume-jspdf-error": {
    "te": "PDF లైబ్రరీ లోడ్ కాలేదు. దయచేసి పేజీని రిఫ్రెష్ చేయండి.",
    "en": "PDF library failed to load. Please refresh the page."
  },
  "resume-pdf-error": {
    "te": "PDF తయారీలో సమస్య. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    "en": "Error generating PDF. Please try again."
  },
  "resume-success-title": {
    "te": "రెజ్యూమ్ విజయవంతంగా తయారైంది!",
    "en": "Resume generated successfully!"
  },
  "resume-success-desc": {
    "te": "PDF మీ ఫోన్‌లో డౌన్‌లోడ్ అయింది. Downloads ఫోల్డర్‌లో చూడండి.",
    "en": "The PDF has been downloaded to your phone. Check your Downloads folder."
  },
  "resume-another": {
    "te": "మరొక రెజ్యూమ్ తయారు చేయండి",
    "en": "Generate Another Resume"
  },
  "resume-back-home": {
    "te": "హోమ్‌కు వెళ్ళండి",
    "en": "Back to Home"
  },
  "node-engineer": {
    "te": "ఇంజనీర్",
    "en": "Engineer"
  },
  "node-teacher": {
    "te": "ఉపాధ్యాయులు",
    "en": "Teacher"
  },
  "node-police": {
    "te": "పోలీస్",
    "en": "Police"
  },
  "node-nurse": {
    "te": "నర్సింగ్",
    "en": "Nurse"
  },
  "node-entrepreneur": {
    "te": "స్వయం ఉపాధి",
    "en": "Entrepreneur"
  },
  "nav-scholarships": {
    "te": "స్కాలర్‌షిప్‌లు",
    "en": "Scholarships"
  },
  "nav-schemes": {
    "te": "ప్రభుత్వ పథకాలు",
    "en": "Govt Schemes"
  },
  "nav-roadmap": {
    "te": "కెరీర్ రోడ్‌మ్యాప్",
    "en": "Career Roadmap"
  },
  "nav-stories": {
    "te": "విజయ గాథలు",
    "en": "Success Stories"
  },
  "nav-about": {
    "te": "ప్రాజెక్ట్ గురించి",
    "en": "About Project"
  },
  "btn-apply": {
    "te": "దరఖాస్తు చేసుకోండి",
    "en": "Apply Now"
  },
  "btn-save": {
    "te": "సేవ్ చేయండి",
    "en": "Save Job"
  },
  "btn-download": {
    "te": "డౌన్‌లోడ్",
    "en": "Download"
  },
  "btn-view-details": {
    "te": "వివరాలు చూడండి",
    "en": "View Details"
  },
  "btn-register": {
    "te": "నమోదు చేసుకోండి",
    "en": "Register Now"
  },
  "btn-search": {
    "te": "వెతకండి",
    "en": "Search"
  },
  "btn-clear": {
    "te": "ఫిల్టర్లు క్లియర్ చేయండి",
    "en": "Clear Filters"
  },
  "btn-back": {
    "te": "వెనక్కి వెళ్ళండి",
    "en": "Go Back"
  },
  "btn-back-jobs": {
    "te": "← ఉద్యోగాల జాబితాకు",
    "en": "← Back to Jobs"
  },
  "btn-generate-roadmap": {
    "te": "రోడ్‌మ్యాప్ రూపొందించండి",
    "en": "Generate Roadmap"
  },
  "btn-download-pdf": {
    "te": "PDF డౌన్‌లోడ్ చేయండి",
    "en": "Download PDF"
  },
  "btn-share": {
    "te": "షేర్ చేయండి",
    "en": "Share"
  }
};

  function getCurrentLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'te' || saved === 'en') return saved;
    } catch (e) {}
    return DEFAULT_LANG;
  }

  function setLanguage(lang) {
    if (lang !== 'te' && lang !== 'en') lang = DEFAULT_LANG;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}

    document.documentElement.lang = lang;
    const isTe = lang === 'te';

    // 1. Update elements with [data-lang-key]
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.getAttribute('data-lang-key');
      if (dictionary[key] && dictionary[key][lang] !== undefined) {
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
      if (dictionary[key] && dictionary[key][lang] !== undefined) {
        el.placeholder = dictionary[key][lang];
      }
    });

    // 3. Hero Subtitle toggle: if both .gcs-hero-sub-en and .gcs-hero-sub-te exist, manage visibility
    const subEn = document.querySelector('.gcs-hero-sub-en');
    const subTe = document.querySelector('.gcs-hero-sub-te');
    if (subEn && subTe) {
      if (isTe) {
        subEn.style.display = 'none';
        subTe.style.display = 'block';
        subTe.style.fontSize = '1.05rem';
        subTe.style.fontWeight = '600';
      } else {
        subEn.style.display = 'block';
        subTe.style.display = 'none';
      }
    }

    // 4. Update language toggle pills
    document.querySelectorAll('#gcsPillTe, .pill-te').forEach(btn => {
      btn.classList.toggle('active', isTe);
      btn.style.fontWeight = isTe ? '800' : '500';
      btn.style.background = isTe ? '#1B4D3E' : 'transparent';
      btn.style.color = isTe ? '#FFFFFF' : 'inherit';
    });
    document.querySelectorAll('#gcsPillEn, .pill-en').forEach(btn => {
      btn.classList.toggle('active', !isTe);
      btn.style.fontWeight = !isTe ? '800' : '500';
      btn.style.background = !isTe ? '#1B4D3E' : 'transparent';
      btn.style.color = !isTe ? '#FFFFFF' : 'inherit';
    });

    // 5. Update floating pins on image
    const pinMap = {
      '.gcs-node-engineer .gcs-node-tag': isTe ? 'ఇంజనీర్' : 'Engineer',
      '.gcs-node-teacher .gcs-node-tag': isTe ? 'ఉపాధ్యాయులు' : 'Teacher',
      '.gcs-node-police .gcs-node-tag': isTe ? 'పోలీస్' : 'Police',
      '.gcs-node-nurse .gcs-node-tag': isTe ? 'నర్సింగ్' : 'Nurse',
      '.gcs-node-entrepreneur .gcs-node-tag': isTe ? 'స్వయం ఉపాధి' : 'Entrepreneur'
    };
    for (const [sel, text] of Object.entries(pinMap)) {
      const pin = document.querySelector(sel);
      if (pin) pin.textContent = text;
    }

    // 6. Notify any dynamic listeners
    window.dispatchEvent(new CustomEvent('gcs-language-changed', { detail: { lang } }));
  }

  function speakText(text, explicitLang) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const lang = explicitLang || getCurrentLanguage();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let voice = null;
    if (lang === 'te') {
      voice = voices.find(v => v.lang.startsWith('te') || v.name.toLowerCase().includes('telugu'));
      utterance.lang = 'te-IN';
      utterance.rate = 0.9;
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

  window.switchGcsLanguage = setLanguage;

  window.I18n = {
    init: () => Promise.resolve(),
    toggle: () => setLanguage(getCurrentLanguage() === 'te' ? 'en' : 'te'),
    applyLanguage: setLanguage,
    getSavedLang: getCurrentLanguage,
    getCurrentLang: getCurrentLanguage,
    t: (key) => {
      const l = getCurrentLanguage();
      return (dictionary[key] && dictionary[key][l]) || key;
    }
  };

  // Run automatically on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setLanguage(getCurrentLanguage()));
  } else {
    setLanguage(getCurrentLanguage());
  }

})();
