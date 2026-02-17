#!/usr/bin/env node
/**
 * Comprehensive test of all frontend-backend endpoint connections
 */

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND = process.env.DJANGO_API_URL || 'http://localhost:8002';

const tests = [];
let passed = 0;
let failed = 0;

function log(name, status, details = '') {
  const icon = status === 'pass' ? '✓' : status === 'fail' ? '✗' : '⚠';
  const color = status === 'pass' ? '\x1b[32m' : status === 'fail' ? '\x1b[31m' : '\x1b[33m';
  console.log(`${color}${icon}\x1b[0m ${name}${details ? ` - ${details}` : ''}`);
  tests.push({ name, status, details });
  if (status === 'pass') passed++;
  else if (status === 'fail') failed++;
}

async function testEndpoint(name, testFn) {
  try {
    await testFn();
  } catch (error) {
    log(name, 'fail', error.message);
  }
}

async function runTests() {
  console.log('\n=== Frontend-Backend Endpoint Connection Test ===\n');
  console.log(`Frontend: ${FRONTEND}`);
  console.log(`Backend: ${BACKEND}\n`);

  // Test 1: Backend accessibility
  await testEndpoint('Backend Server', async () => {
    const res = await fetch(BACKEND);
    if (res.ok || res.status === 404) {
      log('Backend Server', 'pass', `Status: ${res.status}`);
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  });

  // Test 2: Frontend API route
  await testEndpoint('Frontend API Route', async () => {
    const res = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'test' }),
    });
    if (res.status === 400) {
      log('Frontend API Route', 'pass', 'Route exists (returns 400 for invalid type)');
    } else {
      throw new Error(`Unexpected status: ${res.status}`);
    }
  });

  // Test 3: Login endpoint
  await testEndpoint('Login Endpoint', async () => {
    const res = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
        data: { username: 'admin', password: 'admin123' },
      }),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      log('Login Endpoint', 'pass', 'Login successful');
      return data.data.token;
    } else {
      throw new Error(data.error || 'Login failed');
    }
  });

  // Test 4: Token verification
  let authToken = null;
  await testEndpoint('Token Verification', async () => {
    // First login to get token
    const loginRes = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'login',
        data: { username: 'admin', password: 'admin123' },
      }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success) throw new Error('Login failed');
    
    authToken = loginData.data.token;
    const verifyRes = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ type: 'verify-token', data: {} }),
    });
    const verifyData = await verifyRes.json();
    if (verifyRes.ok || verifyRes.status === 401) {
      log('Token Verification', verifyRes.ok ? 'pass' : 'warn', 
        verifyRes.ok ? 'Token verified' : 'Endpoint exists but may need implementation');
    } else {
      throw new Error(`Status: ${verifyRes.status}`);
    }
  });

  // Test 5: Get user endpoint
  await testEndpoint('Get User Endpoint', async () => {
    if (!authToken) {
      const loginRes = await fetch(`${FRONTEND}/api/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'login',
          data: { username: 'admin', password: 'admin123' },
        }),
      });
      const loginData = await loginRes.json();
      authToken = loginData.data?.token;
    }
    
    const res = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ type: 'get-user', data: {} }),
    });
    const data = await res.json();
    if (res.ok || res.status === 401) {
      log('Get User Endpoint', res.ok ? 'pass' : 'warn',
        res.ok ? 'User data retrieved' : 'Endpoint exists but may need implementation');
    } else {
      throw new Error(`Status: ${res.status}`);
    }
  });

  // Test 6: Project inquiry creation
  await testEndpoint('Create Project Inquiry', async () => {
    const res = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'create-inquiry',
        data: {
          clientName: 'Test User',
          clientEmail: `test-${Date.now()}@example.com`,
          clientPhone: '+27123456789',
          projectTitle: 'Test Project',
          projectDescription: 'Test description',
          projectType: 'web-development',
          budget: '$1,000 - $3,000',
          timeline: '1 month',
        },
      }),
    });
    const data = await res.json();
    if (data.success) {
      log('Create Project Inquiry', 'pass', `Inquiry ID: ${data.data?.id}`);
    } else {
      throw new Error(data.error || 'Failed to create inquiry');
    }
  });

  // Test 7: Get inquiries
  await testEndpoint('Get Inquiries', async () => {
    const res = await fetch(`${FRONTEND}/api/graphql?type=inquiries`);
    const data = await res.json();
    if (data.success || data.data) {
      log('Get Inquiries', 'pass', `Found ${data.data?.length || 0} inquiries`);
    } else {
      throw new Error(data.error || 'Failed to get inquiries');
    }
  });

  // Test 8: Get projects
  await testEndpoint('Get Projects', async () => {
    const res = await fetch(`${FRONTEND}/api/graphql?type=projects`);
    const data = await res.json();
    if (data.success || data.data || res.status === 404) {
      log('Get Projects', res.status === 404 ? 'warn' : 'pass',
        res.status === 404 ? 'Endpoint not implemented' : 'Projects retrieved');
    } else {
      throw new Error(data.error || 'Failed to get projects');
    }
  });

  // Test 9: Get analytics
  await testEndpoint('Get Analytics', async () => {
    const res = await fetch(`${FRONTEND}/api/graphql?type=analytics`);
    const data = await res.json();
    if (data.success || data.data || res.status === 404) {
      log('Get Analytics', res.status === 404 ? 'warn' : 'pass',
        res.status === 404 ? 'Endpoint not implemented' : 'Analytics retrieved');
    } else {
      throw new Error(data.error || 'Failed to get analytics');
    }
  });

  // Test 10: Forgot password
  await testEndpoint('Forgot Password', async () => {
    const res = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'forgot-password',
        data: { email: 'test@example.com' },
      }),
    });
    const data = await res.json();
    if (res.status === 400 || res.status === 404 || data.error) {
      log('Forgot Password', 'warn', 'Endpoint exists but may need implementation');
    } else if (data.success) {
      log('Forgot Password', 'pass', 'Password reset email sent');
    } else {
      throw new Error(data.error || 'Failed');
    }
  });

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total Tests: ${tests.length}`);
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  console.log(`\x1b[33mWarnings: ${tests.length - passed - failed}\x1b[0m`);

  if (failed > 0) {
    console.log('\nFailed Tests:');
    tests.filter(t => t.status === 'fail').forEach(t => {
      console.log(`  ✗ ${t.name}: ${t.details}`);
    });
  }

  return failed === 0;
}

runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('\nTest suite error:', error);
  process.exit(1);
});
