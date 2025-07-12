// Backend email service for making API calls to avoid CORS issues
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://www.shopzyra.site'
  : 'http://localhost:3000';

interface BackendEmailResponse {
  success: boolean;
  id?: string;
  error?: string;
  message?: string;
}

export class BackendEmailService {
  
  // Newsletter welcome email
  static async sendNewsletterWelcome(email: string): Promise<BackendEmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-newsletter-welcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to send email' };
      }

      return result;
    } catch (error: any) {
      console.error('Newsletter welcome email API call failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Account signup welcome email
  static async sendWelcomeSignup(email: string, firstName?: string): Promise<BackendEmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-welcome-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to send email' };
      }

      return result;
    } catch (error: any) {
      console.error('Welcome signup email API call failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Order confirmation email
  static async sendOrderConfirmation(
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    total: number,
    shippingAddress?: string
  ): Promise<BackendEmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-order-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderNumber, 
          customerName, 
          customerEmail, 
          items, 
          total, 
          shippingAddress 
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to send email' };
      }

      return result;
    } catch (error: any) {
      console.error('Order confirmation email API call failed:', error);
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
  ): Promise<BackendEmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-order-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          orderNumber, 
          customerName, 
          customerEmail, 
          status, 
          trackingNumber 
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to send email' };
      }

      return result;
    } catch (error: any) {
      console.error('Order status email API call failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Unsubscribe confirmation email
  static async sendUnsubscribeConfirmation(email: string): Promise<BackendEmailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/send-unsubscribe-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to send email' };
      }

      return result;
    } catch (error: any) {
      console.error('Unsubscribe email API call failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default BackendEmailService;
