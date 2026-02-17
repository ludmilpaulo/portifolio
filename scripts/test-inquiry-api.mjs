#!/usr/bin/env node
/**
 * Test project inquiry API endpoint
 */

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

async function testInquiryAPI() {
  console.log('\n=== Testing Project Inquiry API ===\n');

  const testInquiry = {
    clientName: 'Test User',
    clientEmail: `test-${Date.now()}@example.com`,
    clientPhone: '+27123456789',
    projectTitle: 'Test Project',
    projectDescription: 'This is a test project inquiry',
    projectType: 'web-development',
    budget: '$1,000 - $3,000',
    timeline: '1 month',
    additionalRequirements: '',
    status: 'pending',
    priority: 'medium'
  };

  try {
    console.log('Sending inquiry to:', `${FRONTEND}/api/graphql`);
    console.log('Data:', JSON.stringify(testInquiry, null, 2));
    
    const response = await fetch(`${FRONTEND}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'create-inquiry',
        data: testInquiry,
      }),
    });

    console.log(`\nResponse Status: ${response.status} ${response.statusText}`);

    const contentType = response.headers.get('content-type');
    let result;

    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      console.log('\nNon-JSON Response:', text);
      return;
    }

    console.log('\nResponse:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log('\n✓ Inquiry submitted successfully!');
      if (result.data && result.data.id) {
        console.log(`  Inquiry ID: ${result.data.id}`);
      }
    } else {
      console.log('\n✗ Inquiry submission failed');
      console.log(`  Error: ${result.error || result.message || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    if (error.cause) {
      console.error('  Cause:', error.cause);
    }
  }
}

testInquiryAPI().catch(console.error);
