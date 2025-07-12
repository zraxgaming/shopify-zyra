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
  Img
} from '@react-email/components';

interface NewsletterCampaignEmailProps {
  title: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  imageUrl?: string;
  unsubscribeEmail: string;
}

export function NewsletterCampaignEmail({
  title,
  content,
  ctaText,
  ctaUrl,
  imageUrl,
  unsubscribeEmail
}: NewsletterCampaignEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>Zyra Custom Craft</Heading>
          </Section>
          
          <Section style={contentSection}>
            <Heading style={h2}>{title}</Heading>
            
            {imageUrl && (
              <Section style={imageSection}>
                <Img
                  src={imageUrl}
                  alt="Newsletter Image"
                  width="560"
                  height="300"
                  style={image}
                />
              </Section>
            )}
            
            <div dangerouslySetInnerHTML={{ __html: content }} style={contentText} />
            
            {ctaText && ctaUrl && (
              <Section style={buttonContainer}>
                <Button 
                  href={ctaUrl}
                  style={button}
                >
                  {ctaText}
                </Button>
              </Section>
            )}
            
            <Hr style={hr} />
            
            <Section style={socialSection}>
              <Text style={socialText}>Follow us on social media:</Text>
              <Section style={socialLinks}>
                <Button href="https://facebook.com/zyracustomcraft" style={socialButton}>Facebook</Button>
                <Button href="https://instagram.com/zyracustomcraft" style={socialButton}>Instagram</Button>
                <Button href="https://twitter.com/zyracustomcraft" style={socialButton}>Twitter</Button>
              </Section>
            </Section>
            
            <Hr style={hr} />
            
            <Text style={footer}>
              You're receiving this email because you subscribed to our newsletter.
              <br />
              <a 
                href={`https://www.shopzyra.site/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}`}
                style={unsubscribeLink}
              >
                Unsubscribe
              </a> | 
              <a href="https://www.shopzyra.site" style={unsubscribeLink}>
                Visit our website
              </a>
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

const contentSection = {
  marginBottom: '30px',
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  marginBottom: '20px',
};

const imageSection = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const image = {
  borderRadius: '8px',
  maxWidth: '100%',
  height: 'auto',
};

const contentText = {
  color: '#444444',
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '20px',
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

const socialSection = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const socialText = {
  color: '#666666',
  fontSize: '14px',
  marginBottom: '15px',
};

const socialLinks = {
  textAlign: 'center' as const,
};

const socialButton = {
  backgroundColor: '#6b7280',
  color: '#ffffff',
  padding: '8px 16px',
  textDecoration: 'none',
  borderRadius: '4px',
  display: 'inline-block',
  margin: '0 5px',
  fontSize: '12px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.6',
  textAlign: 'center' as const,
};

const unsubscribeLink = {
  color: '#7c3aed',
  textDecoration: 'underline',
};

export default NewsletterCampaignEmail;
