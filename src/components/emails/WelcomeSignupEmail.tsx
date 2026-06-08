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

interface WelcomeSignupEmailProps {
  email: string;
  firstName?: string;
}

export function WelcomeSignupEmail({ email, firstName }: WelcomeSignupEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Zyra</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={h2}>Welcome to Zyra{firstName ? `, ${firstName}` : ''}!</Heading>
            
            <Text style={text}>
              🎉 Your account has been successfully created. Welcome to our store.
            </Text>
            
            <Text style={text}>
              Explore our latest products, gift cards, and exclusive offers.
            </Text>
            
            <Text style={text}>
              <strong>What's next?</strong>
            </Text>
            
            <Text style={text}>
              • Browse our product catalog<br/>
              • Save your details for faster checkout<br/>
              • Join our newsletter for exclusive offers<br/>
              • Follow us on social media
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
              Need help? Reply to this email or contact us at contact@shopzyra.site
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Shared styles (same as other emails)
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

export default WelcomeSignupEmail;
