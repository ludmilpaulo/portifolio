#!/usr/bin/env node
/**
 * Local end-to-end test script.
 * Run with: node scripts/test-local.mjs
 * Requires: Backend at http://localhost:8000, Frontend at http://localhost:3000 or 3001
 */

const BACKEND = process.env.DJANGO_API_URL || 'http://localhost:8002';
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3001';

async function fetchOk(url, opts = {}) {
  const res = await fetch(url, { ...opts, redirect: 'follow' });
  if (!res.ok) throw new Error(`${url} => ${res.status}`);
  return res;
}

async function run() {
  const errors = [];
  const log = (msg, ok = true) => {
    console.log(ok ? `  ✓ ${msg}` : `  ✗ ${msg}`);
    if (!ok) errors.push(msg);
  };

  console.log('\n=== Local App Test ===\n');

  // 1. Backend: my_info
  try {
    const r = await fetchOk(`${BACKEND}/my_info/`);
    const data = await r.json();
    const hasInfo = Array.isArray(data.info) && data.info.length >= 0;
    const hasCompetences = Array.isArray(data.competences);
    const hasProjects = Array.isArray(data.projects);
    log(`Backend /my_info/ (info: ${data.info?.length ?? 0}, competences: ${data.competences?.length ?? 0}, projects: ${data.projects?.length ?? 0})`);
  } catch (e) {
    log(`Backend /my_info/ - ${e.message}`, false);
  }

  // 2. Backend: testimonials
  try {
    const r = await fetchOk(`${BACKEND}/testimonials/`);
    const data = await r.json();
    log(`Backend /testimonials/ (${Array.isArray(data) ? data.length : 0} items)`);
  } catch (e) {
    log(`Backend /testimonials/ - ${e.message}`, false);
  }

  // 3. Backend: login
  try {
    const r = await fetch(`${BACKEND}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });
    const data = await r.json();
    const ok = data.success && data.token;
    log(`Backend login (admin) - ${ok ? 'OK' : data.error || 'failed'}`, ok);
  } catch (e) {
    log(`Backend login - ${e.message}`, false);
  }

  // 4. Frontend home
  try {
    const r = await fetchOk(`${FRONTEND}/`);
    const html = await r.text();
    const hasContent = html.includes('<!') && html.length > 500;
    log(`Frontend / (${html.length} bytes)`);
  } catch (e) {
    log(`Frontend / - ${e.message}`, false);
  }

  // 5. Frontend About
  try {
    const r = await fetchOk(`${FRONTEND}/About`);
    log(`Frontend /About`);
  } catch (e) {
    log(`Frontend /About - ${e.message}`, false);
  }

  // 6. Frontend Projects
  try {
    const r = await fetchOk(`${FRONTEND}/Projects`);
    log(`Frontend /Projects`);
  } catch (e) {
    log(`Frontend /Projects - ${e.message}`, false);
  }

  // 7. GraphQL API (via Next.js) - projects
  try {
    const r = await fetch(`${FRONTEND}/api/graphql?type=projects`);
    const data = await r.json();
    const ok = data.success && Array.isArray(data.data);
    log(`API /api/graphql?type=projects - ${ok ? 'OK' : 'failed'}`, ok);
  } catch (e) {
    log(`API graphql projects - ${e.message}`, false);
  }

  // 8. Frontend Skills & Education
  try {
    const r = await fetchOk(`${FRONTEND}/Skills`);
    log(`Frontend /Skills`);
  } catch (e) {
    log(`Frontend /Skills - ${e.message}`, false);
  }
  try {
    const r = await fetchOk(`${FRONTEND}/Education`);
    log(`Frontend /Education`);
  } catch (e) {
    log(`Frontend /Education - ${e.message}`, false);
  }

  // 9. Dashboard login page
  try {
    const r = await fetchOk(`${FRONTEND}/dashboard/login`);
    log(`Frontend /dashboard/login`);
  } catch (e) {
    log(`Frontend /dashboard/login - ${e.message}`, false);
  }

  console.log('\n--- Summary ---');
  if (errors.length) {
    console.log(`Failed: ${errors.length}\n${errors.join('\n')}`);
    process.exit(1);
  }
  console.log('All checks passed.\n');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
