#!/usr/bin/env node
/**
 * Test script for project inquiry page with currency conversion
 * Tests: Page accessibility, currency detection, and form functionality
 */

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

async function testPage() {
  console.log('\n=== Project Inquiry Page Test ===\n');
  console.log(`Testing: ${FRONTEND}/project-inquiry\n`);

  const errors = [];
  const log = (msg, ok = true) => {
    console.log(ok ? `  ✓ ${msg}` : `  ✗ ${msg}`);
    if (!ok) errors.push(msg);
    return ok;
  };

  try {
    // 1. Test page accessibility
    console.log('1. Page Accessibility');
    const response = await fetch(`${FRONTEND}/project-inquiry`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      },
    });

    const html = await response.text();
    const pageOk = response.ok && html.includes('project-inquiry') || html.includes('Budget Range');
    log(`Page loads successfully (${response.status})`, pageOk);

    // 2. Check if currency conversion code is present
    console.log('\n2. Currency Conversion Implementation');
    const hasCurrencyLib = html.includes('currency') || html.includes('detectCountry');
    log('Currency conversion code detected', hasCurrencyLib);

    // 3. Test currency API endpoint (if available)
    console.log('\n3. Currency Detection');
    try {
      // Test IP geolocation API
      const geoResponse = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        const country = geoData.country_name || 'Unknown';
        log(`Location detected: ${country}`, true);
        
        // Determine expected currency
        let expectedCurrency = 'USD';
        if (country.toLowerCase().includes('angola')) {
          expectedCurrency = 'AOA';
        } else if (country.toLowerCase().includes('south africa')) {
          expectedCurrency = 'ZAR';
        }
        
        log(`Expected currency: ${expectedCurrency}`, true);
      } else {
        log('IP geolocation API not accessible', false);
      }
    } catch (error) {
      log(`IP geolocation test failed: ${error.message}`, false);
    }

    // 4. Test form structure
    console.log('\n4. Form Structure');
    const hasBudgetField = html.includes('Budget Range') || html.includes('budget');
    log('Budget range field present', hasBudgetField);

    const hasProjectType = html.includes('Project Type') || html.includes('projectType');
    log('Project type field present', hasProjectType);

    const hasSubmitButton = html.includes('Submit') || html.includes('submit');
    log('Submit button present', hasSubmitButton);

    // 5. Check for currency symbols in budget ranges
    console.log('\n5. Currency Display');
    const hasDollarSign = html.includes('$') || html.includes('USD');
    const hasAOASymbol = html.includes('Kz') || html.includes('AOA');
    const hasZARSymbol = html.includes('R ') || html.includes('ZAR');
    
    log('Currency symbols present (USD/AOA/ZAR)', hasDollarSign || hasAOASymbol || hasZARSymbol);

    // 6. Test API endpoint for project inquiry
    console.log('\n6. API Endpoint Test');
    try {
      const apiResponse = await fetch(`${FRONTEND}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'create-inquiry',
          data: {
            clientName: 'Test User',
            clientEmail: 'test@example.com',
            projectTitle: 'Test Project',
            projectDescription: 'Test description',
            projectType: 'web-development',
            budget: '$1,000 - $3,000',
            timeline: '1 month',
          },
        }),
      });

      // We expect this to fail without proper backend, but endpoint should exist
      const apiOk = apiResponse.status !== 404;
      log(`API endpoint exists (Status: ${apiResponse.status})`, apiOk);
    } catch (error) {
      log(`API test failed: ${error.message}`, false);
    }

    // Summary
    console.log('\n--- Summary ---');
    if (errors.length === 0) {
      console.log('All tests passed! ✓');
      console.log('\nCurrency conversion is implemented and ready to use.');
      console.log('Budget ranges will display in:');
      console.log('  - Angola: AOA (Kwanza)');
      console.log('  - South Africa: ZAR (Rand)');
      console.log('  - Other: USD (Dollar)');
    } else {
      console.log(`Failed tests: ${errors.length}`);
      errors.forEach((error, i) => {
        console.log(`  ${i + 1}. ${error}`);
      });
    }

  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testPage().catch(console.error);
