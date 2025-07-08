import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zyraEmailTemplate } from "@/utils/emailTemplate";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendWelcomeEmail = async (email: string) => {
    try {
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

      const response = await fetch('/api/send-email-generic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Welcome to Zyra Custom Craft Newsletter!',
          html: emailHtml
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Email API error:', errorText);
        
        // In development, log the email that would be sent
        if (import.meta.env.DEV) {
          console.log('Development mode: Email would be sent to:', email);
          console.log('Email content:', emailHtml);
        }
        throw new Error(`Email API failed: ${response.status}`);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      
      // In development, this is expected to fail
      if (import.meta.env.DEV) {
        console.log('Development mode: Email would be sent in production to:', email);
      }
      // Don't throw - let the subscription succeed even if email fails
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email, is_active: true }]);

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
        // Send welcome email using the new function
        await sendWelcomeEmail(email);
        
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail("");
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Subscription failed",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <Mail className="w-16 h-16 mx-auto mb-6 text-primary animate-bounce-in" />
          <h2 className="text-3xl font-bold mb-4 text-gradient">
            Stay Updated
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive offers, and design tips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-scale-in">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 input-focus"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="btn-animate primary-button"
            >
              {isLoading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form>

        <p className="text-sm text-muted-foreground mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
