import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEOHead from '@/components/seo/SEOHead';
import { Resend } from 'resend';


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
        var request = require('request');
var options = {
  'method': 'POST',
  'url': 'https://api.resend.com/emails',
  'headers': {
    'Authorization': 'Bearer re_3ZYY9s3W_HuQbhTk4BDEPrrTUB37HyKan',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "from": "Acme <contact@shopzyra.site>",
    "to": [
      "contact@shopzyra.site"
    ],
    "subject": "hello world",
    "html": "<p>Zain,it works!</p>"
  })

};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
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
