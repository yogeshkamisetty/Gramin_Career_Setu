const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { once } = require('node:events');
const { spawn } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const port = 5178;
let serverProcess;

function request(requestPath) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port, path: requestPath, method: 'GET' }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      await request('/index.html');
      return;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  throw new Error('server did not start');
}

test.before(async () => {
  serverProcess = spawn(process.execPath, ['server.js'], {
    cwd: root,
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore'
  });
  await waitForServer();
});

test.after(() => {
  if (serverProcess && !serverProcess.killed) serverProcess.kill();
});

test('serves the application entry point', async () => {
  const response = await request('/');
  assert.equal(response.status, 200);
  assert.match(response.body, /Gramin Career Setu/i);
});

test('returns the custom 404 page for missing files', async () => {
  const response = await request('/does-not-exist');
  assert.equal(response.status, 404);
  assert.match(response.body, /404/i);
});

test('rejects encoded path traversal', async () => {
  const response = await request('/%2e%2e/server.js');
  assert.equal(response.status, 403);
  assert.doesNotMatch(response.body, /const http = require/);
});

test('returns 400 for malformed URL encoding and stays alive', async () => {
  const response = await request('/%E0%A4%A');
  assert.equal(response.status, 400);
  const health = await request('/index.html');
  assert.equal(health.status, 200);
});

test('jobs page has working query/category/pagination implementation', () => {
  const jobs = fs.readFileSync(path.join(root, 'jobs.html'), 'utf8');
  assert.match(jobs, /params\.get\('q'\)/);
  assert.match(jobs, /const category = document\.getElementById\('jobCatSelect'\)\.value/);
  assert.match(jobs, /renderPagination\(pageCount\)/);
  assert.match(jobs, /id="jobsPagination"/);
});

test('resume objective limit is enforced in markup and initialization', () => {
  const resume = fs.readFileSync(path.join(root, 'resume.html'), 'utf8');
  const engine = fs.readFileSync(path.join(root, 'assets', 'resume-builder-engine.js'), 'utf8');
  assert.match(resume, /id="inputObjective"[^>]*maxlength="200"/);
  assert.match(engine, /String\(data\.objective \|\| ''\)\.slice\(0, 200\)/);
});

test('serves assets/api.js with GCS_API client', async () => {
  const response = await request('/assets/api.js');
  assert.equal(response.status, 200);
  assert.match(response.body, /GCS_API/);
  assert.match(response.body, /offlineQueue/);
});

test('handles /api/v1/ reverse proxy gracefully', async () => {
  const response = await request('/api/v1/jobs');
  assert.ok(response.status === 200 || response.status === 503, `Expected status 200 or 503, got ${response.status}`);
  if (response.status === 200) {
    assert.match(response.body, /"success"\s*:\s*true/);
  } else {
    assert.match(response.body, /offline fallback active/);
  }
});

test('service worker caches assets/api.js for offline operation', () => {
  const sw = fs.readFileSync(path.join(root, 'assets', 'sw.js'), 'utf8');
  assert.match(sw, /\.\/assets\/api\.js/);
  assert.match(sw, /gcs-cache-v14/);
});

