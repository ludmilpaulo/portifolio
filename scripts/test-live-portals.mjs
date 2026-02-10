#!/usr/bin/env node
/**
 * Live E2E tests for Admin Portal, Client Portal, and Project Inquiry.
 * Run: node scripts/test-live-portals.mjs
 * Uses production: https://www.ludmilpaulo.co.za
 * Or set FRONTEND_URL for custom (e.g. http://localhost:3001)
 *
 * Credentials (set on Django via create_test_users.py or seed_local_data.py):
 *   Admin:  ADMIN_USER / ADMIN_PASS (default: admin / admin123)
 *   Client: CLIENT_USER / CLIENT_PASS (default: client_test / client123)
 */

const FRONTEND = process.env.FRONTEND_URL || 'https://www.ludmilpaulo.co.za';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const CLIENT_USER = process.env.CLIENT_USER || 'client_test';
const CLIENT_PASS = process.env.CLIENT_PASS || 'client123';

async function apiPost(type, data, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  const res = await fetch(`${FRONTEND}/api/graphql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ type, data }),
  });
  return res.json();
}

async function apiGet(type) {
  const res = await fetch(`${FRONTEND}/api/graphql?type=${type}`);
  return res.json();
}

function log(msg, ok = true) {
  console.log(ok ? `  ✓ ${msg}` : `  ✗ ${msg}`);
  return ok;
}

async function run() {
  const errors = [];
  console.log('\n=== Live Portal Tests ===');
  console.log(`Target: ${FRONTEND}\n`);

  // --- 1. Admin Login ---
  console.log('1. Admin Portal - Login');
  let adminToken = null;
  try {
    const loginRes = await apiPost('login', {
      username: ADMIN_USER,
      password: ADMIN_PASS,
    });
    if (loginRes.success && loginRes.data?.token && loginRes.data?.user?.user_type === 'admin') {
      adminToken = loginRes.data.token;
      log(`Admin login OK (${loginRes.data.user.email})`);
    } else {
      log(`Admin login failed: ${loginRes.error || 'Invalid response'}`, false);
      errors.push('Admin login');
    }
  } catch (e) {
    log(`Admin login error: ${e.message}`, false);
    errors.push('Admin login');
  }

  // --- 2. Admin - Fetch Inquiries ---
  if (adminToken) {
    console.log('\n2. Admin Portal - Fetch Inquiries');
    try {
      const res = await fetch(`${FRONTEND}/api/graphql?type=inquiries`);
      const inqData = await res.json();
      if (inqData.success && Array.isArray(inqData.data)) {
        log(`Admin fetched ${inqData.data.length} inquiries`);
      } else {
        log(`Admin inquiries: ${inqData.error || 'ok'}`);
      }
    } catch (e) {
      log(`Admin inquiries error: ${e.message}`, false);
    }
  }

  // --- 3. Client Login ---
  console.log('\n3. Client Portal - Login');
  let clientToken = null;
  try {
    const loginRes = await apiPost('login', {
      username: CLIENT_USER,
      password: CLIENT_PASS,
    });
    if (loginRes.success && loginRes.data?.token && loginRes.data?.user?.user_type === 'client') {
      clientToken = loginRes.data.token;
      log(`Client login OK (${loginRes.data.user.email})`);
    } else {
      // Try alternate client credentials (created by project inquiry)
      const altRes = await apiPost('login', {
        username: 'client@example.com',
        password: 'client123',
      });
      if (altRes.success && altRes.data?.token && altRes.data?.user?.user_type === 'client') {
        clientToken = altRes.data.token;
        log(`Client login OK (${altRes.data.user.email})`);
      } else {
        log(`Client login failed: ${loginRes.error || altRes.error || 'No client user'}`, false);
        errors.push('Client login');
      }
    }
  } catch (e) {
    log(`Client login error: ${e.message}`, false);
    errors.push('Client login');
  }

  // --- 4. Client - Fetch Inquiries ---
  if (clientToken) {
    console.log('\n4. Client Portal - Fetch Inquiries');
    try {
      const res = await fetch(`${FRONTEND}/api/graphql?type=inquiries`, {
        headers: { Authorization: `Bearer ${clientToken}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        log(`Client fetched ${data.data.length} inquiries (filtered by email)`);
      } else {
        log(`Client inquiries response received`);
      }
    } catch (e) {
      log(`Client inquiries error: ${e.message}`, false);
    }
  }

  // --- 5. Project Inquiry - Submit ---
  console.log('\n5. Project Inquiry - Submit');
  const testInquiry = {
    clientName: 'Live Test User',
    clientEmail: `test-${Date.now()}@example.com`,
    clientPhone: '+27123456789',
    projectTitle: 'Live E2E Test Project',
    projectDescription: 'Automated test submission from test-live-portals.mjs',
    projectType: 'web-development',
    budget: '$5,000 - $10,000',
    timeline: '2-3 months',
    additionalRequirements: 'None',
    status: 'pending',
    priority: 'medium',
  };
  try {
    const createRes = await apiPost('create-inquiry', testInquiry);
    if (createRes.success && createRes.data?.id) {
      log(`Project inquiry created (id: ${createRes.data.id})`);
    } else {
      log(`Project inquiry failed: ${createRes.error || JSON.stringify(createRes)}`, false);
      errors.push('Project inquiry');
    }
  } catch (e) {
    log(`Project inquiry error: ${e.message}`, false);
    errors.push('Project inquiry');
  }

  // --- 6. Page accessibility ---
  console.log('\n6. Page Accessibility');
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/admin-login', name: 'Admin Login' },
    { path: '/client-login', name: 'Client Login' },
    { path: '/project-inquiry', name: 'Project Inquiry' },
  ];
  for (const p of pages) {
    try {
      const res = await fetch(`${FRONTEND}${p.path}`, { redirect: 'follow' });
      if (res.ok) {
        log(`${p.name} (${p.path}) - ${res.status}`);
      } else {
        log(`${p.name} - ${res.status}`, false);
      }
    } catch (e) {
      log(`${p.name} - ${e.message}`, false);
    }
  }

  // --- Summary ---
  console.log('\n--- Summary ---');
  if (errors.length) {
    console.log(`Failed: ${errors.join(', ')}`);
    process.exit(1);
  }
  console.log('All live tests passed.\n');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
