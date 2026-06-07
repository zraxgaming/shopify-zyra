import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

// Inline the email template for now
const zyraEmailTemplate = ({ name, email }: { name?: string; email: string }) => `
  <div style="background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); padding: 32px 0; min-height: 100vh; font-family: 'Segoe UI', Arial, sans-serif;">
    <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(80,0,120,0.08); overflow: hidden;">
      <div style="background: #7c3aed; padding: 24px 0; text-align: center;">
        <img src='https://www.shopzyra.site/favicon.ico' alt='Zyra Logo' style='width:48px;height:48px;border-radius:8px;box-shadow:0 2px 8px #a18cd1;' />
        <h1 style="color: #fff; font-size: 2rem; margin: 16px 0 0 0; letter-spacing: 1px;">Newsletter Subscription</h1>
      </div>
      <div style="padding: 32px 24px 24px 24px; text-align: center;">
        <p style="font-size: 1.1rem; color: #6b21a8; margin-bottom: 16px;">Hello${name ? ` <b>${name}</b>` : ''},</p>
        <p style="font-size: 1.1rem; color: #4b006e; margin-bottom: 16px;">Thank you for subscribing to the Zyra newsletter!<br>You’ll now receive updates from Zyra Custom Craft.</p>
        <a href="https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}" style="display:inline-block;margin:24px 0 0 0;padding:12px 32px;background:#a18cd1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;box-shadow:0 2px 8px #a18cd1;">Unsubscribe</a>
      </div>
      <div style="background: #f3e8ff; padding: 16px; text-align: center; color: #7c3aed; font-size: 0.95rem; border-top: 1px solid #e9d5ff;">
        <p style="margin:0;">Thank you for joining us!<br/>Zyra Custom Craft</p>
      </div>
    </div>
  </div>
`;

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    let timeout: NodeJS.Timeout | null = null;
    try {
      // Add a timeout to guarantee loading state ends
      timeout = setTimeout(() => setIsLoading(false), 10000);
      // Add to Supabase
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert({
          email,
          name: name || null,
          is_active: true,
          subscribed_at: new Date().toISOString(),
        } as any);
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        // Send confirmation to user using backend API
        try {
          const { zyraEmailTemplate } = await import('@/utils/emailTemplate');
          await fetch('/api/send-email-generic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              subject: "Welcome to the Zyra Newsletter!",
              text: `Thank you for subscribing, ${name || 'friend'}. You'll now receive updates, offers, and news from us.`,
              html: zyraEmailTemplate({
                title: 'Newsletter Subscription',
                body: `<p style='font-size:1.1rem;color:#6b21a8;'>Hello${name ? ` <b>${name}</b>` : ''},</p><p style='font-size:1.1rem;color:#4b006e;'>Thank you for subscribing to the Zyra newsletter!<br>You’ll now receive updates from Zyra Custom Craft.</p>`,
                ctaText: 'Unsubscribe',
                ctaUrl: `https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}`
              }),
            })
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
        setName("");
      }
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (timeout) clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="newsletter-name" className="text-foreground">Name (Optional)</Label>
        <Input
          id="newsletter-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <div>
        <Label htmlFor="newsletter-email" className="text-foreground">Email Address</Label>
        <Input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          required
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          "Subscribing..."
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Subscribe to Newsletter
          </>
        )}
      </Button>
    </form>
  );
};

export default NewsletterSignup;
