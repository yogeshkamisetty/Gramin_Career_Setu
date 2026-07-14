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
│   ├── style.css       # Global styles
│   ├── script.js       # Shared logic (language toggle, CSV fetch, utils)
│   ├── quiz.js         # Quiz-specific logic
│   ├── resume.js       # Resume builder + jsPDF export logic
│   └── sw.js           # Service Worker for offline caching (PWA)
│
└── data/
    └── lang.json       # Telugu ↔ English translation strings
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

---

## 🌐 Deployment (GitHub Pages)

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source → Deploy from branch** (select `main`, root `/`).
3. The site will be live at `https://<username>.github.io/gramin-career-setu/`.

---

## 📝 Data Source

Job listings and quiz questions are stored in **Google Sheets** and published as CSV. The sheet URLs are configured as constants in `assets/script.js`. Replace the placeholder URLs with your own published Google Sheets links.

---

## 👤 Author

Built as a **Community Service Project (CSP)** for BTech CSE.

---

## 📄 License

This project is open-source and free to use for educational and community purposes.
