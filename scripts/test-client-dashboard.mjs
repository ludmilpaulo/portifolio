#!/usr/bin/env node
/**
 * Client Dashboard integration smoke test
 * - login (client)
 * - GET inquiries via /api/graphql?type=inquiries
 * - assert camelCase fields exist
 * - POST add-message
 * - refetch inquiries and confirm message present
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
  console.log('\n=== Client Dashboard Integration Test ===\n');
  console.log(`Target: ${FRONTEND}`);

  // 1) login as client
  console.log('\n1) Client login');
  const login = await post('login', { username: 'client_test', password: 'client123' });
  if (!login.json?.success) fail(`login failed: ${login.json?.error || login.res.status}`);
  const token = login.json.data?.token;
  const user = login.json.data?.user;
  if (!token) fail('login succeeded but token missing');
  ok(`login OK (${user?.email || 'no-email'})`);

  // 2) fetch inquiries
  console.log('\n2) Fetch inquiries');
  const inq = await get('inquiries', token);
  if (!inq.json?.success) fail(`get inquiries failed: ${inq.json?.error || inq.res.status}`);
  if (!Array.isArray(inq.json.data)) fail('inquiries response data is not an array');
  ok(`received ${inq.json.data.length} inquiries`);

  // 3) verify camelCase fields
  console.log('\n3) Verify inquiry shape (camelCase)');
  const sample = inq.json.data[0];
  const required = [
    'id',
    'clientEmail',
    'clientName',
    'projectTitle',
    'projectDescription',
    'budget',
    'timeline',
    'status',
    'priority',
    'createdAt',
    'updatedAt',
    'messages',
    'tasks',
    'invoices',
    'documents',
  ];
  const missing = required.filter((k) => sample?.[k] === undefined);
  if (missing.length) {
    fail(`inquiry missing fields: ${missing.join(', ')} (got keys: ${Object.keys(sample || {}).join(', ')})`);
  }
  ok('camelCase inquiry fields present');
  if (!Array.isArray(sample.messages)) fail('messages is not an array');
  if (!Array.isArray(sample.tasks)) fail('tasks is not an array');
  if (!Array.isArray(sample.invoices)) fail('invoices is not an array');
  if (!Array.isArray(sample.documents)) fail('documents is not an array');
  ok('messages/tasks/invoices/documents are arrays');

  // Optional deep-shape checks if nested data exists
  if (sample.tasks.length) {
    const t = sample.tasks[0];
    const taskKeys = ['id', 'title', 'description', 'status', 'assignedTo', 'dueDate', 'createdAt', 'priority'];
    const missingTask = taskKeys.filter((k) => t?.[k] === undefined);
    if (missingTask.length) fail(`task missing fields: ${missingTask.join(', ')}`);
    ok('task shape looks good');
  }
  if (sample.invoices.length) {
    const inv = sample.invoices[0];
    const invKeys = ['id', 'invoiceNumber', 'amount', 'status', 'dueDate', 'createdAt', 'description', 'items'];
    const missingInv = invKeys.filter((k) => inv?.[k] === undefined);
    if (missingInv.length) fail(`invoice missing fields: ${missingInv.join(', ')}`);
    if (!Array.isArray(inv.items)) fail('invoice.items is not an array');
    ok('invoice shape looks good');
  }
  if (sample.documents.length) {
    const d = sample.documents[0];
    const docKeys = ['id', 'title', 'type', 'status', 'createdAt', 'downloadUrl'];
    const missingDoc = docKeys.filter((k) => d?.[k] === undefined);
    if (missingDoc.length) fail(`document missing fields: ${missingDoc.join(', ')}`);
    ok('document shape looks good');
  }

  // 4) pick inquiry for this user (if possible)
  const mine = inq.json.data.find((x) => (x.clientEmail || '').toLowerCase() === (user.email || '').toLowerCase()) || inq.json.data[0];
  if (!mine?.id) fail('could not select inquiry id');
  ok(`selected inquiry id: ${mine.id}`);

  // 5) add message
  console.log('\n4) Add message');
  const msgText = `Client dashboard test message ${Date.now()}`;
  const addMsg = await post('add-message', { inquiryId: mine.id, message: msgText, sender: 'client' }, token);
  if (!addMsg.json?.success) fail(`add-message failed: ${addMsg.json?.error || addMsg.res.status}`);
  ok('message posted');

  // 6) refetch and confirm message exists
  console.log('\n5) Confirm message persisted');
  const inq2 = await get('inquiries', token);
  if (!inq2.json?.success) fail(`refetch inquiries failed: ${inq2.json?.error || inq2.res.status}`);
  const again = inq2.json.data.find((x) => x.id === mine.id);
  const found = again?.messages?.some((m) => m.message === msgText);
  if (!found) fail('message not found after refetch');
  ok('message found after refetch');

  console.log('\n--- Summary ---');
  console.log('Client dashboard backend integration looks good.');
}

run().catch((e) => fail(e?.message || String(e)));
