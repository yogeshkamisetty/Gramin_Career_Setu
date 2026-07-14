/**
 * Gramin Career Setu — Quiz Logic (assets/quiz.js)
 * ─────────────────────────────────────────────────
 * Career aptitude quiz — 5 questions, 4 career paths.
 *
 * EDITING GUIDE:
 * ┌──────────────────────────────────────────────────────────────┐
 * │ To change questions  → edit QUIZ_DATA.questions below.      │
 * │ To change paths      → edit QUIZ_DATA.paths below.          │
 * │ Each option's `scores` adds points to career paths.         │
 * │ The path with the highest total score wins.                 │
 * │ Don't edit below the "QUIZ ENGINE" line unless you want     │
 * │ to change the quiz behavior itself.                         │
 * └──────────────────────────────────────────────────────────────┘
 */

// ═══════════════════════════════════════════════════════════════════
//  QUIZ DATA — Questions, Options, Weights & Career Paths
// ═══════════════════════════════════════════════════════════════════

const QUIZ_DATA = {

  // ────────────────────────────────────────────────
  //  QUESTIONS  (add/remove/reorder freely)
  // ────────────────────────────────────────────────
  questions: [

    // ── Q1: Comfort with numbers ──
    {
      id: 'q1',
      text_te: 'లెక్కలు (Mathematics) చేయడం మీకు ఎలా అనిపిస్తుంది?',
      text_en: 'How comfortable are you with numbers and math?',
      options: [
        {
          text_te: 'చాలా సౌకర్యంగా ఉంటుంది',
          text_en: 'Very comfortable',
          scores: { government: 3, iti: 0, bpo: 1, business: 0 }
        },
        {
          text_te: 'కొంచెం సౌకర్యంగా ఉంటుంది',
          text_en: 'Somewhat comfortable',
          scores: { government: 2, iti: 0, bpo: 0, business: 1 }
        },
        {
          text_te: 'లెక్కలు కష్టంగా అనిపిస్తాయి',
          text_en: 'Math feels difficult',
          scores: { government: 0, iti: 2, bpo: 1, business: 0 }
        },
        {
          text_te: 'ప్రాక్టికల్ పని ఇష్టం, లెక్కలు కాదు',
          text_en: 'I prefer hands-on work over numbers',
          scores: { government: 0, iti: 3, bpo: 0, business: 1 }
        }
      ]
    },

    // ── Q2: Interest in fixing / building things ──
    {
      id: 'q2',
      text_te: 'మెషీన్లు, బైకులు లేదా ఎలక్ట్రికల్ వస్తువులను రిపేర్ చేయడం మీకు ఇష్టమా?',
      text_en: 'Do you enjoy fixing machines, bikes, or electrical items?',
      options: [
        {
          text_te: 'చాలా ఇష్టం — ఎప్పుడూ చేస్తుంటా',
          text_en: 'Love it — I do it all the time',
          scores: { government: 0, iti: 3, bpo: 0, business: 1 }
        },
        {
          text_te: 'ఆసక్తి ఉంది, నేర్చుకోవాలి',
          text_en: 'Interested and want to learn',
          scores: { government: 0, iti: 2, bpo: 0, business: 1 }
        },
        {
          text_te: 'ఎక్కువ ఆసక్తి లేదు',
          text_en: 'Not very interested',
          scores: { government: 2, iti: 0, bpo: 1, business: 0 }
        },
        {
          text_te: 'అస్సలు ఇష్టం లేదు',
          text_en: 'Not at all',
          scores: { government: 1, iti: 0, bpo: 2, business: 1 }
        }
      ]
    },

    // ── Q3: Comfort talking to strangers ──
    {
      id: 'q3',
      text_te: 'తెలియని వ్యక్తులతో ఫోన్‌లో లేదా ముఖాముఖి మాట్లాడటం మీకు ఎలా?',
      text_en: 'How do you feel about talking to strangers on the phone or face-to-face?',
      options: [
        {
          text_te: 'చాలా సౌకర్యంగా — ఇష్టం కూడా',
          text_en: 'Very comfortable — I enjoy it',
          scores: { government: 0, iti: 0, bpo: 3, business: 2 }
        },
        {
          text_te: 'కొంచెం బిడియం, కానీ చేయగలను',
          text_en: 'A bit shy, but I can manage',
          scores: { government: 0, iti: 0, bpo: 2, business: 1 }
        },
        {
          text_te: 'బిడియం ఉంది, కానీ నేర్చుకోవాలని ఉంది',
          text_en: 'Shy, but willing to learn',
          scores: { government: 1, iti: 0, bpo: 1, business: 1 }
        },
        {
          text_te: 'నిశ్శబ్దంగా పనిచేయడం ఇష్టం',
          text_en: 'I prefer working quietly on my own',
          scores: { government: 2, iti: 2, bpo: 0, business: 0 }
        }
      ]
    },

    // ── Q4: Highest qualification ──
    {
      id: 'q4',
      text_te: 'మీ అత్యధిక విద్యార్హత ఏమిటి?',
      text_en: 'What is your highest educational qualification?',
      options: [
        {
          text_te: '10వ తరగతి లేదా అంతకంటే తక్కువ',
          text_en: '10th class or below',
          scores: { government: 0, iti: 3, bpo: 0, business: 2 }
        },
        {
          text_te: 'ఇంటర్మీడియేట్ (12వ తరగతి)',
          text_en: 'Intermediate (12th class)',
          scores: { government: 2, iti: 0, bpo: 2, business: 1 }
        },
        {
          text_te: 'డిగ్రీ (BA / BCom / BSc / BTech)',
          text_en: 'Degree (BA / BCom / BSc / BTech)',
          scores: { government: 3, iti: 0, bpo: 2, business: 0 }
        },
        {
          text_te: 'ITI / డిప్లొమా',
          text_en: 'ITI / Diploma',
          scores: { government: 1, iti: 3, bpo: 0, business: 0 }
        }
      ]
    },

    // ── Q5: Interest in self-employment ──
    {
      id: 'q5',
      text_te: 'సొంతంగా వ్యాపారం లేదా షాపు నడపడం మీకు ఆసక్తి ఉందా?',
      text_en: 'Are you interested in running your own business or shop?',
      options: [
        {
          text_te: 'చాలా ఆసక్తి — ఈ రోజే మొదలు పెట్టాలని ఉంది',
          text_en: 'Very interested — I want to start right away',
          scores: { government: 0, iti: 1, bpo: 0, business: 3 }
        },
        {
          text_te: 'కొంచెం ఆసక్తి ఉంది, ఆలోచిస్తున్నా',
          text_en: 'Somewhat interested, thinking about it',
          scores: { government: 0, iti: 0, bpo: 1, business: 2 }
        },
        {
          text_te: 'నాకు స్థిరమైన జీతం ఉన్న ఉద్యోగం ఇష్టం',
          text_en: 'I prefer a stable salaried job',
          scores: { government: 3, iti: 1, bpo: 0, business: 0 }
        },
        {
          text_te: 'ఇంకా తెలియదు, ఆలోచించాలి',
          text_en: 'Not sure yet, need to think',
          scores: { government: 1, iti: 1, bpo: 1, business: 1 }
        }
      ]
    }
  ],

  // ────────────────────────────────────────────────
  //  CAREER PATHS  (result screen data)
  // ────────────────────────────────────────────────
  paths: {
    government: {
      icon: '🏛️',
      name_te: 'ప్రభుత్వ ఉద్యోగాలు',
      name_en: 'Government Jobs',
      gradient: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
      desc_te: 'మీకు క్రమశిక్షణ, లెక్కల సామర్థ్యం మరియు స్థిరమైన కెరీర్ పట్ల ఆసక్తి ఉన్నాయి. ప్రభుత్వ పోటీ పరీక్షలకు ప్రిపేర్ అవ్వడం మీకు బాగా సరిపోతుంది.',
      desc_en: 'You show discipline, numerical ability, and a preference for career stability. Preparing for government competitive exams is a great fit for you.',
      portal_url: 'https://www.ncs.gov.in',
      portal_name_te: 'NCS పోర్టల్ సందర్శించండి',
      portal_name_en: 'Visit NCS Portal',
      steps_te: [
        'NCS (National Career Service) పోర్టల్‌లో రిజిస్టర్ అవ్వండి',
        'APPSC / SSC పరీక్షల సిలబస్ డౌన్‌లోడ్ చేసి ప్రిపరేషన్ మొదలు పెట్టండి',
        'YouTube లో ఉచిత కోచింగ్ చానెల్‌లో చేరండి (Sakshi Education, Adda247 Telugu)'
      ],
      steps_en: [
        'Register on the NCS (National Career Service) portal',
        'Download APPSC / SSC exam syllabus and start preparation',
        'Join a free YouTube coaching channel (Sakshi Education, Adda247 Telugu)'
      ]
    },

    iti: {
      icon: '🔧',
      name_te: 'ITI / సాంకేతిక విద్య',
      name_en: 'ITI / Technical Training',
      gradient: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
      desc_te: 'మీరు ప్రాక్టికల్ పని చేయడంలో ఆసక్తి ఉన్న వ్యక్తి. ITI ట్రేడ్ కోర్సు మీకు మంచి ఉద్యోగ అవకాశాలు మరియు నైపుణ్యాలు అందిస్తుంది.',
      desc_en: 'You\'re a hands-on learner who enjoys practical work. An ITI trade course will give you marketable skills and excellent job opportunities.',
      portal_url: 'https://www.apssdc.in',
      portal_name_te: 'APSSDC పోర్టల్ సందర్శించండి',
      portal_name_en: 'Visit APSSDC Portal',
      steps_te: [
        'మీ దగ్గరలో ఉన్న ITI సెంటర్‌ను సందర్శించి అడ్మిషన్ వివరాలు తెలుసుకోండి',
        'ఎలక్ట్రీషియన్ / ఫిట్టర్ / మెకానిక్ ట్రేడ్‌కు అప్లై చేయండి',
        'APSSDC వెబ్‌సైట్‌లో అదనపు స్కిల్ డెవలప్‌మెంట్ ప్రోగ్రామ్‌లు చూడండి'
      ],
      steps_en: [
        'Visit your nearest ITI center for admission details',
        'Apply for Electrician / Fitter / Mechanic trade',
        'Check APSSDC website for additional skill development programs'
      ]
    },

    bpo: {
      icon: '📞',
      name_te: 'BPO / కస్టమర్ సర్వీస్',
      name_en: 'BPO / Customer Service',
      gradient: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
      desc_te: 'మీకు వ్యక్తులతో మాట్లాడటం ఇష్టం మరియు మంచి కమ్యూనికేషన్ స్కిల్స్ ఉన్నాయి. BPO / కస్టమర్ సర్వీస్ రంగంలో త్వరగా ఉద్యోగం పొందవచ్చు.',
      desc_en: 'You\'re comfortable with people and have strong communication skills. BPO and customer service roles offer quick employment with career growth.',
      portal_url: 'https://www.naukri.com',
      portal_name_te: 'Naukri.com లో ఉద్యోగాలు వెతకండి',
      portal_name_en: 'Search jobs on Naukri.com',
      steps_te: [
        'ఇంగ్లీషు స్పీకింగ్ ప్రాక్టీస్ చేయండి (EngVarta యాప్ లేదా YouTube)',
        'బేసిక్ కంప్యూటర్ స్కిల్స్ (MS Office, Typing) నేర్చుకోండి',
        'Naukri.com / Indeed లో ప్రొఫైల్ క్రియేట్ చేసి అప్లై చేయండి'
      ],
      steps_en: [
        'Practice English speaking (use EngVarta app or YouTube channels)',
        'Learn basic computer skills (MS Office, typing)',
        'Create a profile on Naukri.com / Indeed and start applying'
      ]
    },

    business: {
      icon: '💼',
      name_te: 'వ్యాపారం / స్వయం ఉపాధి',
      name_en: 'Business / Self-Employment',
      gradient: 'linear-gradient(135deg, #ad1457 0%, #d81b60 100%)',
      desc_te: 'మీలో వ్యాపార దృష్టి మరియు స్వయం ఉపాధి పట్ల ఆసక్తి ఉన్నాయి. చిన్న వ్యాపారం మొదలు పెట్టడం మీ ఆసక్తులకు బాగా సరిపోతుంది.',
      desc_en: 'You have an entrepreneurial mindset and interest in self-employment. Starting a small business could be your ideal career path.',
      portal_url: 'https://www.mudra.org.in',
      portal_name_te: 'ముద్ర లోన్ కోసం అప్లై చేయండి',
      portal_name_en: 'Apply for Mudra Loan',
      steps_te: [
        'మీ ప్రాంతంలో అవసరమైన వ్యాపారాన్ని గుర్తించండి (డెయిరీ, కిరాణా, సర్వీసెస్)',
        'ముద్ర లోన్ (₹50,000 – ₹10 లక్షలు) కోసం మీ దగ్గరి బ్యాంక్‌లో అప్లై చేయండి',
        'స్థానిక వ్యాపార నైపుణ్య శిక్షణ వర్క్‌షాప్‌లలో చేరండి (RSETI, NABARD)'
      ],
      steps_en: [
        'Identify a local need (dairy, kirana store, mobile repair, services)',
        'Apply for Mudra Loan (₹50,000 – ₹10 Lakhs) at your nearest bank',
        'Join local business skill training workshops (RSETI, NABARD)'
      ]
    }
  }
};