test('GCS_API contains quiz, scholarships, and schemes modules', async () => {
  const response = await request('/assets/api.js');
  assert.equal(response.status, 200);
  assert.match(response.body, /quiz:\s*\{/);
  assert.match(response.body, /scholarships:\s*\{/);
  assert.match(response.body, /schemes:\s*\{/);
});

test('quiz, scholarships, and schemes pages link assets/api.js', () => {
  const quiz = fs.readFileSync(path.join(root, 'quiz.html'), 'utf8');
  const scholarships = fs.readFileSync(path.join(root, 'scholarships.html'), 'utf8');
  const schemes = fs.readFileSync(path.join(root, 'schemes.html'), 'utf8');

  assert.match(quiz, /<script src="assets\/api\.js"/);
  assert.match(scholarships, /<script src="assets\/api\.js"/);
  assert.match(schemes, /<script src="assets\/api\.js"/);
});

test('GCS_API supports workshop cancellation and protects offline PII', () => {
  const api = fs.readFileSync(path.join(root, 'assets', 'api.js'), 'utf8');
  assert.match(api, /cancel\(workshopId,\s*\{\s*phone\s*\}\)/);
  assert.match(api, /_protect\(payload\)/);
  assert.match(api, /_unprotect\(payload\)/);
  assert.match(api, /__enc_/);
});

test('GCS_AUTH supports OIDC PKCE flow and distinguishes demo sessions', () => {
  const auth = fs.readFileSync(path.join(root, 'assets', 'auth.js'), 'utf8');
  assert.match(auth, /OIDC_CONFIG/);
  assert.match(auth, /loginWithOidc/);
  assert.match(auth, /handleOidcCallback/);
  assert.match(auth, /refreshToken/);
  assert.match(auth, /isDemoSession:\s*true/);
});

test('actions and login synchronize with OIDC and backend cancellation', () => {
  const actions = fs.readFileSync(path.join(root, 'assets', 'actions.js'), 'utf8');
  const login = fs.readFileSync(path.join(root, 'login.html'), 'utf8');
  assert.match(actions, /GCS_API\.workshops\.cancel/);
  assert.match(login, /loginWithOidc\(\)/);
});

test('serves production security headers on HTTP responses', async () => {
  const response = await request('/index.html');
  assert.equal(response.status, 200);
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['x-frame-options'], 'SAMEORIGIN');
  assert.match(response.headers['content-security-policy'], /default-src 'self'/);
});

test('resumes API client sends structured { resumeJson } payload', () => {
  const api = fs.readFileSync(path.join(root, 'assets', 'api.js'), 'utf8');
  assert.match(api, /body:\s*JSON\.stringify\(\{\s*resumeJson:\s*jsonString\s*\}\)/);
});

test('V5 migration uses portable composite indexes, not pg_trgm', () => {
  const v5Path = path.join(root, 'backend', 'src', 'main', 'resources', 'db', 'migration', 'V5__job_search_trigram_and_quiz_indexes.sql');
  assert.ok(fs.existsSync(v5Path), 'V5 migration file must exist');
  const v5Sql = fs.readFileSync(v5Path, 'utf8');
  // Portable B-tree indexes only: this migration also runs against MySQL and
  // H2, where a Postgres pg_trgm GIN index would fail outright.
  assert.match(v5Sql, /idx_quiz_user_created/i);
  assert.match(v5Sql, /idx_resumes_user_updated/i);
  assert.match(v5Sql, /idx_jobs_title_en/i);
  assert.doesNotMatch(v5Sql, /pg_trgm/i, 'V5 must stay portable across MySQL and H2');
});

test('actuator configuration isolates liveness probe from external dependencies', () => {
  const appYml = fs.readFileSync(path.join(root, 'backend', 'src', 'main', 'resources', 'application.yml'), 'utf8');
  const prodYml = fs.readFileSync(path.join(root, 'backend', 'src', 'main', 'resources', 'application-prod.yml'), 'utf8');
  assert.match(appYml, /liveness:\s*\n\s*include:\s*livenessState/);
  assert.match(prodYml, /liveness:\s*\n\s*include:\s*livenessState/);
  assert.match(prodYml, /readiness:\s*\n\s*include:\s*readinessState,db,redis,diskSpace/);
});



// ── Content integrity ──────────────────────────────────────────────────────
// These guard the Phase A cleanup: the project must not reintroduce invented
// job listings, impact statistics or testimonials, because its Community
// Service Project assessment rests on what it claims about real people.

test('job data is generated from data/jobs.csv and stays in sync with it', () => {
  const csv = fs.readFileSync(path.join(root, 'data', 'jobs.csv'), 'utf8');
  const csvRows = csv.trim().split(/\r?\n/).length - 1; // minus the header

  const dataJs = fs.readFileSync(path.join(root, 'data', 'jobs-data.js'), 'utf8');
  assert.match(dataJs, /GENERATED FILE/, 'jobs-data.js must declare that it is generated');

  const scope = {};
  new Function('window', dataJs)(scope);
  assert.ok(Array.isArray(scope.GCS_JOBS), 'jobs-data.js must define window.GCS_JOBS');
  assert.equal(scope.GCS_JOBS.length, csvRows,
    'jobs-data.js is stale — run: node scripts/build-jobs-data.js');

  for (const job of scope.GCS_JOBS) {
    assert.ok(job.titleTe && job.titleEn, `${job.id} needs both Telugu and English titles`);
    assert.ok(job.qualification, `${job.id} must state who can apply`);
    assert.match(job.applyUrl, /^https:\/\//, `${job.id} must link to an official https portal`);
    assert.ok(Array.isArray(job.eligibleLevels) && job.eligibleLevels.length,
      `${job.id} must be reachable by at least one education level`);
  }
});

test('a 10th-pass student is shown roles they are actually eligible for', () => {
  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'jobs-data.js'), 'utf8'))(scope);
  const forTenth = scope.GCS_JOBS.filter(j => j.eligibleLevels.includes('10th'));
  assert.ok(forTenth.length >= 5,
    `only ${forTenth.length} roles open to a 10th-pass student; the target user must not hit a dead end`);
});

