// Example usage of EmailService for all different email types
import EmailService from '@/services/EmailService';

// 1. Newsletter welcome email (when someone subscribes)
export const sendNewsletterWelcomeExample = async () => {
  const result = await EmailService.sendNewsletterWelcome('user@example.com');
  console.log('Newsletter welcome:', result);
};

// 2. Account signup welcome email (when someone creates an account)
export const sendSignupWelcomeExample = async () => {
  const result = await EmailService.sendWelcomeSignup('user@example.com', 'John');
  console.log('Signup welcome:', result);
};

// 3. Unsubscribe confirmation email
export const sendUnsubscribeExample = async () => {
  const result = await EmailService.sendUnsubscribeConfirmation('user@example.com');
  console.log('Unsubscribe confirmation:', result);
};

// 4. Order confirmation email (when order is created)
export const sendOrderConfirmationExample = async () => {
  const result = await EmailService.sendOrderConfirmation(
    'ORD-12345',
    'John Doe',
    'user@example.com',
    [
      { name: 'Custom Craft Item', quantity: 2, price: 29.99 },
      { name: 'Personalized Mug', quantity: 1, price: 15.99 }
    ],
    75.97,
    '123 Main St, City, State 12345'
  );
  console.log('Order confirmation:', result);
};

// 5. Order status update emails (when admin changes order status)
export const sendOrderStatusExamples = async () => {
  // Order processing
  await EmailService.sendOrderStatusUpdate(
    'ORD-12345',
    'John Doe',
    'user@example.com',
    'processing'
  );

  // Order shipped
  await EmailService.sendOrderStatusUpdate(
    'ORD-12345',
    'John Doe',
    'user@example.com',
    'shipped',
    'TRACK123456'
  );

  // Order delivered
  await EmailService.sendOrderStatusUpdate(
    'ORD-12345',
    'John Doe',
    'user@example.com',
    'delivered'
  );

  // Order cancelled
  await EmailService.sendOrderStatusUpdate(
    'ORD-12345',
    'John Doe',
    'user@example.com',
    'cancelled'
  );
};

// 6. Newsletter campaign (admin sends to all subscribers)
export const sendNewsletterCampaignExample = async () => {
  const result = await EmailService.sendNewsletterCampaign(
    'New Product Launch! 🎉',
    `
      <p>We're excited to announce our latest collection of custom crafts!</p>
      <p>Check out our new products and get 20% off your first order.</p>
      <ul>
        <li>Custom Wall Art</li>
        <li>Personalized Jewelry</li>
        <li>Handmade Decorations</li>
      </ul>
    `,
    'admin@shopzyra.site', // Must match VITE_ADMIN_EMAIL
    'Shop Now',
    'https://www.shopzyra.site/shop',
    'https://www.shopzyra.site/images/new-collection.jpg'
  );
  console.log('Newsletter campaign:', result);
};

// Integration examples for different parts of your app:

// In your Auth component (when user signs up)
export const handleUserSignup = async (email: string, firstName: string) => {
  // ... user creation logic ...
  
  // Send welcome email
  await EmailService.sendWelcomeSignup(email, firstName);
};

// In your Checkout component (when order is completed)
export const handleOrderComplete = async (orderData: any) => {
  // ... order processing logic ...
  
  // Send order confirmation
  await EmailService.sendOrderConfirmation(
    orderData.orderNumber,
    orderData.customerName,
    orderData.customerEmail,
    orderData.items,
    orderData.total,
    orderData.shippingAddress
  );
};

// In your Admin panel (when updating order status)
export const handleOrderStatusChange = async (
  orderId: string,
  newStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled',
  customerData: any,
  trackingNumber?: string
) => {
  // ... update order in database ...
  
  // Send status update email
  await EmailService.sendOrderStatusUpdate(
    orderId,
    customerData.name,
    customerData.email,
    newStatus,
    trackingNumber
  );
};

// In your Unsubscribe page
export const handleUnsubscribe = async (email: string) => {
  // ... update database to mark as unsubscribed ...
  
  // Send unsubscribe confirmation
  await EmailService.sendUnsubscribeConfirmation(email);
};

export default {
  sendNewsletterWelcomeExample,
  sendSignupWelcomeExample,
  sendUnsubscribeExample,
  sendOrderConfirmationExample,
  sendOrderStatusExamples,
  sendNewsletterCampaignExample,
  handleUserSignup,
  handleOrderComplete,
  handleOrderStatusChange,
  handleUnsubscribe
};
