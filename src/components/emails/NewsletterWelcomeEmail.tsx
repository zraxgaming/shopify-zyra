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
  Link
} from '@react-email/components';

interface NewsletterWelcomeEmailProps {
  email: string;
}

export function NewsletterWelcomeEmail({ email }: NewsletterWelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Zyra</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>Welcome to Zyra!</Heading>
            
            <Text style={text}>
              Thank you for subscribing to our newsletter! 🎉
            </Text>
            
            <Text style={text}>
              You'll be the first to know about new products, gift cards, and exclusive offers.
            </Text>
            
            <Section style={buttonContainer}>
              <Button 
                href="https://www.shopzyra.site/shop" 
                style={button}
              >
                Start Shopping
              </Button>
            </Section>
            
            <Hr style={hr} />
            
            <Text style={footer}>
              If you wish to unsubscribe,{' '}
              <Link 
                href={`https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(email)}`}
                style={link}
              >
                click here
              </Link>
              .
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

const text = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
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
  margin: '20px 0',
};

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
};

const link = {
  color: '#7c3aed',
  textDecoration: 'underline',
};

export default NewsletterWelcomeEmail;
