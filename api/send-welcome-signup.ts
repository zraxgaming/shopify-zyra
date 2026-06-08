import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { WelcomeSignupEmail } from '../src/components/emails/WelcomeSignupEmail.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, firstName } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await resend.emails.send({
      from: 'Zyra <contact@shopzyra.site>',
      to: [email],
      subject: 'Welcome to Zyra!',
      react: WelcomeSignupEmail({ email, firstName }),
    });

    return res.status(200).json({ success: true, id: result.data?.id });

  } catch (error) {
    console.error('Welcome signup email error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error });
  }
}
