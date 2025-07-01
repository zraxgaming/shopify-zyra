






import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

  if (!resend) {
    return res.status(500).json({ error: 'Missing or invalid RESEND_API_KEY in environment' });
  }

  let body = req.body;
  if (!body || typeof body !== 'object') {
    try {
      body = JSON.parse(req.body);
    } catch {
      body = {};
    }
  }

  const { to, subject, text, html } = body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text or html' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Zyra <onboarding@resend.dev>',
      to,
      subject,
      text,
      html,
    });
    if (!data || (data as any).error) {
      if (process.env.NODE_ENV !== 'production') console.error('Resend API error:', (data as any)?.error);
      return res.status(500).json({ error: 'Resend API error', details: (data as any)?.error });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: (error as any)?.message || String(error) });
  }
}
