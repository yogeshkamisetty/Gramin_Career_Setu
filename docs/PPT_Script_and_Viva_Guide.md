# Gramin Career Setu — Presentation Script, Technical Walkthrough and Viva Guide

Community Service Project, B.Tech CSE, LBRCE (Autonomous) · Village: Bahubalendrunigudem (B B Gudem), Gannavaram Mandal, Krishna District, A.P. · Period: 15 May – 25 June 2026 · Batch 14 · Guide: Mrs. M. Gayathri

> Use this file in three ways: (1) read **Part 2** while presenting, (2) keep **Part 3 and 4** open for the "how does it work?" questions, (3) revise **Part 6** for the viva. Speak in simple words. If you do not know something, say so and explain what you do know. Never claim more than the project did.

---

## Part 1 — Facts to remember (cheat sheet)

| Item | Fact |
|---|---|
| Project name | Gramin Career Setu ("Rural Career Bridge"), గ్రామీణ కెరీర్ సేతు |
| Idea in one line | A free, Telugu-first, mobile website that tells rural youth which careers are open to them, how to apply online, how to make a resume, and how to avoid fake job offers |
| Village | B B Gudem, ~1,790 residents, 541 households, literacy ~70.6%, 58%+ of workforce are agricultural labourers, ~324 hectares, 6 km from Gannavaram |
| Team | 6 students: Anaparthi Rakesh Kumar, Choragudi Sowmya, Kamisetty Yogesh, Katru Sruthi, Kuppala Surya Teja, Pilla Bhanu |
| Duration | 6 weeks, 15 May – 25 June 2026 |
| Method | Listen (conversations + 50-question guide) → Build (small tested parts) → Show and improve (phone demos in the village) |
| Website content | Skill quiz (5 questions), 7 career roadmaps, 35 job-role types with official links, resume builder (PDF), schemes and scholarships, workshops page, Telugu/English switch, works offline |
| Tests | 48 automated tests passing (`npm test`). Earlier report text says 44; the count grew when mobile and Firebase tests were added. Say "all automated tests pass" if unsure |
| Survey | 60 respondents: 30 students/youth + 30 villagers (39 women, 21 men) |
| Key survey numbers | 73% cannot apply online (44/60) · 87% cannot make a PDF resume (52/60) · 43% were asked to pay money for a job (26/60) · 90% say a Telugu career website is useful (54/60) · 35% can name 3 careers (21/60) · 48% own a smartphone (29/60), 25% share one (15/60), 27% have none (16/60) |
| Readiness | 32 not ready (53%) · 17 partly ready (28%) · 11 ready (18%) |
| Biggest difficulty | Not knowing what is available (35%, 21) · not knowing the steps (27%, 16) · no device/signal (9) · English (7) |
| Main information source | Friends/family (35%, 21) |
| Honest limits | Small, non-random sample; baseline only; no measured change yet; job list is role types, not live vacancies; Telugu text in PDF resume needs the browser print route |

**Numbers that can trip you:** 29 + 15 + 16 = 60 (smartphone). 32 + 17 + 11 = 60 (readiness; percentages 53/28/18 add to 99 because of rounding).

---

## Part 2 — Presentation script (12 slides, about 8–10 minutes)

Tip: one or two members per slide. Suggested split is at the end of this part. Each block is *what to say*. Say it in your own style, do not memorise word for word.

### Slide 1 — Title
"Good morning. We are Batch 14 from the Department of CSE, Lakireddy Bali Reddy College of Engineering. Our Community Service Project is **Gramin Career Setu — a digital career-guidance bridge for rural youth**. Our guide is Mrs. M. Gayathri. Our team has six members. I will explain what we did in the village, what we found, and what we built."

### Slide 2 — Introduction
"We worked in **Bahubalendrunigudem**, a village in Gannavaram Mandal, Krishna District. Many young people here finish 10th, Intermediate or ITI, but they do not know which careers are open to them, how to apply for a job or exam online, or how to make a resume. Our purpose was simple: **listen to the community first, then build something free in Telugu and English that helps.** We worked for six weeks, from 15 May to 25 June 2026."

