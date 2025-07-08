// Vercel serverless function for sending emails via Resend REST API
export default async function handler(req: any, res: any) {
  // Add comprehensive logging for debugging
  console.log('Email API called - Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Environment check - RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  
  // Set CORS headers
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

  try {
    // Parse request body
    let body = req.body;
    console.log('Raw body type:', typeof req.body);
    console.log('Raw body:', req.body);
    
    if (!body || typeof body !== 'object') {
      try {
        body = JSON.parse(req.body);
        console.log('Parsed body:', body);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Invalid JSON body:', req.body);
        return res.status(400).json({ error: 'Invalid JSON in request body' });
      }
    }

    const { to, subject, html, from } = body;
    
    // Validate required fields
    if (!to || !subject || (!html)) {
      console.error('Missing required fields:', { to: !!to, subject: !!subject, html: !!html });
      return res.status(400).json({ error: 'Missing required fields: to, subject, and text or html' });
    }

    // Check for API key
    const apiKey = "re_NnTZvVdb_MNZFrw9c8x6EWrBkkDFmoFZN";
    if (!apiKey) {
      console.error('RESEND_API_KEY environment variable not set');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    console.log('Sending email to:', to, 'with subject:', subject);
    
    // Prepare email payload
    const emailPayload = {
      from: from || 'Zyra Custom Craft <contact@shopzyra.site>',
      to: Array.isArray(to) ? to : [to],
      subject,
      ...(html && { html })
    };

    console.log('Email payload:', emailPayload);

    // Send email using Resend REST API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });

    const responseData = await response.text();
    
    if (!response.ok) {
      console.error('Resend API error:', response.status, responseData);
      return res.status(500).json({ 
        error: 'Failed to send email', 
        details: responseData,
        status: response.status
      });
    }

    const data = JSON.parse(responseData);
    console.log('Email sent successfully:', data);
    return res.status(200).json({ success: true, data });
    
  } catch (error: any) {
    console.error('Unexpected error in email handler:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error?.message || String(error) 
    });
  }
}