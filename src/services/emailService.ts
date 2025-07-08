
import { zyraEmailTemplate } from '@/utils/emailTemplate';

const RESEND_API_KEY = 're_3ZYY9s3W_HuQbhTk4BDEPrrTUB37HyKan';

interface EmailOptions {
  to: string;
  subject: string;
  title: string;
  body: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
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
        from: "Zyra Digital Products <contact@shopzyra.site>",
        to: [options.to],
        subject: options.subject,
        html: emailHtml
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email send error:', response.status, errorText);
      return { success: false, error: errorText };
    }

    const responseData = await response.json();
    console.log('✅ Email sent successfully:', responseData);
    return { success: true, data: responseData };
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    return { success: false, error: error.message };
  }
};

export const emailTemplates = {
  welcome: (name: string) => ({
    title: 'Welcome to Zyra Digital Products!',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Welcome to Zyra Digital Products! We're excited to have you join our community.
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Discover amazing digital products, templates, and resources to enhance your projects.
      </p>
    `,
    ctaText: 'Start Shopping',
    ctaUrl: 'https://www.shopzyra.site/shop'
  }),

  orderConfirmation: (orderId: string, total: number, isDigital: boolean) => ({
    title: 'Order Confirmed!',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Your order <strong>#${orderId.slice(0, 8)}</strong> has been confirmed!
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Total: <strong>$${total}</strong>
      </p>
      ${isDigital ? `
        <p style="color:#7c3aed;font-size:16px;line-height:1.6;margin-bottom:16px;">
          <strong>Digital Products:</strong> Your download links are available in your account.
        </p>
      ` : `
        <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
          We'll send you tracking information once your order ships.
        </p>
      `}
    `,
    ctaText: 'View Order',
    ctaUrl: `https://www.shopzyra.site/order/${orderId}`
  }),

  orderStatusUpdate: (orderId: string, status: string, trackingNumber?: string) => ({
    title: 'Order Status Update',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Your order <strong>#${orderId.slice(0, 8)}</strong> status has been updated to:
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
    ctaUrl: 'https://www.shopzyra.site/order-tracking'
  }),

  newsletterWelcome: (email: string) => ({
    title: 'Welcome to Zyra Newsletter!',
    body: `
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        Thank you for subscribing to our newsletter! 🎉
      </p>
      <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
        You'll be the first to know about new digital products, exclusive offers, and industry insights.
      </p>
      <p style="color:#666;font-size:14px;line-height:1.6;">
        If you wish to unsubscribe, 
        <a href="https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}" style="color:#7c3aed;text-decoration:underline;">
          click here
        </a>.
      </p>
    `,
    ctaText: 'Shop Digital Products',
    ctaUrl: 'https://www.shopzyra.site/shop'
  }),

  newsletterCampaign: (title: string, content: string) => ({
    title,
    body: content,
    ctaText: 'Visit Store',
    ctaUrl: 'https://www.shopzyra.site/shop'
  })
};
