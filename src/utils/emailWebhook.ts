// This file is now deprecated. All email sending is handled by /api/send-email-generic.
// You can safely remove this file.

export interface EmailData {
  email: string;
  subject: string;
  html_content: string;
  content: string;
}

export const sendEmailViaWebhook = async (emailData: EmailData): Promise<boolean> => {
  try {
    const response = await fetch('https://hook.eu2.make.com/auficfn4ga7i1q23k8k4qow5w18t703h', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending email via webhook:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  orderDetails: any
): Promise<boolean> => {
  const res = await fetch('/api/send-email-generic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: customerEmail,
      templateType: 'orderPlaced',
      data: { userName: orderDetails.userName, orderId: orderDetails.id }
    })
  });
  if (!res.ok) throw new Error('Failed to send order confirmation email');
  return true;
};

export const sendNewsletterEmail = async (
  email: string,
  subject: string,
  content: string
): Promise<boolean> => {
  const res = await fetch('/api/send-email-generic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: email,
      templateType: 'newsletterSubscribed',
      data: { userName: email.split('@')[0], message: content }
    })
  });
  if (!res.ok) throw new Error('Failed to send newsletter email');
  return true;
};
