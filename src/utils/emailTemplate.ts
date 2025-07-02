// Centralized branded HTML email template for Zyra
// Usage: import { zyraEmailTemplate } from './emailTemplate';

/**
 * Generates a branded Zyra HTML email.
 * @param {Object} options
 * @param {string} options.title - Main heading for the email
 * @param {string} options.body - Main HTML content (can include <p>, <ul>, etc.)
 * @param {string} [options.ctaText] - Call-to-action button text
 * @param {string} [options.ctaUrl] - Call-to-action button URL
 * @returns {string} HTML string
 */
export function zyraEmailTemplate({ title, body, ctaText, ctaUrl }) {
  // Defensive: always return a valid HTML string, never throw, and never use undefined variables
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