// ═══════════════════════════════════════════════════════════════════
//  QUIZ ENGINE — Handles rendering, transitions, scoring
//  (You normally don't need to edit below this line.)
// ═══════════════════════════════════════════════════════════════════

const Quiz = (() => {
  'use strict';

  // ── State ──
  let currentIndex = 0;
  let scores       = { government: 0, iti: 0, bpo: 0, business: 0 };
  let isAnimating  = false;

  // ── DOM cache ──
  const dom = {};

  function cacheDom() {
    dom.quizContainer = document.getElementById('quizContainer');
    dom.quizResult    = document.getElementById('quizResult');
    dom.progressFill  = document.getElementById('progressFill');
    dom.progressText  = document.getElementById('progressText');
    dom.questionArea  = document.getElementById('questionArea');
  }

  // ── Helpers ──
  function lang() { return I18n.getCurrentLang(); }
  function t(key) { return I18n.getString(key); }
  function pick(obj, suffix) {
    return lang() === 'en' ? obj[suffix + '_en'] : obj[suffix + '_te'];
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  // ── Progress bar ──
  function updateProgress() {
    const total = QUIZ_DATA.questions.length;
    const pct   = ((currentIndex + 1) / total) * 100;
    dom.progressFill.style.width = pct + '%';
    dom.progressText.textContent = (currentIndex + 1) + ' / ' + total;
  }

  // ── Render a question card ──
  function renderQuestionCard(qIndex) {
    const q     = QUIZ_DATA.questions[qIndex];
    const qText = pick(q, 'text');
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    let optionsHtml = '';
    q.options.forEach((opt, i) => {
      const optText = pick(opt, 'text');
      optionsHtml += `
        <button class="quiz-option" data-option-index="${i}" type="button">
          <span class="quiz-option__letter">${letters[i]}</span>
          <span class="quiz-option__text">${escapeHtml(optText)}</span>
        </button>
      `;
    });

    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.innerHTML = `
      <p class="quiz-card__question">${escapeHtml(qText)}</p>
      <div class="quiz-card__options">${optionsHtml}</div>
    `;

    // Bind option clicks
    card.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        if (isAnimating) return;
        handleAnswer(parseInt(btn.dataset.optionIndex, 10));
      });
    });

    return card;
  }

  // ── Show a question with enter animation ──
  function showQuestion(index) {
    currentIndex = index;
    updateProgress();

    const card = renderQuestionCard(index);
    card.classList.add('quiz-card--enter');

    dom.questionArea.innerHTML = '';
    dom.questionArea.appendChild(card);

    // Trigger enter animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.remove('quiz-card--enter');
        card.classList.add('quiz-card--active');
      });
    });
  }

  // ── Handle answer selection ──
  function handleAnswer(optionIndex) {
    isAnimating = true;

    const q   = QUIZ_DATA.questions[currentIndex];
    const opt = q.options[optionIndex];

    // Highlight selected option
    const btns = dom.questionArea.querySelectorAll('.quiz-option');
    btns.forEach((btn, i) => {
      if (i === optionIndex) {
        btn.classList.add('quiz-option--selected');
      }
      btn.disabled = true;
    });

    // Accumulate scores
    Object.keys(opt.scores).forEach(path => {
      scores[path] = (scores[path] || 0) + opt.scores[path];
    });

    // Wait for selection feedback, then transition
    setTimeout(() => {
      const card = dom.questionArea.querySelector('.quiz-card');
      if (card) {
        card.classList.remove('quiz-card--active');
        card.classList.add('quiz-card--exit');
      }

      setTimeout(() => {
        if (currentIndex + 1 < QUIZ_DATA.questions.length) {
          // Next question
          showQuestion(currentIndex + 1);
          isAnimating = false;
        } else {
          // Quiz complete — show result
          const winner = calculateResult();
          showResult(winner);
          isAnimating = false;
        }
      }, 350);
    }, 400);
  }

  // ── Calculate winner ──
  function calculateResult() {
    let maxScore = -1;
    let winner   = 'government';

    Object.keys(scores).forEach(path => {
      if (scores[path] > maxScore) {
        maxScore = scores[path];
        winner   = path;
      }
    });

    return winner;
  }

  // ── Render result screen ──
  function showResult(pathKey) {
    const path   = QUIZ_DATA.paths[pathKey];
    const name   = pick(path, 'name');
    const desc   = pick(path, 'desc');
    const steps  = lang() === 'en' ? path.steps_en : path.steps_te;
    const portal = pick(path, 'portal_name');

    // Build score breakdown for transparency
    const total     = Object.values(scores).reduce((a, b) => a + b, 0);
    const pathNames = {
      government: pick(QUIZ_DATA.paths.government, 'name'),
      iti:        pick(QUIZ_DATA.paths.iti,        'name'),
      bpo:        pick(QUIZ_DATA.paths.bpo,        'name'),
      business:   pick(QUIZ_DATA.paths.business,   'name')
    };

    let breakdownHtml = '';
    Object.keys(scores).forEach(key => {
      const pct = total > 0 ? Math.round((scores[key] / total) * 100) : 0;
      const isWinner = key === pathKey;
      breakdownHtml += `
        <div class="score-bar ${isWinner ? 'score-bar--winner' : ''}">
          <div class="score-bar__label">
            <span>${QUIZ_DATA.paths[key].icon} ${escapeHtml(pathNames[key])}</span>
            <span class="score-bar__pct">${pct}%</span>
          </div>
          <div class="score-bar__track">
            <div class="score-bar__fill" style="width: ${pct}%; background: ${QUIZ_DATA.paths[key].gradient};"></div>
          </div>
        </div>
      `;
    });

    // Build steps
    let stepsHtml = '';
    steps.forEach((step, i) => {
      stepsHtml += `
        <li class="result-step">
          <span class="result-step__number">${i + 1}</span>
          <span class="result-step__text">${escapeHtml(step)}</span>
        </li>
      `;
    });

    // Hide quiz, show result
    dom.quizContainer.style.display = 'none';

    dom.quizResult.innerHTML = `
      <div class="result-celebration">🎉</div>

      <h2 class="result-heading" data-lang-key="quiz-your-result">${escapeHtml(t('quiz-your-result'))}</h2>

      <div class="result-path-card" style="background: ${path.gradient};">
        <span class="result-path-card__icon">${path.icon}</span>
        <h3 class="result-path-card__name">${escapeHtml(name)}</h3>
      </div>

      <p class="result-desc">${escapeHtml(desc)}</p>

      <div class="result-scores">
        <h4 class="result-scores__title" data-lang-key="quiz-score-breakdown">${escapeHtml(t('quiz-score-breakdown'))}</h4>
        ${breakdownHtml}
      </div>

      <div class="result-steps">
        <h4 class="result-steps__title" data-lang-key="quiz-next-steps">${escapeHtml(t('quiz-next-steps'))}</h4>
        <ol class="result-steps__list">${stepsHtml}</ol>
      </div>

      <div class="result-actions">
        <a href="${path.portal_url}" target="_blank" rel="noopener noreferrer" class="btn-portal" style="background: ${path.gradient};">
          <span class="btn-portal__icon">🌐</span>
          ${escapeHtml(portal)}
        </a>
        <button class="btn-retake" id="btnRetake" type="button">
          <span class="btn-retake__icon">🔄</span>
          <span data-lang-key="quiz-retake">${escapeHtml(t('quiz-retake'))}</span>
        </button>
      </div>
    `;

    dom.quizResult.style.display = '';

    // Animate in
    dom.quizResult.classList.add('result--enter');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        dom.quizResult.classList.remove('result--enter');
        dom.quizResult.classList.add('result--visible');
      });
    });

    // Wire retake
    document.getElementById('btnRetake').addEventListener('click', resetQuiz);
  }

  // ── Reset quiz ──
  function resetQuiz() {
    currentIndex = 0;
    scores = { government: 0, iti: 0, bpo: 0, business: 0 };
    isAnimating = false;

    dom.quizResult.style.display = 'none';
    dom.quizResult.classList.remove('result--visible', 'result--enter');
    dom.quizContainer.style.display = '';

    showQuestion(0);
  }

  // ── Watch for language changes → re-render current state ──
  function onLanguageChange() {
    if (dom.quizResult.style.display !== 'none') {
      // Re-render result screen
      const winner = calculateResult();
      showResult(winner);
    } else {
      // Re-render current question
      showQuestion(currentIndex);
    }
  }

  // ── Init ──
  function init() {
    cacheDom();
    showQuestion(0);

    // Listen for language toggle
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        if (m.attributeName === 'lang') onLanguageChange();
      });
    });
    observer.observe(document.documentElement, { attributes: true });
  }

  return { init, resetQuiz };
})();

// ── Bootstrap: wait for I18n ──
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => Quiz.init(), 100);
});
