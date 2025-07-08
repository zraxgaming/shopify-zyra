// Test script to verify email API functionality
const fetch = require('node-fetch');

async function testEmailAPI() {
  console.log('Testing email API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/send-email-generic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Test Email from Zyra',
        html: '<p>This is a test email to verify the API is working correctly.</p>'
      })
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ Email API test passed!');
    } else {
      console.log('❌ Email API test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testEmailAPI();
