import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendNewsletterEmail } from '@/utils/emailjs';

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
        await sendNewsletterEmail({
          to: email,
          message: `Thank you for subscribing to our newsletter! You'll be the first to know about new products, exclusive offers, and design tips.`,
          unsubscribe_link: `${window.location.origin}/unsubscribe?email=${encodeURIComponent(email)}`
        });
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
  );
};

export default Newsletter;
