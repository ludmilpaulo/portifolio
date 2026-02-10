#!/usr/bin/env node
/**
 * Local test - hits Django backend directly (bypasses Next.js).
 * Use when Next.js has issues. Requires Django running:
 *   cd ludmilportifolio && python manage.py runserver 8002 --settings=ludmilportifolio.settings_local
 *
 * Run: node scripts/test-local-direct.mjs
 */

const BACKEND = process.env.DJANGO_API_URL || 'http://localhost:8002';

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

  console.log('\n=== Local Direct Test (Django Backend) ===\n');
  console.log(`Backend: ${BACKEND}\n`);

  // 1. my_info
  try {
    const r = await fetchOk(`${BACKEND}/my_info/`);
    const data = await r.json();
    log(`/my_info/ (info: ${data.info?.length ?? 0}, projects: ${data.projects?.length ?? 0})`);
  } catch (e) {
    log(`/my_info/ - ${e.message}`, false);
  }

  // 2. testimonials
  try {
    const r = await fetchOk(`${BACKEND}/testimonials/`);
    const data = await r.json();
    log(`/testimonials/ (${Array.isArray(data) ? data.length : 0} items)`);
  } catch (e) {
    log(`/testimonials/ - ${e.message}`, false);
  }

  // 3. Admin login
  try {
    const r = await fetch(`${BACKEND}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });
    const data = await r.json();
    const ok = data.success && data.token;
    log(`Admin login - ${ok ? 'OK' : data.error || 'failed'}`, ok);
  } catch (e) {
    log(`Admin login - ${e.message}`, false);
  }

  // 4. Client login
  try {
    const r = await fetch(`${BACKEND}/accounts/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'client_test', password: 'client123' }),
    });
    const data = await r.json();
    const ok = data.success && data.token;
    log(`Client login - ${ok ? 'OK' : data.error || 'failed'}`, ok);
  } catch (e) {
    log(`Client login - ${e.message}`, false);
  }

  // 5. Project inquiry
  const inquiry = {
    clientName: 'Local Test User',
    clientEmail: `test-${Date.now()}@example.com`,
    clientPhone: '+27123456789',
    projectTitle: 'Local E2E Test',
    projectDescription: 'Automated test',
    projectType: 'web-development',
    budget: '$5,000 - $10,000',
    timeline: '2-3 months',
    additionalRequirements: '',
    status: 'pending',
    priority: 'medium',
  };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const r = await fetch(`${BACKEND}/api/create-project-inquiry/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await r.json();
    const ok = data.success && data.data?.id;
    log(`Project inquiry - ${ok ? 'OK' : data.error || 'failed'}`, ok);
  } catch (e) {
    log(`Project inquiry - ${e.message}`, false);
  }

  // 6. Get inquiries
  try {
    const r = await fetchOk(`${BACKEND}/api/get-project-inquiries/`);
    const data = await r.json();
    log(`Get inquiries (${data.data?.length ?? 0} items)`);
  } catch (e) {
    log(`Get inquiries - ${e.message}`, false);
  }

  console.log('\n--- Summary ---');
  if (errors.length) {
    console.log(`Failed: ${errors.join(', ')}`);
    process.exit(1);
  }
  console.log('All backend tests passed.\n');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
