// Test: Create a new tenant through the full 2-step flow
// Step 1: Register user -> Step 2: Create tenant profile

import fetch from 'node_modules/node-fetch/src/index.js';

const BASE = 'http://localhost:5000/api';

// Get a login token first (Owner)
async function getOwnerToken() {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'suresh', password: 'Owner@123' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Login failed: ${JSON.stringify(data)}`);
  console.log('✅ Owner login success');
  return data.token;
}

async function run() {
  let token;
  try {
    token = await getOwnerToken();
  } catch (e) {
    console.error('❌', e.message);
    console.log('→ Please check the owner username/password in this script');
    process.exit(1);
  }

  const timestamp = Date.now();
  const testUsername = `testuser_${timestamp}`;

  // Step 1: Register user
  console.log('\n--- Step 1: Register User ---');
  const regRes = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      username: testUsername,
      password: 'Test@1234',
      role: 'Tenant',
      email: `${testUsername}@test.com`,
      phone: '0771234567'
    })
  });
  const regData = await regRes.json();
  console.log(`Status: ${regRes.status}`, regData);
  if (!regRes.ok) {
    console.error('❌ User registration failed');
    process.exit(1);
  }
  const userId = regData.userId;
  console.log(`✅ User created with ID: ${userId}`);

  // Step 2: Create tenant profile
  console.log('\n--- Step 2: Create Tenant Profile ---');
  const tenantRes = await fetch(`${BASE}/Tenants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      userId,
      fullName: 'Test User Fix',
      nic: '200354901142',
      occupation: 'Student',
      dateOfBirth: '2003-06-04',
      leaseStartDate: '2026-04-20',
      houseId: null,
      familyMembers: []
    })
  });
  const tenantData = await tenantRes.json();
  console.log(`Status: ${tenantRes.status}`, tenantData);
  if (!tenantRes.ok) {
    console.error('❌ Tenant creation failed!');
    process.exit(1);
  }
  console.log('✅ Tenant created successfully! TenantId:', tenantData.TenantId);

  // Cleanup: We'll just log the created IDs - manual cleanup if needed
  console.log('\n--- Test Complete ---');
  console.log(`Created: userId=${userId}, tenantId=${tenantData.TenantId}`);
  console.log('NOTE: You may want to delete this test tenant from the DB manually.');
  process.exit(0);
}

run().catch(e => {
  console.error('Unexpected error:', e);
  process.exit(1);
});
