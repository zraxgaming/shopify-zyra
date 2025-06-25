
interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to];

    const mailersendPayload = {
      from: {
        email: emailData.from || 'info@shopzyra.com',
        name: emailData.fromName || 'Zyra Custom Craft'
      },
      to: recipients.map(email => ({
        email: email,
        name: email.split('@')[0]
      })),
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.html.replace(/<[^>]*>/g, '') // Strip HTML for text version
    };

    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer mlsn.0cfab9ad5a1dd76d789dce0cea822f7b10800c7991856065e60b4f96dd4f892d`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(mailersendPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`MailerSend API error: ${JSON.stringify(errorData)}`);
    }

    return true;
  } catch (error) {
    console.error('MailerSend email error:', error);
    return false;
  }
}

export async function sendBatchEmails(emails: EmailData[]): Promise<boolean> {
  try {
    const results = await Promise.allSettled(
      emails.map(email => sendEmail(email))
    );
    
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;
    
    console.log(`Batch email results: ${successCount}/${emails.length} sent successfully`);
    return successCount > 0;
  } catch (error) {
    console.error('Batch email error:', error);
    return false;
  }
}

// Template for order confirmation with Zyra theme
export function getOrderConfirmationTemplate(order: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Zyra Custom Craft</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative;">
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">✨ Order Confirmed!</h1>
                </div>
                <div style="background: #ffffff; color: #667eea; padding: 12px 24px; border-radius: 25px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    Order #${order.id.slice(-8)}
                </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #333; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Thank you for your order!</h2>
                    <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.6;">Your custom craft order has been received and is being carefully prepared.</p>
                </div>
                
                <!-- Order Details Card -->
                <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div>
                            <p style="margin: 0 0 5px 0; color: #888; font-size: 14px; font-weight: 500;">ORDER NUMBER</p>
                            <p style="margin: 0; color: #333; font-size: 18px; font-weight: 600; font-family: monospace;">#${order.id.slice(-8)}</p>
                        </div>
                        <div>
                            <p style="margin: 0 0 5px 0; color: #888; font-size: 14px; font-weight: 500;">TOTAL AMOUNT</p>
                            <p style="margin: 0; color: #667eea; font-size: 24px; font-weight: 700;">$${order.total_amount.toFixed(2)}</p>
                        </div>
                    </div>
                    <div>
                        <p style="margin: 0 0 5px 0; color: #888; font-size: 14px; font-weight: 500;">PAYMENT METHOD</p>
                        <p style="margin: 0; color: #333; font-size: 16px; font-weight: 600; text-transform: capitalize;">${order.payment_method?.replace('_', ' ')}</p>
                    </div>
                </div>
                
                <!-- Next Steps -->
                <div style="background: #fff; border: 2px solid #e8ecff; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
                    <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What happens next?</h3>
                    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                        <div style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">1</div>
                        <div>
                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #333;">Order Processing</p>
                            <p style="margin: 0; color: #666; font-size: 14px;">We're preparing your custom items with care</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
                        <div style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">2</div>
                        <div>
                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #333;">Quality Check</p>
                            <p style="margin: 0; color: #666; font-size: 14px;">Every item is inspected before shipping</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: flex-start;">
                        <div style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0;">3</div>
                        <div>
                            <p style="margin: 0 0 5px 0; font-weight: 600; color: #333;">Fast Shipping</p>
                            <p style="margin: 0; color: #666; font-size: 14px;">You'll receive tracking information soon</p>
                        </div>
                    </div>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://shopzyra.vercel.app/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                        View Order Details →
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9ff; padding: 30px; text-align: center; border-top: 1px solid #e8ecff;">
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 20px; font-weight: 700;">Zyra Custom Craft</h3>
                    <p style="color: #666; margin: 0; font-size: 14px;">Creating beautiful, personalized items just for you</p>
                </div>
                <div style="border-top: 1px solid #e8ecff; padding-top: 20px;">
                    <p style="color: #888; font-size: 12px; margin: 0;">
                        <a href="https://shopzyra.vercel.app" style="color: #667eea; text-decoration: none;">shopzyra.vercel.app</a> | 
                        <a href="https://shopzyra.vercel.app/contact" style="color: #667eea; text-decoration: none;">Contact Us</a> | 
                        <a href="https://shopzyra.vercel.app/newsletter-unsubscribe?email=${order.profiles?.email}" style="color: #667eea; text-decoration: none;">Unsubscribe</a>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Template for newsletter with Zyra theme
export function getNewsletterTemplate(content: string, subject: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject} - Zyra Custom Craft</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${subject}</h1>
                </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                ${content}
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9ff; padding: 30px; text-align: center; border-top: 1px solid #e8ecff;">
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 20px; font-weight: 700;">Zyra Custom Craft</h3>
                    <p style="color: #666; margin: 0; font-size: 14px;">Creating beautiful, personalized items just for you</p>
                </div>
                <div style="border-top: 1px solid #e8ecff; padding-top: 20px;">
                    <p style="color: #888; font-size: 12px; margin: 0;">
                        You're receiving this because you subscribed to our newsletter.<br>
                        <a href="https://shopzyra.vercel.app/newsletter-unsubscribe?email={{email}}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
                        <a href="https://shopzyra.vercel.app" style="color: #667eea; text-decoration: none;">Visit our website</a>
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
}

// Template for contact form submission
export function getContactFormTemplate(data: any): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission - Zyra Custom Craft</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">📬 New Contact Form</h1>
                </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                    <h3 style="color: #333; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Contact Details:</h3>
                    <div style="margin-bottom: 15px;">
                        <p style="margin: 0 0 5px 0; color: #888; font-size: 14px; font-weight: 500;">NAME</p>
                        <p style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">${data.name}</p>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <p style="margin: 0 0 5px 0; color: #888; font-size: 14px; font-weight: 500;">EMAIL</p>
                        <p style="margin: 0; color: #667eea; font-size: 16px; font-weight: 600;">${data.email}</p>
                    </div>
                    ${data.phone ? `
                    <div style="margin-bottom: 15px;">
                        <p style="margin: 0 0 5px 0; color: #888; font-size: 14px; font-weight: 500;">PHONE</p>
                        <p style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">${data.phone}</p>
                    </div>
                    ` : ''}
                    <div>
                        <p style="margin: 0 0 5px 0; color: #888; font-size: 14px; font-weight: 500;">MESSAGE</p>
                        <div style="background: white; border-radius: 8px; padding: 15px; border: 1px solid #e8ecff;">
                            <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.6;">${data.message}</p>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center;">
                    <a href="mailto:${data.email}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                        Reply to ${data.name} →
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8f9ff; padding: 20px; text-align: center; border-top: 1px solid #e8ecff;">
                <p style="color: #888; font-size: 12px; margin: 0;">
                    Sent from <a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a> via Zyra Contact Form
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}
