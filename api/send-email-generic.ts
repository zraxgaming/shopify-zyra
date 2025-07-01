







// Vercel Edge Function compatible (no direct Resend SDK import)
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
      return res.status(400).json({ error: 'Invalid JSON' });
    }
  }

  const { to, subject, text, html } = body;
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text or html' });
  }

  // Use fetch to call Resend REST API (Edge compatible)
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing RESEND_API_KEY in environment' });
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Zyra <onboarding@resend.dev>',
        to,
        subject,
        text,
        html,
      })
    });
    const data = await response.json();
    if (!response.ok) {
      if (process.env.NODE_ENV !== 'production') console.error('Resend API error:', data);
      return res.status(500).json({ error: 'Resend API error', details: data });
    }
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error?.message || String(error) });
  }
}
