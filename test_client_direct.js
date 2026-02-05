// Test Client Portal - Direct Django Backend Test
const testClientLoginDirect = async () => {
  console.log('🧪 Testing Client Portal - Direct Django Backend\n');
  console.log('='.repeat(50));

  const djangoUrl = 'http://localhost:8000';
  const testClients = [
    { email: 'john.smith@example.com', password: 'Client123!' },
    { email: 'sarah.johnson@example.com', password: 'Client123!' },
    { email: 'michael.brown@example.com', password: 'Client123!' },
    { email: 'client1@example.com', password: 'Client123!' },
    { email: 'client2@example.com', password: 'Client123!' },
  ];

  for (const client of testClients) {
    console.log(`\n🔐 Testing: ${client.email}`);
    console.log('-'.repeat(50));

    try {
      // Test Django login endpoint
      console.log('Step 1: Testing Django login endpoint...');
      const loginResponse = await fetch(`${djangoUrl}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: client.email,
          password: client.password
        })
      });

      const loginText = await loginResponse.text();
      console.log(`Status: ${loginResponse.status}`);
      console.log(`Response: ${loginText.substring(0, 200)}...`);

      if (loginResponse.ok) {
        try {
          const loginResult = JSON.parse(loginText);
          console.log('✅ Login successful!');
          console.log('Response:', JSON.stringify(loginResult, null, 2));
        } catch (e) {
          console.log('⚠️  Response is not JSON');
        }
      } else {
        console.log('❌ Login failed');
      }

      // Test inquiries endpoint
      console.log('\nStep 2: Testing inquiries endpoint...');
      const inquiriesResponse = await fetch(`${djangoUrl}/api/information/get-project-inquiries/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const inquiriesText = await inquiriesResponse.text();
      console.log(`Status: ${inquiriesResponse.status}`);
      
      if (inquiriesResponse.ok) {
        try {
          const inquiriesResult = JSON.parse(inquiriesText);
          const clientInquiries = inquiriesResult.data?.filter(
            i => i.client_email?.toLowerCase() === client.email.toLowerCase()
          ) || [];
          console.log(`✅ Found ${clientInquiries.length} inquiries for ${client.email}`);
          if (clientInquiries.length > 0) {
            clientInquiries.forEach((inq, idx) => {
              console.log(`   ${idx + 1}. ${inq.project_title} - ${inq.status}`);
            });
          }
        } catch (e) {
          console.log('⚠️  Could not parse inquiries response');
        }
      }

    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Test completed');
};

testClientLoginDirect().catch(console.error);
