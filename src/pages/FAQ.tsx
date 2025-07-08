
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Digital Products",
      items: [
        {
          question: "What types of digital products do you offer?",
          answer: "We offer a wide range of digital products including templates, graphics, fonts, digital art, stock photos, software tools, educational courses, and digital resources for creative professionals."
        },
        {
          question: "How do I download my digital products?",
          answer: "After purchase, you'll receive an email with download links. You can also access your digital products anytime from your account dashboard under 'My Orders'. Digital products are available for immediate download after payment confirmation."
        },
        {
          question: "Can I get a refund for digital products?",
          answer: "Due to the nature of digital products, refunds are generally not available once the product has been downloaded. However, we may consider refunds on a case-by-case basis for technical issues or if the product doesn't match its description."
        },
        {
          question: "Are there any usage restrictions on digital products?",
          answer: "Usage rights vary by product. Most of our digital products come with commercial licenses, but please check the specific license terms included with each product. Some items may be for personal use only."
        },
        {
          question: "What if my download link doesn't work?",
          answer: "If you're having trouble with download links, please contact our support team immediately. We'll resend the links or provide alternative download methods. Download links are typically valid for 30 days."
        }
      ]
    },
    {
      title: "Orders & Payment",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept PayPal and Ziina for all purchases. For digital products, only PayPal and Ziina payments are accepted to ensure secure transactions and instant delivery."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard encryption and work with trusted payment processors. We never store your payment information on our servers - all transactions are processed securely through PayPal or Ziina."
        },
        {
          question: "Can I track my order?",
          answer: "For physical products, you'll receive tracking information once your order ships. For digital products, you can access them immediately after payment in your account dashboard."
        },
        {
          question: "How long does processing take?",
          answer: "Digital products are available immediately after payment confirmation. Physical products typically process within 1-2 business days before shipping."
        }
      ]
    },
    {
      title: "Account & Technical",
      items: [
        {
          question: "Do I need an account to make a purchase?",
          answer: "Yes, an account is required to purchase and access digital products. This ensures you can always re-download your purchases and manage your orders easily."
        },
        {
          question: "I forgot my password, how do I reset it?",
          answer: "Click on 'Forgot Password' on the login page and enter your email address. We'll send you a reset link to create a new password."
        },
        {
          question: "Can I change my email address?",
          answer: "Yes, you can update your email address in your account settings. Make sure to use an email you have access to, as order confirmations and download links will be sent there."
        },
        {
          question: "Why can't I access my digital products?",
          answer: "Make sure you're logged into the correct account. If you're still having issues, check your email for the download links or contact our support team for assistance."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      items: [
        {
          question: "Do you offer international shipping?",
          answer: "Currently, we primarily focus on digital products which are available worldwide instantly. For physical products, shipping availability depends on your location. Please check at checkout."
        },
        {
          question: "How much does shipping cost?",
          answer: "Shipping costs vary based on your location and the items ordered. You'll see the exact shipping cost at checkout before completing your purchase."
        },
        {
          question: "Can I change my shipping address after ordering?",
          answer: "Contact us immediately if you need to change your shipping address. We can update it if the order hasn't been processed yet."
        }
      ]
    },
    {
      title: "Support & Contact",
      items: [
        {
          question: "How can I contact customer support?",
          answer: "You can reach our support team through the contact form on our website, or email us directly. We typically respond within 24 hours during business days."
        },
        {
          question: "What if I have a technical issue with a digital product?",
          answer: "If you encounter technical issues with any digital product, please contact our support team with details about the problem. We'll work to resolve it quickly or provide a suitable alternative."
        },
        {
          question: "Can you create custom digital products?",
          answer: "While we focus on ready-made digital products, we may consider custom requests depending on the scope and requirements. Please contact us with your specific needs."
        }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="FAQ - Frequently Asked Questions | Zyra Digital Products"
        description="Find answers to common questions about Zyra digital products, downloads, payments, and more. Get help with your digital product purchases."
        url="https://www.shopzyra.site/faq"
      />
      <Navbar />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about our digital products and services
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-2xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`${categoryIndex}-${index}`}
                      >
                        <AccordionTrigger className="text-left font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? We're here to help!
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default FAQ;