test('no fabricated employer listings remain in the shipped job data', () => {
  const invented = /Tata Consultancy|Infosys Limited|Wipro Limited|Accenture Solutions|Zoho Corporation/i;
  for (const file of ['data/jobs-data.js', 'data/jobs.csv', 'assets/app.js', 'jobs.html']) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(text, invented, `${file} must not carry invented listings for real employers`);
  }
});

test('impact dashboard has no hardcoded statistics and ships without survey data', () => {
  const page = fs.readFileSync(path.join(root, 'results.html'), 'utf8');
  assert.doesNotMatch(page, /5,758|1,102|2,458|1,356|Lives Impacted|Top Reached Villages/i,
    'results.html must not reintroduce invented impact figures');
  assert.match(page, /data\/survey-data\.js/, 'results.html must render from the survey data file');

  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'survey-data.js'), 'utf8'))(scope);
  const survey = scope.GCS_SURVEY;
  assert.ok(survey, 'survey-data.js must define window.GCS_SURVEY');
  assert.equal(survey.metrics.length, 3, 'the three problem-statement metrics must be present');

  // Either no survey has been run (every metric empty), or one has been run
  // and every metric is complete. A half-filled file would render a partial
  // comparison that reads as a result.
  const filled = survey.metrics.filter(m =>
    typeof m.beforeYes === 'number' && typeof m.afterYes === 'number' && typeof m.respondents === 'number');
  if (survey.status === 'collected') {
    assert.equal(filled.length, 3, 'status is "collected" but some metrics have no responses');
    for (const m of survey.metrics) {
      assert.ok(m.respondents > 0, `${m.id} must have respondents`);
      assert.ok(m.beforeYes <= m.respondents && m.afterYes <= m.respondents,
        `${m.id} cannot have more yes answers than respondents`);
    }
  } else {
    assert.equal(filled.length, 0, 'status is "pending" but metrics carry numbers');
  }
});

test('no named testimonial is presented as a real participant', () => {
  const named = /Sandeep Kumar|Lalitha Kumari|Ramesh Babu|openStoryVideo/;
  for (const file of ['index.html', 'stories.html', 'assets/landing.js']) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const body = text.replace(/<!--[\s\S]*?-->/g, ''); // explanatory comments may name what was removed
    assert.doesNotMatch(body, named, `${file} must not present invented success stories`);
  }
});

test('workshop registration never invents a name or phone number', () => {
  const actions = fs.readFileSync(path.join(root, 'assets', 'actions.js'), 'utf8');
  // Comment lines may name the placeholders that were removed, so judge the code only.
  const code = actions.split(/\r?\n/).filter(l => !l.trim().startsWith('//')).join('\n');
  assert.doesNotMatch(code, /'9876543210'|'Registered Scholar'/,
    'registrations must only reach the backend with the student’s real details');
  assert.match(actions, /canSync/, 'registration sync must be gated on having real details');
});

// ── Career roadmaps ────────────────────────────────────────────────────────

