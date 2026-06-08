import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { NewsletterCampaignEmail } from '../src/components/emails/NewsletterCampaignEmail.js';
import { supabase } from '../src/integrations/supabase/client.js';

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
    const { 
      title, 
      content, 
      ctaText, 
      ctaUrl, 
      imageUrl,
      adminEmail // For authentication
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    // Simple admin check
    if (adminEmail !== process.env.VITE_ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get all active newsletter subscribers
    const { data: subscribers, error: subError } = await supabase
      .from('newsletter_subscriptions')
      .select('email')
      .eq('is_active', true);

    if (subError) {
      console.error('Error fetching subscribers:', subError);
      return res.status(500).json({ error: 'Failed to fetch subscribers' });
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ success: true, message: 'No active subscribers found' });
    }

    // Send emails in batches to avoid rate limits
    const batchSize = 10;
    const results = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (subscriber) => {
        try {
          const result = await resend.emails.send({
            from: 'Zyra <contact@shopzyra.site>',
            to: [subscriber.email],
            subject: title,
            react: NewsletterCampaignEmail({ 
              title, 
              content, 
              ctaText, 
              ctaUrl, 
              imageUrl,
              unsubscribeEmail: subscriber.email
            }),
          });
          return { email: subscriber.email, success: true, id: result.data?.id };
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          return { email: subscriber.email, success: false, error: error };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return res.status(200).json({ 
      success: true, 
      totalSent: successCount,
      totalFailed: failureCount,
      totalSubscribers: subscribers.length,
      results: results
    });

  } catch (error) {
    console.error('Newsletter campaign email error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error });
  }
}
