// This file is now deprecated. All email sending is handled by /api/send-email-generic.
// You can safely remove this file.

// SendGrid logic removed. Use Resend instead.
export async function sendEmailDirect() {
  throw new Error('SendGrid is deprecated. Use Resend for all email sending.');
}
