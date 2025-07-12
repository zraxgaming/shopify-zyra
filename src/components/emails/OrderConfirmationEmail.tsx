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
  Hr,
  Row,
  Column
} from '@react-email/components';

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingAddress?: string;
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  customerEmail,
  items,
  total,
  shippingAddress
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Zyra Custom Craft</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>Order Confirmation</Heading>
            
            <Text style={text}>
              Hi {customerName}, thank you for your order! 🎉
            </Text>
            
            <Text style={text}>
              Your order <strong>#{orderNumber}</strong> has been received and is being processed.
            </Text>
            
            <Section style={orderDetails}>
              <Heading style={h3}>Order Details</Heading>
              
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemName}>{item.name}</Column>
                  <Column style={itemQty}>Qty: {item.quantity}</Column>
                  <Column style={itemPrice}>${item.price.toFixed(2)}</Column>
                </Row>
              ))}
              
              <Hr style={hr} />
              
              <Row style={totalRow}>
                <Column style={totalLabel}><strong>Total:</strong></Column>
                <Column style={totalAmount}><strong>${total.toFixed(2)}</strong></Column>
              </Row>
            </Section>
            
            {shippingAddress && (
              <Section style={addressSection}>
                <Heading style={h3}>Shipping Address</Heading>
                <Text style={addressText}>{shippingAddress}</Text>
              </Section>
            )}
            
            <Section style={buttonContainer}>
              <Button 
                href={`https://www.shopzyra.site/order-tracking?order=${orderNumber}`}
                style={button}
              >
                Track Your Order
              </Button>
            </Section>
            
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
};

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  marginBottom: '15px',
};

const text = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const orderDetails = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '8px',
  marginBottom: '20px',
};

const itemRow = {
  marginBottom: '10px',
};

const itemName = {
  color: '#444444',
  fontSize: '14px',
};

const itemQty = {
  color: '#666666',
  fontSize: '14px',
  textAlign: 'center' as const,
};

const itemPrice = {
  color: '#444444',
  fontSize: '14px',
  textAlign: 'right' as const,
  fontWeight: 'bold',
};

const totalRow = {
  marginTop: '15px',
};

const totalLabel = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: 'bold',
};

const totalAmount = {
  color: '#7c3aed',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
};

const addressSection = {
  marginBottom: '20px',
};

const addressText = {
  color: '#444444',
  fontSize: '14px',
  lineHeight: '1.5',
  backgroundColor: '#f8f9fa',
  padding: '15px',
  borderRadius: '6px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
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

const hr = {
  borderColor: '#e5e7eb',
  margin: '15px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
};

export default OrderConfirmationEmail;
