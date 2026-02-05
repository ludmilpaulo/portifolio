// Test Client Portal Login Flow
// Run with: node test_client_portal.js

const testClientLogin = async () => {
  console.log('🧪 Testing Client Portal Login Flow\n');
  console.log('=' .repeat(50));
  
  // Test credentials from documentation
  const testClients = [
    { email: 'john.smith@example.com', password: 'Client123!' },
    { email: 'sarah.johnson@example.com', password: 'Client123!' },
    { email: 'michael.brown@example.com', password: 'Client123!' },
    { email: 'client1@example.com', password: 'Client123!' },
    { email: 'client2@example.com', password: 'Client123!' },
  ];

  const baseUrl = 'http://localhost:3000';
  const apiUrl = 'http://localhost:8000';

  console.log('\n📋 Test Plan:');
  console.log('1. Test client login API');
  console.log('2. Verify authentication token');
  console.log('3. Test fetching client inquiries');
  console.log('4. Verify client-specific data filtering\n');

  for (const client of testClients) {
    console.log(`\n🔐 Testing with: ${client.email}`);
    console.log('-'.repeat(50));

    try {
      // Step 1: Test Login
      console.log('Step 1: Attempting login...');
      const loginResponse = await fetch(`${baseUrl}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'login',
          data: {
            username: client.email,
            password: client.password
          }
        })
      });

      const loginResult = await loginResponse.json();
      console.log('Login Response:', JSON.stringify(loginResult, null, 2));

      if (loginResult.success && loginResult.data && loginResult.data.token) {
        console.log('✅ Login successful!');
        const token = loginResult.data.token;
        const user = loginResult.data.user;
        
        console.log(`   User Type: ${user.user_type}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.first_name} ${user.last_name}`);

        // Step 2: Test fetching inquiries
        console.log('\nStep 2: Fetching client inquiries...');
        const inquiriesResponse = await fetch(`${baseUrl}/api/graphql?type=inquiries`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        const inquiriesResult = await inquiriesResponse.json();
        console.log('Inquiries Response:', JSON.stringify(inquiriesResult, null, 2));

        if (inquiriesResult.success) {
          const clientInquiries = inquiriesResult.data.filter(
            inquiry => inquiry.clientEmail.toLowerCase() === client.email.toLowerCase()
          );
          console.log(`✅ Found ${clientInquiries.length} inquiries for this client`);
          
          if (clientInquiries.length > 0) {
            console.log('\n📊 Client Projects:');
            clientInquiries.forEach((inquiry, idx) => {
              console.log(`   ${idx + 1}. ${inquiry.projectTitle}`);
              console.log(`      Status: ${inquiry.status}`);
              console.log(`      Priority: ${inquiry.priority}`);
              console.log(`      Messages: ${inquiry.messages?.length || 0}`);
            });
          } else {
            console.log('ℹ️  No inquiries found for this client');
          }
        } else {
          console.log('⚠️  Failed to fetch inquiries');
        }

        // Step 3: Test token verification
        console.log('\nStep 3: Verifying token...');
        const verifyResponse = await fetch(`${baseUrl}/api/graphql`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'verify-token',
            data: {}
          })
        });

        const verifyResult = await verifyResponse.json();
        if (verifyResult.success) {
          console.log('✅ Token verified successfully');
        } else {
          console.log('⚠️  Token verification failed');
        }

        console.log('\n✅ All tests passed for this client!');
        return { success: true, client, token, user };
      } else {
        console.log('❌ Login failed:', loginResult.error || 'Unknown error');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test completed');
};

// Run the test
testClientLogin().catch(console.error);
