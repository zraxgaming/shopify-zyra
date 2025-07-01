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
      // Send transactional email via backend API
      await fetch('/api/send-email-generic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'You have been unsubscribed from Zyra Custom Craft',
          html: `
            <div style="background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); padding: 32px 0; min-height: 100vh; font-family: 'Segoe UI', Arial, sans-serif;">
              <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(80,0,120,0.08); overflow: hidden;">
                <div style="background: #7c3aed; padding: 24px 0; text-align: center;">
                  <img src='https://www.shopzyra.site/favicon.ico' alt='Zyra Logo' style='width:48px;height:48px;border-radius:8px;box-shadow:0 2px 8px #a18cd1;' />
                  <h1 style="color: #fff; font-size: 2rem; margin: 16px 0 0 0; letter-spacing: 1px;">You've been unsubscribed</h1>
                </div>
                <div style="padding: 32px 24px 24px 24px; text-align: center;">
                  <p style="font-size: 1.1rem; color: #6b21a8; margin-bottom: 16px;">${email}, you have been removed from our newsletter list. We're sorry to see you go.</p>
                  <p style="color: #333; margin-bottom: 16px;">If this was a mistake, you can <a href='https://www.shopzyra.site/newsletter' style='color:#7c3aed;text-decoration:underline;'>resubscribe here</a>.</p>
                </div>
                <div style="background: #f3e8ff; padding: 16px; text-align: center; color: #7c3aed; font-size: 0.95rem; border-top: 1px solid #e9d5ff;">
                  <p style="margin:0;">Thank you for being with us!<br/>Zyra Custom Craft</p>
                </div>
              </div>
            </div>
          `
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
