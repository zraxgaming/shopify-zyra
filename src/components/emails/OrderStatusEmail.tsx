import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr
} from '@react-email/components';

interface OrderStatusEmailProps {
  orderNumber: string;
  customerName: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
}

export function OrderStatusEmail({
  orderNumber,
  customerName,
  status,
  trackingNumber
}: OrderStatusEmailProps) {
  
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'processing':
        return {
          title: 'Order is Being Processed',
          message: 'Good news! Your order is now being prepared by our team.',
          emoji: '📦'
        };
      case 'shipped':
        return {
          title: 'Order Shipped',
          message: 'Your order is on its way! You should receive it within 3-5 business days.',
          emoji: '🚚'
        };
      case 'delivered':
        return {
          title: 'Order Delivered',
          message: 'Your order has been successfully delivered! We hope you love your purchase.',
          emoji: '✅'
        };
      case 'cancelled':
        return {
          title: 'Order Cancelled',
          message: 'Your order has been cancelled. If you have any questions, please contact us.',
          emoji: '❌'
        };
      default:
        return {
          title: 'Order Update',
          message: 'There has been an update to your order.',
          emoji: '📋'
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Zyra</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>{statusInfo.emoji} {statusInfo.title}</Heading>
            
            <Text style={text}>
              Hi {customerName},
            </Text>
            
            <Text style={text}>
              {statusInfo.message}
            </Text>
            
            <Section style={orderInfo}>
              <Text style={orderText}>
                <strong>Order Number:</strong> #{orderNumber}
              </Text>
              {trackingNumber && (
                <Text style={orderText}>
                  <strong>Tracking Number:</strong> {trackingNumber}
                </Text>
              )}
            </Section>
            
            <Section style={buttonContainer}>
              <Button 
                href={`https://www.shopzyra.site/order-tracking?order=${orderNumber}`}
                style={button}
              >
                View Order Details
              </Button>
            </Section>
            
            {status === 'delivered' && (
              <>
                <Hr style={hr} />
                <Text style={text}>
                  We'd love to hear about your experience! Please consider leaving a review.
                </Text>
                <Section style={buttonContainer}>
                  <Button 
                    href="https://www.shopzyra.site/reviews"
                    style={secondaryButton}
                  >
                    Leave a Review
                  </Button>
                </Section>
              </>
            )}
            
            <Hr style={hr} />
            
            <Text style={footer}>
              Questions about your order? Reply to this email or contact us at contact@shopzyra.site
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f9fafb',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  padding: '40px 20px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '30px',
};

const h1 = {
  color: '#7c3aed',
  fontSize: '28px',
  margin: '0',
  fontWeight: 'bold',
};

const content = {
  marginBottom: '30px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  marginBottom: '20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const orderInfo = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const orderText = {
  color: '#444444',
  fontSize: '14px',
  marginBottom: '8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '20px 0',
};

const button = {
  backgroundColor: '#7c3aed',
  color: '#ffffff',
  padding: '12px 24px',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
  fontWeight: 'bold',
};

const secondaryButton = {
  backgroundColor: '#6b7280',
  color: '#ffffff',
  padding: '10px 20px',
  textDecoration: 'none',
  borderRadius: '6px',
  display: 'inline-block',
  fontWeight: 'bold',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
};

export default OrderStatusEmail;
