#!/usr/bin/env node
/**
 * Document signing workflow smoke test
 * - login admin + client
 * - pick an inquiry for client_test
 * - add document (pending-admin-signature)
 * - sign as admin -> pending-client-signature
 * - sign as client -> signed
 */

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

function fail(msg) {
  console.error(`\n[FAIL] ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`  [OK] ${msg}`);
}

async function post(type, data, token) {
  const res = await fetch(`${FRONTEND}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  console.log("\n=== Document signing workflow test ===\n");
  console.log(`Target: ${FRONTEND}`);

  console.log("\n1) Admin login");
  const adminLogin = await post("login", { username: "admin", password: "admin123" });
  if (!adminLogin.json?.success) fail(`admin login failed: ${adminLogin.json?.error || adminLogin.res.status}`);
  const adminToken = adminLogin.json.data?.token;
  const adminUser = adminLogin.json.data?.user;
  ok(`admin login OK (${adminUser?.email || adminUser?.username})`);

  console.log("\n2) Client login");
  const clientLogin = await post("login", { username: "client_test", password: "client123" });
  if (!clientLogin.json?.success) fail(`client login failed: ${clientLogin.json?.error || clientLogin.res.status}`);
  const clientToken = clientLogin.json.data?.token;
  const clientUser = clientLogin.json.data?.user;
  ok(`client login OK (${clientUser?.email || clientUser?.username})`);

  console.log("\n3) Fetch inquiries");
  const inq = await get("inquiries", adminToken);
  if (!inq.json?.success) fail(`get inquiries failed: ${inq.json?.error || inq.res.status}`);
  const inquiries = inq.json.data || [];
  if (!Array.isArray(inquiries) || inquiries.length === 0) fail("no inquiries found");
  const mine =
    inquiries.find((x) => (x.clientEmail || "").toLowerCase() === (clientUser.email || "").toLowerCase()) || inquiries[0];
  ok(`selected inquiry id: ${mine.id}`);

  console.log("\n4) Add document");
  const docTitle = `NDA Test ${Date.now()}`;
  const addDoc = await post(
    "add-document",
    {
      inquiryId: mine.id,
      title: docTitle,
      type: "nda",
      downloadUrl: "https://example.com/nda.pdf",
      status: "pending-admin-signature",
    },
    adminToken
  );
  if (!addDoc.json?.success) fail(`add-document failed: ${addDoc.json?.error || addDoc.res.status}`);
  ok(`document created id: ${addDoc.json.data?.id}`);

  console.log("\n5) Sign as admin");
  const adminSign = await post(
    "sign-document",
    { documentId: addDoc.json.data.id, signerRole: "admin", signedBy: adminUser?.email || "admin" },
    adminToken
  );
  if (!adminSign.json?.success) fail(`admin sign failed: ${adminSign.json?.error || adminSign.res.status}`);
  if (adminSign.json.data?.status !== "pending-client-signature") {
    fail(`expected pending-client-signature, got ${adminSign.json.data?.status}`);
  }
  ok("admin signature recorded and status moved to pending-client-signature");

  console.log("\n6) Sign as client");
  const clientSign = await post(
    "sign-document",
    { documentId: addDoc.json.data.id, signerRole: "client", signedBy: clientUser?.email || "client" },
    clientToken
  );
  if (!clientSign.json?.success) fail(`client sign failed: ${clientSign.json?.error || clientSign.res.status}`);
  if (clientSign.json.data?.status !== "signed") {
    fail(`expected signed, got ${clientSign.json.data?.status}`);
  }
  ok("client signature recorded and status is signed");

  console.log("\n--- Summary ---");
  console.log("Document signing workflow looks good.");
}

run().catch((e) => fail(e?.message || String(e)));