### Slide 3 — Village profile
"About **1,790 people live in 541 households**. Literacy is about 70 percent. More than half of the workers are agricultural labourers. The village has about 324 hectares of well-irrigated land and is 6 km from Gannavaram town. People depend on farming, small shops, daily-wage work and jobs in the nearby town. Schools are within reach, and ASHA workers connect families to public services. One important point: **some families share one smartphone and have limited data**, so our solution had to be light and simple."

### Slide 4 — Problem identification
"From our village visits we found **seven problems**.
One, career information is scattered and mostly in English.
Two, after 10th, Intermediate, ITI or degree, there is no clear next step.
Three, applying for jobs and exams online is difficult.
Four, young people have no resume and little preparation.
Five, there is a risk of fake offers and agents who ask for money.
Six, digital access is limited — shared phones, costly data, weak signal.
Seven, language and confidence gaps for first-generation learners.
We heard these directly from students, youth, parents, residents and ASHA workers."

### Slide 5 — Objectives
"We had five objectives.
One, understand the career-awareness and digital-access needs of rural youth by listening to them.
Two, help them see career paths after 10th, Intermediate, ITI or a degree.
Three, explain how to apply online and how to avoid agents and fake offers.
Four, design and build a simple, offline-friendly Telugu and English web solution.
Five, build our own communication, teamwork and honest-reporting skills."

### Slide 6 — Methodology
"Our method has three steps.
**Listen:** we talked in simple Telugu. We used a 50-question guide with eight areas — background, career awareness, education and skills, employment, digital access, resume making, feedback on the website, and open comments. We also recorded key answers on a short survey form.
**Build:** we built in small parts and tested each part, using HTML, CSS and JavaScript on the phone, a light Node.js server and a Spring Boot backend.
**Show and improve:** we demonstrated on real phones to students and villagers and used their suggestions.
Our four design rules were: Telugu first, no invented vacancies, private by default, light and offline."

### Slide 7 — Activities performed
"Week 1, 15 to 21 May: village visits, we listened to students, youth, parents and ASHA workers.
Week 2, 22 to 28 May: we listed roles and schemes from official sites, did a follow-up visit and designed the site.
Week 3, 29 May to 4 June: we shared the idea in the village and built roadmaps, the resume builder, the language switch and offline mode.
Week 4, 5 to 11 June: we built the secure backend, wrote automated tests and tested on a phone and a slow network.
Week 5, 12 to 18 June: we demonstrated the prototype and guided people on online applications and fake offers.
Week 6, 19 to 25 June: follow-up visit, survey kit, final tests, report and closing session."

### Slide 8 — Survey results and data analysis
"We surveyed **60 people from the village: 30 students and youth and 30 villagers**. 39 were women and 21 were men. The questions were about smartphones, careers, online applications, resumes, fake offers and our website.
Look at the four main numbers.
**73 percent cannot apply for a job or exam online.**
**87 percent cannot make a PDF resume.**
**43 percent — 26 out of 60 — were asked to pay money for a job.**
And **90 percent said a Telugu career website would be useful.**
On the chart: only 35 percent could name three careers, only 27 percent can apply online and only 13 percent can make a PDF resume. 48 percent own a smartphone.
We also grouped people by readiness. **53 percent need full support, 28 percent need guidance, and only 18 percent can apply on their own.**
The biggest difficulty was not knowing what is available, 35 percent, and not knowing the steps, 27 percent. Most people get information from friends and family.
Our conclusion: people do not lack interest, they lack **clear information and practical steps**. This survey is our baseline. The sample is small and was not random, so these numbers describe these 60 people."

### Slide 9 — Solutions and recommendations
"Based on this, we built Gramin Career Setu. On screen you can see the website on a computer and on a phone — the home page, the skill quiz and the career roadmap. It has a skill quiz, seven career roadmaps, 35 job roles with official links, a resume builder that creates a PDF, and it works in Telugu and English, even offline.
Our recommendations: regular Telugu village sessions led by local youth, a digital help point at the school, panchayat or library, and checking links and schemes against official sites every term."

### Slide 10 — Outcomes and social impact
"We have **7 career roadmap goals, 35 job-role types with official links, and automated tests** that check the data, pages and security. Students and villagers who saw the prototype were interactive, asked questions and gave suggestions. Youth now have a clear next step, a resume tool, and a reminder to verify every offer. Our survey is the baseline; in the next phase we will repeat it to measure real change."

