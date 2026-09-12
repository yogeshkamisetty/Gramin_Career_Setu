# 🌾 Gramin Career Setu — గ్రామీణ కెరీర్ సేతు

> **Career guidance for rural youth, built as a BTech CSE Community Service Project (CSP).**

---

## 🎯 Purpose

Gramin Career Setu is a **free, offline-friendly web portal** designed to help rural students and youth discover career paths, explore local job opportunities, take aptitude quizzes, and build basic resumes — all in **Telugu** (with an English toggle).

This project is submitted as part of a college CSP under a hackathon-style evaluation. It targets communities with limited internet access by working as a **static site** hosted on GitHub Pages, with optional PWA (Progressive Web App) support for offline use.

---

## 🛠️ Tech Stack

| Layer              | Choice                                      |
| ------------------ | ------------------------------------------- |
| **Structure**      | Plain HTML5                                 |
| **Styling**        | Vanilla CSS                                 |
| **Logic**          | Vanilla JavaScript (ES6+)                   |
| **Data Source**     | Google Sheets published as CSV              |
| **PDF Generation** | [jsPDF](https://github.com/parallax/jsPDF) via CDN |
| **Charts**         | [Chart.js](https://www.chartjs.org/) via CDN |
| **Hosting**        | GitHub Pages (static files, no server)      |
| **Language**       | Telugu (default) with English toggle        |

> **No React, no build tools, no npm.** Everything runs from plain static files.

---

## 📁 Folder Structure

```
gramin-career-setu/
├── index.html          # Landing page — hero, navigation, language toggle
├── jobs.html           # Job listings pulled from Google Sheets CSV
├── quiz.html           # Career aptitude quiz
├── resume.html         # Simple resume builder
├── results.html        # Quiz results with Chart.js visualisation
├── manifest.json       # PWA manifest for offline/installable support
├── README.md           # This file
│
├── assets/
│   ├── tokens.css      # Design tokens (colors, spacing, typography)
│   ├── style.css       # Core layout and component styles
│   ├── landing.css     # Landing page styles
│   ├── i18n-dict.js    # Bilingual translation dictionary (261 keys)
│   ├── i18n.js         # Translation engine & speech synthesis
│   ├── app.js          # Core application utilities, bookmarks & offline PWA
│   ├── auth.js         # Authentication & role guard logic
│   ├── quiz.js         # RIASEC career aptitude quiz logic
│   ├── resume-builder-engine.js # Resume builder + ATS scoring engine
│   ├── pdf-loader.js   # Lazy-loader for jsPDF
│   └── sw.js           # Service Worker for offline caching (PWA)
│
└── data/
    └── jobs.csv        # Seed job listings for offline demo
```

---

## 🚀 How to Run Locally

1. Clone or download this repository.
2. Open `index.html` in any modern browser — no server required.
3. Alternatively, use a simple local server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Or use VS Code "Live Server" extension
   ```

### Automated checks

Install Node.js 18 or newer, then run:

```bash
npm test
```

The regression suite verifies the local server entry point, custom 404 handling,
path traversal protection, malformed URL handling, jobs search/filter wiring,
and resume character-limit enforcement.

---

## 🌐 Deployment (GitHub Pages)

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source → Deploy from branch** (select `main`, root `/`).
3. The site will be live at `https://<username>.github.io/gramin-career-setu/`.

---

## 📝 Data Source

Job listings and survey registrations can be synchronized with **Google Sheets** via the Volunteer Admin Dashboard (`admin/index.html`). Configure your published CSV links in `assets/actions.js` or use the built-in offline listings. The public jobs page features 22 verified job opportunities with client-side category filtering and pagination.

The public `results.html` page is the workshop impact dashboard. Update its editable `WORKSHOP_DATA` object with real pre/post survey values before submitting CSP evidence. The `admin/` page provides a local handover-oriented view for job, survey, and impact tracking.

---

## 👤 Author

Built as a **Community Service Project (CSP)** for BTech CSE.

---

## 📄 License

This project is open-source and free to use for educational and community purposes.
