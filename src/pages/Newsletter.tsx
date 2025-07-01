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
              html: `<h1>Thank you for subscribing!</h1><p>You are now part of our newsletter. Stay tuned for updates and offers.</p><p>If you wish to unsubscribe, click <a href='https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}'>here</a>.</p>`
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