### Slide 11 — Evidence and documentation
"These are GPS-stamped photos from our field visits: 15 May with ASHA workers, 16 May explaining the problem to youth, and 23 May a follow-up conversation. We also kept the 50-question guide, daily activity log, weekly reports and the survey kit."

### Slide 12 — Conclusion and learning outcomes
"What we learned: listen to a community before building, work as a team of six, build offline web apps with a secure backend and automated tests, and report honestly what was done and what was not.
Challenges: shared phones, costly data and weak signal; scattered or outdated online information; keeping content accurate without copying fees or cut-offs; explaining online steps to different age groups.
Our message: **opportunities exist, but the information must reach the village.** Next: wider testing, more village sessions and a repeat survey to measure change. Thank you. We are ready for your questions."

### Suggested speaker split (6 members)
Slides 1–2: Member 1 · Slides 3–4: Member 2 · Slides 5–6: Member 3 · Slides 7–8: Member 4 (survey owner) · Slides 9–10: Member 5 (demo/tech owner) · Slides 11–12: Member 6. Everyone must be able to answer questions about slide 8 and slide 9.

### 2-minute project explanation (if the examiner says "explain your project")
"Our project is Gramin Career Setu. We visited B B Gudem for six weeks and found that rural youth have phones but not clear, trustworthy, Telugu guidance on careers. We surveyed 60 people. Most could not apply online or make a resume, and 43 percent had been asked to pay money for a job. So we built a free mobile website in Telugu and English. It has a skill quiz, step-by-step roadmaps for seven goals, 35 job roles with links to official sites, a resume builder, schemes and scholarships, and it works offline. It never invents vacancies — it only points to official sources. We tested it on real phones with villagers, and we wrote automated tests so it stays honest and secure. Our next step is wider testing and repeating the survey to measure change."

---

## Part 3 — Terminal commands: what each one does and how it works

Run these from the project folder `D:\Yogesh\Coding\CSP`. The project has two parts: the **website** (runs with only Node.js) and an optional **backend stack** (Spring Boot + PostgreSQL + Redis + Keycloak in Docker).

### 3.1 Website — the main product

```bash
node server.js
```
**What happens:** starts our small Node.js server (`server.js`). It serves the HTML, CSS and JavaScript files and adds security headers. It listens on **port 5000** (or the `NODE_PORT` / `PORT` environment variable). Open `http://localhost:5000`.
**What to say:** "This is the edge server. It only serves files safely. Students' phones do the real work, so the site stays fast on basic devices."

```bash
npm start
```
Same as `node server.js` (defined in `package.json`).

