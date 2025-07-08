// Test file to verify Resend API integration
// Run with: node send-test-email.cjs

const { Resend } = require('resend');
require('dotenv').config({ path: '.env.local' });

async function testEmailService() {
  console.log('Testing Resend Email Service...');
  console.log('API Key exists:', !!process.env.RESEND_API_KEY);
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    return;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
      from: 'Zyra Custom Craft <onboarding@resend.dev>',
      to: ['zainabusal113@gmail.com'], // Replace with your email
      subject: 'Test Email from Zyra Custom Craft',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Test Email ✅</h1>
          <p>This is a test email to verify the Resend integration is working.</p>
          <p>If you receive this email, the API is configured correctly!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Sent from Zyra Custom Craft email test</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Resend API Error:', error);
    } else {
      console.log('✅ Email sent successfully!');
      console.log('Email ID:', data.id);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testEmailService();
