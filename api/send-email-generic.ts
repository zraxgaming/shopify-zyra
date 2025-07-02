import { Resend } from 'resend';

// Node.js API route using Resend SDK (not Edge-compatible)
export default async function handler(req: any, res: any) {
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? 'https://www.shopzyra.site'
    : '*';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }


  let body = req.body;
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(req.body);
    } catch {
      console.error('Invalid JSON body:', req.body);
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  const { to, subject, text, html } = body;
  if (!to || !subject || (!text && !html)) {
    console.error('Missing required fields:', { to, subject, text, html });
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text or html' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY || 're_3ZYY9s3W_HuQbhTk4BDEPrrTUB37HyKan');
    console.log('Sending email with:', { to, subject, text, html });
    const { data, error } = await resend.emails.send({
      from: 'Zyra <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Resend API error', details: error });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error?.message || String(error) });
  }
}
