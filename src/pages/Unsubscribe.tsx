import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/seo/SEOHead';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Unsubscribe: React.FC = () => {
  const query = useQuery();
  const email = query.get('email') || '';
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ is_active: false, unsubscribed_at: new Date().toISOString() })
        .eq('email', email);
      if (error) throw error;
      // Send transactional email via backend API with branding
      const { zyraEmailTemplate } = await import('@/utils/emailTemplate');
      await fetch('/api/send-email-generic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'You have been unsubscribed from Zyra Custom Craft',
          html: zyraEmailTemplate({
            title: `You've been unsubscribed`,
            body: `<p style='font-size:1.1rem;color:#6b21a8;'>${email}, you have been removed from our newsletter list. We're sorry to see you go.</p><p style='color:#333;'>If this was a mistake, you can <a href='https://www.shopzyra.site/newsletter' style='color:#7c3aed;text-decoration:underline;'>resubscribe here</a>.</p>`,
            ctaText: 'Resubscribe',
            ctaUrl: 'https://www.shopzyra.site/newsletter'
          })
        })
      });
      setStatus('success');
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (e) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Unsubscribe from Newsletter | Zyra Custom Craft"
        description="Easily unsubscribe from the Zyra Custom Craft newsletter. Manage your email preferences and privacy."
        url="https://www.shopzyra.site/unsubscribe"
      />
      <main className="max-w-lg mx-auto mt-12" aria-labelledby="unsubscribe-title">
        <Card>
          <CardHeader>
            <CardTitle id="unsubscribe-title">Unsubscribe from Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            {status === 'idle' && (
              <>
                <p id="unsubscribe-desc">Are you sure you want to unsubscribe {email ? `(${email})` : ''} from our newsletter?</p>
                <Button 
                  onClick={handleUnsubscribe} 
                  disabled={loading} 
                  className="mt-4" 
                  aria-busy={loading} 
                  aria-describedby="unsubscribe-desc"
                >
                  {loading ? 'Processing...' : 'Unsubscribe'}
                </Button>
              </>
            )}
            {status === 'success' && (
              <p role="status">You have been unsubscribed. We're sorry to see you go!<br/>Redirecting to your dashboard...</p>
            )}
            {status === 'error' && (
              <p role="alert">There was an error processing your request. Please try again later.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default Unsubscribe;
