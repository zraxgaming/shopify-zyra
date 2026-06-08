import { Resend } from 'resend';
// Vercel serverless function for sending emails via Resend REST API
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: 'Email service is not configured' });
  }

  const { to, subject, html, from } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required email fields' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: from || 'Zyra <contact@shopzyra.site>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}