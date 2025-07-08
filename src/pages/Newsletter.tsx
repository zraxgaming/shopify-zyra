import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/seo/SEOHead';
import { zyraEmailTemplate } from '@/utils/emailTemplate';


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
        // Send welcome email using the backend API
        const emailHtml = zyraEmailTemplate({
          title: 'Welcome to Zyra Custom Craft!',
          body: `
            <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
              Thank you for subscribing to our newsletter! 🎉
            </p>
            <p style="color:#444;font-size:16px;line-height:1.6;margin-bottom:16px;">
              You'll be the first to know about new products, exclusive offers, and design tips.
            </p>
            <p style="color:#666;font-size:14px;line-height:1.6;">
              If you wish to unsubscribe, 
              <a href="https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}" style="color:#7c3aed;text-decoration:underline;">
                click here
              </a>.
            </p>
          `,
          ctaText: 'Start Shopping',
          ctaUrl: 'https://www.shopzyra.site/shop'
        });

        try {
          // Direct API call for testing - equivalent to your Node.js request example
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer re_3ZYY9s3W_HuQbhTk4BDEPrrTUB37HyKan',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: "Zyra Custom Craft <contact@shopzyra.site>",
              to: [email],
              subject: "Welcome to Zyra Custom Craft Newsletter!",
              html: emailHtml
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Direct email API error:', response.status, errorText);
            // Don't throw - let the subscription succeed even if email fails
          } else {
            const responseData = await response.json();
            console.log('Welcome email sent successfully:', responseData);
          }
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          // Don't throw - let the subscription succeed even if email fails
        }

        toast({
          title: 'Successfully subscribed!',
          description: 'Thank you for subscribing to our newsletter.',
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