```bash
npm test
```
**What happens:** runs `node --test tests/*.test.js` (Node's built-in test runner). It checks, for example: path-traversal protection and security headers of the server, that pages are translated, that the roadmap is rendered from the data file, that no invented job listings or impact numbers can appear, that no literal password opens an account, that the service worker precaches only a small shell, and the mobile/Firebase files. All tests should pass (48 at last run).
**What to say:** "The tests protect our honesty rules. If someone adds a fake vacancy or a hard-coded password, a test fails."

PowerShell tip for a different port:
```powershell
$env:NODE_PORT=5055; node server.js
```

```bash
node scripts/build-jobs-data.js
```
**What happens:** reads `data/jobs.csv` (the source of truth for the 35 job roles) and generates `data/jobs-data.js`, which the website loads. Edit the CSV, not the generated file.

### 3.2 Backend stack (Phase 2 prototype, runs locally)

```bash
docker compose up -d
```
**What happens:** reads `docker-compose.yml` and starts four containers in the background: **PostgreSQL 16** (database, port 5432), **Redis 7** (cache and rate-limit counters, 6379), **Keycloak 24** (login/identity server, 8081) and the **Spring Boot backend** (REST API, 8085). It needs a `.env` file with `DATABASE_PASSWORD` and `REDIS_PASSWORD`; compose stops with an error if they are missing — that is deliberate, so no default passwords are used.

```bash
docker compose ps          # shows which containers are running and healthy
docker compose logs -f     # live logs
docker compose down        # stops and removes the containers (data volumes stay)
```

```bash
cd backend
mvn spring-boot:run
```
**What happens:** runs the Java 21 / Spring Boot 3.3.5 backend without Docker (needs Java 21 and Maven, plus a database). On start, **Flyway** applies the database migrations (V1–V8) such as creating tables, seeding job roles from the CSV and adding search indexes.

```powershell
./scripts/backup-db.ps1      # Windows: backs up the database
./scripts/restore-db.ps1     # Windows: restores from a backup
```
(`.sh` versions exist for Linux.) These implement the backup-and-rollback policy in `docs/database-backup-and-rollback-policy.md`.

### 3.3 Firebase and live hosting (mobile PWA)
You told us this was set up as: Firestore + Phone Auth with offline sync, one-click hosting at `https://gramin-career-setu.web.app`, installable as a PWA. Typical commands (confirm against your `firebase.json` before you demonstrate):
```bash
firebase login
firebase deploy --only hosting     # uploads the static site to Firebase Hosting
```
**What to say:** "Firebase Hosting serves our static site free over HTTPS. Firestore keeps writes in a local queue when offline and syncs when the network returns." If asked for details you are unsure of, say what is configured and that you will not claim more than you tested.

### 3.4 Git (how we saved our work)
```bash
git status                 # what changed
git add <files>            # choose what goes in the next commit
git commit -m "message"    # save a snapshot
git log --oneline          # history
```

---

## Part 4 — How the project works (technical explanation, simple words)

### 4.1 Overall picture
```
Student's phone (browser / installed PWA)
   │  HTML + CSS + JavaScript, data files, service worker
   ▼
Node.js server (server.js, port 5000)  ── only serves files + security headers
   │
   ▼ (optional Phase 2)
Spring Boot API (8085) ── Keycloak login ── PostgreSQL ── Redis
Firebase (Firestore + Phone Auth + Hosting) for the live mobile version
```
Most features run **on the phone itself**. That is why it works on weak networks.

### 4.2 Front-end (what the student sees)
- **Pages:** about 21 HTML pages: home, careers, jobs, roadmap, quiz, resume builder, schemes, scholarships, workshops, resources, dashboard, login, etc.
- **Telugu/English switch (`i18n.js`, `i18n-dict.js`):** every text has a key; one dictionary holds both languages. Pressing the language button swaps the text without reloading. Telugu comes first by default. A "Listen" button uses the browser's speech feature to read text aloud.
- **Skill quiz (`quiz.js`):** 5 questions about comfort with maths, interests, etc. Each answer adds weighted points to tracks (for example government jobs, ITI/technical, BPO/services, self-employment). It suggests career areas; it does not invent match percentages.
- **Career roadmap (`data/roadmaps.js`):** the student picks "what have you studied" and "what do you want to become". The page shows numbered steps: what to do, how, how long, and which official website to check. It starts with an honest note, for example that police cannot be joined directly after 10th.
- **Jobs (`data/jobs.csv` → `jobs-data.js`):** 35 role types, filtered by qualification. Each links to an official site. **No vacancy, age limit, fee or cut-off is copied**, because these change with every notification.
- **Resume builder (`resume-builder-engine.js`):** a form creates a resume in the browser and exports a PDF. Details stay on the phone (private by default). Telugu resumes use the browser print route because the PDF library has no Telugu font.
- **Schemes and scholarships:** directory pages that point to official portals.
- **Impact dashboard (`results.html`, `data/survey-data.js`):** shows before/after survey counts once real counts are entered; empty state until then.

### 4.3 Mobile interface (what you improved)
- Bottom navigation bar (Home, Careers, Jobs, Resume, More) like an app; the "More" sheet holds other pages and the text-size control.
- Touch-friendly cards and 48 px tap targets; no sideways scrolling.
- **Text-size control:** presets small / normal / large / extra-large scale all text through one CSS variable (`--mobile-font-scale`) in `tokens.css`/`ui.css`, saved in the browser.
- Header on phones shows brand, language switch and menu. The desktop menu is hidden on phones (an overlap bug we fixed).

### 4.4 Offline support (PWA)
- **Service worker (`sw.js`)** precaches a small "app shell" (about 1.1 MB) and caches other pages the first time they are opened. Next time, they open without internet.
- **`manifest.json`** makes it installable on a phone like an app (icon, name, colours).
- **Offline queue:** actions done offline (like a registration) wait in local storage / Firestore's local cache and are sent when the connection returns.

### 4.5 Backend (Phase 2 prototype)
- **Spring Boot modular monolith:** packages for `jobs`, `quiz`, `resumes`, `schemes`, `scholarships`, `workshops`, `users`, `auth`, `admin`, `audit`.
- **Security:** stateless JWT login through Keycloak (OAuth2/OIDC), role checks (Student, Volunteer, District Admin), rate limiting (Redis counters with local fallback), ownership checks so one user cannot cancel another's booking (BOLA fix), no secrets in the repository.
- **Database:** PostgreSQL with Flyway migrations; trigram (`pg_trgm`) indexes so job search is fast.
- **Why not required by students:** the product students use is the static PWA; the backend is a prototype for future sign-in and applications.

### 4.6 Security and honesty rules built into the code
1. No invented vacancies, fees, cut-offs or phone numbers.
2. No fake impact numbers or testimonials (tests enforce this).
3. No SMS is claimed unless an SMS service exists.
4. No hard-coded password or signing key.
5. Server blocks path traversal and sets strict headers (CSP, etc.).
6. Personal data stays on the device unless the user signs in.

### 4.7 Technologies at a glance
HTML5, CSS3 (design tokens), vanilla JavaScript · Node.js 18+ · Service Worker / PWA · Web Speech API · jsPDF / browser print · Java 21, Spring Boot 3.3.5 · PostgreSQL 16, Redis 7, Keycloak 24, Flyway · Docker Compose · Firebase (Hosting, Firestore, Phone Auth) · Node test runner.

---

## Part 5 — Survey: what we did and how to explain it

### 5.1 What was the survey?
A short form filled during our village visits, alongside the longer 50-question conversation guide. It covered: age group, gender, qualification, current situation, smartphone ownership, internet use, mobile signal, Q9 can you name 3 careers, Q10 can you apply online, Q11 can you make a PDF resume, main source of information, biggest difficulty, whether you were asked to pay money for a job, Q15 whether a Telugu career website would be useful and why.

### 5.2 Who answered?
60 people: 30 students/youth and 30 villagers; 39 women, 21 men; ages from under 16 to above 60; qualifications from no schooling to degree/diploma/ITI.

### 5.3 How we analysed it (simple steps)
1. Entered each response as one row (code S01–S30 for students/youth, V01–V30 for villagers).
2. Counted Yes/No and category answers for each question.
3. Converted counts to percentages out of 60.
4. Compared students with villagers (the pattern was similar: for example 17 of 30 students/youth and 15 of 30 villagers "need full support").
5. Grouped each person into a digital-readiness level (not ready / partly ready / ready) based on what they could do on their own.
6. Looked for the biggest difficulty and the main information source.

### 5.4 Results to quote
- Own smartphone 29 (48%) · shared 15 (25%) · none 16 (27%)
- Use internet alone: yes 17 (28%) · a little 18 (30%) · no 25 (42%)
- Signal: poor 25 (42%) · sometimes 27 (45%) · good 8 (13%)
- Can name 3 careers 21 (35%) · can apply online 16 (27%) · can make PDF resume 8 (13%)
- Asked to pay money for a job: 26 (43%)
- Website useful: 54 (90%) — 52 asked for easy steps in Telugu, 6 prefer to ask family, 2 need voice help
- Information source: friends/family 21, mobile/YouTube 10, teachers 9, agents/coaching 9, no source 8, Anganwadi/ASHA 3
- Biggest difficulty: don't know what is available 21, don't know the steps 16, no device/signal 9, English 7, cost 3, low literacy 3, other 1

### 5.5 How each result shaped the project
| Finding | What we built or advise |
|---|---|
| Most don't know what is available / the steps | Roadmaps with numbered steps, time and official links |
| 87% cannot make a resume | Phone resume builder with PDF export |
| 43% asked to pay for a job | "Verify on the official website, never pay agents" messages and an apply-online guide |
| Only 48% own a phone, signal is poor | Light, offline-ready PWA; digital help point recommendation |
| Easy Telugu steps requested by 52 | Telugu first, plus voice narration |

### 5.6 Limits (say these before the examiner does)
- 60 people is small and they were reached during visits, **not randomly chosen**, so results describe these 60, not the whole village.
- It is a **baseline**; we have not measured change yet. We plan to repeat the survey after workshops.
- Answers are self-reported.
- The 50-question guide is for conversations; the survey form recorded the key answers. Question numbers like Q9, Q10, Q11, Q15 in the data come from that form.

---

## Part 6 — Viva questions and model answers

### A. Idea and motivation
**1. What is your project?**
A free, mobile-friendly, Telugu-and-English website that guides rural youth on careers, online applications, resumes, schemes, and avoiding fake job offers.

**2. Why did you choose this problem?**
In B B Gudem, young people finish 10th, Intermediate or ITI without knowing the next step. Phones exist, but clear, trustworthy, Telugu guidance does not.

**3. Why is it called Gramin Career Setu?**
"Gramin" means rural, "Career" means career, "Setu" means bridge — a bridge between rural youth and opportunities.

**4. Who is the target user?**
Students, unemployed youth and first-generation learners in villages; parents and volunteers can also use it.

**5. What makes it different from Naukri or government portals?**
It is in Telugu first, explains what to do step by step for a given qualification, works offline, never invents vacancies and links only to official sources.

**6. What is the main contribution of your team?**
We combined field listening, a survey and a working prototype tested with villagers, instead of only building an app.

**7. What is the social benefit?**
Clear next steps, a resume tool, awareness about fake offers, and a template for local youth to help others.

**8. Which SDGs does it support?**
SDG 4 (quality education), SDG 8 (decent work) and SDG 10 (reduced inequalities), as in Annexure B.

**9. Which Programme Outcomes did you cover?**
PO3 design of solutions, PO6 the engineer and society, PO8 ethics, PO10 communication (plus others in the mapping table).

### B. Community and village
**10. Tell me about the village.**
B B Gudem, Gannavaram Mandal, Krishna District: about 1,790 people, 541 households, literacy about 70.6%, over 58% of workers are agricultural labourers.

**11. How did you interact with the community?**
Village visits, conversations in simple Telugu with students, youth, parents, residents and ASHA workers, a 50-question guide, a short survey form, phone demos and follow-up visits.

**12. Why did you talk instead of only giving forms?**
Many people explain better in their own words, so we kept it informal and recorded key answers on a short survey form.

**13. How did ASHA workers help?**
They know families and public services, helped introduce us and shared what youth ask about.

**14. What problems did you find?**
Seven: scattered English information, no clear next step, difficulty applying online, no resume, fake offers and agents, limited digital access, and language/confidence gaps.

**15. What did you do in the village besides the survey?**
Awareness conversations on careers, applying online, resumes, safety against fake offers and prototype demonstrations.

**16. What was the community's reaction?**
Interactive, many questions about education and jobs, and suggestions we noted for improvement.

**17. What challenges did you face with the community?**
Shared phones, costly data, weak signal, and explaining online steps to different age groups.

### C. Survey and data
**18. What is your survey?** (see Part 5.1) A short form of key questions filled during visits with 60 people.

**19. Why 60 respondents?**
It was what we could reach properly in six weeks while keeping it balanced: 30 students/youth and 30 villagers. We call it a baseline, not a census.

**20. Is the sample random?**
No. It is a convenience sample of people we could reach. So we do not claim it represents the whole village.

**21. What are your main findings?**
73% cannot apply online, 87% cannot make a PDF resume, 43% were asked to pay money for a job, only 35% can name three careers, and 90% say a Telugu career website is useful.

**22. How did you calculate 73%?**
44 of 60 said No to applying online: 44 ÷ 60 = 73.3%.

**23. How did you calculate readiness?**
We grouped each person by what they could do on their own: 32 not ready (53%), 17 partly ready (28%), 11 ready (18%). The rounded percentages add to 99.

**24. What was the biggest difficulty?**
Not knowing what is available (35%) and not knowing the steps (27%).

**25. Did students and villagers answer differently?**
Not much. Example: 7 of 30 students/youth and 9 of 30 villagers could apply online; 17 and 15 respectively need full support.

**26. Why do people trust friends and family most?**
It is the nearest and cheapest source; 35% rely on it, 8 have no source at all. That is why we built clear official-source guidance.

**27. Your guide has 50 questions but the data shows fewer. Why?**
The 50-question guide structured the conversations (eight areas, not every question to every person). The survey form recorded the key answers for counting.

**28. What are the limitations?**
Small, non-random sample, self-reported answers, baseline only, no before/after comparison yet.

**29. How will you measure impact?**
Repeat the same survey after workshops and compare the same indicators (apply online, resume, awareness of fake offers).

**30. How do you handle privacy in the survey?**
Data is reported in groups, no names are shown in the report or slides, and the website itself keeps resume details on the user's phone.

**31. Why did your earlier report say "no formal survey"?**
The first report described the conversation phase only. The survey results were added later, and the report and slides now reflect the 60-person baseline. (Answer calmly and factually; mention the report was updated.)

**32. Are the national statistics (ASER, TRAI) your data?**
No. They are published background data. Our survey data is our own field data.

### D. Technical — frontend
**33. Which technologies did you use?** HTML, CSS, JavaScript on the phone; Node.js server; Spring Boot backend; PostgreSQL, Redis, Keycloak; Firebase for the live mobile version.

**34. Why plain JavaScript and no framework?**
Smaller downloads and faster loading on basic phones and slow networks.

**35. How does the Telugu/English switch work?**
Text elements have keys; a dictionary file contains both languages; the switch replaces text on the page instantly and remembers the choice.

**36. How does the quiz decide suggestions?**
Each answer adds weighted points to career tracks; the highest tracks are suggested. It gives guidance, not guarantees.

**37. How does the roadmap work?**
Data in `roadmaps.js` stores steps per education level and goal; the page renders those steps with time, cost and official link.

**38. How is the resume made?**
A form collects details on the phone; the engine formats it and exports a PDF in the browser; data does not need to go to a server.

**39. Why is Telugu PDF resume tricky?**
The PDF library has no Telugu font, so Telugu resumes use the browser's print-to-PDF route.

**40. What is the text-size feature?**
Four presets scale all text via one CSS variable so low-vision or older users can read comfortably.

**41. How is the mobile interface different?**
Bottom tab bar, bigger tap targets, no horizontal scroll, compact header, a "More" sheet.

**42. What bugs did you fix in the mobile UI?**
The desktop menu showed on phones and pushed the language switch off-screen; a floating text-size pill covered content; mobile-only widgets leaked on desktop; empty gaps appeared under page titles.

**43. How did you test on mobile?**
On real phones with villagers, on a slow network, and using a 390-pixel phone viewport in the browser.

### E. Offline and PWA
**44. What is a PWA?**
A website that can be installed on a phone and work offline using a service worker and a manifest.

**45. What does the service worker do?**
It stores a small app shell and caches pages when first opened so they load without internet next time.

**46. What happens when a user submits something offline?**
It is queued locally and synced when internet returns.

**47. Why offline-first?**
Many villagers have weak signal or costly data, so the app must not depend on a constant connection.

### F. Backend and security
**48. What does the backend do?**
Provides REST APIs for jobs, quizzes, resumes, schemes, workshops and users, with sign-in and roles. It is a Phase 2 prototype.

**49. What is Keycloak?**
An identity server handling login with OAuth2/OIDC and JWT tokens.

**50. What is Redis used for?**
Caching and counting requests for rate limiting.

**51. What is Flyway?**
A tool that applies versioned database changes (migrations) in order so every environment has the same schema.

**52. What is rate limiting and why?**
Limiting requests per user/IP to stop abuse; we fixed a bug where fake `X-Forwarded-For` headers could bypass it.

**53. What is BOLA / IDOR and how did you fix it?**
Broken object-level authorization: a user could cancel someone else's booking. We now check ownership.

**54. How do you protect against path traversal?**
`server.js` sanitises paths and refuses anything outside the site folder; tests check this.

**55. How do you store passwords?**
The prototype uses Keycloak for real authentication; there are no hard-coded passwords, and a test checks that.

**56. Why did you not claim an SMS code?**
There is no SMS gateway in the prototype, so the sign-up page says the code is shown on screen instead of pretending to send a message.

### G. Firebase and deployment
**57. Why Firebase?**
Free tier, Firestore offline persistence, phone OTP login and static hosting — a good fit for rural, low-connectivity users.

**58. What does Firestore offline sync do?**
Writes are kept in the device's cache and uploaded automatically when the network returns.

**59. Where is it hosted?**
Configured for Firebase Hosting at gramin-career-setu.web.app as an installable PWA. (Confirm the live status before you claim it is deployed.)

**60. Why do you still have the Spring Boot backend?**
It was our first full backend design; the Firebase plan is lighter and free to operate. Both show different ways to meet the same needs.

### H. Testing and quality
**61. How did you test?**
Automated tests with Node's test runner (all passing: 48 at last run) and manual tests on phones and slow networks.

**62. What do the tests check?**
Server security, translation coverage, roadmap rendering from data, no invented jobs or impact numbers, no hard-coded passwords, service-worker scope, mobile and Firebase files.

**63. Are these end-to-end tests?**
No. They are unit/contract and content-integrity checks, not full browser automation.

**64. How do you make sure content is correct?**
Only role types and official links are listed; fees, ages and cut-offs are not copied; links and schemes are to be re-checked every term.

### I. Ethics and honesty
**65. Does your site list real vacancies?**
No. It lists role types and links to official portals; we do not verify or host openings.

**66. Why not show success stories?**
Stories need written consent from participants; none are published yet.

**67. Why is the impact dashboard empty or baseline-only?**
Because it shows real before/after counts only; the next survey round will fill it.

**68. How do you prevent fake job scams?**
Awareness messages, an apply-online guide, "never pay an agent", and a recommendation to verify on the official site.

### J. Limitations and future work
**69. What are the main limitations?**
Small sample, prototype status, English-only PDF resume export (Telugu via print), no live vacancy data, backend not required for students.

**70. What next?**
Wider testing, more village sessions, repeat the survey to measure change, train local youth as digital helpers, add voice guidance and Telugu wording improvements.

**71. How can this scale to other villages?**
Content is data-driven (CSV and JS data files), the site is static and free to host, and the language dictionary can be extended.

**72. What future technologies could help?**
WhatsApp/SMS alerts, a voice-based Telugu assistant, peer-to-peer sync for areas with no internet.

### K. Team and learning
**73. What was your role?** (Prepare a personal answer: e.g. field visits, survey entry, frontend, backend, testing, report.)

**74. What did you learn?**
Listen first, teamwork, offline web apps, secure backends, automated testing and honest reporting.

**75. What was the biggest challenge?**
Keeping everything simple and accurate for people with shared phones and weak signal.

**76. If you had more time, what would you change?**
Survey more people randomly and repeat after workshops, and test with more age groups.

### L. Tricky questions — safe answers
**77. "Is your data real?"**
Yes, it is from our survey of 60 people in B B Gudem. We describe it as a baseline from a small, non-random sample.

**78. "Why should we trust 90% usefulness?"**
It is the share of 60 respondents who said a Telugu career website would be useful; it shows interest, not proven impact. Impact will be tested after workshops.

**79. "Did you build everything yourselves?"**
We used AI-assisted tools and libraries for parts of development, and we reviewed, tested and adapted the work. Be ready to explain any file you present. (Answer honestly about your actual process.)

**80. "What if a link on your site becomes outdated?"**
That is why we avoid copying details and recommend checking links every term against official sites.

**81. "Your first report said 44 tests, now 48?"**
We added tests when we added the mobile and Firebase work; all pass.

**82. "Why not a native Android app?"**
A PWA works on any phone, needs no store download, and updates itself — better for low storage and data.

**83. "Can an illiterate user use it?"**
Partly: Telugu text, icons and voice narration help; two survey respondents asked for voice help, and a volunteer helper or digital help point is our recommendation for the rest.

**84. "What is your next measurable goal?"**
Repeat the survey and aim for more people able to apply online and make a resume, and fewer losing money to fake offers.

---

## Part 7 — Last-minute checklist
- [ ] Batch number 14 on slide 1
- [ ] Open `http://localhost:5000` (or the live link) before presenting; keep a screenshot backup
- [ ] Know slide 8 numbers by heart (73 / 87 / 43 / 90, n = 60)
- [ ] Be able to open the report and show Chapter 5 and the table
- [ ] Say "baseline", "small sample", "not random" before being asked
- [ ] Never claim live vacancies, measured impact or success stories
