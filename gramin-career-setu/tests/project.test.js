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


