
// TODO: Add your Resend API key here
const RESEND_API_KEY = "re_TnRSeh6X_6AJkMV6wLDCEVqKMKejUw4Yn"; // Replace with your actual Resend API key

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async ({ to, subject, html, from = "Zyra Custom Craft <noreply@shopzyra.site>" }: EmailData): Promise<boolean> => {
  if (!RESEND_API_KEY) {
    console.error('Resend API key not configured');
    throw new Error('Email service not configured');
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${errorData.message || response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  orderDetails: any
): Promise<boolean> => {
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .order-info { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-info h2 { color: #1e293b; margin-top: 0; font-size: 20px; }
        .order-details { background: white; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
        .order-item { padding: 15px; border-bottom: 1px solid #f1f5f9; }
        .order-item:last-child { border-bottom: none; }
        .item-name { font-weight: bold; color: #1e293b; margin-bottom: 5px; }
        .item-details { color: #64748b; font-size: 14px; }
        .customization { color: #9333ea; font-style: italic; margin-top: 5px; }
        .footer { background: #9333ea; color: white; padding: 30px 20px; text-align: center; }
        .footer p { margin: 0; font-size: 16px; }
        .website-link { color: #60a5fa; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Zyra Custom Craft</h1>
          <p>Thank you for your order!</p>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h2>Order Confirmation</h2>
            <p><strong>Order Number:</strong> #${orderDetails.id?.slice(-8) || 'N/A'}</p>
            <p><strong>Total Amount:</strong> $${orderDetails.total_amount || '0.00'}</p>
            <p><strong>Status:</strong> ${orderDetails.status || 'Confirmed'}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="order-details">
            <h3 style="padding: 15px; margin: 0; background: #f8fafc; color: #1e293b;">Items Ordered</h3>
            ${orderDetails.items?.map((item: any) => `
              <div class="order-item">
                <div class="item-name">${item.name || 'Product'}</div>
                <div class="item-details">
                  Quantity: ${item.quantity || 1} | Price: $${item.price || '0.00'}
                </div>
                ${item.customization?.text ? `<div class="customization">Custom Text: "${item.customization.text}"</div>` : ''}
              </div>
            `).join('') || '<div class="order-item">No items found</div>'}
          </div>
          
          <p style="margin-top: 30px; color: #64748b;">
            We'll send you tracking information once your order ships. If you have any questions, 
            please don't hesitate to contact us.
          </p>
        </div>
        
        <div class="footer">
          <p>We'll keep you updated on your order status!</p>
          <p style="margin-top: 10px;">
            Visit us at <a href="https://www.shopzyra.site" class="website-link">www.shopzyra.site</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Order Confirmation - Order #${orderDetails.id?.slice(-8) || 'N/A'}`,
    html: emailHtml,
  });
};

export const sendNewsletterEmail = async (
  email: string,
  message: string,
  unsubscribeLink?: string
): Promise<boolean> => {
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Zyra Custom Craft</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 30px; line-height: 1.6; }
        .message { color: #1e293b; font-size: 16px; margin-bottom: 30px; }
        .features { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .features h3 { color: #1e293b; margin-top: 0; }
        .features ul { color: #64748b; padding-left: 20px; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 12px; }
        .website-link { color: #9333ea; text-decoration: none; }
        .unsubscribe { color: #94a3b8; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Zyra Custom Craft</h1>
        </div>
        
        <div class="content">
          <div class="message">
            ${message.replace(/\n/g, '<br>')}
          </div>
          
          <div class="features">
            <h3>What to expect:</h3>
            <ul>
              <li>Exclusive offers and discounts</li>
              <li>New product announcements</li>
              <li>Custom design tips and inspiration</li>
              <li>Behind-the-scenes content</li>
            </ul>
          </div>
          
          <p>
            Visit our website: <a href="https://www.shopzyra.site" class="website-link">www.shopzyra.site</a>
          </p>
        </div>
        
        <div class="footer">
          <p>You're receiving this because you subscribed to our newsletter.</p>
          ${unsubscribeLink ? `<p><a href="${unsubscribeLink}" class="unsubscribe">Unsubscribe</a></p>` : ''}
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Zyra Custom Craft Newsletter!',
    html: emailHtml,
  });
};

export const sendContactFormEmail = async (
  adminEmail: string,
  contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }
): Promise<boolean> => {
  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: bold; color: #1e293b; margin-bottom: 5px; }
        .field-value { color: #64748b; padding: 10px; background: #f8fafc; border-radius: 4px; }
        .message-field { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="field-label">Name:</div>
            <div class="field-value">${contactData.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email:</div>
            <div class="field-value">${contactData.email}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Subject:</div>
            <div class="field-value">${contactData.subject}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Message:</div>
            <div class="field-value message-field">${contactData.message}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Contact Form: ${contactData.subject}`,
    html: emailHtml,
  });
};
