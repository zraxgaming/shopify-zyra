import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/seo/SEOHead';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email, is_active: true }]);
      if (error) {
        if (error.code === '23505') {
          toast({
            title: 'Already subscribed',
            description: 'This email is already subscribed to our newsletter.',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      } else {
        try {
          await fetch('/api/send-email-generic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              subject: 'Welcome to Zyra Custom Craft Newsletter!',
              html: `
                <div style="background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); padding: 32px 0; min-height: 100vh; font-family: 'Segoe UI', Arial, sans-serif;">
                  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(80,0,120,0.08); overflow: hidden;">
                    <div style="background: #7c3aed; padding: 24px 0; text-align: center;">
                      <img src='https://www.shopzyra.site/favicon.ico' alt='Zyra Logo' style='width:48px;height:48px;border-radius:8px;box-shadow:0 2px 8px #a18cd1;' />
                      <h1 style="color: #fff; font-size: 2rem; margin: 16px 0 0 0; letter-spacing: 1px;">Welcome to the Newsletter!</h1>
                    </div>
                    <div style="padding: 32px 24px 24px 24px; text-align: center;">
                      <p style="font-size: 1.1rem; color: #6b21a8; margin-bottom: 16px;">Hello <b>${email}</b>,</p>
                      <p style="color: #4b006e; margin-bottom: 16px;">Thank you for subscribing! You are now part of our newsletter. Stay tuned for updates and offers.</p>
                      <p style="color: #333; margin-bottom: 16px;">If you wish to unsubscribe, click <a href='https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}' style='color:#7c3aed;text-decoration:underline;'>here</a>.</p>
                    </div>
                    <div style="background: #f3e8ff; padding: 16px; text-align: center; color: #7c3aed; font-size: 0.95rem; border-top: 1px solid #e9d5ff;">
                      <p style="margin:0;">Thank you for being with us!<br/>Zyra Custom Craft</p>
                    </div>
                  </div>
                </div>
              `
            })
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          // Don't fail the subscription if email fails
        }
        
        toast({
          title: 'Successfully subscribed!',
          description: 'Thank you for subscribing to our newsletter.'
        });
        setEmail('');
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to subscribe. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Newsletter - Zyra Custom Craft"
        description="Subscribe to our newsletter and stay updated with new products, exclusive offers, and design tips from Zyra Custom Craft."
        url="https://www.shopzyra.site/newsletter"
      />
      <div className="max-w-lg mx-auto mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Subscribe to our Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
              <Button onClick={handleSubscribe} disabled={loading || !email}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Newsletter;
