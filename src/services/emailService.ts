
// Email service for sending various types of emails using Resend SDK directly
import { Resend } from 'resend';
import { NewsletterWelcomeEmail } from '@/components/emails/NewsletterWelcomeEmail';
import { WelcomeSignupEmail } from '@/components/emails/WelcomeSignupEmail';
import { UnsubscribeEmail } from '@/components/emails/UnsubscribeEmail';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail';
import { OrderStatusEmail } from '@/components/emails/OrderStatusEmail';
import { NewsletterCampaignEmail } from '@/components/emails/NewsletterCampaignEmail';
import { supabase } from '@/integrations/supabase/client';

interface EmailServiceResponse {
  success: boolean;
  id?: string;
  error?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export class EmailService {
  private static getResend(): Resend {
    const apiKey = import.meta.env.VITE_RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_RESEND_API_KEY is not configured');
    }
    return new Resend(apiKey);
  }

  // Newsletter welcome email
  static async sendNewsletterWelcome(email: string): Promise<EmailServiceResponse> {
    try {
      const resend = this.getResend();
      const result = await resend.emails.send({
        from: 'Zyra <contact@shopzyra.site>',
        to: [email],
        subject: 'Welcome to the Zyra Newsletter!',
        react: NewsletterWelcomeEmail({ email }),
      });

      if (result.error) {
        console.error('Newsletter welcome email error:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, id: result.data?.id };
    } catch (error: any) {
      console.error('Newsletter welcome email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Account signup welcome email
  static async sendWelcomeSignup(email: string, firstName?: string): Promise<EmailServiceResponse> {
    try {
      const resend = this.getResend();
      const result = await resend.emails.send({
        from: 'Zyra <contact@shopzyra.site>',
        to: [email],
        subject: 'Welcome to Zyra!',
        react: WelcomeSignupEmail({ email, firstName }),
      });

      if (result.error) {
        console.error('Welcome signup email error:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, id: result.data?.id };
    } catch (error: any) {
      console.error('Welcome signup email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Unsubscribe confirmation email
  static async sendUnsubscribeConfirmation(email: string): Promise<EmailServiceResponse> {
    try {
      const resend = this.getResend();
      const result = await resend.emails.send({
        from: 'Zyra Custom Craft <contact@shopzyra.site>',
        to: [email],
        subject: 'You have been unsubscribed',
        react: UnsubscribeEmail({ email }),
      });

      if (result.error) {
        console.error('Unsubscribe email error:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, id: result.data?.id };
    } catch (error: any) {
      console.error('Unsubscribe email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Order confirmation email
  static async sendOrderConfirmation(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    items: OrderItem[],
    total: number,
    shippingAddress?: string
  ): Promise<EmailServiceResponse> {
    try {
      const resend = this.getResend();
      const result = await resend.emails.send({
        from: 'Zyra Custom Craft <contact@shopzyra.site>',
        to: [customerEmail],
        subject: `Order Confirmation - #${orderNumber}`,
        react: OrderConfirmationEmail({ 
          orderNumber, 
          customerName, 
          customerEmail, 
          items, 
          total, 
          shippingAddress 
        }),
      });

      if (result.error) {
        console.error('Order confirmation email error:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, id: result.data?.id };
    } catch (error: any) {
      console.error('Order confirmation email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Order status update email
  static async sendOrderStatusUpdate(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    status: 'processing' | 'shipped' | 'delivered' | 'cancelled',
    trackingNumber?: string
  ): Promise<EmailServiceResponse> {
    try {
      const resend = this.getResend();
      
      const getSubject = (status: string, orderNumber: string) => {
        switch (status) {
          case 'processing': return `Order #${orderNumber} is being processed`;
          case 'shipped': return `Order #${orderNumber} has shipped`;
          case 'delivered': return `Order #${orderNumber} has been delivered`;
          case 'cancelled': return `Order #${orderNumber} has been cancelled`;
          default: return `Update for Order #${orderNumber}`;
        }
      };

      const result = await resend.emails.send({
        from: 'Zyra Custom Craft <contact@shopzyra.site>',
        to: [customerEmail],
        subject: getSubject(status, orderNumber),
        react: OrderStatusEmail({ 
          orderNumber, 
          customerName, 
          status, 
          trackingNumber 
        }),
      });

      if (result.error) {
        console.error('Order status email error:', result.error);
        return { success: false, error: result.error.message };
      }

      return { success: true, id: result.data?.id };
    } catch (error: any) {
      console.error('Order status email failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Newsletter campaign (admin only)
  static async sendNewsletterCampaign(
    title: string,
    content: string,
    adminEmail: string,
    ctaText?: string,
    ctaUrl?: string,
    imageUrl?: string
  ): Promise<EmailServiceResponse> {
    try {
      // Simple admin check
      const envAdminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      if (adminEmail !== envAdminEmail) {
        return { success: false, error: 'Unauthorized' };
      }

      // Get all active newsletter subscribers
      const { data: subscribers, error: subError } = await supabase
        .from('newsletter_subscriptions')
        .select('email')
        .eq('is_active', true);

      if (subError) {
        console.error('Error fetching subscribers:', subError);
        return { success: false, error: 'Failed to fetch subscribers' };
      }

      if (!subscribers || subscribers.length === 0) {
        return { success: true, id: 'No active subscribers found' };
      }

      const resend = this.getResend();
      
      // Send emails in batches to avoid rate limits
      const batchSize = 10;
      let successCount = 0;
      let failureCount = 0;
      
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (subscriber) => {
          try {
            const result = await resend.emails.send({
              from: 'Zyra Custom Craft <contact@shopzyra.site>',
              to: [subscriber.email],
              subject: title,
              react: NewsletterCampaignEmail({ 
                title, 
                content, 
                ctaText, 
                ctaUrl, 
                imageUrl,
                unsubscribeEmail: subscriber.email
              }),
            });
            
            if (result.error) {
              console.error(`Failed to send to ${subscriber.email}:`, result.error);
              return false;
            }
            return true;
          } catch (error) {
            console.error(`Failed to send to ${subscriber.email}:`, error);
            return false;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        successCount += batchResults.filter(Boolean).length;
        failureCount += batchResults.filter(r => !r).length;

        // Add delay between batches to respect rate limits
        if (i + batchSize < subscribers.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return { 
        success: true, 
        id: `${successCount} emails sent successfully, ${failureCount} failed`
      };

    } catch (error: any) {
      console.error('Newsletter campaign failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default EmailService;
