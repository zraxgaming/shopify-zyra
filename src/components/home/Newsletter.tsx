
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmail, getNewsletterTemplate } from "@/utils/mailersend";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        // Send welcome email using MailerSend
        const welcomeContent = `
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Welcome to the Zyra family! 🎉</h2>
            <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.6;">Thank you for subscribing to our newsletter!</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What to expect:</h3>
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px;">🎨</span>
                <span style="color: #333; font-size: 16px;">Latest custom craft designs and inspiration</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px;">💰</span>
                <span style="color: #333; font-size: 16px;">Exclusive subscriber discounts and offers</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px;">📚</span>
                <span style="color: #333; font-size: 16px;">Crafting tips and tutorials from our experts</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="background: #667eea; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px;">🎉</span>
                <span style="color: #333; font-size: 16px;">Early access to new products and collections</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://shopzyra.vercel.app/shop" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              Start Shopping →
            </a>
          </div>
        `;

        await sendEmail({
          to: email,
          subject: 'Welcome to Zyra Custom Craft!',
          html: getNewsletterTemplate(welcomeContent, 'Welcome to Zyra Custom Craft!')
            .replace('{{email}}', encodeURIComponent(email))
        });

        // Send admin notification
        await sendEmail({
          to: 'zainabusal113@gmail.com',
          subject: 'New Newsletter Subscription',
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; padding: 20px; background: #f8f9ff;">
              <h2 style="color: #667eea;">📰 New Newsletter Subscriber</h2>
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subscribed at:</strong> ${new Date().toLocaleString()}</p>
              </div>
            </div>
          `
        });

        toast({
          title: "Successfully subscribed!",
          description: "Welcome to our newsletter! Check your email for confirmation.",
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
