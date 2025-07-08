// Test script to verify branded email template
const fetch = require('node-fetch');

// Mock the email template function (would normally be imported)
function zyraEmailTemplate({ title, body, ctaText, ctaUrl }) {
  const safeTitle = typeof title === 'string' && title.trim() ? title.trim() : 'Zyra Custom Craft';
  const safeBody = typeof body === 'string' && body.trim() ? body.trim() : '<p style="color:#444;">Thank you for being with us!</p>';
  const safeCtaText = typeof ctaText === 'string' && ctaText.trim() ? ctaText.trim() : '';
  const safeCtaUrl = typeof ctaUrl === 'string' && ctaUrl.trim() ? ctaUrl.trim() : '';
  let year = '';
  try {
    year = String(new Date().getFullYear());
  } catch (e) {
    year = '';
  }
  return [
    '<div style="background: linear-gradient(120deg, #fbc2eb 0%, #a18cd1 100%); padding: 32px 0; min-height: 100vh; font-family: Segoe UI, Arial, sans-serif;">',
    '  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 20px; box-shadow: 0 6px 32px rgba(124,58,237,0.10); overflow: hidden;">',
    '    <div style="background: #a18cd1; padding: 28px 0 16px 0; text-align: center;">',
    "      <img src='https://www.shopzyra.site/favicon.ico' alt='Zyra Logo' style='width:56px;height:56px;border-radius:12px;box-shadow:0 2px 12px #fbc2eb;' />",
    `      <h1 style="color: #fff; font-size: 2.1rem; margin: 18px 0 0 0; letter-spacing: 1.5px; font-weight:700;">${safeTitle}</h1>`,
    '    </div>',
    '    <div style="padding: 36px 28px 28px 28px; text-align: center;">',
    `      ${safeBody}`,
    safeCtaText && safeCtaUrl
      ? `      <a href="${safeCtaUrl}" style="display:inline-block;margin-top:28px;padding:14px 36px;background:#7c3aed;color:#fff;border-radius:10px;text-decoration:none;font-weight:700;font-size:1.1rem;box-shadow:0 2px 8px #a18cd1;">${safeCtaText}</a>`
      : '',
    '    </div>',
    '  </div>',
    `  <div style="text-align:center;color:#a18cd1;font-size:14px;margin-top:28px;">Zyra Custom Craft &copy; ${year}</div>`,
    '</div>'
  ].join('\n');
}

async function testBrandedEmail() {
  console.log('Testing branded email template...');
  
  const htmlContent = zyraEmailTemplate({
    title: 'Welcome to Zyra!',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:20px;">
        Thank you for joining our community! We're excited to have you with us.
      </p>
      <p style="color:#666;font-size:14px;line-height:1.5;">
        You'll receive updates about our latest handcrafted items, special offers, and more.
      </p>
    `,
    ctaText: 'Shop Now',
    ctaUrl: 'https://www.shopzyra.site'
  });
  
  try {
    const response = await fetch('http://localhost:3000/api/send-email-generic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: 'test@example.com',
        subject: 'Welcome to Zyra Custom Craft!',
        html: htmlContent
      })
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ Branded email test passed!');
    } else {
      console.log('❌ Branded email test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testBrandedEmail();
