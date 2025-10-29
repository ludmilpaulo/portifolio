/**
 * Test script to simulate real user login scenarios
 * Run with: node test_login_flow.js
 */

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_URL = process.env.BACKEND_URL || 'https://ludmil.pythonanywhere.com';

// Test scenarios
const testScenarios = [
  {
    name: 'Test 1: Valid Admin Login',
    username: 'ludmil',
    password: 'Maitland@2026',
    expectedSuccess: true,
    expectedError: null
  },
  {
    name: 'Test 2: Invalid Username (Does Not Exist)',
    username: 'nonexistent_user_12345',
    password: 'SomePassword123!',
    expectedSuccess: false,
    expectedErrorCode: 'user_not_found',
    expectedError: 'does not exist'
  },
  {
    name: 'Test 3: Valid Username but Wrong Password',
    username: 'ludmil',
    password: 'WrongPassword123!',
    expectedSuccess: false,
    expectedErrorCode: 'wrong_password',
    expectedError: 'password'
  },
  {
    name: 'Test 4: Invalid Email (Does Not Exist)',
    username: 'nonexistent@example.com',
    password: 'SomePassword123!',
    expectedSuccess: false,
    expectedErrorCode: 'user_not_found',
    expectedError: 'does not exist'
  }
];

async function testBackendLogin(username, password) {
  try {
    const response = await fetch(`${API_URL}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();
    return {
      success: data.success || false,
      error: data.error || null,
      errorCode: data.error_code || null,
      token: data.token || null,
      user: data.user || null
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error.message}`,
      errorCode: 'network_error'
    };
  }
}

async function testFrontendAPI(username, password) {
  try {
    const response = await fetch(`${BASE_URL}/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'login',
        data: { username, password }
      })
    });

    const data = await response.json();
    return {
      success: data.success || false,
      error: data.error || null,
      errorCode: data.error_code || null,
      data: data.data || null
    };
  } catch (error) {
    return {
      success: false,
      error: `Network error: ${error.message}`,
      errorCode: 'network_error'
    };
  }
}

async function runTests() {
  console.log('\n🧪 Starting Login Flow Tests\n');
  console.log('=' .repeat(60));
  
  let passedTests = 0;
  let failedTests = 0;

  for (const scenario of testScenarios) {
    console.log(`\n📋 ${scenario.name}`);
    console.log(`   Username: ${scenario.username}`);
    console.log(`   Password: ${'*'.repeat(scenario.password.length)}`);
    
    // Test Backend Directly
    console.log('\n   Testing Backend API...');
    const backendResult = await testBackendLogin(scenario.username, scenario.password);
    
    let backendPass = false;
    if (scenario.expectedSuccess) {
      backendPass = backendResult.success === true && backendResult.token !== null;
      if (backendPass) {
        console.log(`   ✅ Backend: Login successful, token received`);
      } else {
        console.log(`   ❌ Backend: Expected success but got: ${backendResult.error}`);
      }
    } else {
      backendPass = backendResult.success === false;
      if (backendPass) {
        if (scenario.expectedErrorCode) {
          const errorCodeMatch = backendResult.errorCode === scenario.expectedErrorCode;
          const errorMessageMatch = scenario.expectedError 
            ? backendResult.error?.toLowerCase().includes(scenario.expectedError.toLowerCase())
            : true;
          
          if (errorCodeMatch && errorMessageMatch) {
            console.log(`   ✅ Backend: Correct error code (${backendResult.errorCode}) and message`);
            console.log(`      Error: ${backendResult.error}`);
          } else {
            backendPass = false;
            console.log(`   ❌ Backend: Expected error code ${scenario.expectedErrorCode}, got ${backendResult.errorCode}`);
            console.log(`      Error: ${backendResult.error}`);
          }
        } else {
          console.log(`   ✅ Backend: Login failed as expected`);
          console.log(`      Error: ${backendResult.error}`);
        }
      } else {
        console.log(`   ❌ Backend: Expected failure but got success`);
      }
    }

    // Test Frontend API Route
    console.log('\n   Testing Frontend API Route...');
    const frontendResult = await testFrontendAPI(scenario.username, scenario.password);
    
    let frontendPass = false;
    if (scenario.expectedSuccess) {
      frontendPass = frontendResult.success === true && frontendResult.data?.token !== null;
      if (frontendPass) {
        console.log(`   ✅ Frontend API: Login successful, token received`);
      } else {
        console.log(`   ❌ Frontend API: Expected success but got: ${frontendResult.error}`);
      }
    } else {
      frontendPass = frontendResult.success === false;
      if (frontendPass) {
        if (scenario.expectedErrorCode) {
          const errorCodeMatch = frontendResult.errorCode === scenario.expectedErrorCode;
          const errorMessageMatch = scenario.expectedError 
            ? frontendResult.error?.toLowerCase().includes(scenario.expectedError.toLowerCase())
            : true;
          
          if (errorCodeMatch && errorMessageMatch) {
            console.log(`   ✅ Frontend API: Correct error code (${frontendResult.errorCode}) and message`);
            console.log(`      Error: ${frontendResult.error}`);
          } else {
            frontendPass = false;
            console.log(`   ❌ Frontend API: Expected error code ${scenario.expectedErrorCode}, got ${frontendResult.errorCode}`);
            console.log(`      Error: ${frontendResult.error}`);
          }
        } else {
          console.log(`   ✅ Frontend API: Login failed as expected`);
          console.log(`      Error: ${frontendResult.error}`);
        }
      } else {
        console.log(`   ❌ Frontend API: Expected failure but got success`);
      }
    }

    // Overall test result
    if (backendPass && frontendPass) {
      console.log(`\n   ✅ TEST PASSED`);
      passedTests++;
    } else {
      console.log(`\n   ❌ TEST FAILED`);
      failedTests++;
    }
    
    console.log('-'.repeat(60));
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}/${testScenarios.length}`);
  console.log(`❌ Failed: ${failedTests}/${testScenarios.length}`);
  console.log(`📈 Success Rate: ${((passedTests / testScenarios.length) * 100).toFixed(1)}%`);
  
  if (failedTests === 0) {
    console.log('\n🎉 All tests passed! Login flow is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the output above.');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    console.error('\n💥 Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, testBackendLogin, testFrontendAPI };

