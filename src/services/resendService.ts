import { zyraEmailTemplate } from '@/utils/emailTemplate';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

interface EmailOptions {
  to: string;
  subject: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const sendResendEmail = async (options: EmailOptions) => {
  try {
    if (!RESEND_API_KEY) {
      console.error('Resend API key not found');
      return { success: false, error: 'API key not configured' };
    }

    const emailHtml = zyraEmailTemplate({
      title: options.title,
      body: options.body,
      ctaText: options.ctaText,
      ctaUrl: options.ctaUrl
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: "Zyra <noreply@shopzyra.site>",
        to: [options.to],
        subject: options.subject,
        html: emailHtml
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API error:', response.status, errorText);
      return { success: false, error: errorText };
    }

    const responseData = await response.json();
    console.log('✅ Email sent successfully via Resend:', responseData);
    return { success: true, data: responseData };
  } catch (error: any) {
    console.error("❌ Resend email sending failed:", error);
    return { success: false, error: error.message };
  }
};

export const emailTemplates = {
  welcome: (name: string) => ({
    title: 'Welcome to Zyra!',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Welcome to Zyra! Thanks for joining — we're glad to have you.
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Explore our latest products and gift cards, hand-picked just for you.
      </p>
    `,
    ctaText: 'Start Shopping',
    ctaUrl: 'https://www.shopzyra.site/shop'
  }),

  orderConfirmation: (orderId: string, total: number, _isDigital?: boolean) => ({
    title: 'Order Confirmed!',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Your order <strong>#${orderId.slice(0, 8)}</strong> has been confirmed!
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Total: <strong>$${total.toFixed(2)}</strong>
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        We'll send you tracking information once your order ships.
      </p>
    `,
    ctaText: 'View Order',
    ctaUrl: `https://www.shopzyra.site/order-confirmation/${orderId}`
  }),

  orderStatusUpdate: (orderId: string, status: string, trackingNumber?: string) => ({
    title: 'Order Status Update',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Your order <strong>#${orderId.slice(0, 8)}</strong> status has been updated:
      </p>
      <p style="color:#7c3aed;font-size:18px;font-weight:bold;margin-bottom:16px;">
        ${status.replace('_', ' ').toUpperCase()}
      </p>
      ${trackingNumber ? `
        <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
          Tracking Number: <strong>${trackingNumber}</strong>
        </p>
      ` : ''}
    `,
    ctaText: 'Track Order',
    ctaUrl: 'https://www.shopzyra.site/account'
  }),

  newsletterWelcome: (email: string) => ({
    title: 'Welcome to the Zyra Newsletter!',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Thank you for subscribing! 🎉
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        You'll be the first to know about new products, restocks, and exclusive offers.
      </p>
      <p style="color:#666;font-size:14px;line-height:1.6;">
        If you wish to unsubscribe,
        <a href="https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}" style="color:#7c3aed;text-decoration:underline;">
          click here
        </a>.
      </p>
    `,
    ctaText: 'Shop Now',
    ctaUrl: 'https://www.shopzyra.site/shop'
  }),

  newsletterCampaign: (title: string, content: string) => ({
    title,
    body: content,
    ctaText: 'Visit Store',
    ctaUrl: 'https://www.shopzyra.site/shop'
  })
};