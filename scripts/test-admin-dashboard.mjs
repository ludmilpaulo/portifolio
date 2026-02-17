#!/usr/bin/env node
/**
 * Admin Dashboard integration smoke test
 * - login (admin)
 * - GET analytics
 * - GET projects and verify shape expected by /dashboard/projects
 */

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

function fail(msg) {
  console.error(`\n[FAIL] ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`  [OK] ${msg}`);
}

async function post(type, data, token) {
  const res = await fetch(`${FRONTEND}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ type, data }),
  });
  const json = await res.json().catch(() => null);
  return { res, json };
}

async function get(type, token) {
  const res = await fetch(`${FRONTEND}/api/graphql?type=${encodeURIComponent(type)}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json().catch(() => null);
  return { res, json };
}

async function run() {
  console.log('\n=== Admin Dashboard Integration Test ===\n');
  console.log(`Target: ${FRONTEND}`);

  // 1) login as admin
  console.log('\n1) Admin login');
  const login = await post('login', { username: 'admin', password: 'admin123' });
  if (!login.json?.success) fail(`login failed: ${login.json?.error || login.res.status}`);
  const token = login.json.data?.token;
  const user = login.json.data?.user;
  if (!token) fail('login succeeded but token missing');
  ok(`login OK (${user?.email || 'no-email'})`);

  // 2) analytics
  console.log('\n2) Fetch analytics');
  const analytics = await get('analytics', token);
  if (!analytics.json?.success) fail(`analytics failed: ${analytics.json?.error || analytics.res.status}`);
  const a = analytics.json.data || {};
  const aKeys = ['totalViews', 'uniqueVisitors', 'projects', 'testimonials', 'viewsChange', 'visitorsChange', 'projectsChange', 'testimonialsChange'];
  const missingA = aKeys.filter((k) => a[k] === undefined);
  if (missingA.length) fail(`analytics missing keys: ${missingA.join(', ')}`);
  ok('analytics shape OK');

  // 3) projects
  console.log('\n3) Fetch projects');
  const projects = await get('projects', token);
  if (!projects.json?.success) fail(`projects failed: ${projects.json?.error || projects.res.status}`);
  if (!Array.isArray(projects.json.data)) fail('projects data is not array');
  ok(`received ${projects.json.data.length} projects`);

  if (projects.json.data.length) {
    const p = projects.json.data[0];
    const pKeys = ['id', 'title', 'description', 'image', 'status', 'technologies', 'createdAt', 'updatedAt', 'url', 'githubUrl'];
    const missingP = pKeys.filter((k) => p?.[k] === undefined);
    if (missingP.length) fail(`project missing keys: ${missingP.join(', ')}`);
    if (!Array.isArray(p.technologies)) fail('project.technologies is not array');
    if (!['live', 'upcoming', 'in-progress', 'clone'].includes(p.status)) fail(`unexpected project.status: ${p.status}`);
    ok('project shape OK');
  }

  console.log('\n--- Summary ---');
  console.log('Admin dashboard backend integration looks good.');
}

run().catch((e) => fail(e?.message || String(e)));
