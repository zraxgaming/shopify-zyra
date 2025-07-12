import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';
import { NewsletterWelcomeEmail } from '../src/components/emails/NewsletterWelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    const result = await resend.emails.send({
      from: 'Zyra Custom Craft <contact@shopzyra.site>',
      to: [email],
      subject: 'Welcome to Zyra Custom Craft Newsletter!',
      react: NewsletterWelcomeEmail({ email }),
    });

    if (result.error) {
      console.error('Newsletter welcome email error:', result.error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    console.log('✅ Newsletter welcome email sent successfully:', result.data?.id);
    return res.status(200).json({ 
      success: true, 
      id: result.data?.id,
      message: 'Newsletter welcome email sent successfully' 
    });

  } catch (error: any) {
    console.error('Newsletter welcome email failed:', error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
