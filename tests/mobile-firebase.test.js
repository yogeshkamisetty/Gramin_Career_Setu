const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('tokens.css and ui.css configure universal font scaling multiplier', () => {
  const tokens = fs.readFileSync(path.join(root, 'assets', 'tokens.css'), 'utf8');
  assert.match(tokens, /--mobile-font-scale/, 'tokens.css must define --mobile-font-scale variable');
  assert.match(tokens, /calc\(.*?--mobile-font-scale.*?\)/, 'tokens.css must multiply text scale by --mobile-font-scale');

  const ui = fs.readFileSync(path.join(root, 'assets', 'ui.css'), 'utf8');
  assert.match(ui, /html\[data-font-scale="small"\]/, 'ui.css must define small font scale preset');
  assert.match(ui, /html\[data-font-scale="normal"\]/, 'ui.css must define normal font scale preset');
  assert.match(ui, /html\[data-font-scale="large"\]/, 'ui.css must define large font scale preset');
  assert.match(ui, /html\[data-font-scale="xlarge"\]/, 'ui.css must define xlarge font scale preset');
  assert.match(ui, /font-size:\s*calc\(16px\s*\*\s*var\(--mobile-font-scale,\s*1\)\)\s*!important;/, 'ui.css must scale html font-size dynamically');
});

test('app.js exports FontScaleManager and MobileUiController', () => {
  const app = fs.readFileSync(path.join(root, 'assets', 'app.js'), 'utf8');
  assert.match(app, /const FontScaleManager =/, 'app.js must implement FontScaleManager');
  assert.match(app, /const MobileUiController =/, 'app.js must implement MobileUiController');
  assert.match(app, /setFontScale:/, 'app.js must export setFontScale');
  assert.match(app, /openMoreSheet:/, 'app.js must export openMoreSheet');
});

test('dedicated mobile interface styles exist in ui.css', () => {
  const ui = fs.readFileSync(path.join(root, 'assets', 'ui.css'), 'utf8');
  assert.match(ui, /\.gcs-mobile-bottom-nav/, 'ui.css must style the mobile bottom navigation dock');
  assert.match(ui, /\.gcs-bottom-sheet/, 'ui.css must style the mobile slide-up bottom sheet');
  assert.match(ui, /\.gcs-floating-text-scaler/, 'ui.css must style the floating text sizer widget');
  assert.match(ui, /min-height:\s*48px/, 'ui.css must enforce accessible 48px touch targets for mobile buttons');
});

test('firebase module and backend architecture plan exist', () => {
  const fbConfig = fs.readFileSync(path.join(root, 'assets', 'firebase-config.js'), 'utf8');
  assert.match(fbConfig, /window\.GCS_FIREBASE/, 'firebase-config.js must export window.GCS_FIREBASE');
  assert.match(fbConfig, /enablePersistence/, 'firebase module must configure offline persistence');

  const plan = fs.readFileSync(path.join(root, 'docs', 'FIREBASE_BACKEND_PLAN.md'), 'utf8');
  assert.match(plan, /users/, 'Backend plan must document the users collection schema');
  assert.match(plan, /resumes/, 'Backend plan must document the resumes collection schema');
  assert.match(plan, /quiz_attempts/, 'Backend plan must document the quiz_attempts collection schema');
  assert.match(plan, /firestore\.rules/, 'Backend plan must specify security rules');
});

test('the on-screen phone code opens only a demo student session', () => {
  const auth = fs.readFileSync(path.join(root, 'assets', 'auth.js'), 'utf8');
  const start = auth.indexOf('async function verifyLoginOtp');
  const body = auth.slice(start, auth.indexOf('function logout', start));
  assert.ok(start > -1, 'verifyLoginOtp must exist');
  assert.match(body, /isDemoSession:\s*true/, 'on-screen code sessions must be marked as demo');
  assert.match(body, /role:\s*'student'/, 'on-screen code sessions must be student-only');
  assert.doesNotMatch(body, /existingUser|pending\.existing/, 'on-screen code must not take over an existing account');
});

test('the Firebase module has no literal code that signs anyone in', () => {
  const fb = fs.readFileSync(path.join(root, 'assets', 'firebase-config.js'), 'utf8');
  assert.doesNotMatch(fb, /123456/, 'no hardcoded OTP');
});

test('Firestore is protected by owner-only security rules', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8'));
  assert.strictEqual(cfg.firestore && cfg.firestore.rules, 'firestore.rules');
  const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');
  assert.match(rules, /match \/users\/\{userId\}/);
  assert.match(rules, /request\.auth\.uid == userId/);
  assert.doesNotMatch(rules, /match \/users[\s\S]*?allow read, write: if true/);
});

test('hosting never publishes server config or credentials', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8'));
  const ignore = cfg.hosting.ignore.join('\n');
  for (const p of ['keycloak/**', 'backend/**', 'server.js', 'docker-compose.yml', 'docs/**']) {
    assert.ok(ignore.includes(p), `firebase.json must ignore ${p}`);
  }
});

test('quiz and resume pages load the Firebase module and save to it', () => {
  for (const page of ['quiz.html', 'resume.html', 'resume-preview.html', 'dashboard.html', 'workshops.html']) {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.match(html, /assets\/firebase-config\.js/, `${page} must load firebase-config.js`);
  }
  assert.match(fs.readFileSync(path.join(root, 'quiz.html'), 'utf8'), /GCS_FIREBASE\.saveQuizAttempt\(/);
  const engine = fs.readFileSync(path.join(root, 'assets', 'resume-builder-engine.js'), 'utf8');
  assert.match(engine, /GCS_FIREBASE\.saveResume\(/);
  assert.match(engine, /GCS_FIREBASE\.loadResume\(/);
});

test('the resume builder starts on clean URLs like /resume', () => {
  const engine = fs.readFileSync(path.join(root, 'assets', 'resume-builder-engine.js'), 'utf8');
  assert.doesNotMatch(engine, /pathname\.includes\('resume(-preview)?\.html'\)/);
});

test('signing out also ends the Firebase session', () => {
  const auth = fs.readFileSync(path.join(root, 'assets', 'auth.js'), 'utf8');
  const body = auth.slice(auth.indexOf('function logout'), auth.indexOf('function syncHeaderAuthUI'));
  assert.match(body, /signOut\(/);
});
