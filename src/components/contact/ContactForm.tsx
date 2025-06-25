
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendEmail, getContactFormTemplate } from "@/utils/mailersend";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to database
      const { error } = await supabase
        .from("contact_submissions")
        .insert([formData]);

      if (error) throw error;

      // Send email notification using MailerSend
      await sendEmail({
        to: 'zainabusal113@gmail.com',
        subject: `New Contact Form Submission from ${formData.name}`,
        html: getContactFormTemplate(formData)
      });

      // Send confirmation email to user
      await sendEmail({
        to: formData.email,
        subject: 'Thank you for contacting Zyra Custom Craft',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Thank You - Zyra Custom Craft</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
              <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); margin-top: 20px; margin-bottom: 20px;">
                  <!-- Header -->
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 12px; padding: 20px;">
                          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Thank You! 💌</h1>
                      </div>
                  </div>
                  
                  <!-- Content -->
                  <div style="padding: 40px 30px;">
                      <div style="text-align: center; margin-bottom: 30px;">
                          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">We've received your message!</h2>
                          <p style="color: #666; margin: 0; font-size: 16px; line-height: 1.6;">Hi ${formData.name}, thank you for reaching out to us. We'll get back to you within 24 hours.</p>
                      </div>
                      
                      <div style="background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); border-radius: 12px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                          <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Your message:</h3>
                          <div style="background: white; border-radius: 8px; padding: 15px; border: 1px solid #e8ecff;">
                              <p style="margin: 0; color: #333; font-size: 16px; line-height: 1.6;">${formData.message}</p>
                          </div>
                      </div>
                      
                      <div style="text-align: center; margin: 30px 0;">
                          <a href="https://shopzyra.vercel.app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                              Browse Our Products →
                          </a>
                      </div>
                  </div>
                  
                  <!-- Footer -->
                  <div style="background: #f8f9ff; padding: 30px; text-align: center; border-top: 1px solid #e8ecff;">
                      <div style="margin-bottom: 20px;">
                          <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 20px; font-weight: 700;">Zyra Custom Craft</h3>
                          <p style="color: #666; margin: 0; font-size: 14px;">Creating beautiful, personalized items just for you</p>
                      </div>
                  </div>
              </div>
          </body>
          </html>
        `
      });

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Get in Touch
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Have a question or want to discuss a custom project? We'd love to hear from you!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-focus"
                placeholder="Your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-focus"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone (Optional)
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="input-focus"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="input-focus resize-none"
              placeholder="Tell us about your project or ask us anything..."
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full primary-button btn-animate"
            size="lg"
          >
            {isLoading ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="w-4 h-4 text-primary" />
            <span>info@shopzyra.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Phone className="w-4 h-4 text-primary" />
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
