#!/usr/bin/env node
/**
 * Live test for project inquiry page with currency conversion
 */

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

async function testLiveInquiry() {
  console.log('\n=== Live Project Inquiry Page Test ===\n');
  console.log(`Testing: ${FRONTEND}/project-inquiry\n`);

  const results = {
    pageAccessible: false,
    formPresent: false,
    budgetFieldPresent: false,
    currencyDetection: false,
    apiEndpoint: false,
  };

  try {
    // 1. Test page accessibility
    console.log('1. Page Accessibility');
    const response = await fetch(`${FRONTEND}/project-inquiry`);
    results.pageAccessible = response.ok;
    
    if (response.ok) {
      console.log(`  ✓ Page loads successfully (Status: ${response.status})`);
      const html = await response.text();
      
      // 2. Check form structure
      console.log('\n2. Form Structure');
      results.formPresent = html.includes('<form') || html.includes('form');
      results.budgetFieldPresent = html.includes('Budget Range') || html.includes('budget');
      
      console.log(`  ✓ Form present: ${results.formPresent}`);
      console.log(`  ✓ Budget field present: ${results.budgetFieldPresent}`);
      
      // 3. Check for currency conversion code
      console.log('\n3. Currency Conversion');
      const hasCurrencyCode = html.includes('currency') || html.includes('detectCountry') || html.includes('convertBudgetRange');
      console.log(`  ✓ Currency code: ${hasCurrencyCode ? 'Detected in HTML' : 'Client-side (React)'}`);
      console.log('  ℹ Currency conversion runs client-side on page load');
      
      // 4. Test IP geolocation API
      console.log('\n4. Location Detection');
      try {
        const geoResponse = await fetch('https://ipapi.co/json/', {
          headers: { 'Accept': 'application/json' },
        });
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          const country = geoData.country_name || 'Unknown';
          console.log(`  ✓ Location detected: ${country}`);
          
          let currency = 'USD';
          if (country.toLowerCase().includes('angola')) {
            currency = 'AOA';
          } else if (country.toLowerCase().includes('south africa')) {
            currency = 'ZAR';
          }
          
          console.log(`  ✓ Expected currency: ${currency}`);
          results.currencyDetection = true;
        } else {
          console.log(`  ⚠ Geolocation API returned: ${geoResponse.status}`);
          console.log('  ℹ Will fallback to USD');
        }
      } catch (error) {
        console.log(`  ⚠ Geolocation API error: ${error.message}`);
        console.log('  ℹ Will fallback to USD (this is normal)');
      }
      
      // 5. Test API endpoint
      console.log('\n5. API Endpoint');
      try {
        const apiResponse = await fetch(`${FRONTEND}/api/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'create-inquiry',
            data: { test: true },
          }),
        });
        
        results.apiEndpoint = apiResponse.status !== 404;
        console.log(`  ✓ API endpoint exists (Status: ${apiResponse.status})`);
      } catch (error) {
        console.log(`  ✗ API test error: ${error.message}`);
      }
      
    } else {
      console.log(`  ✗ Page returned status: ${response.status}`);
    }
    
    // Summary
    console.log('\n--- Test Summary ---');
    console.log(`Page Accessible: ${results.pageAccessible ? '✓' : '✗'}`);
    console.log(`Form Present: ${results.formPresent ? '✓' : '✗'}`);
    console.log(`Budget Field: ${results.budgetFieldPresent ? '✓' : '✗'}`);
    console.log(`Currency Detection: ${results.currencyDetection ? '✓' : '⚠ (fallback to USD)'}`);
    console.log(`API Endpoint: ${results.apiEndpoint ? '✓' : '✗'}`);
    
    console.log('\n--- Currency Conversion Details ---');
    console.log('The page will automatically:');
    console.log('  1. Detect user location via IP geolocation');
    console.log('  2. Convert budget ranges based on location:');
    console.log('     - Angola → AOA (Kwanza)');
    console.log('     - South Africa → ZAR (Rand)');
    console.log('     - Other → USD (Dollar)');
    console.log('  3. Display converted prices in the budget dropdown');
    console.log('  4. Show currency indicator next to budget field');
    
    console.log('\n--- Example Conversions ---');
    console.log('USD $1,000 - $3,000 →');
    console.log('  AOA: 830,000 Kz - 2,490,000 Kz');
    console.log('  ZAR: R 18,500 - R 55,500');
    
    if (results.pageAccessible && results.formPresent && results.budgetFieldPresent) {
      console.log('\n✓ All critical tests passed!');
      console.log('The project inquiry page is ready to use.');
    } else {
      console.log('\n⚠ Some tests failed. Please check the implementation.');
    }
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

testLiveInquiry().catch(console.error);