test('every roadmap step answers the six questions, in both languages', () => {
  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'roadmaps.js'), 'utf8'))(scope);
  const data = scope.GCS_ROADMAPS;
  assert.ok(Array.isArray(data.goals) && data.goals.length, 'roadmaps.js must define goals');

  const LEVELS = ['below10', '10th', 'inter', 'iti', 'degree'];
  for (const goal of data.goals) {
    assert.ok(goal.realityEn && goal.realityTe, `${goal.id} must state the honest picture in both languages`);
    assert.ok(goal.steps.length, `${goal.id} must have steps`);
    for (const step of goal.steps) {
      assert.ok(LEVELS.includes(step.fromLevel), `${goal.id}/${step.id} has an unknown fromLevel`);
      for (const f of ['titleEn', 'titleTe', 'whatEn', 'whatTe', 'durationEn', 'durationTe',
                       'costEn', 'costTe', 'officialName', 'officialUrl', 'verifyEn', 'verifyTe']) {
        assert.ok(step[f], `${goal.id}/${step.id} is missing ${f}`);
      }
      assert.ok(step.howEn.length && step.howTe.length, `${goal.id}/${step.id} needs how-to steps`);
      assert.equal(step.howEn.length, step.howTe.length,
        `${goal.id}/${step.id} has a different number of how-to steps in each language`);
      assert.match(step.officialUrl, /^https:\/\//, `${goal.id}/${step.id} must link to an https official source`);
    }
  }
});

test('roadmaps encode no volatile figures that would go stale', () => {
  // Age limits, fees, vacancy counts and physical standards change with every
  // recruitment notification and differ between posts in the same one. Nobody
  // maintains this file after handover, so a number here becomes wrong and
  // misleads a student. The roadmap links to the official portal instead.
  const raw = fs.readFileSync(path.join(root, 'data', 'roadmaps.js'), 'utf8');
  const code = raw.split(/\r?\n/).filter(l => !l.trim().startsWith('*') && !l.trim().startsWith('//')).join('\n');
  const volatile = [
    [/age limit (is|of|:)\s*\d/i, 'a specific age limit'],
    [/\b(aged|age)\s+\d{2}\s*(to|-|–)\s*\d{2}/i, 'an age band'],
    [/₹\s?\d/, 'a rupee amount'],
    [/\b\d+\s*vacanc/i, 'a vacancy count'],
    [/cut-?off\s+(marks?|rank)\s+(is|of|:)\s*\d/i, 'a cut-off figure'],
    [/\b\d{2,3}\s?cm\b/i, 'a physical measurement']
  ];
  for (const [re, what] of volatile) {
    assert.doesNotMatch(code, re, `data/roadmaps.js must not hardcode ${what}`);
  }
});

test('a 10th-pass student gets a path that starts where they are', () => {
  const scope = {};
  new Function('window', fs.readFileSync(path.join(root, 'data', 'roadmaps.js'), 'utf8'))(scope);
  const RANK = { below10: 0, '10th': 1, inter: 2, iti: 2, degree: 3 };

  for (const goal of scope.GCS_ROADMAPS.goals) {
    // Every goal must be reachable from 10th: either a step they can begin
    // now, or an alternative route open to them. Otherwise a 10th-pass
    // student picking this goal hits a dead end, which is the exact failure
    // this page was rebuilt to remove.
    const reachableStep = goal.steps.some(s => RANK[s.fromLevel] <= RANK['10th']);
    const reachableAlt = (goal.alternatives || []).some(a => RANK[a.fromLevel] <= RANK['10th']);
    assert.ok(reachableStep || reachableAlt,
      `${goal.id} offers a 10th-pass student nothing to start`);
  }
});

test('roadmap page renders from the data file and not from hardcoded markup', () => {
  const page = fs.readFileSync(path.join(root, 'roadmap.html'), 'utf8');
  assert.match(page, /data\/roadmaps\.js/, 'roadmap.html must load the roadmap data');
  assert.match(page, /GCS_ROADMAPS/, 'roadmap.html must render from GCS_ROADMAPS');
  assert.doesNotMatch(page, /B\.Tech in CSE|Top Career Options in Software/,
    'the fixed B.Tech-CSE path must not return');
});

test('quiz results lead into the roadmap instead of inventing match scores', () => {
  const page = fs.readFileSync(path.join(root, 'quiz-results.html'), 'utf8');
  const body = page.replace(/<!--[\s\S]*?-->/g, '');
  assert.doesNotMatch(body, /Cyber Security Analyst|Data Scientist|Database Administrator/,
    'quiz results must not recommend IT careers the quiz never measured');
  assert.doesNotMatch(body, /\b(92|85|81|76|75|70)%\s*Match/i,
    'match percentages must come from the quiz, not from the markup');
  assert.match(body, /resultRoadmapLink/, 'quiz results must link into the roadmap');
});
